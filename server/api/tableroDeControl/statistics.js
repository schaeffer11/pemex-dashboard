import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()

router.get('/costByType', (req, res) => {
  let {  } = req.body
  let query = `

select SUM(COST_MNX + COST_DLS * MNXtoDLS) as TOTAL_COST, SUM(COST_MNX + COST_DLS * MNXtoDLS) / COUNT(1) AS AVG_COST, TIPO_DE_INTERVENCIONES 
from ResultsCosts rc 
JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
GROUP BY TIPO_DE_INTERVENCIONES
`

  connection.query(query, (err, results) => {
      console.log('err', err)
      console.log('results', results)
    
      results = results.map(i => ({
        name: i.TIPO_DE_INTERVENCIONES,
        totalCost: i.TOTAL_COST,
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