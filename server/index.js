import express from 'express'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import config from '../app-config'
import bodyParser from 'body-parser'
import { autoRefreshSession } from './auth/session-store'
import logger from './logger'
import pkg from '../package.json'
import compression from 'compression'
import proxy from 'http-proxy-middleware'
import cors from 'cors'

// CONFIG & ENVIRONMENT
const { NODE_ENV } = process.env
const env = NODE_ENV || 'dev'
const isProduction = env === 'production'
const PORT = process.env.PORT || config.ports.http

// INITIALIZE APP SERVER
console.log(`initializing ${pkg.description} server in ${env} mode...`)
var app = express()

// ENABLE CORS
app.use(cors())

// ENABLE GZIP COMPRESSION
app.use(compression())

// ENABLE USER SESSIONS
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'kitty cat of kittens',
  saveUninitialized: true,
  resave: true
}))

// ENABLED FORM BODY PARSING
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}))

// ENABLE OUTPUT LOGGING
app.use(morgan('dev'))

// ENABLE SESSION REFRESHING ON REQUEST
app.use(autoRefreshSession)

// ENABLE STATIC CONTENT DELIVERY
app.use(express.static(path.join(__dirname, (!isProduction ? '../dist-dev/client' : '/client'))))


// ENABLE AUTHENTICATION
import auth from './auth/index'
app.use(auth)

import api from './api/api'
app.use('/api', api)

// ENABLE LOGGING AND CACHE CONTROL
app.use(logger)

// VERSION & PACKAGE CHECKING
app.get('/version', (req, res) => {
  let { name, version, description } = pkg
  let { title } = config
  res.json({ name, title, description, version, deployed: new Date })
})


var httpServer = app.listen(PORT, () => {
  console.log(`Running "${pkg.name}" in ${process.env.NODE_ENV || 'development'} mode...`)
  console.log(`Magic happens on port ${httpServer.address().port} using Node Version ${process.version}`)
})