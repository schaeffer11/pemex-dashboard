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

  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  
  let where = ''

  if (level) {
    where = ` WHERE ${level} = ?`
  }

// select a.COMPANY, EST_COST, COST, TIPO_DE_INTERVENCIONES from (
// select SUM(COST_MNX + COST_DLS * MNXtoDLS) AS EST_COST, COMPANY, TRANSACTION_ID from IntervencionesEstimatedCosts GROUP BY TRANSACTION_ID) a
// JOIN (
// select SUM(COST_MNX + COST_DLS * MNXtoDLS) AS COST, COMPANY, PROPUESTA_ID from ResultsCosts GROUP BY PROPUESTA_ID) b
// ON a.TRANSACTION_ID = b.PROPUESTA_ID
// JOIN Intervenciones i ON a.TRANSACTION_ID = i.TRANSACTION_ID
// JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID


//   let query = `
// select WELL_NAME, FECHA, SUM(COST_MNX + COST_DLS * MNXtoDLS) as TOTAL_COST, TIPO_DE_INTERVENCIONES, COMPANY from ResultsCosts rc
// JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
// JOIN FieldWellMapping fw ON i.WELL_FORMACION_ID = fw.WELL_FORMACION_ID
// ${where}
// GROUP BY i.TRANSACTION_ID
// `


  let query = `
    select WELL_NAME, rc.FECHA, SUM(rc.COST_MNX + rc.COST_DLS * rc.MNXtoDLS) as TOTAL_COST, SUM(iec.COST_MNX + iec.COST_DLS * iec.MNXtoDLS) as TOTAL_ESTIMATED_COST, TIPO_DE_INTERVENCIONES, rc.COMPANY from ResultsCosts rc
    JOIN IntervencionesEstimatedCosts iec ON rc.PROPUESTA_ID = iec.TRANSACTION_ID
    JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
    JOIN FieldWellMapping fw ON i.WELL_FORMACION_ID = fw.WELL_FORMACION_ID
    ${where}
    GROUP BY i.TRANSACTION_ID`

  connection.query(query, value, (err, results) => {
      console.log('err', err)

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

  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  
  let where = ''

  if (level) {
    where = ` WHERE ${level} = ?`
  }


  let query = `
select SUM(TOTAL_COST) / COUNT(1) as AVG_COST, SUM(TOTAL_EST_COST) / COUNT(1) as AVG_EST_COST, TIPO_DE_INTERVENCIONES
FROM
(select SUM(rc.COST_MNX + rc.COST_DLS * rc.MNXtoDLS) as TOTAL_COST, SUM(iec.COST_MNX + iec.COST_DLS * iec.MNXtoDLS) as TOTAL_EST_COST, TIPO_DE_INTERVENCIONES 
from ResultsCosts rc 
JOIN IntervencionesEstimatedCosts iec ON rc.PROPUESTA_ID = iec.TRANSACTION_ID
JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
JOIN FieldWellMapping fw ON i.WELL_FORMACION_ID = fw.WELL_FORMACION_ID 
${where}
GROUP BY rc.INTERVENTION_ID) a GROUP BY TIPO_DE_INTERVENCIONES
`

  connection.query(query, value, (err, results) => {
      console.log('err', err)
    
      results = results.map(i => ({
        name: i.TIPO_DE_INTERVENCIONES,
        avgCost: i.AVG_COST,
        avgEstCost: i.AVG_EST_COST
      }))

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/avgCostByCompany', (req, res) => {
  let { activo, field, well, formation } = req.body

  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  
  let where = ''

  if (level) {
    where = ` WHERE ${level} = ?`
  }


  let query = `
select SUM(TOTAL_COST) / COUNT(1) as AVG_COST, SUM(TOTAL_EST_COST) / COUNT(1) as AVG_EST_COST, COMPANY
FROM
(
select SUM(rc.COST_MNX + rc.COST_DLS * rc.MNXtoDLS) as TOTAL_COST, SUM(iec.COST_MNX + iec.COST_DLS * iec.MNXtoDLS) as TOTAL_EST_COST, rc.COMPANY
from ResultsCosts rc 
JOIN IntervencionesEstimatedCosts iec ON rc.PROPUESTA_ID = iec.TRANSACTION_ID
JOIN Intervenciones i ON rc.PROPUESTA_ID = i.TRANSACTION_ID 
JOIN FieldWellMapping fw ON i.WELL_FORMACION_ID = fw.WELL_FORMACION_ID 
${where}
GROUP BY rc.INTERVENTION_ID
) a GROUP BY COMPANY
`

  connection.query(query, value, (err, results) => {
      console.log('err', err)
    
      results = results.map(i => ({
        name: i.COMPANY,
        avgCost: i.AVG_COST,
        avgEstCost: i.AVG_EST_COST
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