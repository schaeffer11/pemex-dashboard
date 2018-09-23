import express from 'express'
import db from '../lib/db'
import appConfig from '../../app-config.js'
import path from 'path'
import fs from 'fs'
import objectPath from 'object-path'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';
import { create as createWell, getFields, getWell, 
            getHistIntervenciones, getLayer, getMudLoss, getMecanico, 
            getAnalisisAgua, getEmboloViajero, getBombeoNeumatico, getBombeoHidraulico, 
            getBombeoCavidades, getBombeoElectrocentrifugo, getBombeoMecanico, 
            getFieldPressure, getWellPressure, 
            getWellAforos, getWellProduccion, getWellImages, getInterventionBase, 
            getInterventionEsimulacion, getInterventionAcido, getInterventionApuntalado, 
            getLabTest, getCedulaEstimulacion, getCedulaAcido, getCedulaApuntalado, 
            getLabResults, getLabAcido, getLabApuntalado, getCosts, getInterventionImage } from './pozo'

const connection = db.getConnection(appConfig.users.database)
const app = express()

const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
})

const handleError = (err) => {
  console.error(err)
  return { status: 500, error: true }
}

app.use(upload.array())

app.get('/ping', (req, res) => {
	console.log('pong')
  res.json({ response: 'pong' })
})

app.get('/woop', async (req, res) => {
  getBuckets()
  res.send('done')
})

app.get('/getTemplate', (req, res) => {
  let localPath = path.join(__dirname, '../tempFile.xlsm')

  res.sendFile(localPath)
})

app.get('/what', (req, res) => {
  const buf = fs.readFileSync(path.join(__dirname, '../../', 'screenshot_test.png'))
  console.log('buf', buf)
  res.send('done')
})

app.get('/geturl?', async (req, res) => {
  const url = await signedURL(req.query.img).catch(reason => console.log(reason))
  res.send(url)
})

app.get('/deleteobj', async (req, res) => {
  const imgsToDelete = [
    'dareal.pruebasDeLaboratorio.caracterizacinSolubilidad.1536860807755',
    'dareal.pruebasDeLaboratorio.caracterizacinAgua.1536860807755',
    'dareal.evaluacionPetrofisica.1536860807755'
  ]

  const done = await Promise.all(imgsToDelete.map(elem => deleteObject(elem)))
  // const test = await deleteObject(req.query.img)
  console.log('data', done)
  res.send('done')
})

app.post('/testing', (req, res) => {
  // console.log('this is about to get fucked', req.body)
  const buf = Buffer.from(req.body.file, 'base64')
  addObject(buf)

  res.json({ yeah: 'boy' })
})


app.get('/getFieldWellMapping', (req, res) => {
    connection.query(`SELECT * FROM FieldWellMapping`, (err, results) => {
      res.json(results)
    })
})


app.get('/getSave', (req, res) => {
    let { userID, wellID } = req.query
    
    connection.query(`SELECT * FROM SavedInputs WHERE USER_ID = ? ORDER BY INSERT_TIME DESC LIMIT 1`, 
      [userID, wellID], (err, results) => {

        let transactionID = null
        let tipoDeIntervenciones = null

        if (results.length > 0) {
          transactionID = results[0].TRANSACTION_ID
          tipoDeIntervenciones = results[0].TIPO_DE_INTERVENCIONES
        }

        res.json({ transactionID: transactionID, tipoDeIntervenciones: tipoDeIntervenciones })
    })
})

app.get('/getTransactionField', (req, res) => {
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

app.get('/getTransactionWell', (req, res) => {
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





app.post('/well', async (req, res) => {
  createWell(req.body, 'submit', err => {
    if (err) {
      console.log('we got an error saving', err)
      res.json({ isSubmitted: false })
    } else {
      console.log('all good in the saving neighborhood')
      res.json({ isSubmitted: true })
    }
  })
})


app.post('/wellSave', async (req, res) => {
  // TODO: Find a way to clean up callbacks from createWell
  createWell(req.body, 'save', err => {
    if (err) {
      console.log('we got an error saving', err)
      res.json({ isSaved: false })
    } else {
      console.log('all good in the saving neighborhood')
      res.json({ isSaved: true })
    }
  })
})

app.get('/getFields', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  const map = {
    FIELD_FORMACION_ID: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'campo'},
    DESCUBRIMIENTO: { parent: 'fichaTecnicaDelCampo', child: 'descubrimientoField' },
    FECHA_DE_EXPLOTACION: { parent: 'fichaTecnicaDelCampo', child: 'fechaDeExplotacionField' },
    P_INICIAL_ANO: { parent: 'fichaTecnicaDelCampo', child: 'pInicialAnoField'},
    NUMERO_DE_POZOS_OPERANDO: { parent: 'fichaTecnicaDelCampo', child: 'numeroDePozosOperandoField' },
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
    
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})

app.get('/getWell', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    WELL_FORMACION_ID: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'pozo'},
    SUBDIRECCION: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'subdireccion'},
    ACTIVO: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'activo'},
    FORMACION: { parent: 'fichaTecnicaDelPozoHighLevel', child: 'formacion'},
    INTERVALO_PRODUCTOR: { parent: 'fichaTecnicaDelPozo', child: 'intervaloProductor'},
    ESPESOR_BRUTO: { parent: 'fichaTecnicaDelPozo', child: 'espesorBruto'},
    ESPESOR_NETO: { parent: 'fichaTecnicaDelPozo', child: 'espesorNeto'},
    CALIZA: { parent: 'fichaTecnicaDelPozo', child: 'caliza'},
    DOLOMIA: { parent: 'fichaTecnicaDelPozo', child: 'dolomia'},
    ARCILLA: { parent: 'fichaTecnicaDelPozo', child: 'arcilla'},
    POROSIDAD: { parent: 'fichaTecnicaDelPozo', child: 'porosidad'},
    PERMEABILIDAD: { parent: 'fichaTecnicaDelPozo', child: 'permeabilidad'},
    SW: { parent: 'fichaTecnicaDelPozo', child: 'sw'},
    CAA: { parent: 'fichaTecnicaDelPozo', child: 'caa'},
    CGA: { parent: 'fichaTecnicaDelPozo', child: 'cga'},
    TIPO_DE_POZO: { parent: 'fichaTecnicaDelPozo', child: 'tipoDePozo'},
    PWS_FECHA: { parent: 'fichaTecnicaDelPozo', child: 'pwsFecha'},
    PWF_FECHA: { parent: 'fichaTecnicaDelPozo', child: 'pwfFecha'},
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
    
    if (data.length > 0) {console.log(data)
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})


app.get('/getHistIntervenciones', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    DATE: { child: 'fecha' },
    DESCRIPTION: { child: 'intervenciones' },
  }

  const mainParent = 'fichaTecnicaDelPozo'
  const innerParent = 'historialIntervencionesData'

  getHistIntervenciones(transactionID, action, (data) => {
    const finalObj = {}

    if (data.length > 0) {
      data.forEach((d, index) => {
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
        mainParent: {
          innerParent: [
          {}
          ]
        }
      })
    }
  })
})



app.get('/getLayer', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    INTERVALO: { child: 'interval' },
    CIMA_MD: { child: 'cimaMD'},
    BASE_MD: { child: 'baseMD'},
    CIMA_MV: { child: 'cimaMV'},
    BASE_MV: { child: 'baseMV' },
    V_ARC: { child: 'vArc'},
    POROSITY: { child: 'porosity'},
    SW: { child: 'sw'},
    DENS: { child: 'dens'},
    RESIS: { child: 'resis'},
    PERMEABILIDAD: { child: 'perm'},
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'layerData'

  getLayer(transactionID, action, (data) => {
    const finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
        mainParent: {
          innerParent: [
          {}
          ]
        }
      })
    }
  })
})



app.get('/getMudLoss', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    CIMA_MD: { child: 'cimaMD' },
    BASE_MD: { child: 'baseMD' },
    LODO_PERDIDO: { child: 'lodoPerdido' },
    DENSIDAD: { child: 'densidad' },
    length: { child: 'length' },
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'mudLossData'

  getMudLoss(transactionID, action, (data) => {
    const finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
        mainParent: {
          innerParent: [
          {}
          ]
        }
      })
    }
  })
})


app.get('/getMecanico', async (req, res) => {
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
    
    if (data.length > 0) {const finalObj = {}
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})

app.get('/getAnalisisAgua', async (req, res) => {
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
    
    if (data.length > 0) {const finalObj = {}
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database' })
    }
  })
})

app.get('/getEmboloViajero', async (req, res) => {
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

app.get('/getBombeoNeumatico', async (req, res) => {
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


app.get('/getBombeoHidraulico', async (req, res) => {
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

app.get('/getBombeoCavidades', async (req, res) => {
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

app.get('/getBombeoElectrocentrifugo', async (req, res) => {
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

app.get('/getBombeoMecanico', async (req, res) => {
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



app.get('/getFieldPressure', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    FECHA: { child: 'fecha' },
    QO: { child: 'Qo' },
    NP: { child: 'Np' },
    PWS: { child: 'Pws' },
    PR: { child: 'Pr' } 
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataCampo'

  getFieldPressure(transactionID, action, (data) => {
    const finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
        mainParent: {
          innerParent: [
          {}
          ]
        }
      })
    }
  })
})



app.get('/getWellPressure', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    FECHA: { child: 'fecha' },
    QO: { child: 'Qo' },
    NP: { child: 'Np' },
    PWS: { child: 'Pws' },
    PR: { child: 'Pr' } 
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataPozo'

  getWellPressure(transactionID, action, (data) => {
    const finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
        mainParent: {
          innerParent: [
          {}
          ]
        }
      })
    }
  })
})



app.get('/getWellAforos', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

 
  const map = {
    FECHA: { parent: 'historicoDeProduccion', child: 'fecha' }, 
    ESTRANGULADOR: { parent: 'historicoDeProduccion', child: 'estrangulado' },
    PTP: { parent: 'historicoDeProduccion', child: 'ptp' }, 
    TTP: { parent: 'historicoDeProduccion', child: 'ttp' }, 
    PBAJ: { parent: 'historicoDeProduccion', child: 'pbaj' }, 
    TBAJ: { parent: 'historicoDeProduccion', child: 'tbaj' }, 
    PSEP: { parent: 'historicoDeProduccion', child: 'psep' },
    TSEP: { parent: 'historicoDeProduccion', child: 'tsep' }, 
    QL: { parent: 'historicoDeProduccion', child: 'ql' }, 
    QO: { parent: 'historicoDeProduccion', child: 'qo'},
    QG: { parent: 'historicoDeProduccion', child: 'qg' }, 
    QW: { parent: 'historicoDeProduccion', child: 'qw' }, 
    RGA: { parent: 'historicoDeProduccion', child: 'rga' },
    SALINIDAD: { parent: 'historicoDeProduccion', child: 'salinidad'},
    PH: { parent: 'historicoDeProduccion', child: 'ph'},
  }

  getWellAforos(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        if (map[key]) {
          const { parent, child } = map[key]
          objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
        }
      })   
      res.json(finalObj)
    }
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})


app.get('/getWellProduccion', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'

  
  const map = {
    Fecha: { child: 'fecha' },
    Dias: { child: 'dias' },
    QO: { child: 'qo' },
    QW: { child: 'qw' },
    QG_CAL: { child: 'qg' },
    QGL: { child: 'qgl' },
    NP: { child: 'np' },
    WP: { child: 'wp' },
    GP: { child: 'gp' },
    GI: { child: 'gi' },
    RGA: { child: 'rga' },
    FW_FRACTION: { child: 'fw' },
    POZOS_PROD_ACTIVOS: { child: 'pozosProdActivos' }, 
  }

  const mainParent = 'historicoDeProduccion'
  const innerParent = 'produccionData'

  getWellProduccion(transactionID, action, (data) => {
    const finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
    else {
      res.json({ err: 'No value found in database'  })
    }
  })
})

app.get('/getWellImages', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  getWellImages(transactionID, action, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionBase', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    OBJETIVO: { parent: 'objetivoYAlcancesIntervencion', child: 'objetivo' }, 
    ALCANCES: { parent: 'objetivoYAlcancesIntervencion', child: 'alcances' },
    TIPO_DE_INTERVENCIONES: { parent: 'objetivoYAlcancesIntervencion', child: 'tipoDeIntervenciones' }, 
  }

  getInterventionBase(transactionID, action, (data) => {
    const finalObj = {}

    if (data[0]) {
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

app.get('/getInterventionEstimulacion', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    INTERVALO: { parent: 'propuestaEstimulacion', child: 'intervalo' }, 
    LONGITUD_DE_INTERVALO_A_TRATAR: { parent: 'propuestaEstimulacion', child: 'longitudDeIntervalo' }, 
    VOLUME_APAREJO: { parent: 'propuestaEstimulacion', child: 'volAparejo' }, 
    CAPACIDAD_TOTAL_DEL_POZO: { parent: 'propuestaEstimulacion', child: 'capacidadTotalDelPozo' }, 
    VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaEstimulacion', child: 'volumenPrecolchonN2' },
    VOLUMEN_SISTEMA_NO_REACTIVO: { parent: 'propuestaEstimulacion', child: 'volumenSistemaNoReativo' }, 
    VOLUMEN_SISTEM_REACTIVO: { parent: 'propuestaEstimulacion', child: 'volumenSistemaReactivo' }, 
    VOLUMEN_SISTEMA_DIVERGENTE: { parent: 'propuestaEstimulacion', child: 'volumenSistemaDivergente' }, 
    VOLUMEN_DISPLAZAMIENTO_LIQUIDO: { parent: 'propuestaEstimulacion', child: 'volumenDesplazamientoLiquido' }, 
    VOLUMEN_DESPLAZAMIENTO_N2: { parent: 'propuestaEstimulacion', child: 'volumenDesplazamientoN2' },
    VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaEstimulacion', child: 'volumenTotalDeLiquido' }, 
    VOLUMEN_DEL_SISTEMA_ACIDO_LIMPIEZA: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDelSistemaAcidoLimpieza' },
    VOLUMEN_DEL_SISTEMA_NO_ACIDO_LIMPIEZA: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDelSistemaNoAcidoLimpieza' }, 
    TIPO_DE_COLOCACION: { parent: 'resultadosSimulacionEstimulacion', child: 'tipoDeColocacion' },
    TIEMPO_DE_CONTACTO: { parent: 'resultadosSimulacionEstimulacion', child: 'tiempoDeContacto' }, 
    NUMERO_DE_ETAPAS: { parent: 'resultadosSimulacionEstimulacion', child: 'numeroDeEtapas' }, 
    VOLUMEN_DEL_SISTEMA_ACIDO: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDelSistemAcido' }, 
    VOLUMEN_DEL_SISTEMA_NO_ACIDO: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDelSistemNoAcido' }, 
    VOLUMEN_DE_DIVERGENTE: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDeDivergente' }, 
    VOLUMEN_DE_N2: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDeN2' },
    CALIDAD_DE_ESPUMA: { parent: 'resultadosSimulacionEstimulacion', child: 'calidadDeEspuma' }, 
    VOLUMEN_DE_PRECOLCHON_N2: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDePrecolchonN2' }, 
    VOLUMEN_DE_DESPLAZAMIENTO: { parent: 'resultadosSimulacionEstimulacion', child: 'volumenDeDesplazamiento' }, 
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

app.get('/getInterventionAcido', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    INTERVALO: { parent: 'propuestaAcido', child: 'intervalo' }, 
    LONGITUD_DE_INTERVALO_A_TRATAR: { parent: 'propuestaAcido', child: 'longitudDeIntervalo' }, 
    VOLUME_APAREJO: { parent: 'propuestaAcido', child: 'volAparejo' },
    CAPACIDAD_TOTAL_DEL_POZO: { parent: 'propuestaAcido', child: 'capacidadTotalDelPozo' }, 
    VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaAcido', child: 'volumenPrecolchonN2' }, 
    VOLUMEN_SISTEMA_NO_REACTIVO: { parent: 'propuestaAcido', child: 'volumenSistemaNoReativo' }, 
    VOLUMEN_SISTEM_REACTIVO: { parent: 'propuestaAcido', child: 'volumenSistemaReactivo' }, 
    VOLUMEN_SISTEMA_DIVERGENTE: { parent: 'propuestaAcido', child: 'volumenSistemaDivergente' },
    VOLUMEN_DISPLAZAMIENTO_LIQUIDO: { parent: 'propuestaAcido', child: 'volumenDesplazamientoLiquido' }, 
    VOLUMEN_DESPLAZAMIENTO_GEL_LINEAL: { parent: 'propuestaAcido', child: 'volumenDesplazamientoGelLineal' }, 
    MODULO_YOUNG_ARENA: { parent: 'propuestaAcido', child: 'moduloYoungArena' },
    MODULO_YOUNG_LUTITAS: { parent: 'propuestaAcido', child: 'moduloYoungLutitas' }, 
    RELAC_POISSON_ARENA: { parent: 'propuestaAcido', child: 'relacPoissonArena' }, 
    RELAC_POISSON_LUTITAS: { parent: 'propuestaAcido', child: 'relacPoissonLutitas' }, 
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


app.get('/getInterventionApuntalado', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    INTERVALO: { parent: 'propuestaApuntalado', child: 'intervalo' }, 
    LONGITUD_DE_INTERVALO_A_TRATAR: { parent: 'propuestaApuntalado', child: 'longitudDeIntervalo' }, 
    VOLUME_APAREJO: { parent: 'propuestaApuntalado', child: 'volAparejo' },
    CAPACIDAD_TOTAL_DEL_POZO: { parent: 'propuestaApuntalado', child: 'capacidadTotalDelPozo' }, 
    VOLUMEN_PRECOLCHON_N2: { parent: 'propuestaApuntalado', child: 'volumenPrecolchonN2' }, 
    VOLUMEN_DE_APUNTALANTE: { parent: 'propuestaApuntalado', child: 'volumenDeApuntalante' }, 
    VOLUMEN_DE_GEL_DE_FRACTURA: { parent: 'propuestaApuntalado', child: 'volumenDeGelDeFractura' }, 
    VOLUMEN_DESPLAZAMIENTO: { parent: 'propuestaApuntalado', child: 'volumenDesplazamiento' },
    VOLUMEN_TOTAL_DE_LIQUIDO: { parent: 'propuestaApuntalado', child: 'volumenTotalDeLiquido' }, 
    MODULO_YOUNG_ARENA: { parent: 'propuestaApuntalado', child: 'moduloYoungArena' },
    MODULO_YOUNG_LUTITAS: { parent: 'propuestaApuntalado', child: 'moduloYoungLutitas' }, 
    RELAC_POISSON_ARENA: { parent: 'propuestaApuntalado', child: 'relacPoissonArena' }, 
    RELAC_POISSON_LUTITAS: { parent: 'propuestaApuntalado', child: 'relacPoissonLutitas' }, 
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
app.get('/getLabTest', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    TIPO_DE_ANALISIS: { child: 'type' }, 
    FECHA_DE_MUESTREO: { child: 'fechnaMuesetreo' }, 
    FECHA_DE_PRUEBA: { child: 'fechaPrueba' }, 
    COMPANIA: { child: 'compania' }, 
    PERSONAL_DE_PEMEX_QUE_SUPERVISO: { child: 'superviso' }, 
    OBSERVACIONES: { child: 'obervaciones' },
  }

  const mainParent = 'pruebasDeLaboratorio'
  const innerParent = 'pruebasDeLaboratorioData'

  getLabTest(transactionID, action, (data) => {
    const finalObj = {}
    data.forEach((d, index) => {
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
  })
})

app.get('/getCedulaEstimulacion', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
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
  }

  const mainParent = 'propuestaEstimulacion'
  const innerParent = 'cedulaData'

  getCedulaEstimulacion(transactionID, action, (data) => {
    let finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
    }
    else {
      finalObj = {
        'propuestaEstimulacion': {
          "cedulaData": [
            {}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


app.get('/getCedulaAcido', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'



  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
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
  }

  const mainParent = 'propuestaAcido'
  const innerParent = 'cedulaData'

  getCedulaAcido(transactionID, action, (data) => {
    let finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
    }
    else {
      finalObj = {
        'propuestaAcido': {
          "cedulaData": [
            {}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


app.get('/getCedulaApuntalado', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'



  const map = {
    ETAPA: { child: 'etapa' }, 
    SISTEMA: { child: 'sistema' }, 
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
  }

  const mainParent = 'propuestaApuntalado'
  const innerParent = 'cedulaData'

  getCedulaApuntalado(transactionID, action, (data) => {
    let finalObj = {}
    if (data.length > 0) {
      data.forEach((d, index) => {
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
    }
    else {
      finalObj = {
        'propuestaApuntalado': {
          "cedulaData": [
            {}
          ]
        }
      }
    }

    res.json(finalObj)
  })
})


app.get('/getLabResults', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    SISTEMA: { child: 'sistem' }, 
    TIEMPO_DE_ROMPIMIENTO: { child: 'tiempoRompimiento' }, 
    INTERFASE: { child: 'interfase' }, 
    SOLIDOS_DESPUES_DE_FILTRAR: { child: 'solidosFiltrar' }, 
    RESULTADO: { child: 'resultado' },
  }

  const mainParent = 'pruebasDeLaboratorio'
  const innerParent = 'pruebasDeLaboratorioData'

  getLabResults(transactionID, action, (data) => {
    const finalObj = {}
    console.log(data)

    data = [data[0], data[0]]

    data.forEach((d, index) => {
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
  })
})


app.get('/getLabAcido', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    CONTENIDO_DE_ACEITE: { child: 'contenidoDeAceite' }, 
    CONTENIDO_DE_AGUA: { child: 'contenidoDeAgua' }, 
    CONTENIDO_DE_EMULSION: { child: 'contenidoDeEmulsion' },
    CONTENIDO_DE_SOLIDOS: { child: 'contenidoDeSolidos' },
    TIPO_DE_SOLIDOS: { child: 'tipoDeSolidos' },
    DENSIDAD_DEL_ACEITE: { child: 'densidadDelAceite' },
    DENSIDAD_DEL_AGUA: { child: 'densidadDelAgua' },
    DENSIDAD_DE_LA_EMULSION: { child: 'densidadDeLaEmulsion' },
    CONTENIDO_DE_ASFALTENOS: { child: 'contenidoDeAsfaltenos' },
    CONTENIDO_DE_PARAFINAS: { child: 'contenidoDeParafinas' },
    CONTENIDO_DE_RESINAS: { child: 'contenidoDeResinas' },
    INDICE_DE_ESTABILIDAD_COLOIDAL: { child: 'indiceDeEstabilidadColoidal' },
    INDICE_DE_ESTABILIDAD_DEL_AGUA: { child: 'indiceDeEstabilidadDelAgua' },
    PH: { child: 'pH' },
    SALINIDAD: { child: 'salinidad' },
    VISCOSIDAD_DEL_ACEITE: { child: 'viscosidadDelAceite' },
    SISTEMA_ACIDO_SOLUBILIDAD: { child: 'sistemaAcidoSolubilidad' },
    PESO_MUESTRA_INICIAL: { child: 'pesoMuestraInicial' },
    PESO_MUESTRA_FINAL: { child: 'pesoMuestraFinal' },
    SOLUBILIDAD: { child: 'solubilidad' },
    SISTEMA_ACIDO_GRABADO_DE_NUCLEOS: { child: 'sistemaAcidoGrabadoDeNucleos' },
    NUCLEO_DE_FORMACION: { child: 'nucleoDeFormacion' },
    GRABADO: { child: 'grabado' },
    TIPO_DE_GEL_LINEAL: { child: 'tipoDeGelLineal' },
    VISCOSIDAD_DEL_GEL_LINEAL: { child: 'viscosidadDelGelLineal' },
    TIEMPO_DE_RETICULACION: { child: 'tiempoDeReticulacion' },
    PH_GEL_LINEAL: { child: 'phGelLineal' },
    TIEMPO_DE_ROMPEDOR_DEL_GEL: { child: 'tiempoDeRompedorDelGel' },
  }

  const mainParent = 'pruebasDeLaboratorio'
  const innerParent = 'pruebasDeLaboratorioData'

  getLabAcido(transactionID, action, (data) => {
    const finalObj = {}
    data.forEach((d, index) => {
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
  })
})


app.get('/getLabApuntalado', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  const map = {
    CONTENIDO_DE_ACEITE: { child: 'contenidoDeAceite' }, 
    CONTENIDO_DE_AGUA: { child: 'contenidoDeAgua' }, 
    CONTENIDO_DE_EMULSION: { child: 'contenidoDeEmulsion' }, 
    CONTENIDO_DE_SOLIDOS: { child: 'contenidoDeSolidos' }, 
    TIPO_DE_SOLIDOS: { child: 'tipoDeSolidos' },
    DENSIDAD_DEL_ACEITE: { child: 'densidadDelAceite' }, 
    DENSIDAD_DEL_AGUA: { child: 'densidadDelAgua' }, 
    DENSIDAD_DE_LA_EMULSION: { child: 'densidadDeLaEmulsion' }, 
    CONTENIDO_DE_ASFALTENOS: { child: 'contenidoDeAsfaltenos' }, 
    CONTENIDO_DE_PARAFINAS: { child: 'contenidoDeParafinas' }, 
    CONTENIDO_DE_RESINAS: { child: 'contenidoDeResinas' }, 
    INDICE_DE_ESTABILIDAD_COLOIDAL: { child: 'indiceDeEstabilidadColoidal' }, 
    INDICE_DE_ESTABILIDAD_DEL_AGUA: { child: 'indiceDeEstabilidadDelAgua' }, 
    PH: { child: 'pH' }, 
    SALINIDAD: { child: 'salinidad' }, 
    VISCOSIDAD_DEL_ACEITE: { child: 'viscosidadDelAceite' }, 
    TIPO_DE_GEL_LINEAL: { child: 'tipoDeGelLineal' }, 
    VISCOSIDAD_DEL_GEL_LINEAL: { child: 'viscosidadDelGelLineal' }, 
    TIEMPO_DE_RETICULACION: { child: 'tiempoDeReticulacion' }, 
    PH_GEL_LINEAL: { child: 'phGelLineal' }, 
    TIEMPO_DE_ROMPEDOR_DEL_GEL: { child: 'tiempoDeRompedorDelGel' }, 
    TAMANO_DEL_APUNTALANTE: { child: 'tamanoDelApuntalante' }, 
    GRAVEDAD_ESPECIFICA: { child: 'gravedadEspecifica' }, 
    ESFERICIDAD: { child: 'esfericidad' }, 
    REDONDEO: { child: 'redondeo' }, 
    TURBIDEZ: { child: 'turbidez' }, 
    RESISTENCIA: { child: 'resistencia' }, 
    PRUEBA_DE_SOLUBILIDAD_CON_ACIDO: { child: 'pruebaDeSolubilidadConAcido' },
  }

  const mainParent = 'pruebasDeLaboratorio'
  const innerParent = 'pruebasDeLaboratorioData'

  getLabApuntalado(transactionID, action, (data) => {
    const finalObj = {}
    data.forEach((d, index) => {
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
  })
})


app.get('/getCosts', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  getCosts(transactionID, action, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionImage', async (req, res) => {
  let { transactionID, saved } = req.query

  let action = saved ? 'loadSave' : 'loadTransaction'


  getInterventionImage(transactionID, action, (data) => {
    res.json(data)
  })
})


app.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default app
