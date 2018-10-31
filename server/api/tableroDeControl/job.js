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
      SELECT * FROM IntervencionesApuntalado
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
      SELECT * FROM ResultsEstimulacions re
      JOIN Results r ON re.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE re.PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM ResultsAcido ra
      JOIN Results r ON ra.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE ra.PROPUESTA_ID = ?`
  }
  else {
    query = `
      SELECT * FROM ResultsApuntalado rap
      JOIN Results r ON rap.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE rap.PROPUESTA_ID = ?`
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

router.get('/getAforoData', (req, res) => {
  let { transactionID, type } = req.query
  
  let query =
`select FECHA, QO, QW, QG from WellAforos WHERE TRANSACTION_ID = ? AND Qo != -999
UNION
select FECHA, QO, QW, QG from ResultsAforos WHERE PROPUESTA_ID = ? AND Qo != -999
`

  connection.query(query, [transactionID, transactionID], (err, results) => {
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