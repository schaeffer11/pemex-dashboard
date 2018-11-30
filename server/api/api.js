import { Router } from 'express'
import db from '../lib/db'
import appConfig from '../../app-config.js'
import path from 'path'
import fs from 'fs'
import objectPath from 'object-path'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';
import { create as createWell, getFields, getWell, getSurveys,
            getHistIntervenciones, getHistIntervencionesNew, getLayer, getMudLoss, getMecanico, 
            getAnalisisAgua, getEmboloViajero, getBombeoNeumatico, getBombeoHidraulico, 
            getBombeoCavidades, getBombeoElectrocentrifugo, getBombeoMecanico, 
            getFieldPressure, getWellPressure,
            getWellAforos, getWellProduccion, getWellImages, getInterventionBase, 
            getInterventionEsimulacion, getInterventionAcido, getInterventionApuntalado,
            getInterventionTermico, getCedulaTermico, 
            getLabTest, getCedulaEstimulacion, getCedulaAcido, getCedulaApuntalado, 
            getCosts, getInterventionImages, deleteSave } from './pozo'


import { create as createCompromiso, mine as myCompromisos, collection as getCompromisos, get as getCompromiso, put as updateCompromiso } from './compromisos';

import { createResults } from './results'

import { create as createDiagnostico, get as getDiagnostico, getAll as getDiagnosticos } from './diagnosticos';

import { create as createMapeo, get as getMapeo, getAll as getMapeos } from './mapeo';

import { getAuthorization, allowAdmin } from '../middleware';

const connection = db.getConnection(appConfig.users.database)
const env = process.env.NODE_ENV || 'dev'
const isProduction = env === 'production'
const router = Router()

const getImagesForClient = async (transactionID, action) => new Promise((resolve, reject) => {
  getWellImages(transactionID, action, async (wellImages) => {
    const formattedWellImages = await handleImageResponse(wellImages)
    getInterventionImages(transactionID, action, async (interventionImages) => {
      const formattedInterventionImages = await handleImageResponse(interventionImages)
      resolve({ ...formattedWellImages, ...formattedInterventionImages })
    })
  })
})

export async function handleImageResponse(data) {
  const filteredData = data.filter(well => well.IMG_URL !== null && well.IMG_URL !== '').sort((a, b) => {
    if(a.label < b.label) return -1;
    if(a.label > b.label) return 1;
    return 0;
  })
  const final = {}
  for (let well of filteredData) {
    const imgName = well.IMG_URL
    // makes no sense but we had to do this so we didn't need to add a new column
    const labID = well.IMAGE_NAME
    const imgInformation = well.IMG_URL.split('.')
    const parent = imgInformation[1]
    const index = imgInformation[imgInformation.length - 1]
    // regex checks if the last index is a number or a number-number
    const isNumber = /^([0-9])|([0-9]+(-[0-9]+))+$/.test(index)
    // get img url from s3
    const imgURL = await signedURL(imgName)
    const innerObj = {
      displayName: labID,
      imgName,
      imgURL,
      imgSource: 's3',
    }
    // determine if we need to store in array
    if (isNumber) {
      // this is naive assumes everything is in order
      innerObj.labID = labID
      objectPath.push(final, parent, innerObj)
    } else {
      objectPath.set(final, parent, innerObj)
    }
  }
  return final
}

async function labTests(transactionID, action) {
  return new Promise((resolve, reject) => {
    getLabTest(transactionID, action, (data) => {
      let labIDs = []
      let outData = []
  
      data.forEach(i => {
        if (!labIDs.includes(i.LAB_ID)) {
          labIDs.push(i.LAB_ID)
        }
      })
  
      labIDs.forEach((id, index) => {
        let subset = data.filter(i => i.LAB_ID === id)
        let type
        if (subset.length > 0) {
          type = subset[0].TIPO_DE_ANALISIS
          let i = subset[0]
          if (type === 'caracterizacionFisico') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              percentAceite: i.PORENTAJE_DE_ACEITE,
              percentAgua: i.PORENTAJE_DE_AGUA,
              percentEmulsion: i.PORENTAJE_DE_EMULSION,
              percentSolidos: i.PORENTAJE_DE_SOLIDOS,
              percentAsfaltenos: i.PORENTAJE_DE_ASFALTENOS,
              percentParafinas: i.PORENTAJE_DE_PARAFINAS,
              percentResinasAsfalticas: i.PORENTAJE_DE_RESINAS_ASFALTICAS,
              percentContenidoDeSolidos: i.PORENTAJE_DE_CONTENIDO_DE_SOLIDOS,
              densityAceite: i.DENSIDAD_DEL_ACEITE,
              densityAgua: i.DENSIDAD_DEL_AGUA,
              densityEmulsion: i.DENSIDAD_DE_LA_EMULSION,
              viscosityAceite: i.VISCOSIDAD_DEL_ACEITE,
              viscosityEmulsion: i.VISCOSIDAD_DE_LA_EMULSION,
              phDelAgua: i.PH_DEL_AGUA,
              salinidadDelAgua: i.SALINIDAD_DEL_AGUA,
              salinidadDelAceite: i.SALINIDAD_DEL_ACEITE,
            })
          }
          else if (type === 'pruebasDeCompatibilidad') {
            let table = []
            subset.forEach(point => {
              table.push({
                diseno: point.DISENO,
                sistema: point.SISTEMA,
                aceiteDelPozo: point.ACEITE_DEL_POZO,
                tiempoDeRompimiento: point.TIEMPO_DE_ROMPIMIENTO,
                separacionDeFases: point.SEPARACION_DE_FASES,
                solidos: point.SOLIDOS,
                condicion: point.CONDICION,
              })
            })
  
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              compatabilidadTable: table
            })
          }
          else if (type === 'pruebasDeGrabado') {
            let table = []
            subset.forEach(point => {
              table.push({
                sistemaAcido: point.SISTEMA_ACIDO,
                tiempoDeContacto: point.TIEMPO_DE_CONTACTO,
                grabado: point.GRABADO,
              })
            })
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              grabadoTable: table
            })
          }
          else if (type === 'pruebasDeSolubilidad') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              tipoDeMuestra: i.TIPO_DE_MUESTRA,
              pesoDeLaMuestra: i.PESO_DE_LA_MUESTRA,
              tipoDeSistemaEmpleado: i.TIPO_DE_SISTEMA_QUIMICO,
              pesoDeLaMuestraFinal: i.PESO_FINAL_DE_LA_MUESTRA,
              solubilidad: i.SOLUBILIDAD,
            })
          }
          else if (type === 'pruebasGelDeFractura') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              hidratacionDelFluido: i.HIDRATACION,
              tiempoDeActivacion: i.TIEMPO_DE_ACTIVACION_DEL_GEL,
              determinacionDePh: i.DETERMINACION_DE_PH,
              tiempoDeRompimiento: i.TIEMPO_DE_ROMPIMIENTO_GEL,
              dosificacionDeQuebradors: i.DOSIFICATION_DE_QUEBRADORES,
              viscosidadDelGelDeFractura: i.VISCOSIDAD_DEL_GEL_DE_FRACTURA,
            })
          }
          else if (type === 'pruebasParaApuntalante') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
              esfericidad: i.ESFERICIDAD,
              redondez: i.REDONDEZ,
              resistenciaCompresion: i.RESISTENCIA_A_LA_COMPRESION,
              malla: i.MALLA, 
              aglutinamiento: i.AGLUTINAMIENTO,
              turbidez: i.TURBIDEZ,
              solubilidad: i.SOLUBILIDAD_APUNTALANTE
            })
          }
          else if (type === 'cromatografiaDelGas') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
            })
          }
          else if (type === 'pruebaDeDureza') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
            })
          }
          else if (type === 'determinacionDeLaCalidad') {
            outData.push({
              edited: true,
              labID: i.LAB_ID,
              index: index,
              length: labIDs.length,
              type: type,
              fechaMuestreo: (i.FECHA_DE_MUESTREO ? i.FECHA_DE_MUESTREO = i.FECHA_DE_MUESTREO.toJSON().slice(0, 10) : null),
              fechaPrueba : (i.FECHA_DE_PRUEBA ? i.FECHA_DE_PRUEBA = i.FECHA_DE_PRUEBA.toJSON().slice(0, 10) : null),
              compania: i.COMPANIA,
              superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
              obervaciones: i.OBSERVACIONES,
            })
          }
        }
      })
  
      if (outData.length === 0) {
        outData = [{}]
      }
      resolve(outData)
    })
  })
}

// We do not want to check authorization for templates so we put above middleware!
router.get('/get_template/:template', (req, res) => {
  const { template } = req.params
  const filePath = path.join(__dirname, isProduction ? '../' : '../../', `templates/${template}.xlsx`)
  res.sendFile(filePath)
})


router.use(getAuthorization)
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
})
router.get('/testingAdmin', allowAdmin, (req, res) => {
  res.send('good stuff')
})

router.use(upload.array())

router.get('/ping', (req, res) => {
  res.json({ response: 'pong' })
})


router.get('/deleteSave', (req, res) => {
  let { transactionID } = req.query

  deleteSave(transactionID, (data) => {
    res.json({complete2: true})
  })
})

router.post('/comment', (req, res) => {
  let { comment, page, user } = req.body
  connection.query(`INSERT INTO Feedback (USER, COMMENT, PAGE) VALUES (?, ?, ?)`, [user, comment, page], (err, results) => {
      console.log('comment err', err)
      console.log('comment results', results)
      if (err) {
        res.json({ success: false})
      }
      else {
        res.json({ success: true})
      }
    })
})

router.get('/users', (req, res) => {
    let table = appConfig.users.table
    connection.query(`SELECT username, id FROM ??`, [table], (err, results) => {
        if (err) {
            res.json([])
        }

        res.json({ results })
    })
})

router.get('/activo', (req, res) => {
    connection.query(`SELECT DISTINCT SUBDIRECCION_ID, SUBDIRECCION_NAME, ACTIVO_NAME, ACTIVO_ID FROM FieldWellMapping`, (err, results) => {
        res.json(results)
    })
})

router.post('/compromiso', allowAdmin, (req, res) => {
  console.log('IN COMPROMISO')
  createCompromiso(req, res)
})

router.put('/compromiso/:id', allowAdmin, (req, res) => {
  console.log('IN COMPROMISO put')
    updateCompromiso(req, res)
})

router.get('/compromiso/mine', (req, res) => {
    myCompromisos(req, res)
})

router.get('/compromiso', allowAdmin, (req, res) => {
    getCompromisos(req, res)
})

router.get('/compromiso/:id', (req, res) => {
    getCompromiso(req, res)
})

router.post('/diagnostico', allowAdmin, (req, res) => {
    createDiagnostico(req, res)
})

router.get('/diagnostico', allowAdmin, (req, res) => {
    getDiagnosticos(req, res)
})

router.get('/diagnostico/:id', allowAdmin, (req, res) => {
    getDiagnostico(req, res)
})

router.post('/mapeo', allowAdmin, (req, res) => {
    createMapeo(req, res)
})

router.get('/mapeo', allowAdmin, (req, res) => {
    getMapeos(req, res)
})

router.get('/mapeo/:id', allowAdmin, (req, res) => {
    getMapeo(req, res)
})


router.get('/getSubmittedFieldWellMapping', (req, res) => {
    connection.query(`SELECT * FROM FieldWellMapping WHERE HAS_DATA = 1`, (err, results) => {
      res.json(results)
    })
})

router.get('/getDates', (req, res) => {
  connection.query(`select 
      YEAR(MIN(FECHA_INTERVENCION)) * 12 + MONTH(MIN(FECHA_INTERVENCION)) AS MIN, 
      YEAR(MAX(FECHA_INTERVENCION)) * 12 + MONTH(MAX(FECHA_INTERVENCION)) + 1 AS MAX, 
      MIN(FECHA_INTERVENCION) AS MIN_DATE, 
      MAX(FECHA_INTERVENCION) AS MAX_DATE 
      FROM TransactionsResults`, (err, results) => {
        res.json(results)
      })
})

router.get('/getTerminationTypes', (req, res) => {
  const query = `SELECT DISTINCT(TIPO_DE_TERMINACION) FROM WellMecanico`
  connection.query(query, (err, results) => {
    results = results.map(i => i.TIPO_DE_TERMINACION)
    res.send(results)
  })
})




router.get('/getCompanyMap', (req, res) => {
  const query = `SELECT COMPANY FROM CompanyMap`
  connection.query(query, (err, results) => {
    results = results.map(i => ({label: i.COMPANY, value: i.COMPANY}))
    res.send(results)
  })
})

router.get('/getJustificationMap', (req, res) => {
  const query = `SELECT JUSTIFICACION FROM JustificacionesMap`
  connection.query(query, (err, results) => {
    results = results.map(i => ({label: i.JUSTIFICACION, value: i.JUSTIFICACION}))
    res.send(results)
  })
})

router.get('/getLitologiaMap', (req, res) => {
  const query = `SELECT LITOLOGIA FROM LitologiaMap`
  connection.query(query, (err, results) => {
    results = results.map(i => ({label: i.LITOLOGIA, value: i.LITOLOGIA}))
    res.send(results)
  })
})

router.get('/getTipoDeTerminationMap', (req, res) => {
  const query = `SELECT TIPO_DE_TERMINATION FROM TipoDeTerminationMap`
  connection.query(query, (err, results) => {
    results = results.map(i => ({label: i.TIPO_DE_TERMINATION, value: i.TIPO_DE_TERMINATION}))
    res.send(results)
  })
})

router.get('/getTipoDeLinerMap', (req, res) => {
  const query = `SELECT TIPO_DE_LINER FROM TipoDeLinerMap`
  connection.query(query, (err, results) => {
    results = results.map(i => ({label: i.TIPO_DE_LINER, value: i.TIPO_DE_LINER}))
    res.send(results)
  })
})



//todo: move this to seperate script, or delete entirely
router.get('/deletePlaceholders', (req, res) => {
  const query = `SHOW TABLES`
  connection.query(query, (err, results) => {
    
    results = [{Tables_in_DataInput: 'WellHistorialIntervenciones'}]

    results.forEach(i => {
      let newQuery = `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema='DataInput' AND table_name='${i.Tables_in_DataInput}';`
      connection.query(newQuery, (err, results) => {
        results.forEach(column => {
          // console.log(column)
          let finalQuery =  `UPDATE ${i.Tables_in_DataInput} SET ${column.COLUMN_NAME} = NULL WHERE ${column.COLUMN_NAME} = '-9999'`
          // console.log(finalQuery)
          connection.query(finalQuery, (err, results) => {
            console.log(err)
            console.log(results)
          })
        })
      })
    })
  })
})


router.get('/getTreatmentCompanies', (req, res) => {
  const query = `
    SELECT DISTINCT(COMPANIA) FROM
      (SELECT COMPANIA FROM
      ResultsCedulaApuntalado
      UNION
      SELECT COMPANIA FROM
      ResultsCedulaEstimulacion
      UNION
      SELECT COMPANIA FROM
      ResultsCedulaTermico
      UNION
      SELECT COMPANIA FROM
      ResultsCedulaAcido) companies
  `
  connection.query(query, (err, results) => {
    if (err) {
      console.log('there was an error', err)
    }
    results = results.map(i => i.COMPANIA)
    res.json(results)
  })
})

router.get('/getInterventionTypes', (req, res) => {
  const query = `SELECT DISTINCT(TIPO_DE_INTERVENCIONES) FROM Transactions`
  connection.query(query, (err, results) => {
    if (err) {
      console.log('there was an error', err)
    }
    results = results.map(i => i.TIPO_DE_INTERVENCIONES)
    res.json(results)
  })
})

router.get('/getFormationTypes', (req, res) => {
  const query = `SELECT DISTINCT(FORMACION) FROM WellsData`
  connection.query(query, (err, results) => {
    if (err) {
      console.log('there was an error', err)
    }
    results = results.map(i => i.FORMACION)
    res.json(results)
  })
})

router.get('/getJobs', (req, res) => {
    let { well, lowDate, highDate } = req.query
    const query = `SELECT * FROM Intervenciones inter
    JOIN TransactionsResults tr on inter.TRANSACTION_ID = tr.PROPUESTA_ID
    WHERE inter.WELL_FORMACION_ID = ? AND tr.FECHA_INTERVENCION >= ? AND tr.FECHA_INTERVENCION <= ?`
    
    // JOIN TransactionsResults tr on t.TRANSACTION_ID = tr.PROPUESTA_ID

    connection.query(query, [well, lowDate, highDate], (err, results) => {
      res.json(results)
    })
})


router.get('/isAdmin', allowAdmin, (req, res) => {
  res.json({ success: true })
})

router.get('/getFieldWellMapping', (req, res) => {
    connection.query(`SELECT * FROM FieldWellMapping`, (err, results) => {
      res.json(results)
    })
})

router.get('/filterOptions', async (req, res) => {
  const queryPromise = (name, query, id) => new Promise((resolve, reject) => {
    connection.query(query, id, (err, results) => {
      if (err) {
        reject({ err })
      } else {
        resolve ({ [name]: results })
      }
    })
  })
  
  function whereBuilderForFilters(queries, selectMap) {
    const whereMap = {}
    Object.keys(selectMap).forEach(query => {
      let reqQueriesKeys = Object.keys(queries)
      if (queries[query]) {
        // remove query from keys if it's part of the request. this prevents limiting options of selections
        reqQueriesKeys = reqQueriesKeys.filter(q => q !== query)
      }
      const builtQuery = reqQueriesKeys.map(q => {
        let { select, operator } = selectMap[q]
        operator = operator || '='
        return `AND ${select[0]} ${operator} ?`
      })
      const values = reqQueriesKeys.map(q => queries[q])
      whereMap[query] = { query: builtQuery, values }
      return builtQuery
    })
    return whereMap
  }

  const selectMap = {
    subdireccion: {
      joinStatement: 'FieldWellMapping fwm on t.SUBDIRECCION_ID = fwm.SUBDIRECCION_ID',
      select: ['t.SUBDIRECCION_ID', 'fwm.SUBDIRECCION_NAME']
    },
    activo: {
      joinStatement: 'FieldWellMapping fwm on t.ACTIVO_ID = fwm.ACTIVO_ID',
      select: ['t.ACTIVO_ID', 'fwm.ACTIVO_NAME']
    },
    field: {
      joinStatement: 'FieldWellMapping fwm on t.FIELD_FORMACION_ID = fwm.FIELD_FORMACION_ID',
      select: ['t.FIELD_FORMACION_ID', 'fwm.FIELD_NAME']
    },
    well: {
      joinStatement: 'FieldWellMapping fwm on t.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID',
      select: ['t.WELL_FORMACION_ID', 'fwm.WELL_NAME']
    },
    formation: { select: ['t.FORMACION'] },
    company: { select: ['tr.COMPANY'] },
    interventionType: { select: ['t.TIPO_DE_INTERVENCIONES'] },
    terminationType: { select: ['t.TIPO_DE_TERMINACION'] },
    lowDate: { select: ['tr.FECHA_INTERVENCION'], operator: '>=' },
    highDate: { select: ['tr.FECHA_INTERVENCION'], operator: '<=' },
  }
  const whereMap = whereBuilderForFilters(req.query, selectMap)
  const promises = Object.keys(whereMap).map(q => {
    let query = `SELECT DISTINCT ${selectMap[q].select.join(',')} FROM Transactions t
                 JOIN TransactionsResults tr on t.TRANSACTION_ID = tr.PROPUESTA_ID`
    if (selectMap[q].joinStatement) {
      query += `\nJOIN ${selectMap[q].joinStatement}`
    }
    query += `\nWHERE 1 = 1 ${whereMap[q].query.join(' ')}`
    return queryPromise(q, query, whereMap[q].values).catch(e => {
      return e
    })
  })
  const results = await Promise.all(promises)
  res.json(results)
})

router.get('/getSpecificFieldWell', (req, res) => {
  const { transactionID } = req.query
  const query = `
    SELECT t.FORMACION, fwm.WELL_NAME, fwm.FIELD_NAME
    FROM Transactions t JOIN FieldWellMapping fwm ON t.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
    WHERE t.TRANSACTION_ID = ?`
  connection.query(query, transactionID, (err, results) => {
    if (err) {
      console.log('err', err)
      return res.json({ success: false })
    }
    res.json({
      well: results[0].WELL_NAME,
      field: results[0].FIELD_NAME,
      formation: results[0].FORMACION,
    })
  })
})

router.get('/getFieldWellMappingHasData', (req, res) => {
    connection.query(`
      SELECT * FROM FieldWellMapping 
      WHERE WELL_FORMACION_ID IN 
        (SELECT DISTINCT(WELL_FORMACION_ID) FROM Transactions)
        `, (err, results) => {
      res.json(results)
    })
})


router.get('/getCostItems', (req, res) => {
    connection.query(`SELECT * FROM CostMap`, (err, results) => {
      res.json(results)
    })
})



router.get('/getAllSaves', (req, res) => {
    let { userID } = req.query
    
    connection.query(`SELECT SAVE_NAME, TRANSACTION_ID FROM SavedInputs WHERE USER_ID = ? ORDER BY INSERT_TIME DESC `,
      [userID], (err, data) => {
        if (err) {
          res.json([])
        } else {
          data = data.map(i => ({
            name: i.SAVE_NAME,
            id: i.TRANSACTION_ID
          }))
          res.json(data)
        }

    })
})


router.get('/getWellTransactions', (req, res) => {
  let { wellID } = req.query

  connection.query(`SELECT * FROM Transactions t JOIN Users u ON t.USER_ID = u.id WHERE WELL_FORMACION_ID = ? ORDER BY INSERT_TIME DESC`,
      [wellID], (err, data) => {

        data = data.map(i => ({
          user: i.username,
          date: i.INSERT_TIME,
          id: i.TRANSACTION_ID
        }))

        res.json(data)
    })
})


router.get('/getSave', (req, res) => {
    let { transactionID } = req.query
    
    connection.query(`SELECT * FROM SavedInputs WHERE TRANSACTION_ID = ?`, 
      [transactionID], (err, results) => {

        let transactionID = null
        let tipoDeIntervenciones = null

        if (results.length > 0) {
          transactionID = results[0].TRANSACTION_ID
          tipoDeIntervenciones = results[0].TIPO_DE_INTERVENCIONES
        }

        res.json({ transactionID: transactionID, tipoDeIntervenciones: tipoDeIntervenciones })
    })
})

router.get('/getTransactionField', (req, res) => {
    let { fieldID } = req.query
    
    connection.query(`select * from Transactions WHERE FIELD_FORMACION_ID = ? ORDER BY INSERT_TIME DESC LIMIT 1;`, 
      [fieldID], (err, results) => {

        let transactionID = null

        if (results.length > 0) {
          transactionID = results[0].TRANSACTION_ID
        }

        res.json({ transactionID: transactionID })
    })
})

router.get('/getTransactionWell', (req, res) => {
    let { wellID } = req.query
    
    connection.query(`select * from Transactions WHERE WELL_FORMACION_ID = ? ORDER BY INSERT_TIME DESC LIMIT 1;`, 
      [wellID], (err, results) => {

        let transactionID = null

        if (results.length > 0) {
          transactionID = results[0].TRANSACTION_ID
        }

        res.json({ transactionID: transactionID })
    })
})

router.get('/getTransactionNoResults', (req, res) => {
    let { userID } = req.query
    
    connection.query(`select * from Transactions t 
      JOIN FieldWellMapping f ON t.WELL_FORMACION_ID = f.WELL_FORMACION_ID 
      JOIN Intervenciones i ON t.TRANSACTION_ID = i.TRANSACTION_ID
      WHERE HAS_RESULTS = 0 AND USER_ID = ? ORDER BY INSERT_TIME DESC;`, 
      [userID], (err, results) => {


        res.json(results)
    })
})



router.post('/well', async (req, res) => {

  // TODO: Find a way to clean up callbacks from createWell
  createWell(req.body, 'submit', err => {
    if (err) {
      console.log('we got an error saving', err)
      res.json({ isSubmitted: false })
    } else {
      res.json({ isSubmitted: true })
    }
  })
})


router.post('/wellSave', async (req, res) => {

  // TODO: Find a way to clean up callbacks from createWell
  createWell(req.body, 'save', async (err, transactionID) => {
    if (err) {
      console.log('we got an error saving', err)
      res.json({ isSaved: false })
    } else {
      const images = await getImagesForClient(transactionID, 'loadSave')
      // Need pruebas de laboratorio so lab images can be correctly saved in redux 
      const pruebasDeLaboratorioData = await labTests(transactionID, 'loadSave').catch(e => e)
      let finalObj = {
        images,
        isSaved: true,
        pruebasDeLaboratorio: {
          pruebasDeLaboratorioData,
          checked: [],
        },
      }
      res.json(finalObj)
    }
  })
})


router.post('/results', async (req, res) => {
  createResults(req.body, 'save', err => {
    if (err) {
      console.log('we got an error saving', err)
      res.json({ isSubmitted: false })
    } else {
      res.json({ isSubmitted: true })
    }
  })
})

router.get('/getFields', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    FIELD_FORMACION_ID: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'campo'},
    DESCUBRIMIENTO: { parent: 'fichaTecnicaDelCampo', child: 'descubrimientoField' },
    FECHA_DE_EXPLOTACION: { parent: 'fichaTecnicaDelCampo', child: 'fechaDeExplotacionField' },
    NUMERO_DE_POZOS_OPERANDO: { parent: 'fichaTecnicaDelCampo', child: 'numeroDePozosOperandoField' },
    P_INICIAL: { parent: 'fichaTecnicaDelCampo', child: 'pInicialField'},
    P_INICIAL_ANO: { parent: 'fichaTecnicaDelCampo', child: 'pInicialAnoField'},
    P_ACTUAL: { parent: 'fichaTecnicaDelCampo', child: 'pActualField'},
    P_ACTUAL_FECHA: { parent: 'fichaTecnicaDelCampo', child: 'pActualFechaField'},
    DP_PER_ANO: { parent: 'fichaTecnicaDelCampo', child: 'dpPerAnoField' },
    TYAC: { parent: 'fichaTecnicaDelCampo', child: 'tyacField' },
    PR: { parent: 'fichaTecnicaDelCampo', child: 'prField' },
    TIPO_DE_FLUIDO: { parent: 'fichaTecnicaDelCampo', child: 'tipoDeFluidoField' },
    DENSIDAD_DEL_ACEITE: { parent: 'fichaTecnicaDelCampo', child: 'densidadDelAceiteField' },
    P_SAT: { parent: 'fichaTecnicaDelCampo', child: 'pSatField' },
    RGA_FLUIDO: { parent: 'fichaTecnicaDelCampo', child: 'rgaFluidoField' },
    SALINIDAD: { parent: 'fichaTecnicaDelCampo', child: 'salinidadField'},
    PVT_REPRESENTATIVO: { parent: 'fichaTecnicaDelCampo', child: 'pvtRepresentativoField'},
    LITOLOGIA: { parent: 'fichaTecnicaDelCampo', child: 'litologiaField'},
    ESPESOR_NETO: { parent: 'fichaTecnicaDelCampo', child: 'espesorNetoField'},
    POROSIDAD: { parent: 'fichaTecnicaDelCampo', child: 'porosidadField'},
    SW: { parent: 'fichaTecnicaDelCampo', child: 'swField'},
    K_PROMEDIO: { parent: 'fichaTecnicaDelCampo', child: 'kPromedioField'},
    CAA: { parent: 'fichaTecnicaDelCampo', child: 'caaField'},
    CGA: { parent: 'fichaTecnicaDelCampo', child: 'cgaField'},
    QO: { parent: 'fichaTecnicaDelCampo', child: 'qoField'},
    QG: { parent: 'fichaTecnicaDelCampo', child: 'qgField'},
    RGA: { parent: 'fichaTecnicaDelCampo', child: 'rgaField'},
    FW: { parent: 'fichaTecnicaDelCampo', child: 'fwField'},
    NP: { parent: 'fichaTecnicaDelCampo', child: 'npField'},
    GP: { parent: 'fichaTecnicaDelCampo', child: 'gpField'},
    WP: { parent: 'fichaTecnicaDelCampo', child: 'wpField'},
    RESERVA_REMANENTE_DE_ACEITE: { parent: 'fichaTecnicaDelCampo', child: 'rraField'},
    RESERVA_REMONENTE_DE_GAS: { parent: 'fichaTecnicaDelCampo', child: 'rrgField'},
    RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE: { parent: 'fichaTecnicaDelCampo', child: 'rrpceField'},
    H2S: { parent: 'fichaTecnicaDelCampo', child: 'h2sField'},
    CO2: { parent: 'fichaTecnicaDelCampo', child: 'co2Field'},
    N2: { parent: 'fichaTecnicaDelCampo', child: 'n2Field'},
  }
  getFields(transactionID, action, (data) => {
    const finalObj = {}

    if (data && data.length > 0) {
      data[0].P_ACTUAL_FECHA ? data[0].P_ACTUAL_FECHA = data[0].P_ACTUAL_FECHA.toJSON().slice(0, 10) : null
      data[0].FECHA_DE_EXPLOTACION ? data[0].FECHA_DE_EXPLOTACION = data[0].FECHA_DE_EXPLOTACION.toJSON().slice(0, 10) : null

      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })

      finalObj.fichaTecnicaDelCampo.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})



router.get('/getHistIntervencionesEstimulacionNew', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSaveEstimulacion' : 'loadTransactionEstimulacion'
  
  const map = {
    FECHA: { child: 'fecha' },
    TIPO_DE_TRATAMIENTO: { child: 'tipoDeTratamiento' },
    OBJETIVO: { child: 'objetivo' },
    COMPANIA: { child: 'compania' },
    ACIDO_VOL: { child: 'acidoVol' },
    ACIDO_NOMBRE: { child: 'acidoNombre' },
    SOLVENTE_VOL: { child: 'solventeVol' },
    SOLVENTE_NOMBRE: { child: 'solventeNombre' },
    DIVERGENTE_VOL: { child: 'divergenteVol' },
    DIVERGENTE_NOMBRE: { child: 'divergenteNombre' },
    TOTAL_N2: { child: 'totalN2' },
    BENEFICIO_PROGRAMADO: { child: 'beneficioProgramado' },
    BENEFICIO_OFICIAL: { child: 'beneficioOficial' },    
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'historialDeIntervenciones'
  const innerParent = 'historicoEstimulacionData'

  getHistIntervencionesNew(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined || d.HAS_ERRORS === null ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historialDeIntervenciones.hasErrors = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      finalObj.historialDeIntervenciones.showEstim = true
      res.json(finalObj)
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [],
          showEstim: false
        }
      })
    }
  })
})

router.get('/getHistIntervencionesAcidoNew', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSaveAcido' : 'loadTransactionAcido'
  
  const map = {
    FECHA: { child: 'fecha' },
    TIPO_DE_TRATAMIENTO: { child: 'tipoDeTratamiento' },
    OBJETIVO: { child: 'objetivo' },
    COMPANIA: { child: 'compania' },
    BASE: { child: 'base' },
    CIMA: { child: 'cima' },
    LONGITUD_GRAVADA: { child: 'longitudGravada' },
    ALTURA_GRAVADO: { child: 'alturaGravada' },
    ANCHO_GRAVADO: { child: 'anchoGravado' },
    CONDUCTIVIDAD: { child: 'conductividad' },
    FCD: { child: 'fcd' },
    PRESION_NETA: { child: 'presionNeta' },
    FLUIDO_FRACTURA: { child: 'fluidoFractura' },    
    BENEFICIO_PROGRAMADO: { child: 'beneficioProgramado' },
    BENEFICIO_OFICIAL: { child: 'beneficioOficial' },  
    HAS_ERRORS: { child: 'error'}  
  }

  const mainParent = 'historialDeIntervenciones'
  const innerParent = 'historicoAcidoData'

  getHistIntervencionesNew(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historialDeIntervenciones.hasErrors = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      finalObj.historialDeIntervenciones.showAcido = true
      res.json(finalObj)
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [],
          showAcido: false
        }
      })
    }
  })
})

router.get('/getHistIntervencionesApuntaladoNew', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSaveApuntalado' : 'loadTransactionApuntalado'
  
  const map = {
    FECHA: { child: 'fecha' },
    TIPO_DE_TRATAMIENTO: { child: 'tipoDeTratamiento' },
    OBJETIVO: { child: 'objetivo' },
    COMPANIA: { child: 'compania' },
    BASE: { child: 'base' },
    CIMA: { child: 'cima' },
    LONGITUD_APUNTALADA: { child: 'longitudApuntalada' },
    ALTURA_TOTAL_DE_FRACTURA: { child: 'alturaTotalDeFractura' },
    ANCHO_PROMEDIO: { child: 'anchoPromedio' },
    CONCENTRACION_AREAL: { child: 'concentracionAreal' },
    CONDUCTIVIDAD: { child: 'conductividad' },
    FCD: { child: 'fcd' },
    PRESION_NETA: { child: 'presionNeta' },
    FLUIDO_FRACTURA: { child: 'fluidoFractura' },    
    BENEFICIO_PROGRAMADO: { child: 'beneficioProgramado' },
    BENEFICIO_OFICIAL: { child: 'beneficioOficial' },    
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'historialDeIntervenciones'
  const innerParent = 'historicoApuntaladoData'

  getHistIntervencionesNew(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historialDeIntervenciones.hasErrors = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      finalObj.historialDeIntervenciones.showApuntalado = true
      res.json(finalObj)
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [],
          showApuntalado: false
        }
      })
    }
  })
})

router.get('/getHistIntervencionesTermicoNew', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSaveTermico' : 'loadTransactionTermico'
  
  const map = {
    FECHA_INICIO: { child: 'fechaInicio' },
    FECHA_FIN: { child: 'fechaFin' },
    OBJETIVO: { child: 'objetivo' },
    CICLO: { child: 'ciclo' },
    P_INY: { child: 'Piny' },
    T_INY: { child: 'Tiny' },
    CALIDAD: { child: 'calidad' },
    Q_INY: { child: 'Qiny' },
    AGUA_ACUM: { child: 'aguaAcum' },
    BENEFICIO_PROGRAMADO: { child: 'beneficioProgramado'},
    BENEFICIO_OFICIAL: { child: 'beneficioOficial'},
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'historialDeIntervenciones'
  const innerParent = 'historicoTermicoData'

  getHistIntervencionesNew(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA_INICIO ? d.FECHA_INICIO = d.FECHA_INICIO.toJSON().slice(0, 10) : null
        d.FECHA_FIN ? d.FECHA_FIN = d.FECHA_FIN.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historialDeIntervenciones.hasErrors = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      finalObj.historialDeIntervenciones.showTermico = true
      res.json(finalObj)
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [],
          showTermico: false
        }
      })
    }
  })
})




router.get('/getWell', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    WELL_FORMACION_ID: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'pozo'},
    SUBDIRECCION: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'subdireccion'},
    ACTIVO: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'activo'},
    FORMACION: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'formacion'},
    CALIZA: { parent: 'fichaTecnicaDelPozo', child: 'caliza'},
    DOLOMIA: { parent: 'fichaTecnicaDelPozo', child: 'dolomia'},
    ARCILLA: { parent: 'fichaTecnicaDelPozo', child: 'arcilla'},
    POROSIDAD: { parent: 'fichaTecnicaDelPozo', child: 'porosidad'},
    PERMEABILIDAD: { parent: 'fichaTecnicaDelPozo', child: 'permeabilidad'},
    SW: { parent: 'fichaTecnicaDelPozo', child: 'sw'},
    CAA: { parent: 'fichaTecnicaDelPozo', child: 'caa'},
    CGA: { parent: 'fichaTecnicaDelPozo', child: 'cga'},
    DENSIDAD_ACEITE : { parent: 'fichaTecnicaDelPozo', child: 'densidadAceite'},
    BO : { parent: 'fichaTecnicaDelPozo', child: 'bo'},
    VISCOSIDAD_ACEITE : { parent: 'fichaTecnicaDelPozo', child: 'viscosidadAceite'},
    GRAVEDAD_ESPECIFICA_GAS : { parent: 'fichaTecnicaDelPozo', child: 'gravedadEspecificaGas'},
    BG : { parent: 'fichaTecnicaDelPozo', child: 'bg'},
    RGA : { parent: 'fichaTecnicaDelPozo', child: 'rga'},
    ASFALTENOS : { parent: 'fichaTecnicaDelPozo', child: 'asfaltenos'},
    PARAFINAS : { parent: 'fichaTecnicaDelPozo', child: 'parafinas'},
    RESINAS_ASFALTICAS : { parent: 'fichaTecnicaDelPozo', child: 'resinasAsfalticas'},
    INDICE_EST_COLOIDAL : { parent: 'fichaTecnicaDelPozo', child: 'indiceEstColoidal'},
    DENSIDAD_AGUA : { parent: 'fichaTecnicaDelPozo', child: 'densidadAgua'},
    CONTENIDO_AGUA : { parent: 'fichaTecnicaDelPozo', child: 'contenidoAgua'},
    SALINIDAD : { parent: 'fichaTecnicaDelPozo', child: 'salinidad'},
    PH : { parent: 'fichaTecnicaDelPozo', child: 'ph'},
    INDICE_EST_AGUA : { parent: 'fichaTecnicaDelPozo', child: 'indiceEstAgua'},
    CONENIDO_EMULSION : { parent: 'fichaTecnicaDelPozo', child: 'contenidoEmulsion'},
    PRUEBA_DE_PRESION : { parent: 'fichaTecnicaDelPozo', child: 'pruebaDePresion'},
    MODELO : { parent: 'fichaTecnicaDelPozo', child: 'modelo'},
    KH : { parent: 'fichaTecnicaDelPozo', child: 'kh'},
    K : { parent: 'fichaTecnicaDelPozo', child: 'k'},
    S : { parent: 'fichaTecnicaDelPozo', child: 's'},
    PI_EN_NIVEL_SONDA : { parent: 'fichaTecnicaDelPozo', child: 'piEnNivelSonda'},
    TIPO_DE_POZO: { parent: 'fichaTecnicaDelPozo', child: 'tipoDePozo'},
    PWS_FECHA: { parent: 'fichaTecnicaDelPozo', child: 'pwsFecha'},
    PWF_FECHA: { parent: 'fichaTecnicaDelPozo', child: 'pwfFecha'},
    PWS: { parent: 'fichaTecnicaDelPozo', child: 'pws'},
    PWF: { parent: 'fichaTecnicaDelPozo', child: 'pwf'},
    DELTA_P_PER_MES: { parent: 'fichaTecnicaDelPozo', child: 'deltaPPerMes'},
    TYAC: { parent: 'fichaTecnicaDelPozo', child: 'tyac'},
    PVT: { parent: 'fichaTecnicaDelPozo', child: 'pvt'},
    APAREJO_DE_PRODUCCION: { parent: 'fichaTecnicaDelPozo', child: 'aparejoDeProduccion'},
    PROF_EMPACADOR: { parent: 'fichaTecnicaDelPozo', child: 'profEmpacador'},
    PROF_SENSOR_PYT: { parent: 'fichaTecnicaDelPozo', child: 'profSensorPYT'},
    TIPO_DE_SISTEMA: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeSistemo' }
  }

  getWell(transactionID, action, (data) => {
    const finalObj = {}
    
    if (data && data.length > 0) {
      data[0].PVT ? data[0].PVT = parseInt(data[0].PVT) : null
      data[0].PWS_FECHA ? data[0].PWS_FECHA = data[0].PWS_FECHA.toJSON().slice(0, 10) : null
      data[0].PWF_FECHA ? data[0].PWF_FECHA = data[0].PWF_FECHA.toJSON().slice(0, 10) : null
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.fichaTecnicaDelPozo.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})


router.get('/getHistIntervenciones', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    DATE: { child: 'fecha' },
    DESCRIPTION: { child: 'intervenciones' },
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'fichaTecnicaDelPozo'
  const innerParent = 'historialIntervencionesData'

  getHistIntervenciones(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.DATE ? d.DATE = d.DATE.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }

        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {}
          ]
        }
      })
    }
  })
})



router.get('/getSurvey', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    COMMENTS: { child: 'comments' },
    MEASURED_DEPTH: { child: 'measuredDepth'},
    INCLINATION: { child: 'inclination'},
    AZIMUTH: { child: 'azimuth'},
    TRUE_VERTICAL_DEPTH: { child: 'trueVerticalDepth'},
    VERTICAL_SECTION: { child: 'verticalSection'},
    NS: { child: 'ns'},
    EW: { child: 'ew'},
    DLS: { child: 'dls'},
    NORTHING: { child: 'northing'},
    EASTING: { child: 'easting'},
    LATITUDE: { child: 'latitude'},
    LONGITUDE: { child: 'longitude'},
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'mecanicoYAparejoDeProduccion'
  const innerParent = 'desviacion'

  getSurveys(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {comments: '', measuredDepth: '', inclination: '', azimuth: '', trueVerticalDepth: '', verticalSection: '', ns: '', ew: '', dls: '', northing: '', easting: '', latitude: '', longitude: '', error: true}
          ]
        }
      })
    }
  })
})




router.get('/getLayer', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    INTERVALO: { child: 'interval' },
    CIMA_MD: { child: 'cimaMD'},
    BASE_MD: { child: 'baseMD'},
    ESPESOR_BRUTO: { child: 'espesorBruto'},
    ESPESOR_NETO: { child: 'espesorNeto'},
    V_ARC: { child: 'vArc'},
    V_CAL: { child: 'vCal'},
    V_DOL: { child: 'vDol'},
    POROSITY: { child: 'porosity'},
    SW: { child: 'sw'},
    DENS: { child: 'dens'},
    RESIS: { child: 'resis'},
    PERMEABILIDAD: { child: 'perm'},
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'layerData'

  getLayer(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {}
          ]
        }
      })
    }
  })
})



router.get('/getMudLoss', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    CIMA_MD: { child: 'cimaMD' },
    BASE_MD: { child: 'baseMD' },
    LODO_PERDIDO: { child: 'lodoPerdido' },
    DENSIDAD: { child: 'densidad' },
    HAS_ERRORS: { child: 'error'}
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'mudLossData'

  getMudLoss(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.evaluacionPetrofisica.hasErrors = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {}
          ]
        }
      })
    }
  })
})


router.get('/getMecanico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    TIPO_DE_TERMINACION: { parent: 'mecanicoYAparejoDeProduccion', child: 'tipoDeTerminacion'},
    H_INTERVALO_PRODUCTOR: { parent: 'mecanicoYAparejoDeProduccion', child: 'hIntervaloProductor'},
    EMPACADOR: { parent: 'mecanicoYAparejoDeProduccion', child: 'empacador'},
    PRESION_DIF_EMPACADOR: { parent: 'mecanicoYAparejoDeProduccion', child: 'presionDifEmpacador'},
    SENSOR_PYT: { parent: 'mecanicoYAparejoDeProduccion', child: 'sensorPyt'},
    TIP_DE_LINER: { parent: 'mecanicoYAparejoDeProduccion', child: 'tipoDeLiner'},
    DIAMETRO_DE_LINER: { parent: 'mecanicoYAparejoDeProduccion', child: 'diametroDeLiner'},
    TIPO_DE_PISTOLAS: { parent: 'mecanicoYAparejoDeProduccion', child: 'tipoDePistolas'},
    DENSIDAD_DE_DISPAROS_MECANICO_DUPL: { parent: 'mecanicoYAparejoDeProduccion', child: 'densidadDeDisparosMecanico'},
    FASE: { parent: 'mecanicoYAparejoDeProduccion', child: 'fase'},
    DIAMETRO_DE_ORIFICIO: { parent: 'mecanicoYAparejoDeProduccion', child: 'diametroDeOrificio'},
    PENETRACION: { parent: 'mecanicoYAparejoDeProduccion', child: 'penetracion'},
    TRATAMIENTO_POR: { parent: 'mecanicoYAparejoDeProduccion', child: 'tratamientoPor'},
    VOLUMEN_APAREJO_DE_PRODUCCION: { parent: 'mecanicoYAparejoDeProduccion', child: 'volumenAparejoDeProduccion'},
    VOLUMEN_INTERVALO_CIMA: { parent: 'mecanicoYAparejoDeProduccion', child: 'volumenCimaDeIntervalo'},
    VOLUMEN_INTERVALO_BASE: { parent: 'mecanicoYAparejoDeProduccion', child: 'volumenBaseDeIntervalo'},
    VOLUMEN_DE_ESPACIO_ANULA: { parent: 'mecanicoYAparejoDeProduccion', child: 'volumenDeEspacioAnular'},
  }

  getMecanico(transactionID, action, (data) => {
    if (data && data.length > 0) {const finalObj = {}
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.mecanicoYAparejoDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})

router.get('/getAnalisisAgua', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

 
  const map = {
    pH: { parent: 'analisisDelAgua', child: 'pH' },
    TEMPERATURA_DE_CONDUCTIVIDAD: { parent: 'analisisDelAgua', child: 'temperaturaDeConductividad' },
    RESISTIVIDAD: { parent: 'analisisDelAgua', child: 'resistividad' },
    SALINIDAD_CON_CONDUCTIMETRO: { parent: 'analisisDelAgua', child: 'salinidadConConductimetro' },
    SOLIDOS_DISUELTOS_TOTALES: { parent: 'analisisDelAgua', child: 'solidosDisueltosTotales' },
    DUREZA_TOTAL_COMO_CaCO3: { parent: 'analisisDelAgua', child: 'durezaTotalComoCaCO3' },
    DUREZA_DE_CALCIO_COMO_CaCO3: { parent: 'analisisDelAgua', child: 'durezaDeCalcioComoCaCO3' },
    DUREZA_DE_MAGNESIO_COMO_CaCO3: { parent: 'analisisDelAgua', child: 'durezaDeMagnesioComoCaCO3' },
    ALCALINIDAD_TOTAL_COMO_CaCO3: { parent: 'analisisDelAgua', child: 'alcalinidadTotalComoCaCO3' },
    ALCALINIDAD_A_LA_FENOLFTALEINA_COMO_CaCO3: { parent: 'analisisDelAgua', child: 'alcalinidadALaFenolftaleinaComoCaCO3' },
    SALINIDAD_COMO_NaCL: { parent: 'analisisDelAgua', child: 'salinidadComoNaCl' },
    SODIO: { parent: 'analisisDelAgua', child: 'sodio' },
    CALCIO: { parent: 'analisisDelAgua', child: 'calcio' },
    MAGNESIO: { parent: 'analisisDelAgua', child: 'magnesio' },
    FIERRO: { parent: 'analisisDelAgua', child: 'fierro' },
    CLORUROS: { parent: 'analisisDelAgua', child: 'cloruros' },
    BICARBONATOS: { parent: 'analisisDelAgua', child: 'bicarbonatos' },
    SULFATOS: { parent: 'analisisDelAgua', child: 'sulfatos' },
    CARBONATOS: { parent: 'analisisDelAgua', child: 'carbonatos' },
    DENSIDAD_15: { parent: 'analisisDelAgua', child: 'densidadAt15' },
    DENSIDAD_20: { parent: 'analisisDelAgua', child: 'densidadAt20' },
  }

  getAnalisisAgua(transactionID, action, (data) => {
    
    if (data && data.length > 0) {const finalObj = {}
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.analisisDelAgua.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      finalObj.analisisDelAgua.waterAnalysisBool = data[0].WATER_ANALYSIS_BOOL === 0 ? false : true
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})

router.get('/getEmboloViajero', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'
 
  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' },
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    NUMERO_DE_DESCARGAS_O_CIRCLOS: { parent: 'sistemasArtificialesDeProduccion', child: 'numeroDeDescargasOCiclosEV' },
    VOLUMEN_DESPLAZADO_POR_CIRCLO: { parent: 'sistemasArtificialesDeProduccion', child: 'volumenDesplazadoPorCircloEV' },
  }

  getEmboloViajero(transactionID, action, (data) => {
    const finalObj = {}
    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})

router.get('/getBombeoNeumatico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

 
  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' },
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    PRESION_DE_INYECCION: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeInyeccionBN' },
    PRESION_DE_DESCARGA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeDescargaBN' },
    NUMERO_DE_VALVULAS: { parent: 'sistemasArtificialesDeProduccion', child: 'numeroDeValvulasBN'},
    PREFUNDIDAD_DE_LA_VALVULA_OPERANTE: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDeLaVulvulaOperanteBN'},
    ORIFICIO: { parent: 'sistemasArtificialesDeProduccion', child: 'orificioBN'},
    VOLUMEN_DE_GAS_INYECTADO: { parent: 'sistemasArtificialesDeProduccion', child: 'volumenDeGasInyectadoBN'},
  }

  getBombeoNeumatico(transactionID, action, (data) => {
    const finalObj = {}
    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})


router.get('/getBombeoHidraulico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' },
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    PROFUNDIDAD_DE_LA_BOMBA: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDeLaBombaBH' },
    TIPO_Y_MARCA_DE_BOMBA: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoYMarcaDeBombaBH' },
    ORIFICIO: { parent: 'sistemasArtificialesDeProduccion', child: 'orificioBH'},
    TIPO_DE_CAMISA: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeCamisaBH'},
    FLUIDO_MOTRIZ: { parent: 'sistemasArtificialesDeProduccion', child: 'fluidoMotrizBH'},
    EQUIPO_SUPERFICIAL: { parent: 'sistemasArtificialesDeProduccion', child: 'equipoSuperficialBH'},
  }

  getBombeoHidraulico(transactionID, action, (data) => {
    const finalObj = {}
    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})

router.get('/getBombeoCavidades', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' },
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    MOTOR_Y_TIPO_DE_MOTOR: { parent: 'sistemasArtificialesDeProduccion', child: 'motorYTipoDeMotorBCP' },
    PROFUNDIDAD_DEL_MOTOR: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDelMotorBCP' },
    VELOCIDAD: { parent: 'sistemasArtificialesDeProduccion', child: 'velocidadBCP' },
    HP: { parent: 'sistemasArtificialesDeProduccion', child: 'hpBCP' },
    ARREGLO_DE_VARILLAS: { parent: 'sistemasArtificialesDeProduccion', child: 'arregloDeVarillasBCP' },
    TIPO_DE_ELASTOMERO: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeElastomeroBCP' },
    PROFUNDIDAD_DEL_ANCLA_ANTITORQUE: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDelAntitorqueBCP' },   
  }



  getBombeoCavidades(transactionID, action, (data) => {
    const finalObj = {}
    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true

      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})

router.get('/getBombeoElectrocentrifugo', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' }, 
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    PROFUNDIDAD_DEL_MOTOR: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDelMotorBE' }, 
    DIAMETRO: { parent: 'sistemasArtificialesDeProduccion', child: 'diametroBE' }, 
    VOLTS: { parent: 'sistemasArtificialesDeProduccion', child: 'voltsBE' }, 
    AMPERAJE: { parent: 'sistemasArtificialesDeProduccion', child: 'amparajeBE' }, 
    ARMADURA: { parent: 'sistemasArtificialesDeProduccion', child: 'armaduraBE' },
    TIPO_DE_CABLE: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeCableBE' }, 
    LONGITUD_DE_CABLE: { parent: 'sistemasArtificialesDeProduccion', child: 'longitudDeCableBE' }, 
    RPM: { parent: 'sistemasArtificialesDeProduccion', child: 'rpmBE' },
  }

  getBombeoElectrocentrifugo(transactionID, action, (data) => {
    const finalObj = {}
    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})

router.get('/getBombeoMecanico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' }, 
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    TIPO_DE_UNIDAD: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeUnidadBM' }, 
    VELOCIDAD: { parent: 'sistemasArtificialesDeProduccion', child: 'velocidadBM' }, 
    LONGITUD_DE_CARERA: { parent: 'sistemasArtificialesDeProduccion', child: 'longitudDeCareraBM' }, 
    TIPO_DE_BOMBA_SUBSUPERFICIAL: { parent: 'sistemasArtificialesDeProduccion', child: 'tipoDeBombaSubsuperficialBM' }, 
    TAMANO_DE_BOMBA_SUBSUPERFICIAL: { parent: 'sistemasArtificialesDeProduccion', child: 'tamanoDeBombaSubsuperficialBM' },
    PROFUNDIDAD_DE_LA_BOMBA: { parent: 'sistemasArtificialesDeProduccion', child: 'profundidadDeLaBombaBM' }, 
    ARREGLO_DE_VARILLAS: { parent: 'sistemasArtificialesDeProduccion', child: 'arregloDeVarillasBM' }, 
    CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'CuantaConAnclaBM' }, 
    NIVEL_DINAMICO: { parent: 'sistemasArtificialesDeProduccion', child: 'nivelDinamico' }, 
    NIVEL_ESTATICO: { parent: 'sistemasArtificialesDeProduccion', child: 'nivelEstatico' },
  }

  getBombeoMecanico(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      finalObj.sistemasArtificialesDeProduccion.hasErrors = data[0].HAS_ERRORS === 0 || data[0].HAS_ERRORS === undefined ? false : true
      res.json(finalObj)   
    }
    else if (action === 'loadSave') {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})



router.get('/getFieldPressure', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    FECHA: { child: 'fecha' },
    PWS: { child: 'Pws' },
    HAS_ERRORS: { child: 'error' }
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataCampo'

  getFieldPressure(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj['historicoDePresion'].pressureDepthCampo = data[0].PRESSURE_DEPTH
      finalObj.historicoDePresion.hasErrorsCampo = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {}
          ],
          presionDataCampo: ''
        }
      })
    }
  })
})



router.get('/getWellPressure', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    FECHA: { child: 'fecha' },
    PWS: { child: 'Pws' },
    PWF: { child: 'Pwf'},
    HAS_ERRORS: { child: 'error' }
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataPozo'

  getWellPressure(transactionID, action, (data) => {
    const finalObj = {}
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj['historicoDePresion'].pressureDepthPozo = data[0].PRESSURE_DEPTH
      finalObj.historicoDePresion.hasErrorsPozo = data[0].TABLE_HAS_ERRORS === 0 ? false : true
      res.json(finalObj)
    }
    else if (action === 'loadTransaction'){
      res.json({ err: 'No value found in database'  })
    }
    else {
      res.json({
        [mainParent]: {
          [innerParent]: [
          {}
          ],
          pressureDepthPozo: ''
        }
      })
    }
  })
})



router.get('/getWellAforos', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    FECHA: { child: 'fecha' }, 
    TIEMPO: { child: 'tiempo' },
    ESTRANGULADOR: { child: 'estrangulador' },
    PTP: { child: 'ptp' }, 
    TTP: { child: 'ttp' }, 
    PBAJ: { child: 'pbaj' }, 
    TBAJ: { child: 'tbaj' }, 
    PSEP: { child: 'psep' },
    TSEP: { child: 'tsep' }, 
    QL: { child: 'ql' }, 
    QO: { child: 'qo'},
    QG: { child: 'qg' }, 
    QW: { child: 'qw' }, 
    RGA: { child: 'rga' },
    SALINIDAD: { child: 'salinidad'},
    PH: { child: 'ph'},
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'historicoDeAforos'
  const innerParent = 'aforosData'

  getWellAforos(transactionID, action, (data) => {
    const finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.FECHA ? d.FECHA = d.FECHA.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historicoDeAforos.hasErrors = error
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})


router.get('/getWellProduccion', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  
  const map = {
    Fecha: { child: 'fecha' },
    Dias: { child: 'dias' },
    QO: { child: 'qo' },
    QW: { child: 'qw' },
    QG: { child: 'qg' },
    QGI: { child: 'qgi' },
    QO_VOLUME: { child: 'qo_vol' },
    QW_VOLUME: { child: 'qw_vol' },
    QG_VOLUME: { child: 'qg_vol' },
    QGI_VOLUME: { child: 'qgi_vol' },
    NP: { child: 'np' },
    WP: { child: 'wp' },
    GP: { child: 'gp' },
    GI: { child: 'gi' },
    RGA: { child: 'rga' },
    FW_FRACTION: { child: 'fw' }, 
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'historicoDeProduccion'
  const innerParent = 'produccionData'

  getWellProduccion(transactionID, action, (data) => {
    const finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.Fecha ? d.Fecha = d.Fecha.toJSON().slice(0, 10) : null
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.historicoDeProduccion.hasErrors = error
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})



router.get('/getImages', async (req, res) => {
  const { transactionID, saved } = req.query
  const action = saved ? 'loadSave' : 'loadTransaction'
  const imagesForClient = await getImagesForClient(transactionID, action).catch(r => console.log('something went wrong getting images'))
  res.json(imagesForClient)
})
router.get('/getWellImages', async (req, res) => {
  let { transactionID, saved } = req.query
  let action = saved ? 'loadSave' : 'loadTransaction'
  getWellImages(transactionID, action, async (data) => {
    const final = await handleImageResponse(data)
    res.json(final)
  })
})

router.get('/getInterventionImages', async (req, res) => {
  let { transactionID, saved } = req.query
  let action = saved ? 'loadSave' : 'loadTransaction'
  getInterventionImages(transactionID, action, async (data) => {
    const final = await handleImageResponse(data)
    res.json(final)
  })
})

router.get('/getInterventionBase', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    OBJETIVO: { parent: 'objetivoYAlcancesIntervencion', child: 'objetivo' }, 
    ALCANCES: { parent: 'objetivoYAlcancesIntervencion', child: 'alcances' },
    TIPO_DE_INTERVENCIONES: { parent: 'objetivoYAlcancesIntervencion', child: 'tipoDeIntervenciones' },
    FECHA_PROGRAMADA_INTERVENCION: { parent: 'objetivoYAlcancesIntervencion', child: 'fechaProgramadaIntervencion'},
    INTERVENCION_PROGRAMADA: { parent: 'objetivoYAlcancesIntervencion', child: 'intervencionProgramada'},
  }

  getInterventionBase(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      data[0].FECHA_PROGRAMADA_INTERVENCION ? data[0].FECHA_PROGRAMADA_INTERVENCION = data[0].FECHA_PROGRAMADA_INTERVENCION.toJSON().slice(0, 10) : null
      data[0].INTERVENCION_PROGRAMADA !== undefined ? (data[0].INTERVENCION_PROGRAMADA = data[0].INTERVENCION_PROGRAMADA === 1 ? true : false) : null
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })   
    }
    else {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
    }
    res.json(finalObj)
  })
})

router.get('/getInterventionEstimulacion', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    TIPO_DE_ESTIMULACION: { parent: 'propuestaEstimulacion', child: 'tipoDeEstimulacion'},
    VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaEstimulacion', child: 'volumenPrecolchonN2' },
    VOLUMEN_SISTEMA_NO_REACTIVO: { parent: 'propuestaEstimulacion', child: 'volumenSistemaNoReativo' }, 
    VOLUMEN_SISTEMA_REACTIVO: { parent: 'propuestaEstimulacion', child: 'volumenSistemaReactivo' }, 
    VOLUMEN_SISTEMA_DIVERGENTE: { parent: 'propuestaEstimulacion', child: 'volumenSistemaDivergente' }, 
    VOLUMEN_DESPLAZAMIENTO_LIQUIDO: { parent: 'propuestaEstimulacion', child: 'volumenDesplazamientoLiquido' }, 
    VOLUMEN_DESPLAZAMIENTO_N2: { parent: 'propuestaEstimulacion', child: 'volumenDesplazamientoN2' },
    VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaEstimulacion', child: 'volumenTotalDeLiquido' }, 
    TIPO_DE_COLOCACION: { parent: 'propuestaEstimulacion', child: 'tipoDeColocacion' },
    TIEMPO_DE_CONTACTO: { parent: 'propuestaEstimulacion', child: 'tiempoDeContacto' }, 
    PENETRACION_RADIAL: { parent: 'resultadosSimulacionEstimulacion', child: 'penetracionRadial' }, 
    LONGITUD_DE_AGUJERO_DE_GUSANO: { parent: 'resultadosSimulacionEstimulacion', child: 'longitudDeAgujeroDeGusano' },
    EST_INC_ESTRANGULADOR: { parent: 'estIncProduccionEstimulacion', child: 'estIncEstrangulador' },
    EST_INC_Ptp: { parent: 'estIncProduccionEstimulacion', child: 'estIncPtp' }, 
    EST_INC_Ttp: { parent: 'estIncProduccionEstimulacion', child: 'estIncTtp' }, 
    EST_INC_Pbaj: { parent: 'estIncProduccionEstimulacion', child: 'estIncPbaj' }, 
    EST_INC_Tbaj: { parent: 'estIncProduccionEstimulacion', child: 'estIncTbaj' },
    EST_INC_Ptr: { parent: 'estIncProduccionEstimulacion', child: 'estIncPtr' }, 
    EST_INC_Qi: { parent: 'estIncProduccionEstimulacion', child: 'estIncQl' }, 
    EST_INC_Qo: { parent: 'estIncProduccionEstimulacion', child: 'estIncQo' }, 
    EST_INC_Qq: { parent: 'estIncProduccionEstimulacion', child: 'estIncQg' }, 
    EST_INC_Qw: { parent: 'estIncProduccionEstimulacion', child: 'estIncQw' },
    EST_INC_RGA: { parent: 'estIncProduccionEstimulacion', child: 'estIncRGA' }, 
    EST_INC_SALINIDAD: { parent: 'estIncProduccionEstimulacion', child: 'estIncSalinidad' }, 
    EST_INC_IP: { parent: 'estIncProduccionEstimulacion', child: 'estIncIP' }, 
    EST_INC_DELTA_P: { parent: 'estIncProduccionEstimulacion', child: 'estIncDeltaP' }, 
    EST_INC_GASTO_COMPROMISO_Qo: { parent: 'estIncProduccionEstimulacion', child: 'estIncGastoCompromisoQo' },
    EST_INC_GASTO_COMPROMISO_Qg: { parent: 'estIncProduccionEstimulacion', child: 'estIncGastoCompromisoQg' }, 
    EST_INC_OBSERVACIONES: { parent: 'estIncProduccionEstimulacion', child: 'obervacionesEstIncEstim' },
  }

  getInterventionEsimulacion(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      }) 
      finalObj.propuestaEstimulacion.hasErrors = data[0].HAS_ERRORS_PROPUESTA === 0 ? false : true
      finalObj.resultadosSimulacionEstimulacion.hasErrors = data[0].HAS_ERRORS_RESULTS === 0 ? false : true
      finalObj.estIncProduccionEstimulacion.hasErrors = data[0].HAS_ERRORS_EST_INC === 0 ? false : true
    }
    else {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      finalObj.propuestaEstimulacion.hasErrors = true
      finalObj.resultadosSimulacionEstimulacion.hasErrors = true
      finalObj.estIncProduccionEstimulacion.hasErrors = true
    }
    res.json(finalObj)
  })
})

router.get('/getInterventionAcido', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaAcido', child: 'volumenPrecolchonN2' },
    VOLUMEN_SISTEMA_NO_REACTIVO: { parent: 'propuestaAcido', child: 'volumenSistemaNoReativo' }, 
    VOLUMEN_SISTEMA_REACTIVO: { parent: 'propuestaAcido', child: 'volumenSistemaReactivo' }, 
    VOLUMEN_SISTEMA_DIVERGENTE: { parent: 'propuestaAcido', child: 'volumenSistemaDivergente' }, 
    VOLUMEN_DESPLAZAMIENTO_LIQUIDO: { parent: 'propuestaAcido', child: 'volumenDesplazamientoLiquido' }, 
    VOLUMEN_DESPLAZAMIENTO_N2: { parent: 'propuestaAcido', child: 'volumenDesplazamientoN2' },
    VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaAcido', child: 'volumenTotalDeLiquido' }, 
    MODULO_YOUNG_ARENA: { parent: 'propuestaAcido', child: 'moduloYoungArena' },
    MODULO_YOUNG_LUTITAS: { parent: 'propuestaAcido', child: 'moduloYoungLutitas' }, 
    RELAC_POISSON_ARENA: { parent: 'propuestaAcido', child: 'relacPoissonArena' }, 
    RELAC_POISSON_LUTITAS: { parent: 'propuestaAcido', child: 'relacPoissonLutatas' }, 
    GRADIENTE_DE_FRACTURA: { parent: 'propuestaAcido', child: 'gradienteDeFractura' }, 
    DENSIDAD_DE_DISPAROS: { parent: 'propuestaAcido', child: 'densidadDeDisparos' },
    DIAMETRO_DE_DISPAROS: { parent: 'propuestaAcido', child: 'diametroDeDisparos' }, 
    LONGITUD_TOTAL: { parent: 'resultadosSimulacionAcido', child: 'longitudTotal' }, 
    LONGITUD_EFECTIVA_GRABADA: { parent: 'resultadosSimulacionAcido', child: 'longitudEfectivaGrabada' },
    ALTURA_GRABADA: { parent: 'resultadosSimulacionAcido', child: 'alturaGrabada' }, 
    ANCHO_PROMEDIO: { parent: 'resultadosSimulacionAcido', child: 'anchoPromedio' }, 
    CONCENTRACION_DEL_ACIDO: { parent: 'resultadosSimulacionAcido', child: 'concentracionDelAcido' }, 
    CONDUCTIVIDAD: { parent: 'resultadosSimulacionAcido', child: 'conductividad' }, 
    FCD: { parent: 'resultadosSimulacionAcido', child: 'fcd' },
    PRESION_NETA: { parent: 'resultadosSimulacionAcido', child: 'presionNeta' },
    EFICIENCIA_DE_FLUIDO_DE_FRACTURA: { parent: 'resultadosSimulacionAcido', child: 'eficienciaDeFluidoDeFractura' }, 
    EST_INC_ESTRANGULADOR: { parent: 'estIncProduccionAcido', child: 'estIncEstrangulador' },
    EST_INC_Ptp: { parent: 'estIncProduccionAcido', child: 'estIncPtp' }, 
    EST_INC_Ttp: { parent: 'estIncProduccionAcido', child: 'estIncTtp' }, 
    EST_INC_Pbaj: { parent: 'estIncProduccionAcido', child: 'estIncPbaj' }, 
    EST_INC_Tbaj: { parent: 'estIncProduccionAcido', child: 'estIncTbaj' },
    EST_INC_Ptr: { parent: 'estIncProduccionAcido', child: 'estIncPtr' }, 
    EST_INC_Qi: { parent: 'estIncProduccionAcido', child: 'estIncQl' }, 
    EST_INC_Qo: { parent: 'estIncProduccionAcido', child: 'estIncQo' }, 
    EST_INC_Qq: { parent: 'estIncProduccionAcido', child: 'estIncQg' }, 
    EST_INC_Qw: { parent: 'estIncProduccionAcido', child: 'estIncQw' },
    EST_INC_RGA: { parent: 'estIncProduccionAcido', child: 'estIncRGA' }, 
    EST_INC_SALINIDAD: { parent: 'estIncProduccionAcido', child: 'estIncSalinidad' }, 
    EST_INC_IP: { parent: 'estIncProduccionAcido', child: 'estIncIP' }, 
    EST_INC_DELTA_P: { parent: 'estIncProduccionAcido', child: 'estIncDeltaP' }, 
    EST_INC_GASTO_COMPROMISO_Qo: { parent: 'estIncProduccionAcido', child: 'estIncGastoCompromisoQo' },
    EST_INC_GASTO_COMPROMISO_Qg: { parent: 'estIncProduccionAcido', child: 'estIncGastoCompromisoQg' }, 
    EST_INC_OBSERVACIONES: { parent: 'estIncProduccionAcido', child: 'obervacionesEstIncAcido' },
  }


  getInterventionAcido(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })   
      finalObj.resultadosSimulacionAcido.hasErrors = data[0].HAS_ERRORS_RESULTS === 0 ? false : true
      finalObj.propuestaAcido.hasErrors = data[0].HAS_ERRORS_PROPUESTA === 0 ? false : true
      finalObj.estIncProduccionAcido.hasErrors = data[0].HAS_ERRORS_EST_INC === 0 ? false : true
    }
    else {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      finalObj.resultadosSimulacionAcido.hasErrors = true
      finalObj.propuestaAcido.hasErrors = true
      finalObj.estIncProduccionAcido.hasErrors = true
    }

    res.json(finalObj)
  })
})


router.get('/getInterventionApuntalado', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    VOLUMEN_PRECOLCHON_APUNTALANTE: { parent: 'propuestaApuntalado', child: 'volumenPrecolchonN2' },
    VOLUMEN_APUNTALANTE: { parent: 'propuestaApuntalado', child: 'volumenApuntalante' },
    VOLUMEN_DESPLAZAMIENTO_LIQUIDO: { parent: 'propuestaApuntalado', child: 'volumenDesplazamientoLiquido' },
    VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaApuntalado', child: 'volumenTotalDeLiquido' },
    VOLUMEN_GEL_DE_FRACTURA: { parent: 'propuestaApuntalado', child: 'volumenGelFractura' },
    // VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaApuntalado', child: 'volumenPrecolchonN2' },
    // VOLUMEN_SISTEMA_NO_REACTIVO: { parent: 'propuestaApuntalado', child: 'volumenSistemaNoReativo' }, 
    // VOLUMEN_SISTEMA_REACTIVO: { parent: 'propuestaApuntalado', child: 'volumenSistemaReactivo' }, 
    // VOLUMEN_SISTEMA_DIVERGENTE: { parent: 'propuestaApuntalado', child: 'volumenSistemaDivergente' }, 
    // VOLUMEN_DESPLAZAMIENTO_LIQUIDO: { parent: 'propuestaApuntalado', child: 'volumenDesplazamientoLiquido' }, 
    // VOLUMEN_DESPLAZAMIENTO_N2: { parent: 'propuestaApuntalado', child: 'volumenDesplazamientoN2' },
    // VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaApuntalado', child: 'volumenTotalDeLiquido' }, 
    MODULO_YOUNG_ARENA: { parent: 'propuestaApuntalado', child: 'moduloYoungArena' },
    MODULO_YOUNG_LUTITAS: { parent: 'propuestaApuntalado', child: 'moduloYoungLutitas' }, 
    RELAC_POISSON_ARENA: { parent: 'propuestaApuntalado', child: 'relacPoissonArena' }, 
    RELAC_POISSON_LUTITAS: { parent: 'propuestaApuntalado', child: 'relacPoissonLutatas' }, 
    GRADIENTE_DE_FRACTURA: { parent: 'propuestaApuntalado', child: 'gradienteDeFractura' }, 
    DENSIDAD_DE_DISPAROS: { parent: 'propuestaApuntalado', child: 'densidadDeDisparos' },
    DIAMETRO_DE_DISPAROS: { parent: 'propuestaApuntalado', child: 'diametroDeDisparos' }, 
    LONGITUD_APUNTALADA: { parent: 'resultadosSimulacionApuntalado', child: 'longitudApuntalada' }, 
    ALTURA_TOTAL_DE_FRACTURA: { parent: 'resultadosSimulacionApuntalado', child: 'alturaTotalDeFractura' },
    ANCHO_PROMEDIO: { parent: 'resultadosSimulacionApuntalado', child: 'anchoPromedio' }, 
    CONCENTRACION_AREAL: { parent: 'resultadosSimulacionApuntalado', child: 'concentractionAreal' },
    CONDUCTIVIDAD: { parent: 'resultadosSimulacionApuntalado', child: 'conductividad' }, 
    FCD: { parent: 'resultadosSimulacionApuntalado', child: 'fcd' },
    PRESION_NETA: { parent: 'resultadosSimulacionApuntalado', child: 'presionNeta' },
    EFICIENCIA_DE_FLUIDO_DE_FRACTURA: { parent: 'resultadosSimulacionApuntalado', child: 'eficienciaDeFluidoDeFractura' }, 
    EST_INC_ESTRANGULADOR: { parent: 'estIncProduccionApuntalado', child: 'estIncEstrangulador' },
    EST_INC_Ptp: { parent: 'estIncProduccionApuntalado', child: 'estIncPtp' }, 
    EST_INC_Ttp: { parent: 'estIncProduccionApuntalado', child: 'estIncTtp' }, 
    EST_INC_Pbaj: { parent: 'estIncProduccionApuntalado', child: 'estIncPbaj' }, 
    EST_INC_Tbaj: { parent: 'estIncProduccionApuntalado', child: 'estIncTbaj' },
    EST_INC_Ptr: { parent: 'estIncProduccionApuntalado', child: 'estIncPtr' }, 
    EST_INC_Qi: { parent: 'estIncProduccionApuntalado', child: 'estIncQl' }, 
    EST_INC_Qo: { parent: 'estIncProduccionApuntalado', child: 'estIncQo' }, 
    EST_INC_Qq: { parent: 'estIncProduccionApuntalado', child: 'estIncQg' }, 
    EST_INC_Qw: { parent: 'estIncProduccionApuntalado', child: 'estIncQw' },
    EST_INC_RGA: { parent: 'estIncProduccionApuntalado', child: 'estIncRGA' }, 
    EST_INC_SALINIDAD: { parent: 'estIncProduccionApuntalado', child: 'estIncSalinidad' }, 
    EST_INC_IP: { parent: 'estIncProduccionApuntalado', child: 'estIncIP' }, 
    EST_INC_DELTA_P: { parent: 'estIncProduccionApuntalado', child: 'estIncDeltaP' }, 
    EST_INC_GASTO_COMPROMISO_Qo: { parent: 'estIncProduccionApuntalado', child: 'estIncGastoCompromisoQo' },
    EST_INC_GASTO_COMPROMISO_Qg: { parent: 'estIncProduccionApuntalado', child: 'estIncGastoCompromisoQg' }, 
    EST_INC_OBSERVACIONES: { parent: 'estIncProduccionApuntalado', child: 'obervacionesEstIncApuntalado' },
  } 

  getInterventionApuntalado(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })   
      finalObj.resultadosSimulacionApuntalado.hasErrors = data[0].HAS_ERRORS_RESULTS === 0 ? false : true
      finalObj.propuestaApuntalado.hasErrors = data[0].HAS_ERRORS_PROPUESTA === 0 ? false : true
      finalObj.estIncProduccionApuntalado.hasErrors = data[0].HAS_ERRORS_EST_INC === 0 ? false : true
    }
    else {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      finalObj.resultadosSimulacionApuntalado.hasErrors = true
      finalObj.propuestaApuntalado.hasErrors = true
      finalObj.estIncProduccionApuntalado.hasErrors = true
    }
    res.json(finalObj)
  })
})


router.get('/getInterventionTermico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    VOLUMEN_VAPOR_INYECTAR: { parent: 'propuestaTermica', child: 'volumenVapor' },
    CALIDAD: { parent: 'propuestaTermica', child: 'calidad' }, 
    GASTO_INYECCION: { parent: 'propuestaTermica', child: 'gastoInyeccion' },     
    PRESION_MAXIMA_SALIDA_GENERADOR: { parent: 'propuestaTermica', child: 'presionMaximaSalidaGenerador' },
    TEMPERATURA_MAXIMA_GENERADOR: { parent: 'propuestaTermica', child: 'temperaturaMaximaGenerador' }, 
    EST_INC_ESTRANGULADOR: { parent: 'estIncProduccionTermico', child: 'estIncEstrangulador' },
    EST_INC_Ptp: { parent: 'estIncProduccionTermico', child: 'estIncPtp' }, 
    EST_INC_Ttp: { parent: 'estIncProduccionTermico', child: 'estIncTtp' }, 
    EST_INC_Pbaj: { parent: 'estIncProduccionTermico', child: 'estIncPbaj' }, 
    EST_INC_Tbaj: { parent: 'estIncProduccionTermico', child: 'estIncTbaj' },
    EST_INC_Ptr: { parent: 'estIncProduccionTermico', child: 'estIncPtr' }, 
    EST_INC_Qi: { parent: 'estIncProduccionTermico', child: 'estIncQl' }, 
    EST_INC_Qo: { parent: 'estIncProduccionTermico', child: 'estIncQo' }, 
    EST_INC_Qq: { parent: 'estIncProduccionTermico', child: 'estIncQg' }, 
    EST_INC_Qw: { parent: 'estIncProduccionTermico', child: 'estIncQw' },
    EST_INC_RGA: { parent: 'estIncProduccionTermico', child: 'estIncRGA' }, 
    EST_INC_SALINIDAD: { parent: 'estIncProduccionTermico', child: 'estIncSalinidad' }, 
    EST_INC_IP: { parent: 'estIncProduccionTermico', child: 'estIncIP' }, 
    EST_INC_DELTA_P: { parent: 'estIncProduccionTermico', child: 'estIncDeltaP' }, 
    EST_INC_GASTO_COMPROMISO_Qo: { parent: 'estIncProduccionTermico', child: 'estIncGastoCompromisoQo' },
    EST_INC_GASTO_COMPROMISO_Qg: { parent: 'estIncProduccionTermico', child: 'estIncGastoCompromisoQg' }, 
    EST_INC_OBSERVACIONES: { parent: 'estIncProduccionTermico', child: 'observacionesEstIncTermico' },
  } 

  getInterventionTermico(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })   
      finalObj.propuestaTermica.hasErrors = data[0].HAS_ERRORS_PROPUESTA === 0 ? false : true
      finalObj.estIncProduccionTermico.hasErrors = data[0].HAS_ERRORS_EST_INC === 0 ? false : true
    }
    else {
      Object.keys(map).forEach(key => {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, '')
      })
      finalObj.propuestaTermica.hasErrors = true
      finalObj.estIncProduccionTermico.hasErrors = true
    }
    res.json(finalObj)
  })
})

router.get('/getLabTest', async (req, res) => {
  let { transactionID, saved } = req.query
  let action = saved ? 'loadSave' : 'loadTransaction'
  const outData = await labTests(transactionID, action).catch(e => e)
  let finalObj = {
    pruebasDeLaboratorio: {
      pruebasDeLaboratorioData: outData,
      checked: []
    }
  }
  res.json(finalObj)
})

router.get('/getCedulaEstimulacion', async (req, res) => {
  let { transactionID, saved } = req.query
  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
    NOMBRE_COMERCIAL: { child: 'nombreComercial'},
    TIPO_DE_APUNTALANTE: { child: 'tipoDeApuntalante' }, 
    CONCENTRACION_DE_APUNTALANTE: { child: 'concentraciDeApuntalante' }, 
    VOL_LIQUID: { child: 'volLiquid' }, 
    GASTO_N2: { child: 'gastoN2' }, 
    GASTO_LIQUIDO: { child: 'gastoLiqudo' }, 
    GASTO_EN_FONDO: { child: 'gastoEnFondo' }, 
    CALIDAD: { child: 'calidad' }, 
    VOL_N2: { child: 'volN2' },
    VOL_LIQUIDO_ACUM: { child: 'volLiquidoAcum' }, 
    VOL_N2_ACUM: { child: 'volN2Acum' }, 
    REL_N2_LIQ: { child: 'relN2Liq' }, 
    TIEMPO: { child: 'tiempo' },
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'propuestaEstimulacion'
  const innerParent = 'cedulaData'

  getCedulaEstimulacion(transactionID, action, (data) => {
    let finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj['propuestaEstimulacion'].propuestaCompany = data[0].COMPANIA
      finalObj.propuestaEstimulacion.hasErrors = error
    }
    else {
      finalObj = {
        'propuestaEstimulacion': {
          "propuestaCompany": '',
          "cedulaData": [
            {etapa: 1}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


router.get('/getCedulaAcido', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
    NOMBRE_COMERCIAL: { child: 'nombreComercial' },
    TIPO_DE_APUNTALANTE: { child: 'tipoDeApuntalante' }, 
    CONCENTRACION_DE_APUNTALANTE: { child: 'concentraciDeApuntalante' }, 
    VOL_LIQUID: { child: 'volLiquid' }, 
    GASTO_N2: { child: 'gastoN2' }, 
    GASTO_LIQUIDO: { child: 'gastoLiqudo' }, 
    GASTO_EN_FONDO: { child: 'gastoEnFondo' }, 
    CALIDAD: { child: 'calidad' }, 
    VOL_N2: { child: 'volN2' },
    VOL_LIQUIDO_ACUM: { child: 'volLiquidoAcum' }, 
    VOL_N2_ACUM: { child: 'volN2Acum' }, 
    REL_N2_LIQ: { child: 'relN2Liq' }, 
    TIEMPO: { child: 'tiempo' },
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'propuestaAcido'
  const innerParent = 'cedulaData'

  getCedulaAcido(transactionID, action, (data) => {
    let finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj['propuestaAcido'].propuestaCompany = data[0].COMPANIA
      finalObj.propuestaAcido.hasErrors = error
    }
    else {
      finalObj = {
        'propuestaAcido': {
          "propuestaCompany": '',
          "cedulaData": [
            {etapa: 1}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


router.get('/getCedulaApuntalado', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
    NOMBRE_COMERCIAL: { child: 'nombreComercial' },
    TIPO_DE_FLUIDO: { child: 'tipoDeFluido'},
    TIPO_DE_APUNTALANTE: { child: 'tipoDeApuntalante' }, 
    VOL_LIQUIDO: { child: 'volLiquido' }, 
    VOL_LECHADA: { child: 'volLechada' }, 
    GASTO_EN_SUPERFICIE: { child: 'gastoSuperficie' }, 
    GASTO_N2_SUPERFICIE: { child: 'gastoN2Superficie' }, 
    GASTO_TOTAL_FONDO: {child: 'gastoEnFondo'},
    CALIDAD_N2: { child: 'calidadN2Fondo' }, 
    VOL_ESPUMA_FONDO: { child: 'volEspumaFondo' }, 
    CONCENTRACION_APUNTALANTE_SUPERFICIE: { child: 'concentracionApuntalanteSuperficie' }, 
    CONCENTRACION_APUNTALANTE_FONDO: { child: 'concentracionApuntalanteFondo' }, 
    APUNTALANTE_ACUMULADO: { child: 'apuntalanteAcumulado' }, 
    TIEMPO: { child: 'tiempo' },
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'propuestaApuntalado'
  const innerParent = 'cedulaData'

  getCedulaApuntalado(transactionID, action, (data) => {
    let finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj['propuestaApuntalado'].propuestaCompany = data[0].COMPANIA
      finalObj.propuestaApuntalado.hasErrors = error
    }
    else {
      finalObj = {
        'propuestaApuntalado': {
          "propuestaCompany": '',
          "cedulaData": [
            {etapa: 1}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


router.get('/getCedulaTermico', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    ETAPA: { child: 'etapa' }, 
    ACTIVIDAD: { child: 'actividad' }, 
    DESCRIPCION: { child: 'descripcion' },
    JUSTIFICACION: { child: 'justificacion'},
    HAS_ERRORS: { child: 'error' },
  }

  const mainParent = 'propuestaTermica'
  const innerParent = 'cedulaData'

  getCedulaTermico(transactionID, action, (data) => {
    let finalObj = {}
    let error = false

    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.propuestaTermica.propuestaCompany = data[0].COMPANIA
      finalObj.propuestaTermica.hasErrors = error
    }
    else {
      finalObj = {
        'propuestaTermica': {
          "propuestaCompany": '',
          "cedulaData": [
            {etapa: 1}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})

router.get('/getCosts', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'
  

  const map = {
    ITEM: { child: 'item' }, 
    UNIT: { child: 'unit' },
    COST_MNX: { child: 'cost' }, 
    COST_DLS: { child: 'costDLS' },
    MNXtoDLS: { child: 'MNXtoDLS'},
    HAS_ERRORS: { child: 'error' }
  }

  const mainParent = 'estCost'
  const innerParent = 'estimacionCostosData'

  getCosts(transactionID, action, (data) => {
    let finalObj = {}
    let error = false
    if (data && data.length > 0) {
      data.forEach((d, index) => {
        d.HAS_ERRORS = d.HAS_ERRORS === 0 || d.HAS_ERRORS === undefined ? false : true
        d.HAS_ERRORS === true ? error = true : null
        d.ITEM = d.ITEM ? parseInt(d.ITEM) : null
        const innerObj = {}
        Object.keys(d).forEach(k => {
          if (map[k]) {
            const { child } = map[k]
            objectPath.set(innerObj, child, d[k])
          }
        })
        objectPath.set(innerObj, 'length', data.length)
        objectPath.set(innerObj, 'index', index)
        objectPath.push(finalObj, `${mainParent}.${innerParent}`, innerObj)
      })
      finalObj.estCost.hasErrors = error
    }
    else {
      finalObj = {
        'estCost': {
          "estimacionCostosData": [
            {}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})

router.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default router
