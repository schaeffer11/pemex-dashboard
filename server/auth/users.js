import Blowfish from 'xs-blowfish'
import prompt from 'prompt-promise'
import inquirer from 'inquirer'
import appConfig from '../../app-config.js'
import db from '../lib/db'

const debug = require('debug')('users')
const HASH_SECRET = '80% accuracy at the speed of light'

// ADD CONSOLE FUNCTIONS
// import consoleFunctions from '../lib/console-functions'
// consoleFunctions(console, console.log)


// FILTERS & SUCH
const hash = (obj) => {
  let bf = new Blowfish(HASH_SECRET + obj.username)
  return bf.encrypt(JSON.stringify(obj))
}

const questions = [
  {
    type: 'input',
    message: 'username?',
    name: 'username'
  },
  {
    type: 'password',
    message: 'password?',
    name: 'password'
  },
 { 
    type: 'input',
    message: 'company?',
    name: 'company'
  },
]

export const validate = (userData, cb) => {
  let { username, password } = userData

  console.log('validating user', userData)

  getUser(username, (err, user) => {
    if (err) {
      return cb({ message: 'invalid login', details: err})
    }

    user = user.pop()

    let pwd = hash({ username, password })

    if (user.password === pwd) {
      console.log('password match... OK')

      console.log(user)

      cb(null, user)
    } else {
      cb({ message: 'invalid login' })
    }
  })
}

export const getUser = (username, cb) => {
  if (!username) return cb({ message: 'user lookup requires a username' })

    let db_con = db.get(appConfig.users.database)
    let table = appConfig.users.table

    return db_con.query(`SELECT * FROM ??  
      WHERE username = ?`, [table, username], (err, results) => {
      if (err) {
        return cb(err)
      }

      try {
        var user = results
        console.log('res', results)
        cb(null, user)
      } catch (err) {
        cb(err, null)
      }
    })
}

export default {
  validate, getUser
}

const commandValidateUser = async function() {
  debug('validating user...\n')
  let username = await prompt('username: ')
  let password = await prompt('password: ')
  validate({ username, password }, (err, user) => {
    if (!err) {
      debug('OK!')
    } else {
      debug('ERROR', err)
    }
  })
}

let userCommands = process.argv.slice(2)
let availableCommands = {
  validate: commandValidateUser,
}

// EXECUTE USER COMMAND
if (userCommands.length) {
  let command = availableCommands[userCommands[0]]
  command && command()
}