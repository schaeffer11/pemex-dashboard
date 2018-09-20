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
            getWellAForos, getWellProduccion, getWellImages, getInterventionBase, 
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


app.get('/getSaveID', (req, res) => {
    let { userID, wellID } = req.query
    
    connection.query(`SELECT * FROM SavedInputs WHERE USER_ID = ? AND WELL_FORMACION_ID = ?`, 
      [userID, wellID], (err, results) => {

        console.log('resultsss', userID, wellID, results)
        res.json({ transactionID: results[0].TRANSACTION_ID })
    })
})


app.post('/well', async (req, res) => {
  const test = await createWell(req.body, 'submit')
  res.json({ well: 'submitted' })
})


app.post('/wellSave', async (req, res) => {
  const test = await createWell(req.body, 'save')
  res.json({ well: 'submitted' })
})

app.get('/getFields', async (req, res) => {
  let { transactionID } = req.query
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
    PVT_REPRESENTATIVO: { parent: 'fichaTecnicaDelCampo', child: ''},
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
  getFields(transactionID, (data) => {
    const finalObj = {}
    Object.keys(data[0]).forEach(key => {
      if (map[key]) {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
      }
    })
    res.json(finalObj)
  })
})

app.get('/getWell', async (req, res) => {
  let { transactionID } = req.query

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

  getWell(transactionID, (data) => {
    const finalObj = {}
    console.log(data)
    Object.keys(data[0]).forEach(key => {
      if (map[key]) {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
      }
    })
    res.json(finalObj)
  })
})


app.get('/getHistIntervenciones', async (req, res) => {
  let { transactionID } = req.query

  const map = {
    DATE: { child: 'fecha' },
    DESCRIPTION: { child: 'intervenciones' },
  }

  const mainParent = 'fichaTecnicaDelPozo'
  const innerParent = 'historialIntervencionesData'

  getHistIntervenciones(transactionID, (data) => {
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


app.get('/getLayer', async (req, res) => {
  let { transactionID } = req.query

  const map = {
    INTERVALO: { child: 'interval' },
    CIMA_MD: { child: 'cimaMD'},
    BASE_MD: { child: 'baseMD'},
    CIMA_MV: { child: 'cimaMV'},
    BASE_MV: { child: 'baseMD' },
    V_ARC: { child: 'vArc'},
    POROSITY: { child: 'porosity'},
    SW: { child: 'sw'},
    DENS: { child: 'dens'},
    RESIS: { child: 'resis'},
    PERMEABILIDAD: { child: 'perm'},
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'layerData'

  getLayer(transactionID, (data) => {
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


app.get('/getMudLoss', async (req, res) => {
  let { transactionID } = req.query

  const map = {
    CIMA_MD: { child: 'cimaMD' },
    LODO_PERDIDO: { child: 'lodoPerdido' },
    DENSIDAD: { child: 'densidad' },
    length: { child: 'length' },
  }

  const mainParent = 'evaluacionPetrofisica'
  const innerParent = 'mudLossData'

  getMudLoss(transactionID, (data) => {
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

app.get('/getMecanico', async (req, res) => {
  let { transactionID } = req.query

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

  getMecanico(transactionID, (data) => {
    const finalObj = {}
    Object.keys(data[0]).forEach(key => {
      if (map[key]) {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
      }
    })
    res.json(finalObj)
  })
})

app.get('/getAnalisisAgua', async (req, res) => {
  let { transactionID } = req.query
 
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

  getAnalisisAgua(transactionID, (data) => {
    const finalObj = {}
    Object.keys(data[0]).forEach(key => {
      if (map[key]) {
        const { parent, child } = map[key]
        objectPath.set(finalObj, `${parent}.${child}`, data[0][key])
      }
    })
    res.json(finalObj)
  })
})

app.get('/getEmboloViajero', async (req, res) => {
  let { transactionID } = req.query

 
  const map = {
    PRESION_DE_CABEZA: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeCabeza' },
    PRESION_DE_LINEA_O_DE_SEPARADOR: { parent: 'sistemasArtificialesDeProduccion', child: 'presionDeLineaODeSeparador' },
    NUMERO_DE_DESCARGAS_O_CIRCLOS: { parent: 'sistemasArtificialesDeProduccion', child: 'numeroDeDescargasOCiclosEV' },
    VOLUMEN_DESPLAZADO_POR_CIRCLO: { parent: 'sistemasArtificialesDeProduccion', child: 'volumenDesplazadoPorCircloEV' },
  }

  getEmboloViajero(transactionID, (data) => {
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

app.get('/getBombeoNeumatico', async (req, res) => {
  let { transactionID } = req.query
 
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

  getBombeoNeumatico(transactionID, (data) => {
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


app.get('/getBombeoHidraulico', async (req, res) => {
  let { transactionID } = req.query

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

  getBombeoHidraulico(transactionID, (data) => {
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

app.get('/getBombeoCavidades', async (req, res) => {
  let { transactionID } = req.query

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



  getBombeoCavidades(transactionID, (data) => {
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

app.get('/getBombeoElectrocentrifugo', async (req, res) => {
  let { transactionID } = req.query

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

  getBombeoElectrocentrifugo(transactionID, (data) => {
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

app.get('/getBombeoMecanico', async (req, res) => {
  let { transactionID } = req.query

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

  getBombeoMecanico(transactionID, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        console.log(key)
        if (map[key]) {
          console.log(map[key])
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



app.get('/getFieldPressure', async (req, res) => {
  let { transactionID } = req.query

  const map = {
    FECHA: { child: 'fecha' },
    QO: { child: 'Qo' },
    NP: { child: 'Np' },
    PWS: { child: 'Pws' },
    PR: { child: 'Pr' } 
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataCampo'

  getFieldPressure(transactionID, (data) => {
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


app.get('/getWellPressure', async (req, res) => {
  let { transactionID } = req.query

  const map = {
    FECHA: { child: 'fecha' },
    QO: { child: 'Qo' },
    NP: { child: 'Np' },
    PWS: { child: 'Pws' },
    PR: { child: 'Pr' } 
  }

  const mainParent = 'historicoDePresion'
  const innerParent = 'presionDataPozo'

  getWellPressure(transactionID, (data) => {
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


app.get('/getWellAforos', async (req, res) => {
  let { transactionID } = req.query
 
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

  getWellAForos(transactionID, (data) => {
    const finalObj = {}

    if (data[0]) {
      Object.keys(data[0]).forEach(key => {
        console.log(key)
        if (map[key]) {
          console.log(map[key])
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

app.get('/getWellProduccion', async (req, res) => {
  let { transactionID } = req.query
  
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

  getWellProduccion(transactionID, (data) => {
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

app.get('/getWellImages', async (req, res) => {
  let { transactionID } = req.query

  getWellImages(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionBase', async (req, res) => {
  let { transactionID } = req.query

  getInterventionBase(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionEstimulacion', async (req, res) => {
  let { transactionID } = req.query

  getInterventionEsimulacion(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionAcido', async (req, res) => {
  let { transactionID } = req.query

  getInterventionAcido(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionApuntalado', async (req, res) => {
  let { transactionID } = req.query

  getInterventionApuntalado(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getLabTest', async (req, res) => {
  let { transactionID } = req.query

  getLabTest(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getCedulaEstimulacion', async (req, res) => {
  let { transactionID } = req.query

  getCedulaEstimulacion(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getCedulaAcido', async (req, res) => {
  let { transactionID } = req.query

  getCedulaAcido(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getCedulaApuntalado', async (req, res) => {
  let { transactionID } = req.query

  getCedulaApuntalado(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getLabResults', async (req, res) => {
  let { transactionID } = req.query

  getLabResults(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getLabAcido', async (req, res) => {
  let { transactionID } = req.query

  getLabAcido(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getLabApuntalado', async (req, res) => {
  let { transactionID } = req.query

  getLabApuntalado(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getCosts', async (req, res) => {
  let { transactionID } = req.query

  getCosts(transactionID, (data) => {
    res.json(data)
  })
})

app.get('/getInterventionImage', async (req, res) => {
  let { transactionID } = req.query

  getInterventionImage(transactionID, (data) => {
    res.json(data)
  })
})


app.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default app
