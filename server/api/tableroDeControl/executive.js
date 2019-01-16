import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
import { getAuthorization } from './../../middleware'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.use(getAuthorization)
router.get('/jobBreakdown', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, noGroup, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = 'WHERE 1 = 1'
  let groupByClause = ''

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
    whereClause += ' AND tr.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
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
      groupByClause = `, COMPANY`
      groupByKey = 'COMPANY as groupedName'
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

  let query = `SELECT TIPO_DE_INTERVENCIONES as name, COUNT(1) AS y, ${groupByKey} 
  FROM Results r
  JOIN Transactions t ON r.PROPUESTA_ID = t.TRANSACTION_ID
  JOIN TransactionsResults tr on tr.TRANSACTION_ID = r.TRANSACTION_ID
  JOIN FieldWellMapping fwm ON r.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
  ${whereClause}
  GROUP BY TIPO_DE_INTERVENCIONES ${groupByClause}
  ORDER BY TIPO_DE_INTERVENCIONES`

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
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, carousel, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = ''
  let groupByClause = 'GROUP BY TRANSACTION_ID'

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
    whereClause += ' AND FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
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
      groupByKey = 'COMPANY'
      select = `, COMPANY as groupedName`
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
SELECT *, COUNT(1) AS y,  (QO_RESULT - QO) AS DELTA_QO, IF(QO_RESULT > QO, 'Successful', 'Unsuccessful') as name,  IF(QO_RESULT > QO, 'green', 'red') as color ${select} FROM 

(SELECT SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, A.WELL_FORMACION_ID, WELL_NAME, FORMACION, COMPANY, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION, A.PROPUESTA_ID, QO AS QO_RESULT, QW AS QW_RESULT, QG AS QG_RESULT, FECHA  
FROM
(
  select fwm.SUBDIRECCION_NAME, fwm.ACTIVO_NAME, fwm.FIELD_NAME, fwm.WELL_FORMACION_ID, FORMACION, COMPANY, WELL_NAME, ResultsAforos.PROPUESTA_ID, ResultsAforos.TRANSACTION_ID, MAX(FECHA) AS FECHA, TIPO_DE_TERMINACION, TIPO_DE_INTERVENCIONES
  FROM ResultsAforos  
  JOIN FieldWellMapping fwm ON ResultsAforos.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID 
  JOIN Transactions t ON ResultsAforos.PROPUESTA_ID = t.TRANSACTION_ID
  JOIN TransactionsResults tr ON ResultsAforos.TRANSACTION_ID = tr.TRANSACTION_ID
  WHERE QO != '-999'  ${whereClause} GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results, 

(SELECT A.TRANSACTION_ID, QO, QW, QG
FROM
(
  select WellAforos.TRANSACTION_ID, MAX(FECHA) AS FECHA
  FROM WellAforos
    WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos

WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID
${groupByClause}
ORDER BY groupedName`

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
          qg: i.QG,
          qw: i.QW,
          qoResult: i.QO_RESULT,
          qwResult: i.QW_RESULT,
          qgResult: i.QG_RESULT,
          groupedName: i.groupedName
        }))


        res.json(results)
      }
    })
})





router.get('/costData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, noGroup, lowDate, highDate } = req.query
  
  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = 'WHERE 1 = 1'
  let groupByClause = ''
  let orderByClause = ''

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
    whereClause += ' AND FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }

  switch(groupBy) {
    case 'subdireccion':
      groupByClause = `GROUP BY SUBDIRECCION_NAME`
      orderByClause = `ORDER BY SUBDIRECCION_NAME`
      break
    case 'activo':
      groupByClause = `GROUP BY ACTIVO_NAME`
      orderByClause = `ORDER BY ACTIVO_NAME`
      break
    case 'field':
      groupByClause = `GROUP BY FIELD_NAME`
      orderByClause = `ORDER BY FIELD_NAME`
      break
    case 'well':
      groupByClause = `GROUP BY WELL_FORMACION_ID`
      orderByClause = `ORDER BY WELL_FORMACION_ID`
      break
    case 'formation':
      groupByClause = `GROUP BY FORMACION`
      orderByClause = `ORDER BY FORMACION`
      break
    case 'company':
      groupByClause = `GROUP BY COMPANY`
      orderByClause = `ORDER BY COMPANY`
      break
    case 'interventionType':
      groupByClause = `GROUP BY TIPO_DE_INTERVENCIONES`
      orderByClause = `ORDER BY TIPO_DE_INTERVENCIONES`
      break
    case 'terminationType':
      groupByClause = `GROUP BY TIPO_DE_TERMINACION`
      orderByClause = `ORDER BY TIPO_DE_TERMINACION`
      break
  }

  if (noGroup) {
    groupByClause = 'GROUP BY TRANSACTION_ID'
  }


  let query = 
`
 select a.SUBDIRECCION_NAME, a.ACTIVO_NAME, a.FIELD_NAME, a.WELL_FORMACION_ID, a.WELL_NAME, a.FORMACION, a.COMPANY, a.TIPO_DE_INTERVENCIONES, a.TIPO_DE_TERMINACION,
    SUM(TOTAL_COST) AS TOTAL_COST, 
    SUM(TOTAL_EST_COST) AS TOTAL_EST_COST, 
    AVG(TOTAL_COST) AS AVG_COST,
    AVG(TOTAL_EST_COST) AS AVG_EST_COST,
    ((SUM(TOTAL_COST) / SUM(TOTAL_EST_COST)) - 1) * 100 AS DEVIATION,
    SUM(((TOTAL_COST / TOTAL_EST_COST) - 1) * 100)   / COUNT(DISTINCT a.TRANSACTION_ID) as AVG_DEVIATION,
    a.TRANSACTION_ID  
    
    FROM
    
    (select SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, fwm.WELL_FORMACION_ID, WELL_NAME, FORMACION, rc.COMPANY AS COMPANY, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION,
      SUM(rc.COST_MNX) + SUM(rc.COST_DLS * rc.MNXtoDLS) as TOTAL_COST,
      rc.PROPUESTA_ID, rc.TRANSACTION_ID
    FROM ResultsCosts rc
    JOIN Transactions t ON rc.PROPUESTA_ID = t.TRANSACTION_ID  
    JOIN TransactionsResults  tr ON rc.TRANSACTION_ID = tr.TRANSACTION_ID  
    JOIN FieldWellMapping fwm ON t.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
    ${whereClause}
    GROUP BY TRANSACTION_ID) a
  
  JOIN 
  
  (select SUBDIRECCION_NAME, ACTIVO_NAME, FIELD_NAME, fwm.WELL_FORMACION_ID, WELL_NAME, FORMACION, rc.COMPANY AS COMPANY, TIPO_DE_INTERVENCIONES, TIPO_DE_TERMINACION,
      SUM(rc.COST_MNX) + SUM(rc.COST_DLS * rc.MNXtoDLS) as TOTAL_EST_COST,
      rc.TRANSACTION_ID
    FROM IntervencionesEstimatedCosts rc
    LEFT JOIN Transactions t ON rc.TRANSACTION_ID = t.TRANSACTION_ID 
    LEFT JOIN TransactionsResults  tr ON rc.TRANSACTION_ID = tr.PROPUESTA_ID     
    LEFT JOIN FieldWellMapping fwm ON t.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
    ${whereClause} AND HAS_RESULTS = 1
    GROUP BY TRANSACTION_ID) b
    
  ON a.PROPUESTA_ID = b.TRANSACTION_ID
${groupByClause}
${orderByClause}

`







  console.log('cost stuff', query, values)

  connection.query(query, values.concat(values), (err, results) => {
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
          totalEstimatedCost: i.TOTAL_EST_COST,
          avgCost: i.AVG_COST,
          avgEstCost: i.AVG_EST_COST,
          deviation: i.DEVIATION,
          avgDeviation: i.AVG_DEVIATION
        }))

        res.json(results)
      }
    })
})


router.get('/tableData', (req, res) => {
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, lowDate, highDate } = req.query

  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []


  let whereClause = 'WHERE 1 = 1'

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
    whereClause += ' AND tr.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
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
      select = 'COMPANY as groupedName'
      break
    case 'interventionType':
      select = 't.TIPO_DE_INTERVENCIONES as groupedName'
      break
    case 'terminationType':
      select = 't.TIPO_DE_TERMINACION as groupedName'
      break
  }



  let query = `
select 
${select},
COUNT(1) as NUM_TREATMENTS,  
SUM(TIPO_DE_INTERVENCIONES = 'estimulacionLimpieza') as NUM_ESTIMULACION_LIMPIEZA,
SUM(TIPO_DE_INTERVENCIONES = 'estimulacionMatricial') as NUM_ESTIMULACION_MATRICIAL,
SUM(TIPO_DE_INTERVENCIONES = 'acido') as NUM_ACIDO, 
SUM(TIPO_DE_INTERVENCIONES = 'apuntalado') as NUM_APUNTALADO, 
SUM(TIPO_DE_INTERVENCIONES = 'termico') as NUM_TERMICO,
SUM(COST) AS COST
from Results r 
LEFT JOIN TransactionsResults tr ON tr.TRANSACTION_ID = r.TRANSACTION_ID
JOIN Transactions t ON r.PROPUESTA_ID = t.TRANSACTION_ID
JOIN FieldWellMapping fwm ON r.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID 
LEFT JOIN (select TRANSACTION_ID, SUM(COST_MNX) + SUM(COST_DLS * MNXtoDLS) as COST FROM ResultsCosts rc GROUP BY TRANSACTION_ID) costs  ON r.TRANSACTION_ID = costs.TRANSACTION_ID
${whereClause}
GROUP BY groupedName
`

console.log('herherehrehrer', query, values)

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
  let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy, noGroup, lowDate, highDate } = req.query

  let level = well ? 'fwm.WELL_FORMACION_ID' : field ? 'fwm.FIELD_FORMACION_ID' : activo ? 'fwm.ACTIVO_ID' : subdir ? 'fwm.SUBDIRECCION_ID' : null
  let values = []

  let whereClause = 'WHERE 1 = 1'

  if (level) {
    whereClause += ` AND ${level} = ?`
    let val  = well ? well : field ? field : activo ? activo : subdir ? subdir : null
    values.push(val)
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
    whereClause += ' AND tr.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }

  values = [values, values, values, values, values]

  values = [].concat.apply([], values)
  console.log(values)


  let select = `1 as groupedName`
  let selectAcido = ''
  let selectEstimulacionLimpieza = ''
  let selectEstimulacionMatricial = ''
  let selectApuntalado = ''
  let selectTermico = ''

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
      select = 'COMPANY as groupedName'
      break
    case 'interventionType':
      select = '1'
      selectAcido = `, 'acido' AS groupedName`
      selectEstimulacionLimpieza = `, 'estimulacionLimpieza' AS groupedName`
      selectEstimulacionMatricial = `, 'estimulacionMatricial' AS groupedName`
      selectApuntalado = `, 'apuntalado' AS groupedName`
      selectTermico = `, 'termico' AS groupedName`
      break
    case 'terminationType':
      select = 'TIPO_DE_TERMINACION as groupedName'
      break
  }


  let groupByClause = noGroup ? 'GROUP BY TRANSACTION_ID' : 'GROUP BY groupedName'


let query = `
select 
groupedName, 
TRANSACTION_ID, 
SUM(EST_INC_GASTO_COMPROMISO_Qo) as EST_INC_GASTO_COMPROMISO_Qo, 
SUM(EST_INC_Qw) as EST_INC_Qw, 
SUM(EST_INC_GASTO_COMPROMISO_Qg) as EST_INC_GASTO_COMPROMISO_Qg, 
SUM(QO_RESULT) as QO_RESULT, 
SUM(QG_RESULT) as QG_RESULT, 
SUM(QW_RESULT) as QW_RESULT,

SUM(EST_INC_GASTO_COMPROMISO_Qo) / COUNT(DISTINCT TRANSACTION_ID) as AVG_EST_INC_GASTO_COMPROMISO_Qo, 
SUM(EST_INC_Qw) / COUNT(DISTINCT TRANSACTION_ID) as AVG_EST_INC_Qw, 
SUM(EST_INC_GASTO_COMPROMISO_Qg) / COUNT(DISTINCT TRANSACTION_ID) as AVG_EST_INC_GASTO_COMPROMISO_Qg, 
SUM(QO_RESULT) / COUNT(DISTINCT TRANSACTION_ID) as AVG_QO_RESULT, 
SUM(QG_RESULT) / COUNT(DISTINCT TRANSACTION_ID) as AVG_QG_RESULT, 
SUM(QW_RESULT) / COUNT(DISTINCT TRANSACTION_ID) as AVG_QW_RESULT, 
 
((SUM(QO_RESULT) / SUM(EST_INC_GASTO_COMPROMISO_Qo)) - 1) * 100 AS QO_DEVIATION,
SUM(((QO_RESULT / EST_INC_GASTO_COMPROMISO_Qo) - 1) * 100)   / COUNT(DISTINCT TRANSACTION_ID) as AVG_QO_DEVIATION,
((SUM(QG_RESULT) / SUM(EST_INC_GASTO_COMPROMISO_Qg)) - 1) * 100 AS QG_DEVIATION,
SUM(((QG_RESULT / EST_INC_GASTO_COMPROMISO_Qg) - 1) * 100)   / COUNT(DISTINCT TRANSACTION_ID) as AVG_QG_DEVIATION,
((SUM(QW_RESULT) / SUM(EST_INC_Qw)) - 1) * 100 AS QW_DEVIATION,
SUM(((QW_RESULT / EST_INC_Qw) - 1) * 100)   / COUNT(DISTINCT TRANSACTION_ID) as AVG_QW_DEVIATION

from
(select r.TRANSACTION_ID, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG, ${select} ${selectAcido}
from Results r
JOIN IntervencionesAcido ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
 ${whereClause}
UNION
select r.TRANSACTION_ID, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG, ${select} ${selectEstimulacionLimpieza} 
from Results r
JOIN IntervencionesEstimulacions ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
${whereClause} AND TIPO_DE_INTERVENCIONES = 'estimulacionLimpieza'
UNION
select r.TRANSACTION_ID, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG, ${select} ${selectEstimulacionMatricial}
from Results r
JOIN IntervencionesEstimulacions ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
${whereClause} AND TIPO_DE_INTERVENCIONES = 'estimulacionMatricial'
UNION
select r.TRANSACTION_ID, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG, ${select} ${selectApuntalado}
from Results r
 JOIN IntervencionesApuntalado ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
 ${whereClause}
UNION
select r.TRANSACTION_ID, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG, ${select} ${selectTermico} 
from Results r
JOIN IntervencionesTermico ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
 ${whereClause}) as a
 ${groupByClause}
 ORDER BY groupedName`

 console.log(query, values)

  connection.query(query, values, (err, results) => {
      console.log('comment err', err)
      
     if (err) {
        res.json({ success: false})
      }
      else {

        results = results.map(i => {
          return {
            groupedName: i.groupedName,
            qo: i.EST_INC_GASTO_COMPROMISO_Qo,
            qg: i.EST_INC_GASTO_COMPROMISO_Qg,
            qw: i.EST_INC_Qw,
            qoResult: i.QO_RESULT,
            qgResult: i.QG_RESULT,
            qwResult: i.QW_RESULT,
            avgQo: i.AVG_EST_INC_GASTO_COMPROMISO_Qo,
            avgQg: i.AVG_EST_INC_GASTO_COMPROMISO_Qg,
            avgQw: i.AVG_EST_INC_Qw,
            avgQoResult: i.AVG_QO_RESULT,
            avgQgResult: i.AVG_QG_RESULT,
            avgQwResult: i.AVG_QW_RESULT,
            qoDeviation: i.QO_DEVIATION,
            qgDeviation: i.QG_DEVIATION,
            qwDeviation: i.QW_DEVIATION,
            avgQoDeviation: i.AVG_QO_DEVIATION,
            avgQgDeviation: i.AVG_QG_DEVIATION,
            avgQwDeviation: i.AVG_QW_DEVIATION
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


  let whereClause = 'WHERE 1 = 1'
  
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
    whereClause += ' AND tr.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }

  let select = ''
  let groupByClause = ''

  switch(groupBy) {
    case 'subdireccion':
      groupByClause = 'GROUP BY SUBDIRECCION_NAME'
      select = `SUBDIRECCION_NAME as groupedName,`
      break
    case 'activo':
      groupByClause = 'GROUP BY ACTIVO_NAME'
      select = `ACTIVO_NAME as groupedName,`
      break
    case 'field':
      groupByClause = 'GROUP BY FIELD_NAME'
      select = `FIELD_NAME as groupedName,`
      break
    case 'well':
      groupByClause = 'GROUP BY WELL_NAME'
      select = `WELL_NAME as groupedName,`
      break
    case 'formation':
      groupByClause = 'GROUP BY FORMACION'
      select = `FORMACION as groupedName,`
      break
    case 'company':
      groupByClause = 'GROUP BY COMPANY'
      select = `COMPANY as groupedName,`
      break
    case 'interventionType':
      groupByClause = 'GROUP BY TIPO_DE_INTERVENCIONES'
      select = `TIPO_DE_INTERVENCIONES as groupedName,`
      break
    case 'terminationType':
      groupByClause = 'GROUP BY TIPO_DE_TERMINACION'
      select = `TIPO_DE_TERMINACION as groupedName,`
      break
  }


  let query = `
select 
${select}
r.WELL_FORMACION_ID, 
SUM(IF(ra.VOLUMEN_SISTEMA_NO_REACTIVO, ra.VOLUMEN_SISTEMA_NO_REACTIVO, 0) + IF(re.VOLUMEN_SISTEMA_NO_REACTIVO, re.VOLUMEN_SISTEMA_NO_REACTIVO, 0)) as TOTAL_SISTEMA_NO_REACTIVO,
SUM(IF(ra.VOLUMEN_SISTEMA_REACTIVO, ra.VOLUMEN_SISTEMA_REACTIVO, 0) + IF(re.VOLUMEN_SISTEMA_REACTIVO, re.VOLUMEN_SISTEMA_REACTIVO, 0)) as TOTAL_SISTEMA_REACTIVO,
SUM(IF(ra.VOLUMEN_SISTEMA_DIVERGENTE, ra.VOLUMEN_SISTEMA_DIVERGENTE, 0) + IF(re.VOLUMEN_SISTEMA_DIVERGENTE, re.VOLUMEN_SISTEMA_DIVERGENTE, 0)) as TOTAL_SISTEMA_DIVERGENTE,
SUM(IF(ra.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, ra.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, 0) + (IF(rap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, rap.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, 0) / 264.172) + IF(re.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, re.VOLUMEN_DESPLAZAMIENTO_LIQUIDO, 0)) as TOTAL_DESPLAZAMIENTO_LIQUIDO,
SUM(IF(ra.VOLUMEN_DESPLAZAMIENTO_N2, ra.VOLUMEN_DESPLAZAMIENTO_N2, 0) + IF(re.VOLUMEN_DESPLAZAMIENTO_N2, re.VOLUMEN_DESPLAZAMIENTO_N2, 0)) as TOTAL_DESPLAZAMIENTO_N2,
SUM(IF(ra.VOLUMEN_PRECOLCHON_N2, ra.VOLUMEN_PRECOLCHON_N2, 0) + IF(re.VOLUMEN_PRECOLCHON_N2, re.VOLUMEN_PRECOLCHON_N2, 0)) as TOTAL_PRECOLCHON_N2,
SUM(IF(ra.VOLUMEN_TOTAL_DE_LIQUIDO, ra.VOLUMEN_TOTAL_DE_LIQUIDO, 0) + (IF(rap.VOLUMEN_TOTAL_DE_LIQUIDO, rap.VOLUMEN_TOTAL_DE_LIQUIDO, 0) / 264.172) + IF(re.VOLUMEN_TOTAL_DE_LIQUIDO, re.VOLUMEN_TOTAL_DE_LIQUIDO, 0)) as TOTAL_LIQUIDO,
SUM(IF(rap.VOLUMEN_APUNTALANTE, rap.VOLUMEN_APUNTALANTE, 0) /  264.172) as TOTAL_APUNTALANTE,
SUM((IF(rap.VOLUMEN_GEL_DE_FRACTURA, rap.VOLUMEN_GEL_DE_FRACTURA, 0)/  264.172) + IF(re.VOLUMEN_GEL_DE_FRACTURA, re.VOLUMEN_GEL_DE_FRACTURA, 0) + IF(ra.VOLUMEN_GEL_DE_FRACTURA, ra.VOLUMEN_GEL_DE_FRACTURA, 0)) as TOTAL_GEL_DE_FRACTURA,
SUM(IF(rap.VOLUMEN_PRECOLCHON_APUNTALANTE, rap.VOLUMEN_PRECOLCHON_APUNTALANTE, 0)/  264.172) as TOTAL_PRECOLCHON_APUNTALANTE,
SUM(IF(rt.VOLUMEN_VAPOR_INYECTAR, rt.VOLUMEN_VAPOR_INYECTAR, 0)) as TOTAL_VAPOR_INJECTED,
SUM(IF(re.VOLUMEN_GEL_LINEAL, re.VOLUMEN_GEL_LINEAL, 0) + IF(ra.VOLUMEN_GEL_LINEAL, ra.VOLUMEN_GEL_LINEAL, 0) + (IF(rap.VOLUMEN_GEL_LINEAL, rap.VOLUMEN_GEL_LINEAL, 0) / 264.172)) as TOTAL_GEL_LINEAL,
SUM(IF(re.VOLUMEN_MODIFICADOR_PERMEABILIDAD, re.VOLUMEN_MODIFICADOR_PERMEABILIDAD, 0) + IF(ra.VOLUMEN_MODIFICADOR_PERMEABILIDAD, ra.VOLUMEN_MODIFICADOR_PERMEABILIDAD, 0)) as TOTAL_MODIFICADOR_PERMEABILIDAD,
SUM(IF(re.VOLUMEN_ESPACIADOR, re.VOLUMEN_ESPACIADOR, 0) + IF(ra.VOLUMEN_ESPACIADOR, ra.VOLUMEN_ESPACIADOR, 0)) as TOTAL_ESPACIADOR
FROM Results r 
JOIN FieldWellMapping fwm ON r.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
LEFT JOIN Transactions t ON r.PROPUESTA_ID = t.TRANSACTION_ID
LEFT JOIN TransactionsResults tr on tr.TRANSACTION_ID = r.TRANSACTION_ID
LEFT JOIN ResultsAcido ra ON r.WELL_FORMACION_ID = ra.WELL_FORMACION_ID
LEFT JOIN ResultsApuntalado rap ON r.WELL_FORMACION_ID = rap.WELL_FORMACION_ID
LEFT JOIN ResultsEstimulacions re ON r.WELL_FORMACION_ID = re.WELL_FORMACION_ID
LEFT JOIN ResultsTermico rt ON r.WELL_FORMACION_ID = rt.WELL_FORMACION_ID
${whereClause}
${groupByClause}`

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







router.get('/countData', (req, res) => {
  let { lowDate, highDate } = req.query
  let values = []
  let whereClause = 'WHERE 1 = 1'

  if (lowDate) {
    whereClause += ' AND IF(FECHA_INTERVENCION, FECHA_INTERVENCION, FECHA_PROGRAMADA_INTERVENCION) >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND IF(FECHA_INTERVENCION, FECHA_INTERVENCION, FECHA_PROGRAMADA_INTERVENCION) <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }


  let query = `
select 
  t.TIPO_DE_INTERVENCIONES, 
  SUM(IF(HAS_RESULTS = 1, 1, 0)) as COUNT_RESULTS, 
  SUM(IF(HAS_RESULTS = 2, 0, 1))  AS COUNT,
  IF(FECHA_INTERVENCION, FECHA_INTERVENCION, FECHA_PROGRAMADA_INTERVENCION) AS FECHA_INTERVENCION    
from Transactions t 
LEFT JOIN TransactionsResults tr ON t.TRANSACTION_ID = tr.PROPUESTA_ID
LEFT JOIN Intervenciones i ON i.TRANSACTION_ID = t.TRANSACTION_ID
JOIN FieldWellMapping ON t.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID 

${whereClause} 
GROUP BY TIPO_DE_INTERVENCIONES
`

console.log(query, values)

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

router.get('/dateDiffData', (req, res) => {
  let { lowDate, highDate } = req.query
  let values = []
  let whereClause = 'WHERE 1 = 1'

  if (lowDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION >= ?'
    let year = Math.floor((lowDate - 1) / 12)
    let month = lowDate % 12
    month === 0 ? month = 12 : null
    let lowDateString = `${year}-${month}-01`
    values.push(lowDateString)
  }
  if (highDate) {
    whereClause += ' AND tr.FECHA_INTERVENCION <= ?'
    let year = Math.floor((highDate - 1) / 12)
    let month = highDate % 12
    month === 0 ? month = 12 : null
    let highDateString = `${year}-${month}-31`
    values.push(highDateString)
  }

  let query = `
select t.TIPO_DE_INTERVENCIONES as type, AVG(DATEDIFF(tr.FECHA_INTERVENCION, FECHA_PROGRAMADA_INTERVENCION))  as avgDateDiff, COUNT(1) as COUNT
FROM Results r 
JOIN Intervenciones i ON r.PROPUESTA_ID = i.TRANSACTION_ID 
JOIN Transactions t on r.PROPUESTA_ID = t.TRANSACTION_ID
JOIN TransactionsResults tr on r.TRANSACTION_ID = tr.TRANSACTION_ID
${whereClause} 
GROUP BY type`

  console.log(query, values)
  
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


























export default router