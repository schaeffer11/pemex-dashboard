import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';


const INSERT_COSTS_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsCosts (
        COST_ID, INTERVENTION_ID, FECHA, COMPANY, COST_MNX, COST_DLS, MNXtoDLS, PROPUESTA_ID, TRANSACTION_ID) VALUES ?`,
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_AFOROS_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsAforos (
        WELL_FORMACION_ID, FECHA, TIEMPO, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH, PROPUESTA_ID, TRANSACTION_ID) VALUES 
        ?`,     
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_IMAGES_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsImages (
        WELL_FORMACION_ID, IMAGE_NAME, IMG_URL, PROPUESTA_ID, TRANSACTION_ID) VALUES
        ?`,
    loadSave: ``,
    loadTransaction: ``,
}


const INSERT_CEDULA_ESTIMULACION_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsCedulaEstimulacion (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, PROPUESTA_ID, TRANSACTION_ID) VALUES ?`,
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_CEDULA_ACIDO_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsCedulaAcido (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, PROPUESTA_ID, TRANSACTION_ID) VALUES ?`,
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_CEDULA_APUNTALADO_QUERY = {
    save: ``   ,
    submit: `INSERT INTO ResultsCedulaApuntalado (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, NOMBRE_COMERCIAL, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO, COMPANIA, PROPUESTA_ID, TRANSACTION_ID) VALUES ?`        ,
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_RESULTS_ESIMULACION_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsEstimulacions (
        INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ESTIMULACION,
        VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, 
        VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        PROPUESTA_ID, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`,     
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_RESULTS_ACIDO_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsAcido (
        INTERVENTION_ID, WELL_FORMACION_ID, VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, 
        VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DESPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA, MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA,
        RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_TOTAL, LONGITUD_EFECTIVA_GRABADA,
        ALTURA_GRABADA, ANCHO_PROMEDIO, CONCENTRACION_DEL_ACIDO, CONDUCTIVIDAD, FCD, PRESION_NETA,
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA, PROPUESTA_ID, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?)`,     
    loadSave: ``,
    loadTransaction: ``    
}

const INSERT_RESULTS_APUNTALADO_QUERY = {
    save: ``,
    submit: `INSERT INTO ResultsApuntalado (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEMA_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DESPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_APUNTALADA, ALTURA_TOTAL_DE_FRACTURA, ANCHO_PROMEDIO,
        CONCENTRACION_AREAL, CONDUCTIVIDAD, FCD, PRESION_NETA, EFICIENCIA_DE_FLUIDO_DE_FRACTURA,
        PROPUESTA_ID, TRANSACTION_ID) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`,     
    loadSave: ``,
    loadTransaction: ``    
}


const INSERT_TRANSACTION = {
    save: ``,
    submit: `INSERT INTO TransactionsResults (
        TRANSACTION_ID, PROPUESTA_ID, USER_ID, WELL_FORMACION_ID) VALUES
        (?, ?, ?, ?)`, 
}


const DUMMY_QUERY = 'SELECT(1) FROM Users LIMIT 1'


export const createResults = async (body, action, cb) => {
  console.log('im in results')
  const transactionID = Math.floor(Math.random() * 1000000000)
  const allKeys = Object.keys(body)
  const finalObj = {}

  for(let k of allKeys) {
    const innerObj = JSON.parse(body[k])
    const innerKeys = Object.keys(innerObj)

    // look for immediate images
    if (innerObj.img) {
      innerObj.imgName = [transactionID, innerObj.imgName].join('.')
      console.log('found image', k, innerObj.imgName)
      const buf = Buffer.from(innerObj.img, 'base64')
      const t = await addObject(buf, innerObj.imgName).catch(reason => console.log('something went wrong', reason))
      innerObj.img = t
      console.log('uploaded img', t, k)
    }

    for (let iKey of innerKeys) {
      const property = innerObj[iKey]
      if (Array.isArray(property)) {
        let i = 0
        for (let j of property) {
          if (j.img) {
            j.imgName = [transactionID, j.imgName].join('.')
            const buf = Buffer.from(j.img, 'base64')
            const t = await addObject(buf, j.imgName).catch(reason => console.log('something went wrong', reason))
            j.img = t
            console.log('uploaded img', k, t)
          }
          i++
        }
      }
    }
    finalObj[k] = innerObj
  }

  console.log(finalObj)


  let userID = finalObj.user.id
  let propuestaID = finalObj.global.transactionID

  let { estimacionCostosData } = finalObj.estCostResults

  let { propuestaCompany, stimulationType, interventionType } = finalObj.resultsMeta

  let { aforosData } = finalObj.historicoDeAforosResults

  let treatmentGraphImg = finalObj.graficaTratamiento.imgUrl

  if (interventionType === 'estimulacion') {
      var { tipoDeColocacion, tiempoDeContacto, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, cedulaData } = finalObj.tratamientoEstimulacion

      var { penetracionRadial, longitudDeAgujeroDeGusan, geometria } = finalObj.evaluacionEstimulacion

      if (stimulationType === 'matricial') {
        tipoDeColocacion = null
        tiempoDeContacto = null
      }
  }
  else if (interventionType === 'acido') {
      var { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
        relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, cedulaData } = finalObj.tratamientoAcido

      var { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractur, geometria } = finalObj.evaluacionAcido
  }

  else if (interventionType === 'apuntalado') {
      var { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
        relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, cedulaData } = finalObj.tratamientoApuntalado

      var { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentracionAreal, conductividad,
        fcd, presionNeta, eficienciaDeFluidoDeFractura, geometria } = finalObj.evaluacionApuntalado

  }

// write to db
  connection.beginTransaction(function(err) {
    if (err) { throw err; }


    connection.query(`SELECT t.WELL_FORMACION_ID, INTERVENCIONES_ID FROM Transactions t 
      JOIN Intervenciones i ON t.TRANSACTION_ID = i.TRANSACTION_ID 
      WHERE t.TRANSACTION_ID = ?`, [propuestaID], (err, results) => {


      let wellFormacionID = results[0].WELL_FORMACION_ID
      let interventionID = results[0].INTERVENCIONES_ID

      let values = []

      estimacionCostosData.forEach(i => {
        let newRow = [i.item, interventionID, i.fecha, propuestaCompany, i.cost, i.costDLS, i.MNXtoDLS, propuestaID, transactionID]
        values.push(newRow)
      })

      connection.query(values.length === 0 ? DUMMY_QUERY : INSERT_COSTS_QUERY.submit, [values], (err, results) => {
        console.log('costs', err)
        console.log('costs', results)
        if (err) {
          return connection.rollback(function() {
            console.log('rolling back!!! 2')
            cb(err)
          })
        }

        values = []
        aforosData.forEach(i => {
            let newRow = [wellFormacionID, i.fecha, i.tiempo, i.estrangulador, i.ptp, i.ttp, i.pbaj, i.tbaj, i.psep, i.tsep, 
              i.ql, i.qo, i.qg, i.qw, i.rga, i.salinidad, i.ph, propuestaID, transactionID]
            values.push(newRow)
        })

        connection.query(values.length === 0 ? DUMMY_QUERY : INSERT_AFOROS_QUERY.submit, [values], (err, results) => {
          console.log('aforos', err)
          console.log('aforos', results)
          if (err) {
            return connection.rollback(function() {
              console.log('rolling back!!! 2')
              cb(err)
            })
          }

          values = []
          geometria.forEach(i => {
              let name = 'geometry ' + i.intervalo
              let newRow = [wellFormacionID, name, i.imgUrl, propuestaID, transactionID]
              values.push(newRow)
          })

          values.push([wellFormacionID, 'Treatment Graph', treatmentGraphImg, propuestaID, transactionID])

          connection.query(values.length === 0 ? DUMMY_QUERY : INSERT_IMAGES_QUERY.submit, [values], (err, results) => {
            console.log('images', err)
            console.log('images', results)
            if (err) {
              return connection.rollback(function() {
                console.log('rolling back!!! 2')
                cb(err)
              })
            }

            let query = interventionType === 'estimulacion' ? INSERT_CEDULA_ESTIMULACION_QUERY.submit : interventionType === 'acido' ? INSERT_CEDULA_ACIDO_QUERY.submit : INSERT_CEDULA_APUNTALADO_QUERY.submit

            values = []

            if (interventionType === 'estimulacion') {
              if (cedulaData) {
                cedulaData.forEach(i => {
                  let cedulaID = Math.floor(Math.random() * 1000000000)
                  let newRow = [cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, propuestaCompany, propuestaID, transactionID]
                  values.push(newRow)

                })  
              }
            } 
            else {
              if (cedulaData) {
                cedulaData.forEach(i => {
                  let cedulaID = Math.floor(Math.random() * 1000000000)
                  let newRow = [cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.tipoDeApuntalante, i.concentraciDeApuntalante, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, propuestaCompany, propuestaID, transactionID]
                  values.push(newRow)

                })   
              }
            }

            connection.query(values.length === 0 ? DUMMY_QUERY : query, [values], (err, results) => {
              console.log('cedula', err)
              console.log('cedula', results)
              if (err) {
                return connection.rollback(function() {
                  console.log('rolling back!!! 2')
                  cb(err)
                })
              }

              query = interventionType === 'estimulacion' ? INSERT_RESULTS_ESIMULACION_QUERY.submit : interventionType === 'acido' ? INSERT_RESULTS_ACIDO_QUERY.submit : INSERT_RESULTS_APUNTALADO_QUERY.submit

              if (interventionType === 'estimulacion') {
                values = [
                  interventionID, wellFormacionID, stimulationType, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                  volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido,
                  tipoDeColocacion, tiempoDeContacto, penetracionRadial, longitudDeAgujeroDeGusano,
                  propuestaID, transactionID
                ]
              }
              else if (interventionType === 'acido'){ 
                values = [
                  interventionID, wellFormacionID, 
                  volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, 
                moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                  relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, 
                  longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
                  conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, propuestaID, transactionID
                ]
              }
              else if (interventionType === 'apuntalado') {
                values = [
                    interventionID, wellFormacionID,  
                    volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                      volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, 
                      moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos,
                    longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentracionAreal, conductividad,
                    fcd, presionNeta, eficienciaDeFluidoDeFractura, propuestaID, transactionID
                  ]
              } 

              connection.query(query, values, (err, results) => {
                console.log('intervention', err)
                console.log('intervention', results)
                if (err) {
                  return connection.rollback(function() {
                    console.log('rolling back!!! 2')
                    cb(err)
                  })
                }

                values = [transactionID, propuestaID, userID, wellFormacionID]
                connection.query((INSERT_TRANSACTION.submit), values, (err, results) => {
                  console.log('transaction', err)
                  console.log('transaction', results)
                  if (err) {
                    return connection.rollback(function() {
                      console.log('rolling back!!! 2')
                      cb(err)
                    })
                  }

                  connection.query(`UPDATE Transactions SET HAS_RESULTS = 0 WHERE TRANSACTION_ID = ?`, [propuestaID], (err, results) => {
                    console.log('update old trans', err)
                    console.log('update old trans', results)
                    if (err) {
                      return connection.rollback(function() {
                        console.log('rolling back!!! 2')
                        cb(err)
                      })
                    }


                    connection.commit(function(err) {
                        if (err) {
                          cb(err)
                          return connection.rollback(function() {
                            console.log('something went terrible')
                            throw err;
                          });
                        }
                        console.log('success!');
                        cb(null)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}
