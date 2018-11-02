import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/jobBreakdown', (req, res) => {
  let { activo, field, well, formation } = req.query

  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null

  let query = `SELECT i.TIPO_DE_INTERVENCIONES as name, COUNT(1) AS y, PROPUESTA_COMPANIA 
  FROM Intervenciones i
  JOIN Transactions t ON i.TRANSACTION_ID = t.TRANSACTION_ID`
  
  if (level) {
    query += ` JOIN FieldWellMapping f ON i.WELL_FORMACION_ID = f.WELL_FORMACION_ID`
    query += ` WHERE ${level} = ?`
  }

  // if (formation){
  //   query += level ? ' AND' : null
  //   query += ' WHERE FORMACION = ?'
  // }

  query += ` GROUP BY PROPUESTA_COMPANIA`


  // console.log(query)
  // console.log(value)
  connection.query(query, value, (err, results) => {
      // console.log('comment err', err)
      // console.log('comment results', results)

     if (err) {
      console.log(err)
        res.json({ success: false})
      }
      else {
        let out = {}
        results.forEach(i => {
          out[i.PROPUESTA_COMPANIA] = i.y
        })

        res.json(out)
      }
    })
})


router.get('/aforosData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion } = req.query
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = ''
  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (company) {
    whereClause += ' AND PROPUESTA_COMPANIA = ?'
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

  let query = `
SELECT * FROM 

(SELECT SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, A.WELL_FORMACION_ID, WELL_NAME, FORMACION, PROPUESTA_COMPANIA, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION, TRANSACTION_ID, FECHA, QO, QW  FROM
(
  select fwm.SUBDIRECCION_NAME, fwm.ACTIVO_NAME, fwm.FIELD_NAME, WellAforos.WELL_FORMACION_ID, FORMACION, PROPUESTA_COMPANIA, WELL_NAME, WellAforos.TRANSACTION_ID, MAX(FECHA) FECHA, TIPO_DE_TERMINACION, TIPO_DE_INTERVENCIONES
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

  connection.query(query, values, (err, results) => {
      console.log('comment err', err)

      if (err) {
        res.json({ success: false})
      }
      else {
        results = results.map(i => ({
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
          qo: i.QO,
          qw: i.QW,
          qoResult: i.QO_RESULT,
          qwResult: i.QW_RESULT,
        }))


        res.json(results)
      }
    })
})

router.post('/countData', (req, res) => {
  let { activo, field, well, formation } = req.body
  
  let level = well ? 't.WELL_FORMACION_ID' : field ? 't.FIELD_FORMACION_ID' : activo ? 't.ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `WHERE ${level} = ?`
  }

  let query = `
select TIPO_DE_INTERVENCIONES, SUM(HAS_RESULTS) as COUNT_RESULTS, COUNT(1)  AS COUNT  from Transactions t 
JOIN FieldWellMapping ON t.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID
 ${whereClause} GROUP BY TIPO_DE_INTERVENCIONES
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

router.post('/estimatedIncreaseData', (req, res) => {
  let { activo, field, well, formation, groupBy } = req.body
  
  let level = well ? 'FieldWellMapping.WELL_FORMACION_ID' : field ? 'FieldWellMapping.FIELD_FORMACION_ID' : activo ? 'FieldWellMapping.ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `WHERE ${level} = ?`
  }
  groupBy = groupBy === 'type' ? 'TYPE' : groupBy === 'well' ? 'WELL_FORMACION_ID' : 'FIELD_FORMACION_ID'

  let query = `
select TYPE, FIELD_NAME, WELL_NAME, WELL_FORMACION_ID, FIELD_FORMACION_ID, SUM(EST_INC_Qo) as EST_INC_Qo from
(select FIELD_NAME, WELL_NAME, ia.WELL_FORMACION_ID, FIELD_FORMACION_ID, EST_INC_Qo, 'acido' AS TYPE FROM IntervencionesAcido ia
 JOIN FieldWellMapping ON ia.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID
${whereClause}
 UNION
select FIELD_NAME, WELL_NAME, ie.WELL_FORMACION_ID, FIELD_FORMACION_ID, EST_INC_Qo, 'estimulacion' AS TYPE FROM IntervencionesEstimulacions ie
 JOIN FieldWellMapping ON ie.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID
${whereClause}
  UNION
select FIELD_NAME, WELL_NAME, iap.WELL_FORMACION_ID, FIELD_FORMACION_ID, EST_INC_Qo, 'apuntalado' AS TYPE FROM IntervencionesApuntalado iap
 JOIN FieldWellMapping ON iap.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID
 ${whereClause}) as a
 GROUP BY ${groupBy}
`

  connection.query(query, [value, value, value], (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/execTableData', (req, res) => {
  let { activo, field, well, formation, groupBy } = req.body
  
  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `WHERE ${level} = ?`
  }

  groupBy = groupBy === 'well' ? 'FieldWellMapping.WELL_FORMACION_ID' : 'FieldWellMapping.FIELD_FORMACION_ID'

  let query = `
select 
FIELD_NAME, 
WELL_NAME,
FieldWellMapping.WELL_FORMACION_ID,
FieldWellMapping.FIELD_FORMACION_ID,
COUNT(1) as NUM_TREATMENTS,  
SUM(TIPO_DE_INTERVENCIONES = 'estimulacion') as NUM_ESTIMULACION,
SUM(TIPO_DE_INTERVENCIONES = 'acido') as NUM_ACIDO, 
SUM(TIPO_DE_INTERVENCIONES = 'apuntalado') as NUM_APUNTALADO, 
SUM(TIPO_DE_INTERVENCIONES = 'termico') as NUM_TERMICO,
COST
from Intervenciones i 
JOIN FieldWellMapping ON i.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID 
LEFT JOIN (select PROPUESTA_ID, SUM(COST_MNX + COST_DLS * MNXtoDLS) as COST FROM ResultsCosts GROUP BY TRANSACTION_ID) costs  ON i.TRANSACTION_ID = costs.PROPUESTA_ID
${whereClause}
GROUP BY ${groupBy}
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

router.post('/volumenData', (req, res) => {
  let { activo, field, well, formation, groupBy } = req.body
  
  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `WHERE ${level} = ?`
  }

  let query = `
select i.WELL_FORMACION_ID, WELL_NAME, 
SUM(ia.VOLUMEN_SISTEMA_NO_REACTIVO + ie.VOLUMEN_SISTEMA_NO_REACTIVO) as TOTAL_SISTEMA_NO_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_REACTIVO + ie.VOLUMEN_SISTEMA_REACTIVO) as TOTAL_SISTEMA_REACTIVO,
SUM(ia.VOLUMEN_SISTEMA_DIVERGENTE + ie.VOLUMEN_SISTEMA_DIVERGENTE) as TOTAL_SISTEMA_DIVERGENTE,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_LIQUIDO + (iap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO / 264.172) + ie.VOLUMEN_DISPLAZAMIENTO_LIQUIDO) as TOTAL_DESPLAZAMIENTO_LIQUIDO,
SUM(ia.VOLUMEN_DESPLAZAMIENTO_N2 + ie.VOLUMEN_DESPLAZAMIENTO_N2) as TOTAL_DESPLAZAMIENTO_N2,
SUM(ia.VOLUMEN_PRECOLCHON_N2 + ie.VOLUMEN_PRECOLCHON_N2) as TOTAL_PRECOLCHON_N2,
SUM(ia.VOLUMEN_TOTAL_DE_LIQUIDO + (iap.VOLUMEN_TOTAL_DE_LIQUIDO / 264.172) + ie.VOLUMEN_TOTAL_DE_LIQUIDO) as TOTAL_LIQUIDO,
SUM(iap.VOLUMEN_APUNTALANTE /  264.172) as TOTAL_APUNTALANTE,
SUM(iap.VOLUMEN_GEL_DE_FRACTURA/  264.172) as TOTAL_GEL_DE_FRACTURA,
SUM(iap.VOLUMEN_PRECOLCHON_APUNTALANTE/  264.172) as TOTAL_PRECOLCHON_APUNTALANTE,
SUM(it.VOLUMEN_VAPOR_INYECTAR) as TOTAL_VAPOR_INJECTED
FROM Intervenciones i 
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN IntervencionesAcido ia ON i.WELL_FORMACION_ID = ia.WELL_FORMACION_ID
LEFT JOIN IntervencionesApuntalado iap ON i.WELL_FORMACION_ID = iap.WELL_FORMACION_ID
LEFT JOIN IntervencionesEstimulacions ie ON i.WELL_FORMACION_ID = ie.WELL_FORMACION_ID
LEFT JOIN IntervencionesTermico it ON i.WELL_FORMACION_ID = it.WELL_FORMACION_ID
${whereClause}
GROUP BY i.WELL_FORMACION_ID`


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


router.get('/costData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, avg, noGroup } = req.query
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = ''
  let groupByClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (company) {
    whereClause += ' AND PROPUESTA_COMPANIA = ?'
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

  switch(groupBy) {
    case 'subdireccion':
      groupByClause = `GROUP BY SUBDIRECCION_NAME`
      break
    case 'activo':
      groupByClause = `GROUP BY ACTIVO_NAME`
      break
    case 'field':
      groupByClause = `GROUP BY FIELD_NAME`
      break
    case 'well':
      groupByClause = `GROUP BY WELL_FORMACION_ID`
      break
    case 'formation':
      groupByClause = `GROUP BY FORMACION`
      break
    case 'company':
      groupByClause = `GROUP BY COMPANY`
      break
    case 'interventionType':
      groupByClause = `GROUP BY TIPO_DE_INTERVENCIONES`
      break
    case 'terminationType':
      groupByClause = `GROUP BY TIPO_DE_TERMINACION`
      break
  }

  if (noGroup) {
    groupByClause = 'GROUP BY rc.TRANSACTION_ID'
  }

  let agg = avg ? 'AVG' : 'SUM'


  let query = `
    select SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, fwm.WELL_FORMACION_ID, WELL_NAME, FORMACION, rc.COMPANY AS COMPANY, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION, ${agg}(rc.COST_MNX + rc.COST_DLS * rc.MNXtoDLS) as TOTAL_COST, ${agg}(iec.COST_MNX + iec.COST_DLS * iec.MNXtoDLS) as TOTAL_ESTIMATED_COST 
    FROM ResultsCosts rc
    JOIN Transactions t ON rc.PROPUESTA_ID = t.TRANSACTION_ID
    JOIN IntervencionesEstimatedCosts iec ON rc.PROPUESTA_ID = iec.TRANSACTION_ID
    JOIN FieldWellMapping fwm ON t.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
    ${whereClause}
    ${groupByClause}`

  connection.query(query, values, (err, results) => {
      console.log('err', err)

     if (err) {
        res.json({ success: false})
      }
      else {

        results = results.map(i => ({
          subdireccion: i.SUBDIRECCION_NAME,
          activo: i.ACTIVO_NAME,
          field: i.FIELD_NAME,
          well: i.WELL_NAME,
          wellID: i.WELL_FORMACION_ID,
          formation: i.FORMACION,
          company: i.COMPANY,
          interventionType: i.TIPO_DE_INTERVENCIONES,
          terminationType: i.TIPO_DE_TERMINACION,
          totalCost: i.TOTAL_COST,
          totalEstimatedCost: i.TOTAL_ESTIMATED_COST

        }))

        res.json(results)
      }
    })
})







export default router