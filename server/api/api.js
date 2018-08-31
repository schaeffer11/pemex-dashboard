import express from 'express'
// import signedURL from '../aws/index';
// import objectPath from 'object-path'
import db from '../lib/db'
import appConfig from '../../app-config.js'

const db_con = db.get(appConfig.users.database)
const app = express()

const handleError = (err) => {
  console.error(err)
  return { status: 500, error: true }
}

app.get('/ping', (req, res) => {
	console.log('pong')
  res.json({ response: 'pong' })
})



// app.post('/storeWellData', (req, res) => {
  
//   res.json(req.body)
// })

app.post('/storeInterventionData', (req, res) => {
  
  res.json(req.body)
})



app.post('/storeWellData', (req, res) => {

  // console.log(req.body)

  //Ficha Tecnica Del Pozo
  let { subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, espesorNeto, caliza, 
  	dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, 
    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, 
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = req.body

	// console.log(subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, espesorNeto, caliza, 
 //    dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, 
 //    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, 
 //    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos)


  //Ficha Tecnia Del Campo
  let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField, 
    dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField, 
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField, 
    porosidadField, swField, kPromedioField, caaField, cgaField, 
    qoField, qgField, rgaField, fwField, npField, 
    gpField, wpField, rraField, rrgField, rrpceField, 
    h2sField, co2Field, n2Field } = req.body
  	

    console.log(subdireccion, bloque, activo, campo, formacion, 
        descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField, 
        dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField, 
        rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField, 
        porosidadField, swField, kPromedioField, caaField, cgaField, 
        qoField, qgField, rgaField, fwField, npField, 
        gpField, wpField, rraField, rrgField, rrpceField, 
        h2sField, co2Field, n2Field)


	let query = `INSERT INTO Wells (
	WELL_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO, CAMPO, POZO, FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO, 
	ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD, PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO, 
	PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT, APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SAP, MODULO_YOUNG_ARENA, 
	MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS, DIAMETRO_DE_DISPAROS) VALUES
	(1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?)`

   //TODO put this all in transaction, better handling
  try {
    return db_con.query(query, [
    	subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, 
    	espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo,
    	pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, 
    	moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos], 
    (err, results) => {
      
      console.log('res', results)
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

          console.log('finito')
          console.log('res2', results)
          console.log('err', err)
          res.json({err: err, success: !err})

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
