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
  let { subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, espesorNeto, caliza, 
  	dolomia, arcilla, porosidad, permeabilidad, 
    sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, 
    profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, 
    gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = req.body

	console.log(subdireccion, bloque, diametroDeDisparos)

	// let query = `INSERT INTO Wells (
	// WELL_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO, CAMPO, POZO, FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO, 
	// ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD, PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO, 
	// PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT, APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SAP, MODULO_YOUNG_ARENA, 
	// MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS, DIAMETRO_DE_DISPAROS) VALUES
	// (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
	//  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	//  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	//  ?, ?, ?, ?, ?, ?)`

	let query = `INSERT INTO Wells (
	WELL_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO, CAMPO, POZO, FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO, 
	ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD, PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO, 
	PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT, APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SAP, MODULO_YOUNG_ARENA, 
	MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS, DIAMETRO_DE_DISPAROS) VALUES
	(1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
	 ?, ?, ?, ?, ?, ?)`

  try {
    return db_con.query(query, [
    	subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, 
    	espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo,
    	pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, 
    	moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos], 
    (err, results) => {
      
      console.log('res', results)
      res.json({})
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
