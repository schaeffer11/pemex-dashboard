import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
import moment from 'moment'
import { getWellProduccion } from '../pozo';
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()



router.post('/previousTransaction', (req, res) => {
  let { well } = req.body

  let query = `
select TRANSACTION_ID from Transactions WHERE WELL_FORMACION_ID = ? ORDER BY INSERT_TIME DESC LIMIT 1;`

  connection.query(query, well, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/wellData', (req, res) => {
  let { transactionID } = req.body

  let query = `
SELECT * FROM WellsData w
JOIN WellMecanico wm ON w.TRANSACTION_ID = wm.TRANSACTION_ID 
JOIN FieldWellMapping fwm ON w.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
WHERE w.TRANSACTION_ID = ?`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/zoneData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellZones WHERE TRANSACTION_ID = ?`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/layerData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellLayers WHERE TRANSACTION_ID = ?`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/productionData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellHistoricalProduccion WHERE TRANSACTION_ID = ? ORDER BY Fecha DESC`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/fieldHistoricalPressure', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM FieldHistoricalPressure WHERE TRANSACTION_ID = ? ORDER BY FECHA DESC`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/pressureData', (req, res) => {
  let { transactionID } = req.body

  let query = `SELECT * FROM WellHistoricalPressure WHERE TRANSACTION_ID = ? ORDER BY FECHA DESC`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.post('/aforosData', (req, res) => {
  let { transactionID } = req.body

  let query = `
select FECHA, QO, QW, QG from WellAforos WHERE TRANSACTION_ID = ? AND Qo != -999
UNION
select FECHA, QO, QW, QG from ResultsAforos WHERE PROPUESTA_ID = ? AND Qo != -999
`




  connection.query(query, [transactionID, transactionID], (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/getInterventionDates', (req, res) => {
  let { wellID } = req.query

  let query = `SELECT FECHA_INTERVENCION FROM Results WHERE WELL_FORMACION_ID = ?`

  connection.query(query, wellID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})

router.get('/exportData/', (req, res) => {
  const { option, id } = req.query
  const formatDate = (fecha) => {
    let date = new Date(fecha)
    date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    return date
  }
  const queries = {
    historicoProduccion: 'SELECT * FROM WellHistoricalProduccion WHERE WELL_FORMACION_ID = ?',
    historicoPresionPozo: 'SELECT * FROM WellHistoricalPressure WHERE WELL_FORMACION_ID = ?',
    historicoPresionCampo: 'SELECT * FROM WellHistoricalPressure WHERE FIELD_FORMACION_ID = ?',
    historicoAforos: 'SELECT * FROM WellAforos WHERE WELL_FORMACION_ID = ?',
    desviacion: 'SELECT * FROM WellSurveys WHERE WELL_FORMACION_ID = ?',
  }
  const maps = {
    historicoProduccion: {
      Fecha: 'Fecha (dd/mm/aaaa)',
      Dias: 'dias',
      QO: 'Qo (bbl/d)',
      QW: 'Qw (bbl/d)',
      QG: 'Qg (MMpc/d)',
      QGI: 'Qgi (MMpc)',
      QO_VOLUME: 'Vo (bbl)',
      QW_VOLUME: 'Vw (bbl)',
      QG_VOLUME: 'Vg (MMpc)',
      QGI_VOLUME: 'Vgi (MMpc)',
      NP: 'Np (bbl)',
      WP: 'Wp (bbl)',
      GP: 'Gp (bbl)',
      GI: 'Gi (MMpc)',
      RGA: 'RGA (m3/m3)',
      FW_FRACTION: 'w (%)',
    },
    historicoPresionPozo: {
      FECHA: 'Fecha (dd/mm/aaaa)',
      PWS: 'Pws (kg/cm2)',
      PWF: 'Pwf (kg/cm2)',
      PRESSURE_DEPTH: 'Plano de Referencia (md)',
    },
    historicoPresionCampo: {
      FECHA: 'Fecha (dd/mm/aaaa)',
      PWS: 'Pws (kg/cm2)',
      PRESSURE_DEPTH: 'Plano de Referencia (md)',
    },
    historicoAforos: {
      FECHA: 'Fecha (dd/mm/aaaa)',
      TIEMPO: 'Tiempo (hrs)',
      ESTRANGULADOR: 'Estrangulador (pg)',
      PTP: 'P_TP (kg/cm2)',
      TTP: 'T_TP (°C)',
      PBAJ: 'P_baj (kg/cm2)',
      TBAJ: 'T_baj (°C)',
      PSEP: 'P_sep (kg/cm2)',
      TSEP: 'T_sep (°C)',
      QL: 'Qgi (MMcp/d)',
      QO: 'Qo (bbl/d)',
      QG: 'Qg (MMcp/d)',
      QW: 'Qw (bbl/d)',
      RGA: 'RGA (m3/m3)',
      SALINIDAD: 'Salinidad (ppm)',
      PH: 'pH',
    },
    desviacion: {
      MEASURED_DEPTH: 'Depth (m)',
      INCLINATION: 'Inclinación (deg)',
      AZIMUTH: 'Azimuth (deg)',
      TRUE_VERTICAL_DEPTH: 'TVD (m)',
      VERTICAL_SECTION: 'Vertical Section (m)',
      NS: 'NS (m)',
      EW: 'EW (m)',
      DLS: 'DLS (deg/30m)',
      NORTHING: 'Northing (m)',
      EASTING: 'Easting (m)',
      LATITUDE: 'Latitud (decimal degrees)',
      LONGITUDE: 'Longitud (decimal degrees)',
      COMMENTS: 'Comentarios',
    },
  }
  // switch (option) {
  //   case 'historicoProduccion':
  //     query = `SELECT * FROM WellHistoricalProduccion WHERE WELL_FORMACION_ID = ?`
  //     map = {
  //       Fecha: 'Fecha (dd/mm/aaaa)',
  //       Dias: 'dias',
  //       QO: 'Qo (bbl/d)',
  //       QW: 'Qw (bbl/d)',
  //       QG: 'Qg (MMpc/d)',
  //       QGI: 'Qgi (MMpc)',
  //       QO_VOLUME: 'Vo (bbl)',
  //       QW_VOLUME: 'Vw (bbl)',
  //       QG_VOLUME: 'Vg (MMpc)',
  //       QGI_VOLUME: 'Vgi (MMpc)',
  //       NP: 'Np (bbl)',
  //       WP: 'Wp (bbl)',
  //       GP: 'Gp (bbl)',
  //       GI: 'Gi (MMpc)',
  //       RGA: 'RGA (m3/m3)',
  //       FW_FRACTION: 'w (%)',
  //     }
  //     break;
  //   case 'historicoPresionCampo':
  //     console.log('')
  //     break;
  //   case 'historicoPresionPozo':
  //     query = 'SELECT * FROM WellHistoricalPressure WHERE WELL_FORMACION_ID = ?'
  //     map = {
  //       FECHA: 'Fecha (dd/mm/aaaa)',
  //       PWS: 'Pws (kg/cm2)',
  //       PWF: 'Pwf (kg/cm2)',
  //       PRESSURE_DEPTH: 'Plano de Referencia (md)',
  //     }
  //     console.log('historicoPresionPozo')
  //     break;
  //   case 'historicoAforos':
  //     query = 'SELECT * FROM WellAforos WHERE WELL_FORMACION_ID = ?'
  //     map = {
        
  //     }
  //     break;
  //   case 'desviacion':
  //     console.log('desviacion')
  //     break;
  //   default:FIELD_FORMACION_ID
  //     break;
  // }
  const query = queries[option]
  connection.query(query, id, (err, results) => {
    if (err) {
      return res.send('Error')
    }
    console.log('results', results)
    // return res.send('')
    
    const map = maps[option]
    const mapKeys = Object.keys(map)
    console.log('keys',mapKeys)
    const headers = mapKeys.map(key => map[key]).join(',')
    console.log(`what are my headers?${headers}`)
    const data = results.map(r => {
      const innerStr = mapKeys.map(key => key === 'Fecha' || key === 'FECHA' ? formatDate(r[key]) : r[key]).join(',')
      return innerStr
    }).join('\n')
    const finalStr = headers + '\n' + data
    res.send(finalStr)
  })
})



export default router