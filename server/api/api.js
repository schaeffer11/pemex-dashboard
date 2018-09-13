import express from 'express'
// import signedURL from '../aws/index';
// import objectPath from 'object-path'
import db from '../lib/db'
import appConfig from '../../app-config.js'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws';
var well = require('./pozo')
var intervencion = require('./intervenciones')

const db_con = db.get(appConfig.users.database)
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

app.post('/inputTest', async (req, res) => {
  // console.log('what are we here?', req.body)
  const allKeys = Object.keys(req.body)
  // const { pozo } = JSON.parse(req.body.fichaTecnicaDelPozoHighLevel)
  // console.log('pzo', pozo)
  const finalObj = {}
  for(let k of allKeys) {
    const innerObj = JSON.parse(req.body[k])
    const innerKeys = Object.keys(innerObj)
    // look for immediate images
    if (innerObj.img) {
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

  console.log('finalobj', finalObj)

  // write to db
  res.json({ done: true })
})

app.post('/testing', (req, res) => {
  // console.log('this is about to get fucked', req.body)
  const buf = Buffer.from(req.body.file, 'base64')
  addObject(buf)

  res.json({ yeah: 'boy' })
})

app.post('/well', well.create);

app.post('/intervencion', intervencion.create);



app.post('/storeInterventionData', (req, res) => {
  let { objetivo, alcances, tipoDeIntervenciones } = req.body
  //Pruebas De Laboratoro
  let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = req.body

  let query = ''
  let data = []

  if (tipoDeIntervenciones === 'estimulacion') {

      //Propuesta Estimulaction
      let { etapa, sistema, volLiquid, gastoN2, gastoLiquido, 
        gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, 
        relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, 
        capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, 
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = req.body

      //Simulacion Resultados Estimulacion
      let { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas, 
        volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, 
        volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano } = req.body

      //EstIncProd 
      let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncEstim } = req.body

      //Est Cost
      let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes, 
        estCostDeN2, estCostHCL } = req.body

      query = `INSERT INTO InterventionsTratamientoDeEstimulacions (
        INTERVENTION_ID, DATE, OBJETIVO, ALCANCES, ETAPA,
        SISTEMA, VOLUME_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDA,
        CALIDAD, VOLUME_N2, VOLUME_LIQUID_ACUM, VOLUME_N2_ACUM, REL_N2_PER_LIQ, TIEMPO,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO, CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, INSERTLABTESTSHERE, VOLUMEN_DEL_SISTEMA_ACIDO_LIMPIEZA, VOLUMEN_DEL_SISTEMA_NO_ACIDO_LIMPIEZA, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, NUMERO_DE_ETAPAS, VOLUMEN_DEL_SISTEMA_ACIDO, VOLUMEN_DEL_SISTEMA_NO_ACIDO, VOLUMEN_DE_DIVERGENTE, VOLUMEN_DE_N2,
        CALIDAD_DE_ESPUMA, VOLUMEN_DE_PRECOLCHON_N2, VOLUMEN_DE_DESPLAZAMIENTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, OBSERVACIONES, EST_COSTO_COMPANIA_DE_SERVICIOS, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_DE_SISTEMA_REACTIVO,
        EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2, EST_COSTO_DE_HCL) VALUES
        (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`

        data = [objetivo, alcances, etapa, sistema, volLiquid, gastoN2, gastoLiquido, 
        gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, 
        relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, 
        capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, 
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido, 
        tipoDeAnalisis,
        volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas, 
        volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, 
        volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano, 
        estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncEstim, estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, 
        estCostDeSistemaNoReactivo, estCostDeDivergenes, estCostDeN2, estCostHCL]
  }
  else if (tipoDeIntervenciones === 'acido') {
      
      //Propuesta De Fracturamiento Acido
      let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, 
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, 
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, 
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, 
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal } = req.body

      //Pruebas De Laboratoro
      let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = req.body

      //Pruebas De laboratorio Acido
      let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, 
        densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, 
        contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, 
        viscosidadDelAceite, sistemAcido, pesoMuestraInicial, pesoMuestraFinal, solubilidad, 
        sistemaAcidoGrabado, nucleoDeFormacion, grabado, tipoDeGelLineal, viscosidadDelGelLineal, 
        tiempoDeReticulacion, pHGelLineal, tiempoDeRompedorDelGel, obervacionesPruebasLabAcido } = req.body

      //Resultados De La Simulacion
      let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, 
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = req.body

      //Estimacion Del Incremento De Produccion
      let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncAcido } = req.body

      //Estimacion De Costos
      let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, 
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, 
        estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante  } = req.body
 
      query = `INSERT INTO InterventionsFractuarmientosAcido (
        INTERVENTION_ID, DATE, OBJETIVO, ALCANCES, ETAPA,
        SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, VOLUME_LIQUID, GASTO_N2,
        GASTO_LIQUIDO, GASTO_EN_FONDA, CALIDAD, VOLUME_N2, VOLUME_LIQUID_ACUM, VOLUME_N2_ACUM,
        REL_N2_PER_LIQ, TIEMPO, INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_GEL_LINEAL, INSERTLABTESTSHERE, LONGITUD_TOTAL, LONGITUD_EFECTIVA_GRABADA,
        ALTURA_GRABADA, ANCHO_PROMEDIO, CONCENTRACION_DEL_ACIDO, CONDUCTIVIDAD, FCD, PRESION_NETA,
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA, EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, OBSERVACIONES, EST_COSTO_COMPANIA_DE_SERVICIO, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_UNIDADES_DE_ALTA_PRESION,
        EST_COSTO_DEL_GEL_DE_FRACTURA, EST_COSTO_DE_SISTEMA_REACTIVO, EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2,
        EST_COSTO_DE_HCL, EST_COSTO_DE_SISTEMAS_ACIDOS_RETARDADOS, EST_COSTO_EQUIPO_DE_FRACTURAMIENTO_DE_POZOS, EST_COSTO_GEL_LINEAL, EST_COSTO_DE_TRABAJOS_DE_BOMBEO_DIVERSOS,
        EST_COSTO_DE_LLENADO_DE_POZO_Y_PRUEBA_DE_ADMISION, EST_COSTO_DEL_MINIFRAC, EST_COSTO_DE_BACHE_NEUTRALIZADOR, EST_COSTO_DE_ARBOL, EST_COSTO_DEL_APUNTALANTE) VALUES
        (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`

        data = [objetivo, alcances, etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, 
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, 
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, 
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, 
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal,
        tipoDeAnalisis, longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, 
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncAcido, estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, 
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, 
        estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante]
  }
  else if (tipoDeIntervenciones === 'apuntalado') {
      console.log('here')
      //Propuesta De Fracturamiento Apuntalado
      let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, 
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, 
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, 
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante, 
        volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido } = req.body

      //Pruebas De Laboratorio Apuntalado
      let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, 
        densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, 
        contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, 
        viscosidadDelAceite, tipoDeGelLineal, viscosidadDelGelLineal, tiempoDeReticulacion, pHGelLineal, 
        tiempoDeRompedorDelGel, tamanoDelApuntalante, gravedadEspecifica, esfericidad, redondeo, 
        turbidez, resistencia, pruebaDeSolubilidadConAcida, obervacionesPruebasLabApuntalado } = req.body

      //Resultados de simulacion Apuntalado
      let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, 
        fcd, presionNeta, eficienciaDeFluidoDeFractura  } = req.body


      //Est Inc Produccion
      let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncApuntalado } = req.body


      //Est Cost Apuntalado
      let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, 
        estCostDeSistemaNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, 
        estCostBacheNeutralizador, estCostProtectorDeArbol } = req.body

        console.log(req.body)

      query = `INSERT INTO InterventionsFractuarmientosApuntalado (
        INTERVENTION_ID, DATE, OBJETIVO, ALCANCES, ETAPA,
        SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, VOLUME_LIQUID, GASTO_N2,
        GASTO_LIQUIDO, GASTO_EN_FONDA, CALIDAD, VOLUME_N2, VOLUME_LIQUID_ACUM, VOLUME_N2_ACUM,
        REL_N2_PER_LIQ, TIEMPO, INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_DE_APUNTALANTE, VOLUMEN_DE_GEL_DE_FRACTURA, VOLUMEN_DESPLAZAMIENTO, 
        VOLUMEN_TOTAL_DE_LIQUIDO, INSERTLABTESTSHERE, LONGITUD_APUNTALADA, ALTURA_TOTAL_DE_FRACTURA, ANCHO_PROMEDIO, 
        CONCENTRACION_AREAL, CONDUCTIVIDAD, FCD, PRESION_NETA, EFICIENCIA_DE_FLUIDO_DE_FRACTURA,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, OBSERVACIONES, EST_COSTO_COMPANIA_DE_SERVICIO, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_UNIDADES_DE_ALTA_PRESION,
        EST_COSTO_DEL_GEL_DE_FRACTURA, EST_COSTO_DE_SISTEMA_REACTIVO, EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2,
        EST_COSTO_DE_HCL, EST_COSTO_DE_SISTEMAS_ACIDOS_RETARDADOS, EST_COSTO_EQUIPO_DE_FRACTURAMIENTO_DE_POZOS, EST_COSTO_GEL_LINEAL, EST_COSTO_DE_TRABAJOS_DE_BOMBEO_DIVERSOS,
        EST_COSTO_DE_LLENADO_DE_POZO_Y_PRUEBA_DE_ADMISION, EST_COSTO_DEL_MINIFRAC, EST_COSTO_DE_BACHE_NEUTRALIZADOR, EST_COSTO_DE_PROTECTOR_DE_ARBOL) VALUES
        (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`


        data = [
        objetivo, alcances, etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, 
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, 
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, 
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante, 
        volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido,
        tipoDeApuntalante,
        longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, 
        fcd, presionNeta, eficienciaDeFluidoDeFractura,
        estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, 
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg, obervacionesEstIncApuntalado,
        estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, 
        estCostDeSistemaNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, 
        estCostBacheNeutralizador, estCostProtectorDeArbol 
        ]

  }

  return db_con.query(query, data, (err, results) => {
    
    console.log('res', results)
    if (err) {
      console.log('err', err)
      return res.json({ err: err})
    }

    res.json(req.body)
  })
})



app.post('/storeWellData', (req, res) => {

  // console.log(req.body)

  //Ficha Tecnica Del Pozo
  let { subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, espesorNeto, caliza, 
  	dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, 
    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, 
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = req.body


  //Ficha Tecnia Del Campo
  let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField, 
    dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField, 
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField, 
    porosidadField, swField, kPromedioField, caaField, cgaField, 
    qoField, qgField, rgaField, fwField, npField, 
    gpField, wpField, rraField, rrgField, rrpceField, 
    h2sField, co2Field, n2Field } = req.body
  
  //Informacion De Sistemas Artificiales De Produccion
  let { tipoDeSistemo, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV, 
    presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN, 
    volumenDeGasInyectadoBN, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH, 
    fluidoMotrizBH, equipoSuperficialBH, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, 
    hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, profundidadDelMotorBE, 
    diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE, 
    longitudDeCableBE, rmpBE, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, 
    tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM, 
    nivelDinamico, nivelEstatico } = req.body

  //Mecanico Y Aparejo De Produccion
  let {tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, 
    tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase, 
    diametroDeOrificio, penetracion, tipoDeSAP, tratamientoPor, volumenAparejoDeProduccion, 
    volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular } = req.body

  //Analisis Del Agu
  let {pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales, 
    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3, 
    salinidadComoNaCl, sodio, calcio, magnesio, fierro, 
    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15, 
    densidadAt20 } = req.body

	let query = `INSERT INTO Wells (
	WELL_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO,
  CAMPO, POZO, FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO, 
	ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD, 
  PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO, 
	PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT, 
  APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SAP, MODULO_YOUNG_ARENA, 
	MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS, 
  DIAMETRO_DE_DISPAROS, PRODUCTION_SYSTEM_TYPE, TIPO_DE_TERMINACION, H_INTERVALO_PRODUCTOR, EMPACADOR,
  PRESION_DIF_EMPACADOR, SENSOR_PYT, TIP_DE_LINER, DIAMETRO_DE_LINER, TIPO_DE_PISTOLAS,
  DENSIDAD_DE_DISPAROS_MECANICO_DUPL, FASE, DIAMETRO_DE_ORIFICIO, PENETRACION, TIPO_DE_SAP_MECANICO_DUPL,
  TRATAMIENTO_POR, VOLUMEN_APAREJO_DE_PRODUCCION, VOLUMEN_INTERVALO_CIMA, VOLUMEN_INTERVALO_BASE, VOLUMEN_DE_ESPACIO_ANULA,
  pH, TEMPERATURA_DE_CONDUCTIVIDAD, RESISTIVIDAD, SALINIDAD_CON_CONDUCTIMETRO, SOLIDOS_DISUELTOS_TOTALES,
  DUREZA_TOTAL_COMO_CaCO3, DUREZA_DE_CALCIO_COMO_CaCO3, DUREZA_DE_MAGNESIO_COMO_CaCO3, ALCALINIDAD_TOTAL_COMO_CaCO3, ALCALINIDAD_A_LA_FENOLFTALEINA_COMO_CaCO3,
  SALINIDAD_COMO_NaCL, SODIO, CALCIO, MAGNESIO, FIERRO,
  CLORUROS, BICARBONATOS, SULFATOS, CARBONATOS, DENSIDAD_15,
  DENSIDAD_20) VALUES
	(1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
   ?, ?, ?, ?, ?, ?)`

   //TODO put this all in transaction, better handling
  try {
    return db_con.query(query, [
    	subdireccion, bloque, activo, campo, pozo, 
      formacion, intervaloProductor, espesorBruto, espesorNeto, caliza, 
      dolomia, arcilla, porosidad, permeabilidad, sw, 
      caa, cga, tipoDePozo, pwsFecha, pwfFecha, 
      deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, 
      profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, 
      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, tipoDeSistemo, 
      tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, 
      tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparos, fase, 
      diametroDeOrificio, penetracion, tipoDeSAP, tratamientoPor, volumenAparejoDeProduccion, 
      volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular, 
      pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales, 
      durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3, 
      salinidadComoNaCl, sodio, calcio, magnesio, fierro, 
      cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15, 
      densidadAt20], 
    (err, results) => {
      
      console.log('res', results)
      if (err) {
        console.log('err', err)
        return res.json({ err: err})
      }


      query = `INSERT INTO Fields (
      FIELD_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO, CAMPO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL_ANO, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      Qo, Qg, RGA, Fw, Np, Gp, Wp, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2) VALUES
      (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

       return db_con.query(query, [
        subdireccion, bloque, activo, campo, formacion, 
        descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField, 
        dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField, 
        rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField, 
        porosidadField, swField, kPromedioField, caaField, cgaField, 
        qoField, qgField, rgaField, fwField, npField, 
        gpField, wpField, rraField, rrgField, rrpceField, 
        h2sField, co2Field, n2Field], (err, results) => {

          console.log('res2', results)
        if (err) {
          console.log('err', err)
          return res.json({ err: err})
        }
        let query;
        let vals;

        console.log('why', tipoDeSistemo, tipoDeSistemo === 'bombeoNeumatico')
        switch(tipoDeSistemo) {   
          case 'emboloViajero':
            query = `INSERT INTO ProductionSystemsEmboloViajero (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO) VALUES
                (1, 1, 1, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV]
            break
          case 'bombeoNeumatico':
            query = `INSERT INTO ProductionSystemsBombeoNeumatico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                ORIFICIO, VOLUMEN_DE_GAS_INYECTADO) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, 
                  profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN]
            break
          case 'bombeoHidraulico':    
            query = `INSERT INTO ProductionSystemsBombeoHidraulico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, 
                  tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH]
            break            
          case 'bombeoCavidadesProgresivas':
            query = `INSERT INTO ProductionSystemsBombeoCavidadesProgresivas (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, 
                hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP]
            break          
          case 'bombeoElectrocentrifugo':
            query = `INSERT INTO ProductionSystemsBombeoElectrocentrifugo (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE, 
                amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE]
            break          
          case 'bombeoMecanico':
            query = `INSERT INTO ProductionSystemsBombeoMecanico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            vals = [presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, 
                tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM, 
                nivelDinamico, nivelEstatico]
            break
          default:
                //Dummy query for now
                query = `SELECT COUNT(1) FROM Users`
        }


          return db_con.query(query, vals, (err, results) => {
            if (err) {
              console.log('err', err)
              return res.json({ err: err})
            }
          })
          //res.json({err: err, success: !err})

      })
    })
  } 
  catch(err) {
    console.log('ERROR executing sql:', err)
  }
})












app.get('*', (req, res) => {
  res.status(404).send(`No API endpoint found for "${req.url}"`)
})

export default app
