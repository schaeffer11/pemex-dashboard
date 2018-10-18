import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()

router.post('/costData', (req, res) => {
  let { activo, field, well, formation } = req.body
  let query = `
select WELL_NAME, FECHA, SUM(COST_MNX + COST_DLS * MNXtoDLS) as TOTAL_COST, TIPO_DE_INTERVENCIONES from ResultsCosts rc
JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
JOIN FieldWellMapping fw ON i.WELL_FORMACION_ID = fw.WELL_FORMACION_ID
GROUP BY i.TRANSACTION_ID
`

  connection.query(query, (err, results) => {
      console.log('err', err)
      console.log('results', results)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})


router.post('/avgCostByType', (req, res) => {
  let { activo, field, well, formation } = req.body
  let query = `
select SUM(TOTAL_COST) / COUNT(1) as AVG_COST, TIPO_DE_INTERVENCIONES
FROM
(select SUM(COST_MNX + COST_DLS * MNXtoDLS) as TOTAL_COST, TIPO_DE_INTERVENCIONES 
from ResultsCosts rc 
JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
GROUP BY INTERVENTION_ID) a GROUP BY TIPO_DE_INTERVENCIONES
`

  connection.query(query, (err, results) => {
      console.log('err', err)
      console.log('results', results)
    
      results = results.map(i => ({
        name: i.TIPO_DE_INTERVENCIONES,
        avgCost: i.AVG_COST
      }))

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})








export default router