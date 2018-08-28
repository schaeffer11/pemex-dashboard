import mysql from 'mysql'
import comysql from 'co-mysql'
import APP_ROOT from 'app-root-path'
import debug from 'debug'
const databases = require(APP_ROOT + '/databases.json')
const message = debug('database')

export default {
  get(alias) {
    message('get db with alias', alias)
    if (!alias) {
      var alias = Object.keys(databases)[0]
      message('alias not defined, using default', alias)
    }
    let db = databases[alias]
    let { user, password, host, database } = db
    let dbConfig = Object.assign(
      {
        connectionLimit: 10,
        host,
        database,
        multipleStatements: true,
        debug: false
      },
      { user, password }
    )
    message('creating connection', dbConfig)
    let pool = mysql.createPool(dbConfig)
    let connection = comysql(pool)

    return connection
  }
}
