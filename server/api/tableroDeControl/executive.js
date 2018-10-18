import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.post('/jobBreakdown', (req, res) => {
  let { activo, field, well, formation } = req.body

  let level = well ? 'i.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null

  let query = `SELECT TIPO_DE_INTERVENCIONES as name, COUNT(1) AS y FROM Intervenciones i`
  
  if (level) {
    query += ` JOIN FieldWellMapping f ON i.WELL_FORMACION_ID = f.WELL_FORMACION_ID`
    query += ` WHERE ${level} = ?`
  }

  // if (formation){
  //   query += level ? ' AND' : null
  //   query += ' WHERE FORMACION = ?'
  // }

  query += ` GROUP BY TIPO_DE_INTERVENCIONES`


  // console.log(query)
  // console.log(value)
  connection.query(query, value, (err, results) => {
      // console.log('comment err', err)
      // console.log('comment results', results)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})


router.post('/aforosData', (req, res) => {
  let { activo, field, well, formation } = req.body
  
  let level = well ? 'WellAforos.WELL_FORMACION_ID' : field ? 'FIELD_FORMACION_ID' : activo ? 'ACTIVO_ID' : null
  let value = well ? well : field ? field : activo ? activo : null
  let whereClause = ''
  if (level) {
    whereClause = `AND ${level} = ?`
  }

  let query = `

SELECT * FROM 

(SELECT A.WELL_FORMACION_ID, FORMACION, WELL_NAME, TRANSACTION_ID, FECHA, QO, QW FROM
(
  select WellAforos.WELL_FORMACION_ID, FORMACION, WELL_NAME, WellAforos.TRANSACTION_ID, MAX(FECHA) FECHA
  FROM WellAforos 
  JOIN FieldWellMapping ON WellAforos.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID 
  JOIN WellsData ON WellAforos.TRANSACTION_ID = WellsData.TRANSACTION_ID
  WHERE QO != '-999'${whereClause} GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos,

(SELECT A.PROPUESTA_ID, QO as QO_RESULT, QW as QW_RESULT FROM
(
  select WELL_FORMACION_ID, PROPUESTA_ID, TRANSACTION_ID, MAX(FECHA) FECHA
  FROM ResultsAforos WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results 
WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID`

  connection.query(query, value, (err, results) => {
      console.log('comment err', err)
      console.log('comment results', results)
    
      results = results.map(i => ({
        id: i.WELL_FORMACION_ID,
        name: i.WELL_NAME,
        formation: i.FORMACION,
        date: i.FECHA,
        qo: i.QO,
        qw: i.QW,
        qoResult: i.QO_RESULT,
        qwResult: i.QW_RESULT
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