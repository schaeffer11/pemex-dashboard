import debug from 'debug'
import crypto from 'crypto'
import Blowfish from 'xs-blowfish'
import pkg from '../../package.json'

const message = debug('sessions')
const DEFAULT_EXPIRATION = 3600000
const HASH_SECRET = 'lazard-demo v' + pkg.version
const hmac = crypto.createHmac('sha256', HASH_SECRET)
const bf = new Blowfish(HASH_SECRET)

// extend Date with .add(ms) functionality
Date.prototype.add = function(ms) {
  this.setTime(this.getTime() + ms)
  return this
}

Date.prototype.toUTC = function() {
  return Date.UTC(
    this.getUTCFullYear(),
    this.getUTCMonth(),
    this.getUTCDate(),
    this.getUTCHours(),
    this.getUTCMinutes(),
    this.getUTCSeconds(),
    this.getUTCMilliseconds(),
  )
}

// global sessions object
let sessions = {}

function timeoutSession(sessionid, duration) {
  return setTimeout(() => {
    let session = sessions[sessionid]

    if (session) {
      message(`user session for ${session.user.name} expired`)
      delete sessions[sessionid]
    }
  }, duration)
}

function clearSessions(user) {
  Object.keys(sessions).forEach(sessionid => {
    let session = sessions[sessionid]
    if (session.user.id === user.id) {
      clearTimeout(session.timeout)
      delete sessions[sessionid]
    }
  })
}

function createSession(user, token) {
  let session = {
    user,
    expires: (new Date()).add(DEFAULT_EXPIRATION),
  }

  token.expires = (new Date()).add(DEFAULT_EXPIRATION)
  user.token = bf.encrypt(JSON.stringify(token))

  let sessionid = user.sessionid = crypto
                                    .createHmac('sha256', HASH_SECRET)
                                    .update(JSON.stringify(user))
                                    .digest('hex')

  session.timeout = timeoutSession(sessionid, DEFAULT_EXPIRATION)

  // clear existing sessions for user
  clearSessions(user)

  // store new session
  sessions[sessionid] = session

  message(`creating user session for ${user.name} with sessionid ${sessionid}`)

  return user
}

function listSessions() {
  return Object.keys(sessions).map(sessionid => sessions[sessionid].user)
}

function autoRefreshSession(req, res, next) {
  let user = req.session && req.session.user

  user && refreshSession(user.sessionid)

  next()
}

function refreshSession(sessionid) {
  let storedSession = sessions[sessionid]

  if (storedSession) {
    message(`refreshing user session for ${storedSession.user.name}...`)
    clearTimeout(storedSession.timeout)
    Object.assign(storedSession, {
      expires: (new Date()).add(DEFAULT_EXPIRATION),
      timeout: timeoutSession(sessionid, DEFAULT_EXPIRATION)
    })
  }
}

function resumeSession(sessionid) {
  let storedSession = sessions[sessionid]

  if (storedSession) {
    let user = storedSession.user

    message(`resuming user session for ${user.name}`)
    refreshSession(sessionid)

    return user
  }

  return false
}

export { autoRefreshSession, createSession, refreshSession, resumeSession, listSessions }
