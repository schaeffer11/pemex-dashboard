import { listSessions } from './auth/session-store'
const env = process.env.NODE_ENV || 'dev'
const isProduction = env === 'production'

export const sslRedirect = (req, res, next) => {
  // console.log('isProduction', isProduction)
  // console.log('request header', req.secure, req.protocol, req.headers.host)
  if (isProduction && !req.secure) {
    // console.log('redirecting', req.protocol)
    res.redirect(`https://${req.headers.host}`)
  } else {
    next()
  }
}

export const getAuthorization = (req, res, next) => {
  console.log('getting authorization', req.url)
  const sessions = listSessions()
  const userSession = sessions.find(elem => `Bearer ${elem.token}` === req.headers.authorization)
  req.isAuthorized = userSession !== undefined
  console.log('user is authorized', req.isAuthorized)
  req.user = userSession
  if (req.isAuthorized) {
    return next()
  }
  return res.status(401).json({ success: false, message: 'Usuario no autorizado' })
}

export const allowAdmin = (req, res, next) => {
  console.log('allowing admin?', req.url, req.user.isAdmin)
  if (req.user.isAdmin) {
    console.log('admin and authorized')
    return next()
  }
  return res.status(401).json({ success: false, message: 'Usuario no es administrador' })
}
