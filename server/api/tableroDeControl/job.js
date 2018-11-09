import { Router } from 'express'
import db from '../../lib/db'
import appConfig from '../../../app-config.js'
// import path from 'path'
// import fs from 'fs'
// import objectPath from 'object-path'


const connection = db.getConnection(appConfig.users.database)
const router = Router()


router.get('/getEstCostData', (req, res) => {
  let { transactionID } = req.query

  let query = `
SELECT * FROM IntervencionesEstimatedCosts c
JOIN CostMap cm on c.ITEM = cm.COST_ID
WHERE TRANSACTION_ID = ?`

  console.log('testing', transactionID)
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
  else { 
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
  let { transactionID, type } = req.query
  
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT * FROM ResultsEstimulacions re
      JOIN Results r ON re.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE re.PROPUESTA_ID = ?`
  }
  else if (type === 'Acido') {
    query = `
      SELECT * FROM ResultsAcido ra
      JOIN Results r ON ra.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE ra.PROPUESTA_ID = ?`
  }
  else {
    query = `
      SELECT * FROM ResultsApuntalado rap
      JOIN Results r ON rap.INTERVENTION_ID = r.INTERVENCIONES_ID
      WHERE rap.PROPUESTA_ID = ?`
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

router.get('/getVolumeData', (req, res) => {
  let { transactionID, type } = req.query
  let query 

  if (type === 'Estimulacion') {
    query = `
      SELECT 
        VOLUMEN_SISTEMA_NO_REACTIVO,
        VOLUMEN_SISTEMA_REACTIVO,
        VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO,
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
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO,
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

  console.log(query)

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
            type: i.TIPO_DE_ANALISIS,
            fechaMuestreo: i.FECHA_DE_MUESTREO,
            fechaPrueba: i.FECHA_DE_PRUEBA,
            compania: i.COMPANIA,
            superviso: i.PERSONAL_DE_PEMEX_QUE_SUPERVISO,
          }
        })
        res.json(results)
      }
    })
})






export default router