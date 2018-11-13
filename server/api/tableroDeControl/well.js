import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()



router.post('/previousTransaction', (req, res) => {
  let { well } = req.body

  let query = `
select TRANSACTION_ID from Transactions WHERE WELL_FORMACION_ID = ? ORDER BY INSERT_TIME DESC LIMIT 1;`

  connection.query(query, well, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/wellData', (req, res) => {
  let { transactionID } = req.body

  let query = `
SELECT * FROM WellsData w
JOIN WellMecanico wm ON w.TRANSACTION_ID = wm.TRANSACTION_ID 
JOIN FieldWellMapping fwm ON w.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
WHERE w.TRANSACTION_ID = ?`

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

router.post('/zoneData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellZones WHERE TRANSACTION_ID = ?`

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

router.post('/layerData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellLayers WHERE TRANSACTION_ID = ?`

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

router.post('/productionData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellHistoricalProduccion WHERE TRANSACTION_ID = ? ORDER BY Fecha DESC`

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

router.post('/fieldHistoricalPressure', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM FieldHistoricalPressure WHERE TRANSACTION_ID = ? ORDER BY FECHA DESC`

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

router.post('/pressureData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellHistoricalPressure WHERE TRANSACTION_ID = ? ORDER BY FECHA DESC`

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

router.post('/aforosData', (req, res) => {
  let { transactionID } = req.body

  let query = `
select FECHA, QO, QW, QG from WellAforos WHERE TRANSACTION_ID = ? AND Qo != -999
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

router.get('/getInterventionDates', (req, res) => {
  let { wellID } = req.query

  let query = `SELECT FECHA_INTERVENCION FROM Results WHERE WELL_FORMACION_ID = ?`

  connection.query(query, wellID, (err, results) => {
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