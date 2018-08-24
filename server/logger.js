// create express app
import express from 'express'
import apicache from 'apicache'
import auth from './auth/index.js'

// import moment and plugins
import moment from 'moment'
require('moment-precise-range-plugin')

// import package.json
let pkg = require('../package.json')

const app = express()
const serverStart = new Date
const LOG_LIMIT = 5000

let log = []
let logHash = {}
let requestsServed = 0

function shouldBeLogged(req) {
  if (req.originalUrl.indexOf('/cache') !== -1) return false
  if (req.path.indexOf('/status') !== -1) return false
  if (req.path.indexOf('favicon') !== -1) return false
  return true
}

app.use('*', (req, res, next) => {
  let start = new Date
  requestsServed++

  res.__endFromLogger = res.end

  res.end = (...args) => {
    res.logEntry = {
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      status: res.statusCode,
      date: new Date,
      time: new Date - start
    }

    if (res._headers['apicache-store']) {
      res.logEntry.fromCache = true
    }

    if (shouldBeLogged(req)) {
      // add logEntry to beginning of log
      log.unshift(res.logEntry)

      // preserve first LOG_LIMIT entries
      log.splice(LOG_LIMIT)
    }

    res.__endFromLogger(...args)
  }

  next()
})

app.get('/status', auth.isAuthenticated, (req, res) => {
  let urlPrefix = req.protocol + '://' + req.get('host')
  let groups = apicache.getIndex().groups

  res.json({
    description: pkg.description,
    version: pkg.version,
    uptime: {
      numeric: new Date - serverStart,
      string: moment.preciseDiff(moment(serverStart), moment(new Date))
    },
    cacheControl: {
      view: urlPrefix + '/cache/index',
      clear: {
        all: urlPrefix + '/cache/clear',
        groups: Object.keys(groups).reduce((list, groupName) => {
          list[groupName] = urlPrefix + '/cache/clear/' + groupName

          return list
        }, {})
      }
    },
    requests: {
      served: requestsServed,
      currentlyCached: apicache.getIndex().all.length
    },
    log: log.slice(0, req.query.limit || LOG_LIMIT)
  })
})

// setup initial API middleware on all /spa/ routes
app.get('/cache/index', auth.isAuthenticated, function(req, res, next) {
  return res.send(apicache.getIndex())
})

app.get('/cache/clear/:key?', auth.isAuthenticated, function(req, res, next) {
  apicache.clear(req.params.key)

  return res.send(apicache.getIndex())
})

export default app
