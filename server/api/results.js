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

const INSERT_TRANSACTION = {
    save: ``,
    submit: `INSERT INTO TransactionsResults (
        TRANSACTION_ID, PROPUESTA_ID, USER_ID, WELL_FORMACION_ID) VALUES
        (?, ?, ?, ?)`, 
}


const DUMMY_QUERY = 'SELECT(1) FROM Users LIMIT 1'


export const createResults = async (body, action, cb) => {
  console.log('im in results')
  const allKeys = Object.keys(body)
  const finalObj = {}

  for(let k of allKeys) {
    const innerObj = JSON.parse(body[k])
    const innerKeys = Object.keys(innerObj)

    // look for immediate images
    if (innerObj.img) {
      innerObj.imgName = [transactionID, k].join('.')
      console.log('found image', k, innerObj.imgName)

      const buf = Buffer.from(innerObj.img, 'base64')
      const t = await addObject(buf, innerObj.imgName).catch(reason => console.log(reason))
      innerObj.img = t
      console.log('uploaded img', t, k)
    }

    for (let iKey of innerKeys) {
      const property = innerObj[iKey]
      if (Array.isArray(property)) {
        for (let j of property) {
          if (j.img) {
            const buf = Buffer.from(j.img, 'base64')
            const t = await addObject(buf, j.imgName).catch(reason => console.log(reason))
            j.img = t
            console.log('uploaded img', k, t)
          }
        }
      }
    }
    finalObj[k] = innerObj
  }

  console.log(finalObj)


  let userID = finalObj.user.id
  let propuestaID = finalObj.global.transactionID
  let transactionID = Math.floor(Math.random() * 1000000000)

  let { estimacionCostosData } = finalObj.estCostResults
  compania = 'something'

  let { aforosData } = finalObj.historicoDeAforosResults

  // let { geometryData } = finalObj.someRegister
  let geometryData = []

  // let treatmentGraphImg = finalObj.someRegister.imgUrl
  let treatmentGraphImg = 'empty'

  // let { cedulaData } = finalObj.someRegister
  let cedulaData = []

// write to db
  connection.beginTransaction(function(err) {
    if (err) { throw err; }


    connection.query(`SELECT t.WELL_FORMACION_ID, INTERVENCIONES_ID, TIPO_DE_INTERVENCIONES FROM Transactions t 
      JOIN Intervenciones i ON t.TRANSACTION_ID = i.TRANSACTION_ID 
      WHERE t.TRANSACTION_ID = ?`, [propuestaID], (err, results) => {


      let wellFormacionID = results[0].WELL_FORMACION_ID
      let interventionID = results[0].INTERVENCIONES_ID
      let tipoDeIntervenciones = results[0].TIPO_DE_INTERVENCIONES

      let values = []

      estimacionCostosData.forEach(i => {
        let newRow = [i.item, interventionID, i.fecha, compania, i.cost, i.costDLS, i.MNXtoDLS, propuestaID, transactionID]
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
          geometryData.forEach(i => {
              let newRow = [wellFormacionID, 'Geometry', i.imgUrl, propuestaID, transactionID]
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

            let query = tipoDeIntervenciones === 'estimulacion' ? INSERT_CEDULA_ESTIMULACION_QUERY.submit : tipoDeIntervenciones === 'acido' ? INSERT_CEDULA_ACIDO_QUERY.submit : INSERT_CEDULA_APUNTALADO_QUERY.submit

            values = []

            if (tipoDeIntervenciones === 'estimulacion') {
              if (cedulaData) {
                cedulaData.forEach(i => {
                  let cedulaID = 'SOMETHING'
                  let newRow = [cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, compania, propuestaID, transactionID]
                  if (action === 'save') {
                    newRow.push(i.error)
                  }
                  values.push(newRow)

                })  
              }
            } 
            else {
              if (cedulaData) {
                cedulaData.forEach(i => {
                  let cedulaID = 'SOMETHING'
                  let newRow = [cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.nombreComercial, i.tipoDeApuntalante, i.concentraciDeApuntalante, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo, compania, propuestaID, transactionID]
                  if (action === 'save') {
                    newRow.push(i.error)
                  }
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

                connection.query(`UPDATE Transactions SET HAS_RESULTS = 1 WHERE TRANSACTION_ID = ?`, [propuestaID], (err, results) => {
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
}
