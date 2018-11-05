import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/jobBreakdown', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, avg, noGroup } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = ''
  let groupByClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    values.push(well ? well : field ? field : activo ? activo : subdir ? subdir : null)
  }
  if (formation) {
    whereClause = ` AND FORMACION = ?`
    values.push(formation)
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

  let groupByKey = 1

  switch(groupBy) {
    case 'subdireccion':
      groupByClause = `, SUBDIRECCION_NAME`
      groupByKey = 'SUBDIRECCION_NAME as groupedName'
      break
    case 'activo':
      groupByClause = `, ACTIVO_NAME`
      groupByKey = 'ACTIVO_NAME as groupedName'
      break
    case 'field':
      groupByClause = `, FIELD_NAME`
      groupByKey = 'FIELD_NAME as groupedName'
      break
    case 'well':
      groupByClause = `, t.WELL_FORMACION_ID`
      groupByKey = 'WELL_NAME as groupedName'
      break
    case 'formation':
      groupByClause = `, FORMACION`
      groupByKey = 'FORMACION as groupedName'
      break
    case 'company':
      groupByClause = `, PROPUESTA_COMPANIA`
      groupByKey = 'PROPUESTA_COMPANIA as groupedName'
      break
    case 'interventionType':
      groupByClause = `, TIPO_DE_INTERVENCIONES`
      groupByKey = 'TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      groupByClause = `, TIPO_DE_TERMINACION`
      groupByKey = 'TIPO_DE_TERMINACION as groupedName'
      break
  }

  let query = `SELECT i.TIPO_DE_INTERVENCIONES as name, COUNT(1) AS y, ${groupByKey} 
  FROM Intervenciones i
  JOIN Transactions t ON i.TRANSACTION_ID = t.TRANSACTION_ID
  JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
  ${whereClause}
  GROUP BY i.TIPO_DE_INTERVENCIONES ${groupByClause}`
  

  connection.query(query, values, (err, results) => {
      // console.log('comment err', err)
      // console.log('comment results', results)

     if (err) {
      console.log(err)
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


router.get('/aforosData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, carousel } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = ''
  let groupByClause = 'GROUP BY TRANSACTION_ID'

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


  let groupByKey = 1
  let select = ''

  switch(groupBy) {
    case 'subdireccion':
      groupByKey = 'SUBDIRECCION_NAME'
      select = `, SUBDIRECCION_NAME as groupedName`
      break
    case 'activo':
      groupByKey = 'ACTIVO_NAME'
      select = `, ACTIVO_NAME as groupedName`
      break
    case 'field':
      groupByKey = 'FIELD_NAME'
      select = `, FIELD_NAME as groupedName`
      break
    case 'well':
      groupByKey = 'WELL_NAME'
      select = `, WELL_NAME as groupedName`
      break
    case 'formation':
      groupByKey = 'FORMACION'
      select = `, FORMACION as groupedName`
      break
    case 'company':
      groupByKey = 'PROPUESTA_COMPANIA'
      select = `, PROPUESTA_COMPANIA as groupedName`
      break
    case 'interventionType':
      groupByKey = 'TIPO_DE_INTERVENCIONES'
      select = `, TIPO_DE_INTERVENCIONES as groupedName`
      break
    case 'terminationType':
      groupByKey = 'TIPO_DE_TERMINACION'
      select = `, TIPO_DE_TERMINACION as groupedName`
      break
  }



  if (carousel) {
    groupByClause = `GROUP BY name`
    groupByKey !== 1 ? groupByClause += `, ${groupByKey}` : null
  }

  let query = `
SELECT *, COUNT(1) AS y, 1, IF(QO_RESULT > QO, 'Successful', 'Unsuccessful') as name,  IF(QO_RESULT > QO, 'green', 'red') as color ${select} FROM 

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
${groupByClause}
`

  connection.query(query, values, (err, results) => {
      console.log('comment err', err)

      if (err) {
        res.json({ success: false})
      }
      else if (carousel) {
        let out = {}
        let groups = []

        results.forEach(i => {
          if (!groups.includes(i[groupByKey])) {
            groups.push(i[groupByKey])
          }

        })

        groups.forEach(i => {
          out[i] = results.filter(j => j[groupByKey] === i) 
        })

        res.json(out)
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
          groupedName: i.groupedName
        }))


        res.json(results)
      }
    })
})





router.get('/costData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, avg, noGroup } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
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


router.get('/tableData', (req, res) => {
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

  let select = `1 as groupedName`

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
      select = 'PROPUESTA_COMPANIA as groupedName'
      break
    case 'interventionType':
      select = 'i.TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }



  let query = `
select 
${select},
COUNT(1) as NUM_TREATMENTS,  
SUM(i.TIPO_DE_INTERVENCIONES = 'estimulacion') as NUM_ESTIMULACION,
SUM(i.TIPO_DE_INTERVENCIONES = 'acido') as NUM_ACIDO, 
SUM(i.TIPO_DE_INTERVENCIONES = 'apuntalado') as NUM_APUNTALADO, 
SUM(i.TIPO_DE_INTERVENCIONES = 'termico') as NUM_TERMICO,
SUM(COST) AS COST
from Intervenciones i 
JOIN Transactions t ON i.TRANSACTION_ID = t.TRANSACTION_ID
JOIN FieldWellMapping fwm ON i.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID 
LEFT JOIN (select PROPUESTA_ID, COMPANY, SUM(COST_MNX + COST_DLS * MNXtoDLS) as COST FROM ResultsCosts rc GROUP BY TRANSACTION_ID) costs  ON i.TRANSACTION_ID = costs.PROPUESTA_ID
${whereClause}
GROUP BY groupedName
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




router.get('/estIncData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = ''

  if (level) {
    whereClause = `AND ${level} = ?`
    let val  = well ? well : field ? field : activo ? activo : subdir ? subdir : null
    values = values.concat([val, val, val])
  }
  if (formation) {
    whereClause = ` AND FORMACION = ?`
    values = values.concat([formation, formation, formation])
  }
  if (company) {
    whereClause += ' AND PROPUESTA_COMPANIA = ?'
    values = values.concat([company, company, company])
  }
  if (tipoDeIntervencion) {
    whereClause += ' AND TIPO_DE_INTERVENCIONES = ?'
    values = values.concat([tipoDeIntervencion, tipoDeIntervencion, tipoDeIntervencion])
  }
  if (tipoDeTerminacion) {
    whereClause += ' AND TIPO_DE_TERMINACION = ?'
    values = values.concat([tipoDeTerminacion, tipoDeTerminacion, tipoDeTerminacion])
  }


  let groupByKey = 1
  let select = `1 as groupedName`
  let selectAcido = ''
  let selectEstimulacion = ''
  let selectApuntalado = ''

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
      select = 't.FORMACION as groupedName'
      break
    case 'company':
      select = 't.PROPUESTA_COMPANIA as groupedName'
      break
    case 'interventionType':
      select = '1'
      selectAcido = `, 'acido' AS groupedName`
      selectEstimulacion = `, 'estimulacion' AS groupedName`
      selectApuntalado = `, 'apuntalado' AS groupedName`

      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }



  let query = `
select groupedName, SUM(EST_INC_Qo) as EST_INC_Qo from
(select EST_INC_Qo, ${select} ${selectAcido} FROM IntervencionesAcido ia
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
${whereClause}
 UNION
select EST_INC_Qo, ${select} ${selectEstimulacion} FROM IntervencionesEstimulacions ie
 JOIN FieldWellMapping fwm ON ie.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ie.TRANSACTION_ID = t.TRANSACTION_ID
${whereClause}
  UNION
select EST_INC_Qo, ${select} ${selectApuntalado} FROM IntervencionesApuntalado iap
 JOIN FieldWellMapping fwm ON iap.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON iap.TRANSACTION_ID = t.TRANSACTION_ID
 ${whereClause}) as a
 GROUP BY groupedName
`


console.log('query', query)

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





export default router