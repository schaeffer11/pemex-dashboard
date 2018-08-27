import express from 'express'
import signedURL from '../aws/index';
import objectPath from 'object-path'

const app = express()

const handleError = (err) => {
  console.error(err)
  return { status: 500, error: true }
}

app.get('/ping', (req, res) => {
	console.log('pong')
  res.json({ response: 'pong' })
})


app.post('/storeWellData', (req, res) => {
	console.log('req.body', req.body)
  res.json({ success: true })
})

app.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default app
