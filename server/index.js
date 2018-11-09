import express from 'express'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import config from '../app-config'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import { autoRefreshSession } from './auth/session-store'
import { sslRedirect } from './middleware'
import logger from './logger'
import pkg from '../package.json'
import compression from 'compression'
import proxy from 'http-proxy-middleware'
import cors from 'cors'

// CONFIG & ENVIRONMENT
const env = process.env.NODE_ENV || 'dev'
const isProduction = env === 'production'
const PORT = process.env.PORT || config.ports.http

// INITIALIZE APP SERVER
console.log(`initializing ${pkg.description} server in ${env} mode...`)
var app = express()
app.use(helmet())


// Redirect to secure
app.enable('trust proxy')
app.use(sslRedirect)

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

import executiveRoutes from './api/tableroDeControl/executive'
app.use('/executive', executiveRoutes)

import statisticsRoutes from './api/tableroDeControl/statistics'
app.use('/statistics', statisticsRoutes)

import wellRoutes from './api/tableroDeControl/well'
app.use('/well', wellRoutes)

import jobRoutes from './api/tableroDeControl/job'
app.use('/job', jobRoutes)

import timeSeries from './api/tableroDeControl/timeSeries'
app.use('/timeSeries', timeSeries)

// ENABLE LOGGING AND CACHE CONTROL
app.use(logger)

// VERSION & PACKAGE CHECKING
app.get('/version', (req, res) => {
  let { name, version, description } = pkg
  let { title } = config
  res.json({ name, title, description, version, deployed: new Date })
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, (!isProduction ? '../dist-dev/client' : '/client'), 'index.html'))
});

var httpServer = app.listen(PORT, () => {
  console.log(`Running "${pkg.name}" in ${process.env.NODE_ENV || 'development'} mode...`)
  console.log(`Magic happens on port ${httpServer.address().port} using Node Version ${process.version}`)
})