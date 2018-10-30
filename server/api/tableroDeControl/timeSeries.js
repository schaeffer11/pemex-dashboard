import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/costData', (req, res) => {
  let { activo, field, well, formation } = req.body
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `AND ${level} = ?`
  }

  let query = `
select YEAR(FECHA), MONTH(FECHA), DAY(FECHA), FECHA, SUM(COST_MNX + COST_DLS * MNXtoDLS) as COST
FROM ResultsCosts rc
JOIN Intervenciones i ON rc.INTERVENTION_ID = i.INTERVENCIONES_ID
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
${whereClause}
GROUP BY YEAR(FECHA), MONTH(FECHA), DAY(FECHA);
  `

  connection.query(query, value, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})


//INSERT INTERVENTIONS
//PRODUCTION/ESTIMATED



export default router