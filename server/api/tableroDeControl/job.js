import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
import moment from 'moment'
import { handleImageResponse } from '../api';
import { getAuthorization } from '../../middleware';
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()
router.use(getAuthorization)


router.get('/getJobData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM Intervenciones
WHERE TRANSACTION_ID = ?`

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

router.get('/getEstCostData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM IntervencionesEstimatedCosts c
JOIN CostMap cm on c.ITEM = cm.COST_ID
WHERE TRANSACTION_ID = ?`

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

router.get('/getEstIncData', (req, res) => {
  let { transactionID, type } = req.query

  if (type === 'Estimulacion') {
    type = `IntervencionesEstimulacions`
  }
  else if (type === 'Acido') {
    type = 'IntervencionesAcido'
  }
  else if (type === 'Apuntalado') {
    type = `IntervencionesApuntalado`
  }
  else {
    type = `IntervencionesTermico`
  }



  let query = 

`select r.TRANSACTION_ID, tr.COMPANY, QO_RESULT, QW_RESULT, QG_RESULT, EST_INC_GASTO_COMPROMISO_QO, EST_INC_QW, EST_INC_GASTO_COMPROMISO_QG
from Results r
JOIN ?? ia ON r.PROPUESTA_ID = ia.TRANSACTION_ID
 JOIN FieldWellMapping fwm ON ia.WELL_FORMACION_ID = fwm.WELL_FORMACION_ID
 JOIN Transactions t ON ia.TRANSACTION_ID = t.TRANSACTION_ID
 JOIN TransactionsResults tr on tr.PROPUESTA_ID = ia.TRANSACTION_ID
WHERE r.PROPUESTA_ID = ?`
 

  connection.query(query, [type, transactionID], (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        res.json(results)
      }
    })
})


router.get('/getResultsImages', (req, res) => {
  const { transactionID } = req.query
  const query = `
    SELECT * FROM ResultsImages WHERE PROPUESTA_ID = ?
  `
  connection.query(query, [transactionID], async (err, results) => {
    if (err) {
      return res.json({})
    }
    const images = await handleImageResponse(results)
    res.json(images)
  })
})

router.get('/getCostData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM ResultsCosts c
JOIN CostMap cm on c.COST_ID = cm.COST_ID
WHERE PROPUESTA_ID = ?`

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

router.get('/getCedula', (req, res) => {
  let { transactionID, type } = req.query

  let query

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM IntervencionesCedulaEstimulacion
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Acido') {
    query =`
      SELECT * FROM IntervencionesCedulaAcido
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Apuntalado') {
    query = `
      SELECT * FROM IntervencionesCedulaApuntalado
      WHERE TRANSACTION_ID = ?`
  }
  else {
    query = `
    SELECT * FROM IntervencionesCedulaTermico
    WHERE TRANSACTION_ID = ?`
  }

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        if (type === 'Estimulacion') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              volLiquid: i.VOL_LIQUID,
              gastoLiqudo: i.GASTO_LIQUIDO,
              relN2Liq: i. REL_N2_LIQ,
              calidad: i.CALIDAD,
              gastoEnFondo: i.GASTO_EN_FONDO,
              gastoN2: i.GASTO_N2,
              volN2: i.VOL_N2,
              volLiquidoAcum: i.VOL_LIQUIDO_ACUM,
              volN2Acum: i.VOL_N2_ACUM,
              tiempo: i.TIEMPO
            }
          })
        }
        else if (type === 'Acido') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              tipoDeApuntalante: i.TIPO_DE_APUNTALANTE,
              concentraciDeApuntalante: i.CONCENTRACION_DE_APUNTALANTE,
              volLiquid: i.VOL_LIQUID,
              gastoLiqudo: i.GASTO_LIQUIDO,
              relN2Liq: i.REL_N2_LIQ,
              calidad: i.CALIDAD,
              gastoEnFondo: i.GASTO_EN_FONDO,
              gastoN2: i.GASTO_N2,
              volN2: i.VOL_N2,
              volLiquidoAcum: i.VOL_LIQUIDO_ACUM,
              volN2Acum: i.VOL_N2_ACUM,
              tiempo: i.TIEMPO,      
            }
          })

        }
        else if (type === 'Apuntalado') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              tipoDeFluido: i.TIPO_DE_FLUIDO,
              tipoDeApuntalante: i.TIPO_DE_APUNTALANTE,
              volLiquido: i.VOL_LIQUIDO,
              volLechada: i.VOL_LECHADA,
              gastoSuperficie: i.GASTO_EN_SUPERFICIE,
              gastoN2Superficie: i.GASTO_N2_SUPERFICIE,
              gastoEnFondo: i.GASTO_TOTAL_FONDO,
              calidadN2Fondo: i.CALIDAD_N2,
              volEspumaFondo: i.VOL_ESPUMA_FONDO,
              concentracionApuntalanteSuperficie: i.CONCENTRACION_APUNTALANTE_SUPERFICIE,
              concentracionApuntalanteFondo: i.CONCENTRACION_APUNTALANTE_FONDO,
              apuntalanteAcumulado: i.APUNTALANTE_ACUMULADO,
              tiempo: i.TIEMPO,
            }
          })
        }
        else {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              actividad: i.ACTIVIDAD,
              descripcion: i.DESCRIPCION,
              justificacion: i.JUSTIFICACION,    
            }
          })
        }

        res.json(results)
      }
    })
})

router.get('/getCedulaResults', (req, res) => {
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM ResultsCedulaEstimulacion
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM ResultsCedulaAcido
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Apuntalado') {
    query = `
      SELECT * FROM ResultsCedulaApuntalado
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Termico') { 
    query =`
      SELECT * FROM ResultsCedulaTermico
      WHERE PROPUESTA_ID = ?`
  }

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        if (type === 'Estimulacion') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              volLiquid: i.VOL_LIQUID,
              gastoLiqudo: i.GASTO_LIQUIDO,
              relN2Liq: i. REL_N2_LIQ,
              calidad: i.CALIDAD,
              gastoEnFondo: i.GASTO_EN_FONDO,
              gastoN2: i.GASTO_N2,
              volN2: i.VOL_N2,
              volLiquidoAcum: i.VOL_LIQUIDO_ACUM,
              volN2Acum: i.VOL_N2_ACUM,
              tiempo: i.TIEMPO
            }
          })
        }
        else if (type === 'Acido') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              tipoDeApuntalante: i.TIPO_DE_APUNTALANTE,
              concentraciDeApuntalante: i.CONCENTRACION_DE_APUNTALANTE,
              volLiquid: i.VOL_LIQUID,
              gastoLiqudo: i.GASTO_LIQUIDO,
              relN2Liq: i.REL_N2_LIQ,
              calidad: i.CALIDAD,
              gastoEnFondo: i.GASTO_EN_FONDO,
              gastoN2: i.GASTO_N2,
              volN2: i.VOL_N2,
              volLiquidoAcum: i.VOL_LIQUIDO_ACUM,
              volN2Acum: i.VOL_N2_ACUM,
              tiempo: i.TIEMPO,      
            }
          })
        }
        else if (type === 'Apuntalado') {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              sistema: i.SISTEMA,
              nombreComercial: i.NOMBRE_COMERCIAL,
              tipoDeFluido: i.TIPO_DE_FLUIDO,
              tipoDeApuntalante: i.TIPO_DE_APUNTALANTE,
              volLiquido: i.VOL_LIQUIDO,
              volLechada: i.VOL_LECHADA,
              gastoSuperficie: i.GASTO_EN_SUPERFICIE,
              gastoN2Superficie: i.GASTO_N2_SUPERFICIE,
              gastoEnFondo: i.GASTO_TOTAL_FONDO,
              calidadN2Fondo: i.CALIDAD_N2,
              volEspumaFondo: i.VOL_ESPUMA_FONDO,
              concentracionApuntalanteSuperficie: i.CONCENTRACION_APUNTALANTE_SUPERFICIE,
              concentracionApuntalanteFondo: i.CONCENTRACION_APUNTALANTE_FONDO,
              apuntalanteAcumulado: i.APUNTALANTE_ACUMULADO,
              tiempo: i.TIEMPO,
            }
          })
        }
        else {
          results = results.map(i => {
            return {
              etapa: i.ETAPA,
              actividad: i.ACTIVIDAD,
              descripcion: i.DESCRIPCION,
              justificacion: i.JUSTIFICACION,    
            }
          })
        }

        res.json(results)
      }
    })
})

router.get('/getInterventionData', (req, res) => {
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM IntervencionesEstimulacions
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM IntervencionesAcido
      WHERE TRANSACTION_ID = ?`
  }
  else {
    query = `
      SELECT * FROM IntervencionesApuntalado
      WHERE TRANSACTION_ID = ?`
  }

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


router.get('/getInterventionResultsData', (req, res) => {
  let { transactionID, type, shouldMapData } = req.query
  
  let query 
  let map
  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM ResultsEstimulacions re
      JOIN Results r ON re.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE re.PROPUESTA_ID = ?`
    map = {
      TIPO_DE_ESTIMULACION: 'tipoDeEstimulacion',
      VOLUMEN_PRECOLCHON_N2: 'volumenPrecolchonN2',
      VOLUMEN_SISTEMA_NO_REACTIVO: 'volumenSistemaNoReativo',
      VOLUMEN_SISTEMA_REACTIVO: 'volumenSistemaReactivo',
      VOLUMEN_SISTEMA_DIVERGENTE: 'volumenSistemaDivergente',
      VOLUMEN_DESPLAZAMIENTO_LIQUIDO: 'volumenDesplazamientoLiquido',
      VOLUMEN_DESPLAZAMIENTO_N2: 'volumenDesplazamientoN2',
      VOLUMEN_TOTAL_DE_LIQUIDO: 'volumenTotalDeLiquido',
      TIPO_DE_COLOCACION: 'tipoDeColocacion',
      TIEMPO_DE_CONTACTO: 'tiempoDeContacto',
      PENETRACION_RADIAL: 'penetracionRadial',
      LONGITUD_DE_AGUJERO_DE_GUSANO: 'longitudDeAgujeroDeGusano',
    }
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM ResultsAcido ra
      JOIN Results r ON ra.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE ra.PROPUESTA_ID = ?`

      map = {
        VOLUMEN_PRECOLCHON_N2: 'volumenPrecolchonN2',
        VOLUMEN_SISTEMA_NO_REACTIVO: 'volumenSistemaNoReativo',
        VOLUMEN_SISTEMA_REACTIVO: 'volumenSistemaReactivo',
        VOLUMEN_SISTEMA_DIVERGENTE: 'volumenSistemaDivergente',
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO: 'volumenDesplazamientoLiquido',
        VOLUMEN_DESPLAZAMIENTO_N2: 'volumenDesplazamientoN2',
        VOLUMEN_TOTAL_DE_LIQUIDO: 'volumenTotalDeLiquido',
        MODULO_YOUNG_ARENA: 'moduloYoungArena',
        MODULO_YOUNG_LUTITAS: 'moduloYoungLutitas',
        RELAC_POISSON_ARENA: 'relacPoissonArena',
        RELAC_POISSON_LUTITAS: 'relacPoissonLutatas',
        GRADIENTE_DE_FRACTURA: 'gradienteDeFractura',
        DENSIDAD_DE_DISPAROS: 'densidadDeDisparos',
        DIAMETRO_DE_DISPAROS: 'diametroDeDisparos',
        LONGITUD_TOTAL: 'longitudTotal',
        LONGITUD_EFECTIVA_GRABADA: 'longitudEfectivaGrabada',
        ALTURA_GRABADA: 'alturaGrabada',
        ANCHO_PROMEDIO: 'anchoPromedio',
        CONCENTRACION_DEL_ACIDO: 'concentracionDelAcido',
        CONDUCTIVIDAD: 'conductividad',
        FCD: 'fcd',
        PRESION_NETA: 'presionNeta',
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA: 'eficienciaDeFluidoDeFractura',
      }
  }
  else if (type === 'Apuntalado') {
    query = `
      SELECT * FROM ResultsApuntalado rap
      JOIN Results r ON rap.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE rap.PROPUESTA_ID = ?`
    map = {
      VOLUMEN_PRECOLCHON_APUNTALANTE: 'volumenPrecolchonN2',
      VOLUMEN_APUNTALANTE: 'volumenApuntalante',
      VOLUMEN_DESPLAZAMIENTO_LIQUIDO: 'volumenDesplazamientoLiquido',
      VOLUMEN_TOTAL_DE_LIQUIDO: 'volumenTotalDeLiquido',
      VOLUMEN_GEL_DE_FRACTURA: 'volumenGelFractura',
      MODULO_YOUNG_ARENA: 'moduloYoungArena',
      MODULO_YOUNG_LUTITAS: 'moduloYoungLutitas',
      RELAC_POISSON_ARENA: 'relacPoissonArena',
      RELAC_POISSON_LUTITAS: 'relacPoissonLutatas',
      GRADIENTE_DE_FRACTURA: 'gradienteDeFractura',
      DENSIDAD_DE_DISPAROS: 'densidadDeDisparos',
      DIAMETRO_DE_DISPAROS: 'diametroDeDisparos',
      LONGITUD_APUNTALADA: 'longitudApuntalada',
      ALTURA_TOTAL_DE_FRACTURA: 'alturaTotalDeFractura',
      ANCHO_PROMEDIO: 'anchoPromedio',
      CONCENTRACION_AREAL: 'concentractionAreal',
      CONDUCTIVIDAD: 'conductividad',
      FCD: 'fcd',
      PRESION_NETA: 'presionNeta',
      EFICIENCIA_DE_FLUIDO_DE_FRACTURA: 'eficienciaDeFluidoDeFractura',
    }
  } else if (type === 'Termico') {
    query = `
      SELECT * FROM ResultsTermico rap
      JOIN Results r ON rap.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE rap.PROPUESTA_ID = ?`
    map = {
    VOLUMEN_VAPOR_INYECTAR: 'volumenVapor',
    CALIDAD: 'calidad',
    GASTO_INYECCION: 'gastoInyeccion',
    PRESION_MAXIMA_SALIDA_GENERADOR: 'presionMaximaSalidaGenerador',
    TEMPERATURA_MAXIMA_GENERADOR: 'temperaturaMaximaGenerador',
    }
  }
  map = {
    QO_RESULT: 'qo',
    QG_RESULT: 'qg',
    QW_RESULT: 'qw',
    ...map
  }
  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {
        if (shouldMapData) {
          const final = {}
          Object.keys(results[0]).forEach((key) => {
            final[map[key]] = results[0][key]
          })
          res.json(final)
        } else {
          res.json(results)
        }
      }
    })
})

router.get('/getVolumeData', (req, res) => {
  let { transactionID, type } = req.query
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT 
        VOLUMEN_SISTEMA_NO_REACTIVO,
        VOLUMEN_SISTEMA_REACTIVO,
        VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO
      FROM ResultsEstimulacions ie
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT 
        VOLUMEN_SISTEMA_NO_REACTIVO,
        VOLUMEN_SISTEMA_REACTIVO,
        VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO
      FROM ResultsAcido ie
      WHERE PROPUESTA_ID = ?`
  }
  else if (type === 'Apuntalado') {
    query = `
      SELECT 
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_TOTAL_DE_LIQUIDO,
        VOLUMEN_APUNTALANTE,
        VOLUMEN_GEL_DE_FRACTURA,
        VOLUMEN_PRECOLCHON_APUNTALANTE
      FROM ResultsApuntalado ie
      WHERE PROPUESTA_ID = ?`
  }
  else {
    query = `
      SELECT 
        VOLUMEN_VAPOR_INYECTAR
      FROM ResultsTermico ie
      WHERE PROPUESTA_ID = ?`
  }

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

router.get('/getEstimatedVolumeData', (req, res) => {
  let { transactionID, type } = req.query
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT 
        VOLUMEN_SISTEMA_NO_REACTIVO,
        VOLUMEN_SISTEMA_REACTIVO,
        VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO
      FROM IntervencionesEstimulacions ie
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT 
        VOLUMEN_SISTEMA_NO_REACTIVO,
        VOLUMEN_SISTEMA_REACTIVO,
        VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO
      FROM IntervencionesAcido ie
      WHERE TRANSACTION_ID = ?`
  }
  else if (type === 'Apuntalado') {
    query = `
      SELECT 
        VOLUMEN_DESPLAZAMIENTO_LIQUIDO,
        VOLUMEN_TOTAL_DE_LIQUIDO,
        VOLUMEN_APUNTALANTE,
        VOLUMEN_GEL_DE_FRACTURA,
        VOLUMEN_PRECOLCHON_APUNTALANTE
      FROM IntervencionesApuntalado ie
      WHERE TRANSACTION_ID = ?`
  }
  else {
    query = `
      SELECT 
        VOLUMEN_VAPOR_INYECTAR
      FROM IntervencionesTermico ie
      WHERE TRANSACTION_ID = ?`
  }

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



router.get('/getAforoData', (req, res) => {
  let { transactionID, type } = req.query
  
  let query =
`select FECHA, QO, QW, QG from WellAforos WHERE TRANSACTION_ID = ? AND Qo != -999
UNION
select FECHA, QO, QW, QG from ResultsAforos WHERE PROPUESTA_ID = ? AND Qo != -999
`

  console.log('monkmonkmonk', query, transactionID)
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



router.get('/getLabs', (req, res) => {
  let { transactionID } = req.query
  
  let query = `select * from IntervencionesLabTests where TRANSACTION_ID = ?`

  connection.query(query, transactionID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {

        results = results.map(i => {
          return {
            id: i.LAB_ID,
            type: i.TIPO_DE_ANALISIS,
            fechaMuestreo: i.FECHA_DE_MUESTREO,
            fechaPrueba: i.FECHA_DE_PRUEBA,
            compania: i.COMPANIA,
            superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
            observaciones: i.OBSERVACIONES
          }
        })

        res.json(results)
      }
    })
})


router.get('/getLabData', (req, res) => {
  let { labID, type } = req.query
  
  let query = `select 1 from Users limit 1`

  if (type === 'caracterizacionFisico') {
    query = `select * from IntervencionesLabTestsCaracterizacionFisico where LAB_ID = ?`
  }
  else if (type === 'pruebasDeCompatibilidad') {
    query = `select * from IntervencionesLabTestsPruebasDeCompatibilidad where LAB_ID = ?`
  }
  else if (type === 'pruebasDeGrabado') {
    query = `select * from IntervencionesLabTestsPruebasDeGrabado where LAB_ID = ?`
  }
  else if (type === 'pruebasDeSolubilidad') {
    query = `select * from IntervencionesLabTestsPruebasDeSolubilidad where LAB_ID = ?`
  }
  else if (type === 'pruebasGelDeFractura') {
    query = `select * from IntervencionesLabTestsPruebasGelDeFractura where LAB_ID = ?`
  }
  else if (type === 'pruebasParaApuntalante') {
    query = `select * from IntervencionesLabTestsPruebasParaApuntalante where LAB_ID = ?`
  }
  

  connection.query(query, labID, (err, results) => {
      console.log('comment err', err)

     if (err) {
        res.json({ success: false})
      }
      else {

        res.json(results)
      }
    })
})


router.get('/generalResults', (req, res) => {
  let { transactionID } = req.query  
  // const query = `select * from Results where PROPUESTA_ID = ?`

  const query = `select TransactionsResults.COMPANY, Results.* from TransactionsResults
                 inner join Results on TransactionsResults.PROPUESTA_ID = Results.PROPUESTA_ID
                 where Results.PROPUESTA_ID = ?`
  connection.query(query, transactionID, (err, results) => {
    console.log('comment err', err)
    if (err) {
      res.json({ success: false})
    } else {
      let final = {}
      if (results.length > 0) {
        const result = results[0]
        final = {
          company: result.COMPANY,
          fecha: moment(result.FECHA_INTERVENCION).format('YYYY-MM-DD'),
          justificacion: result.JUSTIFICACION_INTERVENCION,
          comentarios: result.COMENTARIOS_INTERVENCION,
        }
      }
      res.json(final)
    }
  })
})


export default router