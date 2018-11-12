import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/costData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, avg, noGroup, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = 'WHERE TRUE'

  if (level) {
    whereClause += ` AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause += ` AND FORMACION = ?`
    values.push(formation)
  }
  if (company) {
    whereClause += ' AND COMPANY = ?'
    values.push(company)
  }
  if (tipoDeIntervencion) {
    whereClause += ' AND i.TIPO_DE_INTERVENCIONES = ?'
    values.push(tipoDeIntervencion)
  }
  if (tipoDeTerminacion) {
    whereClause += ' AND TIPO_DE_TERMINACION = ?'
    values.push(tipoDeTerminacion)
  }
  if (lowDate) {
    whereClause += ' AND FECHA >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND FECHA <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
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
      select = 'i.TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }

  let groupByClause = select !== 1 ? `groupedName, ` : ''

  let query = `
select ${select}, YEAR(FECHA), MONTH(FECHA), FECHA, SUM(COST_MNX + COST_DLS * MNXtoDLS) as COST
FROM ResultsCosts rc
JOIN Intervenciones i ON rc.INTERVENTION_ID = i.INTERVENCIONES_ID
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN Transactions t ON rc.PROPUESTA_ID = t.TRANSACTION_ID
${whereClause}
GROUP BY ${groupByClause} YEAR(FECHA), MONTH(FECHA);
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
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = ''

  if (level) {
    whereClause += ` AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause += ` AND FORMACION = ?`
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
  if (lowDate) {
    whereClause += ' AND FECHA >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND FECHA <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }

  let query = 
`SELECT *, (QO_RESULT - QO) AS DELTA_QO FROM 

(SELECT SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, A.WELL_FORMACION_ID, WELL_NAME, FORMACION, COMPANY, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION, A.PROPUESTA_ID, QO AS QO_RESULT, QW AS QW_RESULT, FECHA  
FROM
(
  select fwm.SUBDIRECCION_NAME, fwm.ACTIVO_NAME, fwm.FIELD_NAME, fwm.WELL_FORMACION_ID, FORMACION, COMPANY, WELL_NAME, ResultsAforos.PROPUESTA_ID, ResultsAforos.TRANSACTION_ID, MAX(FECHA) AS FECHA, TIPO_DE_TERMINACION, TIPO_DE_INTERVENCIONES
  FROM ResultsAforos  
  JOIN FieldWellMapping fwm ON ResultsAforos.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID 
  JOIN Transactions t ON ResultsAforos.PROPUESTA_ID = t.TRANSACTION_ID
  JOIN TransactionsResults tr ON ResultsAforos.TRANSACTION_ID = tr.TRANSACTION_ID
  WHERE QO != '-999'  ${whereClause} GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results, 

(SELECT A.TRANSACTION_ID, QO, QW 
FROM
(
  select WellAforos.TRANSACTION_ID, MAX(FECHA) AS FECHA
  FROM WellAforos
    WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos

WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID`

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
            company: i.COMPANY,
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
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = 'WHERE TRUE'

  if (level) {
    whereClause += ` AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause += ` AND FORMACION = ?`
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
  if (lowDate) {
    whereClause += ' AND i.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND i.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
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
select ${select}, YEAR(i.FECHA_INTERVENCION), MONTH(i.FECHA_INTERVENCION), i.FECHA_INTERVENCION, i.WELL_FORMACION_ID, WELL_NAME, 
SUM(IF(ra.VOLUMEN_SISTEMA_NO_REACTIVO, ra.VOLUMEN_SISTEMA_NO_REACTIVO, 0) + IF(re.VOLUMEN_SISTEMA_NO_REACTIVO, re.VOLUMEN_SISTEMA_NO_REACTIVO, 0)) as TOTAL_SISTEMA_NO_REACTIVO,
SUM(IF(ra.VOLUMEN_SISTEMA_REACTIVO, ra.VOLUMEN_SISTEMA_REACTIVO, 0) + IF(re.VOLUMEN_SISTEMA_REACTIVO, re.VOLUMEN_SISTEMA_REACTIVO, 0)) as TOTAL_SISTEMA_REACTIVO,
SUM(IF(ra.VOLUMEN_SISTEMA_DIVERGENTE, ra.VOLUMEN_SISTEMA_DIVERGENTE, 0) + IF(re.VOLUMEN_SISTEMA_DIVERGENTE, re.VOLUMEN_SISTEMA_DIVERGENTE, 0)) as TOTAL_SISTEMA_DIVERGENTE,
SUM(IF(ra.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, ra.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, 0) + (IF(rap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, rap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, 0) / 264.172) + IF(re.VOLUMEN_DISPLAZAMIENTO_LIQUIDO, re.VOLUMEN_DISPLAZAMIENTO_LIQUIDO, 0)) as TOTAL_DESPLAZAMIENTO_LIQUIDO,
SUM(IF(ra.VOLUMEN_DESPLAZAMIENTO_N2, ra.VOLUMEN_DESPLAZAMIENTO_N2, 0) + IF(re.VOLUMEN_DESPLAZAMIENTO_N2, re.VOLUMEN_DESPLAZAMIENTO_N2, 0)) as TOTAL_DESPLAZAMIENTO_N2,
SUM(IF(ra.VOLUMEN_PRECOLCHON_N2, ra.VOLUMEN_PRECOLCHON_N2, 0) + IF(re.VOLUMEN_PRECOLCHON_N2, re.VOLUMEN_PRECOLCHON_N2, 0)) as TOTAL_PRECOLCHON_N2,
SUM(IF(ra.VOLUMEN_TOTAL_DE_LIQUIDO, ra.VOLUMEN_TOTAL_DE_LIQUIDO, 0) + (IF(rap.VOLUMEN_TOTAL_DE_LIQUIDO, rap.VOLUMEN_TOTAL_DE_LIQUIDO, 0) / 264.172) + IF(re.VOLUMEN_TOTAL_DE_LIQUIDO, re.VOLUMEN_TOTAL_DE_LIQUIDO, 0)) as TOTAL_LIQUIDO,
SUM(IF(rap.VOLUMEN_APUNTALANTE, rap.VOLUMEN_APUNTALANTE, 0) /  264.172) as TOTAL_APUNTALANTE,
SUM(IF(rap.VOLUMEN_GEL_DE_FRACTURA, rap.VOLUMEN_GEL_DE_FRACTURA, 0)/  264.172) as TOTAL_GEL_DE_FRACTURA,
SUM(IF(rap.VOLUMEN_PRECOLCHON_APUNTALANTE, rap.VOLUMEN_PRECOLCHON_APUNTALANTE, 0)/  264.172) as TOTAL_PRECOLCHON_APUNTALANTE,
SUM(IF(rt.VOLUMEN_VAPOR_INYECTAR, rt.VOLUMEN_VAPOR_INYECTAR, 0)) as TOTAL_VAPOR_INJECTED
FROM Results i 
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN ResultsAcido ra ON i.WELL_FORMACION_ID = ra.WELL_FORMACION_ID
LEFT JOIN ResultsApuntalado rap ON i.WELL_FORMACION_ID = rap.WELL_FORMACION_ID
LEFT JOIN ResultsEstimulacions re ON i.WELL_FORMACION_ID = re.WELL_FORMACION_ID
LEFT JOIN ResultsTermico rt ON i.WELL_FORMACION_ID = rt.WELL_FORMACION_ID
LEFT JOIN Transactions t ON i.PROPUESTA_ID = t.TRANSACTION_ID
LEFT JOIN TransactionsResults tr ON i.TRANSACTION_ID = tr.TRANSACTION_ID
${whereClause}
GROUP BY ${groupByClause} YEAR(FECHA_INTERVENCION), MONTH(FECHA_INTERVENCION)
`

  console.log('rererere', query, values)

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