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

router.get('/aforosData', (req, res) => {
  let { activo, field, well, formation } = req.body
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `AND ${level} = ?`
  }

  let query = 
`SELECT FECHA, (QO_RESULT - QO) AS DELTA_QO FROM 

(SELECT A.WELL_FORMACION_ID, FORMACION, WELL_NAME, TRANSACTION_ID, FECHA, QO, QW, TIPO_DE_INTERVENCIONES FROM
(
  select WellAforos.WELL_FORMACION_ID, FORMACION, WELL_NAME, WellAforos.TRANSACTION_ID, MAX(FECHA) FECHA, TIPO_DE_INTERVENCIONES
  FROM WellAforos 
  JOIN FieldWellMapping ON WellAforos.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID 
  JOIN WellsData ON WellAforos.TRANSACTION_ID = WellsData.TRANSACTION_ID
  JOIN Intervenciones ON WellAforos.TRANSACTION_ID = Intervenciones.TRANSACTION_ID
  WHERE QO != '-999' ${whereClause} GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos,

(SELECT A.PROPUESTA_ID, QO as QO_RESULT, QW as QW_RESULT FROM
(
  select WELL_FORMACION_ID, PROPUESTA_ID, TRANSACTION_ID, MAX(FECHA) FECHA
  FROM ResultsAforos WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results 
WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID`

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

router.get('/volumeData', (req, res) => {
  let { activo, field, well, formation } = req.body
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `AND ${level} = ?`
  }

  let query = 
`
select YEAR(FECHA_INTERVENCION), MONTH(FECHA_INTERVENCION), DAY(FECHA_INTERVENCION), FECHA_INTERVENCION, i.WELL_FORMACION_ID, WELL_NAME, 
SUM(ia.VOLUMEN_SISTEMA_NO_REACTIVO + ie.VOLUMEN_SISTEMA_NO_REACTIVO) as TOTAL_SISTEMA_NO_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_REACTIVO + ie.VOLUMEN_SISTEMA_REACTIVO) as TOTAL_SISTEMA_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_DIVERGENTE + ie.VOLUMEN_SISTEMA_DIVERGENTE) as TOTAL_SISTEMA_DIVERGENTE,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_LIQUIDO + (iap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO / 264.172) + ie.VOLUMEN_DISPLAZAMIENTO_LIQUIDO) as TOTAL_DESPLAZAMIENTO_LIQUIDO,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_N2 + ie.VOLUMEN_DESPLAZAMIENTO_N2) as TOTAL_DESPLAZAMIENTO_N2,
SUM(ia.VOLUMEN_PRECOLCHON_N2 + ie.VOLUMEN_PRECOLCHON_N2) as TOTAL_PRECOLCHON_N2,
SUM(ia.VOLUMEN_TOTAL_DE_LIQUIDO + (iap.VOLUMEN_TOTAL_DE_LIQUIDO / 264.172) + ie.VOLUMEN_TOTAL_DE_LIQUIDO) as TOTAL_LIQUIDO,
SUM(iap.VOLUMEN_APUNTALANTE) as TOTAL_APUNTALANTE,
SUM(iap.VOLUMEN_GEL_DE_FRACTURA) as TOTAL_GEL_DE_FRACTURA,
SUM(iap.VOLUMEN_PRECOLCHON_APUNTALANTE) as TOTAL_PRECOLCHON_APUNTALANTE,
SUM(it.VOLUMEN_VAPOR_INYECTAR) as TOTAL_VAPOR_INJECTED
FROM Results i 
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN ResultsAcido ia ON i.WELL_FORMACION_ID = ia.WELL_FORMACION_ID
LEFT JOIN ResultsApuntalado iap ON i.WELL_FORMACION_ID = iap.WELL_FORMACION_ID
LEFT JOIN ResultsEstimulacions ie ON i.WELL_FORMACION_ID = ie.WELL_FORMACION_ID
LEFT JOIN ResultsTermico it ON i.WELL_FORMACION_ID = it.WELL_FORMACION_ID
${whereClause}
GROUP BY YEAR(FECHA_INTERVENCION), MONTH(FECHA_INTERVENCION), DAY(FECHA_INTERVENCION)
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




export default router