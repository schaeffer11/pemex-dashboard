import express from 'express'
import db from '../lib/db'
import appConfig from '../../app-config.js'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';
import { create as createWell, loadFields } from './pozo'

const connection = db.getConnection(appConfig.users.database)
const app = express()

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
})

const handleError = (err) => {
  console.error(err)
  return { status: 500, error: true }
}

app.use(upload.array())

app.get('/ping', (req, res) => {
	console.log('pong')
  res.json({ response: 'pong' })
})

app.get('/woop', async (req, res) => {
  getBuckets()
  res.send('done')
})

app.get('/getTemplate', (req, res) => {
  let localPath = path.join(__dirname, '../tempFile.xlsm')

  res.sendFile(localPath)
})

app.get('/what', (req, res) => {
  const buf = fs.readFileSync(path.join(__dirname, '../../', 'screenshot_test.png'))
  console.log('buf', buf)
  res.send('done')
})

app.get('/geturl?', async (req, res) => {
  const url = await signedURL(req.query.img).catch(reason => console.log(reason))
  res.send(url)
})

app.get('/deleteobj', async (req, res) => {
  const imgsToDelete = [
    'dareal.pruebasDeLaboratorio.caracterizacinSolubilidad.1536860807755',
    'dareal.pruebasDeLaboratorio.caracterizacinAgua.1536860807755',
    'dareal.evaluacionPetrofisica.1536860807755'
  ]

  const done = await Promise.all(imgsToDelete.map(elem => deleteObject(elem)))
  // const test = await deleteObject(req.query.img)
  console.log('data', done)
  res.send('done')
})

app.post('/testing', (req, res) => {
  // console.log('this is about to get fucked', req.body)
  const buf = Buffer.from(req.body.file, 'base64')
  addObject(buf)

  res.json({ yeah: 'boy' })
})


app.get('/getFieldWellMapping', (req, res) => {
    connection.query(`SELECT * FROM FieldWellMapping`, (err, results) => {
      res.json(results)
    })
})

app.post('/getSaveID', (req, res) => {
    connection.query(`SELECT * FROM SavedInputs WHERE USER_ID = ? AND WELL_FORMACION_ID = ?`, 
      [userID, wellID], (err, results) => {

        console.log(results)
        res.json(results)
    })
})


app.post('/well', async (req, res) => {
  const test = await createWell(req.body, 'submit')
  res.json({ well: 'submitted' })
})


app.post('/wellSave', async (req, res) => {
  const test = await createWell(req.body, 'save')
  res.json({ well: 'submitted' })
})


app.post('/loadFields', async (req, res) => {
  loadFields(req.body, (data) => {
    res.json(data)
  })

})

// app.post('/intervencion', intervencion.create);



app.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default app
