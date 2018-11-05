import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/costData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, avg, noGroup } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause = ` AND FORMACION = ?`
    values.push(formation)
  }
  if (company) {
    whereClause += ' AND COMPANY = ?'
    values.push(company)
  }
  if (tipoDeIntervencion) {
    whereClause += ' AND TIPO_DE_INTERVENCIONES = ?'
    values.push(tipoDeIntervencion)
  }
  if (tipoDeTerminacion) {
    whereClause += ' AND TIPO_DE_TERMINACION = ?'
    values.push(tipoDeTerminacion)
  }

  let select = 1

  switch(groupBy) {
    case 'subdireccion':
      select = 'SUBDIRECCION_NAME as groupedName'
      break
    case 'activo':
      select = 'ACTIVO_NAME as groupedName'
      break
    case 'field':
      select = 'FIELD_NAME as groupedName'
      break
    case 'well':
      select = 'WELL_NAME as groupedName'
      break
    case 'formation':
      select = 'FORMACION as groupedName'
      break
    case 'company':
      select = 'COMPANY as groupedName'
      break
    case 'interventionType':
      select = 'TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }

  let groupByClause = select !== 1 ? `groupedName, ` : ''

  let query = `
select ${select}, YEAR(FECHA), MONTH(FECHA), DAY(FECHA), FECHA, SUM(COST_MNX + COST_DLS * MNXtoDLS) as COST
FROM ResultsCosts rc
JOIN Intervenciones i ON rc.INTERVENTION_ID = i.INTERVENCIONES_ID
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
${whereClause}
GROUP BY ${groupByClause} YEAR(FECHA), MONTH(FECHA), DAY(FECHA);
  `

  connection.query(query, values, (err, results) => {
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
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause = ` AND FORMACION = ?`
    values.push(formation)
  }
  if (company) {
    whereClause += ' AND COMPANY = ?'
    values.push(company)
  }
  if (tipoDeIntervencion) {
    whereClause += ' AND TIPO_DE_INTERVENCIONES = ?'
    values.push(tipoDeIntervencion)
  }
  if (tipoDeTerminacion) {
    whereClause += ' AND TIPO_DE_TERMINACION = ?'
    values.push(tipoDeTerminacion)
  }

  let query = 
`SELECT *, FECHA, (QO_RESULT - QO) AS DELTA_QO FROM 

(SELECT SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, A.WELL_FORMACION_ID, WELL_NAME, FORMACION, PROPUESTA_COMPANIA, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION, TRANSACTION_ID, FECHA, QO, QW  FROM
(
  select fwm.SUBDIRECCION_NAME, fwm.ACTIVO_NAME, fwm.FIELD_NAME, fwm.WELL_FORMACION_ID, FORMACION, PROPUESTA_COMPANIA, WELL_NAME, WellAforos.TRANSACTION_ID, MAX(FECHA) FECHA, TIPO_DE_TERMINACION, TIPO_DE_INTERVENCIONES
  FROM WellAforos 
  JOIN FieldWellMapping fwm ON WellAforos.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID 
  JOIN Transactions t ON WellAforos.TRANSACTION_ID = t.TRANSACTION_ID
  WHERE QO != '-999' ${whereClause} GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos,

(SELECT A.PROPUESTA_ID, QO as QO_RESULT, QW as QW_RESULT FROM
(
  select WELL_FORMACION_ID, PROPUESTA_ID, TRANSACTION_ID, MAX(FECHA) FECHA
  FROM ResultsAforos WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results 
WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID
`


  console.log(query)

  connection.query(query, values, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        results = results.map(i => {
          return {
            subdireccion: i.SUBDIRECCION_NAME,
            activo: i.ACTIVO_NAME,
            field: i.FIELD_NAME,
            well: i.WELL_NAME,
            wellID: i.WELL_FORMACION_ID,
            formation: i.FORMACION,
            company: i.PROPUESTA_COMPANIA,
            interventionType: i.TIPO_DE_INTERVENCIONES,
            terminationType: i.TIPO_DE_TERMINACION,
            date: i.FECHA,
            deltaQo: i.DELTA_QO
          }
        })

        res.json(results)
      }
    })
})

router.get('/volumeData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause = ` AND FORMACION = ?`
    values.push(formation)
  }
  if (company) {
    whereClause += ' AND COMPANY = ?'
    values.push(company)
  }
  if (tipoDeIntervencion) {
    whereClause += ' AND TIPO_DE_INTERVENCIONES = ?'
    values.push(tipoDeIntervencion)
  }
  if (tipoDeTerminacion) {
    whereClause += ' AND TIPO_DE_TERMINACION = ?'
    values.push(tipoDeTerminacion)
  }

  let select = 1

  switch(groupBy) {
    case 'subdireccion':
      select = 'SUBDIRECCION_NAME as groupedName'
      break
    case 'activo':
      select = 'ACTIVO_NAME as groupedName'
      break
    case 'field':
      select = 'FIELD_NAME as groupedName'
      break
    case 'well':
      select = 'WELL_NAME as groupedName'
      break
    case 'formation':
      select = 'FORMACION as groupedName'
      break
    case 'company':
      select = 'COMPANY as groupedName'
      break
    case 'interventionType':
      select = 'TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }

  let groupByClause = select !== 1 ? `groupedName, ` : ''
  let query = 
`
select ${select}, YEAR(FECHA_INTERVENCION), MONTH(FECHA_INTERVENCION), DAY(FECHA_INTERVENCION), FECHA_INTERVENCION, i.WELL_FORMACION_ID, WELL_NAME, 
SUM(ia.VOLUMEN_SISTEMA_NO_REACTIVO + ie.VOLUMEN_SISTEMA_NO_REACTIVO) as TOTAL_SISTEMA_NO_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_REACTIVO + ie.VOLUMEN_SISTEMA_REACTIVO) as TOTAL_SISTEMA_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_DIVERGENTE + ie.VOLUMEN_SISTEMA_DIVERGENTE) as TOTAL_SISTEMA_DIVERGENTE,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_LIQUIDO + (iap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO / 264.172) + ie.VOLUMEN_DISPLAZAMIENTO_LIQUIDO) as TOTAL_DESPLAZAMIENTO_LIQUIDO,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_N2 + ie.VOLUMEN_DESPLAZAMIENTO_N2) as TOTAL_DESPLAZAMIENTO_N2,
SUM(ia.VOLUMEN_PRECOLCHON_N2 + ie.VOLUMEN_PRECOLCHON_N2) as TOTAL_PRECOLCHON_N2,
SUM(ia.VOLUMEN_TOTAL_DE_LIQUIDO + (iap.VOLUMEN_TOTAL_DE_LIQUIDO / 264.172) + ie.VOLUMEN_TOTAL_DE_LIQUIDO) as TOTAL_LIQUIDO,
SUM(iap.VOLUMEN_APUNTALANTE /  264.172) as TOTAL_APUNTALANTE,
SUM(iap.VOLUMEN_GEL_DE_FRACTURA /  264.172) as TOTAL_GEL_DE_FRACTURA,
SUM(iap.VOLUMEN_PRECOLCHON_APUNTALANTE/  264.172) as TOTAL_PRECOLCHON_APUNTALANTE,
SUM(it.VOLUMEN_VAPOR_INYECTAR) as TOTAL_VAPOR_INJECTED
FROM Results i 
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN ResultsAcido ia ON i.WELL_FORMACION_ID = ia.WELL_FORMACION_ID
LEFT JOIN ResultsApuntalado iap ON i.WELL_FORMACION_ID = iap.WELL_FORMACION_ID
LEFT JOIN ResultsEstimulacions ie ON i.WELL_FORMACION_ID = ie.WELL_FORMACION_ID
LEFT JOIN ResultsTermico it ON i.WELL_FORMACION_ID = it.WELL_FORMACION_ID
LEFT JOIN Transactions t ON i.PROPUESTA_ID = t.TRANSACTION_ID
${whereClause}
GROUP BY ${groupByClause} YEAR(FECHA_INTERVENCION), MONTH(FECHA_INTERVENCION), DAY(FECHA_INTERVENCION)
`

  connection.query(query, values, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
    else {
      let out = {}
      let groups = []

      results.forEach(i => {
        if (!groups.includes(i.groupedName)) {
          groups.push(i.groupedName)
        }

      })

      groups.forEach(i => {
        out[i] = results.filter(j => j.groupedName === i) 
      })

      res.json(out)
    }
  })
})




export default router