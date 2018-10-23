import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/getEstCostData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM IntervencionesEstimatedCosts c
JOIN CostMap cm on c.ITEM = cm.COST_ID
WHERE TRANSACTION_ID = ?`

  console.log('testing', transactionID)
  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/getCostData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM ResultsCosts c
JOIN CostMap cm on c.COST_ID = cm.COST_ID
WHERE PROPUESTA_ID = ?`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/getCedula', (req, res) => {
  let { transactionID, type } = req.query

  let query

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM IntervencionesCedulaEstimulacion
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Acido') {
    query =`
      SELECT * FROM IntervencionesCedulaAcido
      WHERE TRANSACTION_ID = ?`
  }
  else {
    query = `
      SELECT * FROM IntervencionesCedulaApuntalado
      WHERE TRANSACTION_ID = ?`
  }
  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/getCedulaResults', (req, res) => {
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM ResultsCedulaEstimulacion
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM ResultsCedulaAcido
      WHERE PROPUESTA_ID = ?`
  }
  else {
    query = `
      SELECT * FROM ResultsCedulaApuntalado
      WHERE PROPUESTA_ID = ?`
  }

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/getInterventionData', (req, res) => {
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM IntervencionesEstimulacions
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM IntervencionesAcido
      WHERE TRANSACTION_ID = ?`
  }
  else {
    query = `
      SELECT * FROM IntervencinoesApuntalado
      WHERE TRANSACTION_ID = ?`
  }

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})


router.get('/getInterventionResultsData', (req, res) => {
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM ResultsEstimulacions
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM Results Acido
      WHERE PROPUESTA_ID = ?`
  }
  else {
    query = `
      SELECT * FROM ResultsApuntalado
      WHERE PROPUESTA_ID = ?`
  }

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})



export default router