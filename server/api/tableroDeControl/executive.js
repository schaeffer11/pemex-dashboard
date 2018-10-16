import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/jobBreakdown', (req, res) => {
  let {  } = req.body

  let query = `SELECT TIPO_DE_INTERVENCIONES as name, COUNT(1) AS y FROM Intervenciones GROUP BY TIPO_DE_INTERVENCIONES`
  connection.query(query, (err, results) => {
      console.log('comment err', err)
      console.log('comment results', results)
    
    // results = results.map(i => {
    //   name: i.TIPO_DE_INTERVENCIONES,
    //   y: i.COUNT
    // })

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})



router.get('/aforosData', (req, res) => {
  let {  } = req.body
  let query = `

SELECT * FROM 

(SELECT A.WELL_FORMACION_ID, FORMACION, WELL_NAME, TRANSACTION_ID, FECHA, QO, QW FROM
(
  select WellAforos.WELL_FORMACION_ID, FORMACION, WELL_NAME, WellAforos.TRANSACTION_ID, MAX(FECHA) FECHA
  FROM WellAforos 
  JOIN FieldWellMapping ON WellAforos.WELL_FORMACION_ID = FieldWellMapping.WELL_FORMACION_ID 
  JOIN WellsData ON WellAforos.TRANSACTION_ID = WellsData.TRANSACTION_ID
  WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN WellAforos B USING(TRANSACTION_ID, FECHA)) as aforos,

(SELECT A.PROPUESTA_ID, QO as QO_RESULT, QW as QW_RESULT FROM
(
  select WELL_FORMACION_ID, PROPUESTA_ID, TRANSACTION_ID, MAX(FECHA) FECHA
  FROM ResultsAforos WHERE QO != '-999' GROUP BY TRANSACTION_ID
) A INNER JOIN ResultsAforos B USING(TRANSACTION_ID, FECHA)) as aforo_results 
WHERE aforos.TRANSACTION_ID = aforo_results.PROPUESTA_ID`

  connection.query(query, (err, results) => {
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