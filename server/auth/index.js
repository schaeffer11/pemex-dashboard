import express from 'express'
import Blowfish from 'xs-blowfish'
var SqlString = require('sqlstring')

import db from '../lib/db'
import appConfig from '../../app-config'
import pkg from '../../package.json'
import users from './users'
import { createSession, resumeSession, listSessions } from './session-store'

const app = express()

// OKTA & BLOWFISH TOKEN ENCRYPTION
const HASH_SECRET = '80% accuracy at the speed of light'
const bf = new Blowfish(HASH_SECRET)

// API CALLS WILL BE ROUTED THROUGH THIS HOST DOMAIN
const API_HOST = appConfig.api_host

// MESSAGING CONSTANTS
const messages = {
  AUTH_FAILURE:   'El usuario y contraseña no coinciden o no están registrados. Favor de verificar.',
  NOT_LOGGED_IN:  'User not logged in.',
  LOGOUT_SUCCESS: 'User logged out successfully.',
  REQUIRES_LOGIN: 'Accessing this data requires user login.',
}

const embedBenchmark = (callback) => {
  let startTime = new Date
}

app.isEnabled = true

// EXPOSED MIDDLEWARE: API calls should require authentication
app.isAuthenticated = function(req, res, next) {
  if (!app.isEnabled) return next() // REMOVE*** authentication bypass
  let { session } = req
  let { user } = session || {}
  if (!user || !user.id) {
    return res.status(403).json({ status: 403, success: false, error: messages.REQUIRES_LOGIN })
  }
  next()
}

// REUSABLE AUTHENTICATION RESPONSE
function authenticationFailure(res, detail) {
  return res.status(401).json({ status: 401, success: false, message: messages.AUTH_FAILURE, detail })
}

app.post('/auth/createUser', (req, res) => {
  let { username, password, subdireccionID, activoID, isAdmin } = req.body
  let db_con = db.get(appConfig.users.database)
  let table = appConfig.users.table

  // FILTERS & SUCH
  const hash = (obj) => {
   let bf = new Blowfish(HASH_SECRET + obj.username)
   return bf.encrypt(JSON.stringify(obj))
  }
  const sqlize = (value) => typeof value === 'string' ? SqlString.escape(value) : value

  let inputs = process.argv.slice(2)
  let user = {
   username: username,
   password: password,
   IS_ADMIN: isAdmin
  }

   // subdireccionID ? user.SUBDIRECCION_ID = subdireccionID
   // activoID ? user.ACTIVO_ID = activoID

  // FILL OUT HASHED COLUMNS
  user.password = hash({ username: user.username, password: user.password })

  let keys = Object.keys(user)

  let values = keys.map(key => sqlize(user[key])).join(', ')
  let sql = `INSERT INTO ?? (${keys.join(', ')}) VALUES (${values})`

  console.log(sql, table)

  return db_con.query(sql, table, (err, results) => {
        if (err) {
          console.log('Error creating user', err)
          res.json({success: false})
        }
        else {
          console.log('success', results)
          res.json({success: true})
        }
  })
})

app.get('/auth/sessions', (req, res) => {
  res.json(listSessions())
})

// RETURN LOGGED IN USER
app.get('/auth/user', (req, res) => {
  let { user } = req.session
  return res.json(user)
})

// LOGS OUT CURRENT USER
app.use('/auth/logout', (req, res) => {
  let { session } = req
  let { user } = session
  if (!user) {
    return res.status(500).json({ status: 500, message: messages.NOT_LOGGED_IN })
  }
  delete session.user
  res.json({ message: messages.LOGOUT_SUCCESS })
})

// AUTHENTICATE USER
app.use('/auth', (req, res) => {
  let responseStart = new Date
  let { userid, userpwd, sessionid, token } = req.body

  // UNSAFE: REMOVE BLOCK IN PRODUCTION: allows GET based login
  if (!userid && !sessionid) {
    userid = req.query.userid
    userpwd = req.query.userpwd
    sessionid = req.query.sessionid
    token = req.query.token
  }

  let resumedSession = resumeSession(sessionid)

  if (resumedSession) {
    return res.json(resumedSession)
  }

  if (!userid || !userpwd) {
    if (token) {
      try {
        token = bf.decrypt(token)
        token = JSON.parse(token)
        userid = token.userid
        userpwd = token.userpwd
        if (new Date(token.expires) < new Date) {
          return res.status(401).json({ status: 401, success: false, error: 'Attempted relogin using expired token' })
        }
      } catch(err) {
        console.log(err.message)
        return res.status(401).json({ status: 401, success: false, error: 'Attempted relogin using invalid token' })
      }
    }
  }

  if (!userid || !userpwd) {
    return authenticationFailure(res, 'Missing username or password')
  }

  users.validate({
    username: userid,
    password: userpwd
  }, (err, userData) => {
    if (err) {
      console.log(err)
      return authenticationFailure(res, err)
    }
    else if (userData.IS_ACTIVE === 0) {
      return authenticationFailure(res, 'Inactive user')
    }

    let user = {
      id: userData.id,
      name: userData.username,
      activoID: userData.ACTIVO_ID,
      subdireccionID: userData.SUBDIRECCION_ID
    }

    // embed user in request.session
    req.session.user = createSession(user, { userid, userpwd })
    req.session.save()

    // send final response
    res.json(user)
  })
})

export default app