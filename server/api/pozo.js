import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';



const INSERT_FIELDS_QUERY = `INSERT INTO Fields (
      FIELD_FORMACION_ID, SUBDIRECCION, ACTIVO, CAMPO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL_ANO, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, TIPO_DE_FLUIDO, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      QO, QG, RGA, FW, NP, GP, WP, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?)`


const INSERT_WELL_QUERY = `INSERT INTO Wells (
        WELL_FORMACION_ID, SUBDIRECCION, ACTIVO,
        CAMPO, POZO, FORMACION, INTERVALO_PRODUCTOR, ESPESOR_BRUTO,
        ESPESOR_NETO, CALIZA, DOLOMIA, ARCILLA, POROSIDAD,
        PERMEABILIDAD, SW, CAA, CGA, TIPO_DE_POZO,
        PWS_FECHA, PWF_FECHA, DELTA_P_PER_MES, TYAC, PVT,
        APAREJO_DE_PRODUCCION, PROF_EMPACADOR, PROF_SENSOR_PYT, TIPO_DE_SISTEMA) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?)`

const INSERT_HIST_INTERVENCIONES_QUERY = `INSERT INTO WellUserInputInterventions (
        WELL_FORMACION_ID, INPUT_INTERVENTION_ID, DATE, DESCRIPTION) VALUES
        ?`

const INSERT_LAYER_QUERY = `INSERT INTO WellLayers (
        INTERVAL_ID, WELL_FORMACION_ID, INTERVALO, CIMA_MD, BASE_MD, CIMA_MV, BASE_MV,
        V_ARC, POROSITY, SW, DENS, RESIS, PERMEABILIDAD) VALUES
        ?`


const INSERT_MUD_LOSS_QUERY = `INSERT INTO WellZones (
        ZONE_ID, WELL_FORMACION_ID, CIMA_MD, BASE_MD, LODO_PERDIDO, DENSIDAD) VALUES
        ?`


const INSERT_MECANICO_QUERY = `INSERT INTO WellMecanico (
        WELL_FORMACION_ID, TIPO_DE_TERMINACION, H_INTERVALO_PRODUCTOR, EMPACADOR,
        PRESION_DIF_EMPACADOR, SENSOR_PYT, TIP_DE_LINER, DIAMETRO_DE_LINER, TIPO_DE_PISTOLAS,
        DENSIDAD_DE_DISPAROS_MECANICO_DUPL, FASE, DIAMETRO_DE_ORIFICIO, PENETRACION,
        TRATAMIENTO_POR, VOLUMEN_APAREJO_DE_PRODUCCION, VOLUMEN_INTERVALO_CIMA, 
        VOLUMEN_INTERVALO_BASE, VOLUMEN_DE_ESPACIO_ANULA) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?)`

const INSERT_ANALISIS_AGUA_QUERY = `INSERT INTO WellAnalisisDelAgua (
        WELL_FORMACION_ID, PH, TEMPERATURA_DE_CONDUCTIVIDAD, RESISTIVIDAD, SALINIDAD_CON_CONDUCTIMETRO, SOLIDOS_DISUELTOS_TOTALES,
        DUREZA_TOTAL_COMO_CaCO3, DUREZA_DE_CALCIO_COMO_CaCO3, DUREZA_DE_MAGNESIO_COMO_CaCO3, ALCALINIDAD_TOTAL_COMO_CaCO3, 
        ALCALINIDAD_A_LA_FENOLFTALEINA_COMO_CaCO3,
        SALINIDAD_COMO_NaCL, SODIO, CALCIO, MAGNESIO, FIERRO,
        CLORUROS, BICARBONATOS, SULFATOS, CARBONATOS, DENSIDAD_15,
        DENSIDAD_20) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?)`


const INSERT_EMBOLO_VIAJERO_QUERY = `INSERT INTO ProductionSystemsEmboloViajero (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO) VALUES
                (1, 1, 1, ?, ?, ?, ?)`

const INSERT_BOMBEO_NEUMATICO_QUERY = `INSERT INTO ProductionSystemsBombeoNeumatico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                ORIFICIO, VOLUMEN_DE_GAS_INYECTADO) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?)`

const INSERT_BOMBEO_HIDRAULICO_QUERY = `INSERT INTO ProductionSystemsBombeoHidraulico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?)`

const INSERT_BOMBEO_CAVIDADES_QUERY = `INSERT INTO ProductionSystemsBombeoCavidadesProgresivas (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

const INSERT_BOMBEO_ELECTROCENTRIFUGO_QUERY = `INSERT INTO ProductionSystemsBombeoElectrocentrifugo (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

const INSERT_BOMBEO_MECANICO_QUERY = `INSERT INTO ProductionSystemsBombeoMecanico (
                SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO) VALUES
                (1, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`


const INSERT_FIELD_PRESSURE_QUERY = `INSERT INTO FieldHistoricalPressure (
        FIELD_FORMACION_ID, FECHA, QO, NP, PWS, PR) VALUES
        ?`
const INSERT_WELL_PRESSURE_QUERY = `INSERT INTO WellHistoricalPressure (
        WELL_FORMACION_ID, FECHA, QO, NP, PWS, PR) VALUES
        ?`

const INSERT_WELL_AFOROS_QUERY = `INSERT INTO WellAforos (
        WELL_FORMACION_ID, FECHA, ESTRANGULADOR, PTP, TTP, PBAJ, TBAJ, PSEP, TSEP, QL, 
        QO, QG, QW, RGA, SALINIDAD, PH) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`

const INSERT_WELL_PRODUCCION_QUERY = `INSERT INTO WellHistoricalProduccion (
        WELL_FORMACION_ID, Fecha, Dias, QO, QW, QG_CAL, QGL, NP, WP, GP, GI, RGA, FW_FRACTION, POZOS_PROD_ACTIVOS)
        VALUES 
        ?`

const INSERT_WELL_IMAGE_QUERY = `INSERT INTO WellImages (
        WELL_FORMACION_ID, IMAGE_NAME, IMG_URL) VALUES
        ?`
// const INSERT_WELL_IMAGE_QUERY = `SELECT(1) FROM WellImages`


const INSERT_INTERVENTION_BASE_QUERY = `INSERT INTO Intervenciones (
      INTERVENCIONES_ID, WELL_FORMACION_ID, OBJETIVO, ALCANCES, TIPO_DE_INTERVENCIONES)
      VALUES (?, ?, ?, ?, ?)`

const INSERT_INTERVENTION_ESIMULACION_QUERY = `INSERT INTO IntervencionesEstimulacions (
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO, CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2,
        VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE, VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_N2,
        VOLUMEN_TOTAL_DE_LIQUIDO, VOLUMEN_DEL_SISTEMA_ACIDO_LIMPIEZA, VOLUMEN_DEL_SISTEMA_NO_ACIDO_LIMPIEZA, TIPO_DE_COLOCACION,
        TIEMPO_DE_CONTACTO, NUMERO_DE_ETAPAS, VOLUMEN_DEL_SISTEMA_ACIDO, VOLUMEN_DEL_SISTEMA_NO_ACIDO, VOLUMEN_DE_DIVERGENTE, VOLUMEN_DE_N2,
        CALIDAD_DE_ESPUMA, VOLUMEN_DE_PRECOLCHON_N2, VOLUMEN_DE_DESPLAZAMIENTO, PENETRACION_RADIAL, LONGITUD_DE_AGUJERO_DE_GUSANO,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj, EST_INC_Tbaj,
        EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq, EST_INC_Qw,
        EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P, EST_INC_GASTO_COMPROMISO_Qo,
        EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?)`

const INSERT_INTERVENTION_ACIDO_QUERY = `INSERT INTO IntervencionesAcido (
        INTERVENTION_ID, WELL_FORMACION_ID,
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_SISTEMA_NO_REACTIVO, VOLUMEN_SISTEM_REACTIVO, VOLUMEN_SISTEMA_DIVERGENTE,
        VOLUMEN_DISPLAZAMIENTO_LIQUIDO, VOLUMEN_DESPLAZAMIENTO_GEL_LINEAL, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_TOTAL, LONGITUD_EFECTIVA_GRABADA,
        ALTURA_GRABADA, ANCHO_PROMEDIO, CONCENTRACION_DEL_ACIDO, CONDUCTIVIDAD, FCD, PRESION_NETA,
        EFICIENCIA_DE_FLUIDO_DE_FRACTURA, EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?)`

const INSERT_INTERVENTION_APUNTALADO_QUERY = `INSERT INTO IntervencionesApuntalado (
        INTERVENTION_ID, WELL_FORMACION_ID, 
        INTERVALO, LONGITUD_DE_INTERVALO_A_TRATAR, VOLUME_APAREJO,
        CAPACIDAD_TOTAL_DEL_POZO, VOLUMEN_PRECOLCHON_N2, VOLUMEN_DE_APUNTALANTE, VOLUMEN_DE_GEL_DE_FRACTURA, VOLUMEN_DESPLAZAMIENTO,
        VOLUMEN_TOTAL_DE_LIQUIDO, MODULO_YOUNG_ARENA,
        MODULO_YOUNG_LUTITAS, RELAC_POISSON_ARENA, RELAC_POISSON_LUTITAS, GRADIENTE_DE_FRACTURA, DENSIDAD_DE_DISPAROS,
        DIAMETRO_DE_DISPAROS, LONGITUD_APUNTALADA, ALTURA_TOTAL_DE_FRACTURA, ANCHO_PROMEDIO,
        CONCENTRACION_AREAL, CONDUCTIVIDAD, FCD, PRESION_NETA, EFICIENCIA_DE_FLUIDO_DE_FRACTURA,
        EST_INC_ESTRANGULADOR, EST_INC_Ptp, EST_INC_Ttp, EST_INC_Pbaj,
        EST_INC_Tbaj, EST_INC_Ptr, EST_INC_Qi, EST_INC_Qo, EST_INC_Qq,
        EST_INC_Qw, EST_INC_RGA, EST_INC_SALINIDAD, EST_INC_IP, EST_INC_DELTA_P,
        EST_INC_GASTO_COMPROMISO_Qo, EST_INC_GASTO_COMPROMISO_Qg, EST_INC_OBSERVACIONES) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?)`

const INSERT_LAB_TEST_QUERY = `INSERT INTO IntervencionesLabTests (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, TIPO_DE_ANALISIS, FECHA_DE_MUESTREO, FECHA_DE_PRUEBA, COMPANIA, PERSONAL_DE_PEMEX_QUE_SUPERVISO, OBSERVACIONES)
        VALUES ?`

const INSERT_CEDULA_ESTIMULACION_QUERY = `INSERT INTO IntervencionesCedulaEstimulacion (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA,
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO) VALUES ?`

const INSERT_CEDULA_ACIDO_QUERY = `INSERT INTO IntervencionesCedulaAcido (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO) VALUES ?`

const INSERT_CEDULA_APUNTALADO_QUERY = `INSERT INTO IntervencionesCedulaApuntalado (
        CEDULA_ID, INTERVENTION_ID, WELL_FORMACION_ID, ETAPA, SISTEMA, TIPO_DE_APUNTALANTE, CONCENTRACION_DE_APUNTALANTE, 
        VOL_LIQUID, GASTO_N2, GASTO_LIQUIDO, GASTO_EN_FONDO, CALIDAD, VOL_N2, VOL_LIQUIDO_ACUM, 
        VOL_N2_ACUM, REL_N2_LIQ, TIEMPO) VALUES ?`        

const INSERT_LAB_RESULTS_QUERY = `INSERT INTO IntervencionesLabResults (
        RESULT_ID, LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, SISTEMA, 
        TIEMPO_DE_ROMPIMIENTO, INTERFASE, SOLIDOS_DESPUES_DE_FILTRAR, RESULTADO) VALUES ?`

const INSERT_LAB_ACIDO_QUERY = `INSERT INTO IntervencionesLabTestsAcido (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, SISTEMA_ACIDO_SOLUBILIDAD, PESO_MUESTRA_INICIAL, 
        PESO_MUESTRA_FINAL, SOLUBILIDAD, SISTEMA_ACIDO_GRABADO_DE_NUCLEOS, NUCLEO_DE_FORMACION, 
        GRABADO, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, TIEMPO_DE_RETICULACION, 
        PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL) VALUES ?`

const INSERT_LAB_APUNTALADO_QUERY = `INSERT INTO IntervencionesLabTestsApuntalado (
        LAB_ID, INTERVENTION_ID, WELL_FORMACION_ID, CONTENIDO_DE_ACEITE, CONTENIDO_DE_AGUA, 
        CONTENIDO_DE_EMULSION, CONTENIDO_DE_SOLIDOS, TIPO_DE_SOLIDOS, DENSIDAD_DEL_ACEITE, 
        DENSIDAD_DEL_AGUA, DENSIDAD_DE_LA_EMULSION, CONTENIDO_DE_ASFALTENOS, CONTENIDO_DE_PARAFINAS, 
        CONTENIDO_DE_RESINAS, INDICE_DE_ESTABILIDAD_COLOIDAL, INDICE_DE_ESTABILIDAD_DEL_AGUA, PH, 
        SALINIDAD, VISCOSIDAD_DEL_ACEITE, TIPO_DE_GEL_LINEAL, VISCOSIDAD_DEL_GEL_LINEAL, 
        TIEMPO_DE_RETICULACION, PH_GEL_LINEAL, TIEMPO_DE_ROMPEDOR_DEL_GEL, TAMANO_DEL_APUNTALANTE, 
        GRAVEDAD_ESPECIFICA, ESFERICIDAD, REDONDEO, TURBIDEZ, RESISTENCIA, 
        PRUEBA_DE_SOLUBILIDAD_CON_ACIDO) VALUES ?`
        
const INSERT_COSTS_QUERY = `INSERT INTO IntervencionesEstimatedCosts (
        COST_ID, INTERVENTION_ID, ITEM, COMPANY, COST) VALUES ?`


const INSERT_INTERVENTION_IMAGE_QUERY = `INSERT INTO IntervencionesImages (
        INTERVENTION_ID, IMAGE_NAME, IMG_URL) VALUES
        ?`

export const create = async(req, res) => {
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


  let { subdireccion, activo, campo, pozo, formacion } = finalObj.fichaTecnicaDelPozoHighLevel

  let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field } = finalObj.fichaTecnicaDelCampo

  let { intervaloProductor, espesorBruto, espesorNeto, caliza,
    dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha,
    deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
    relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, historialIntervencionesData } = finalObj.fichaTecnicaDelPozo
  
  let { layerData, mudLossData } = finalObj.evaluacionPetrofisica

  let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
    tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase,
    diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
    volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular } = finalObj.mecanicoYAparejoDeProduccion

  let {pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
    densidadAt20 } = finalObj.analisisDelAgua

  let { tipoDeSistemo, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV,
    presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN,
    volumenDeGasInyectadoBN, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH,
    fluidoMotrizBH, equipoSuperficialBH, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
    hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, profundidadDelMotorBE,
    diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE,
    longitudDeCableBE, rmpBE, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
    tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
    nivelDinamico, nivelEstatico } = finalObj.sistemasArtificialesDeProduccion

  let { presionDataCampo, presionDataPozo } = finalObj.historicoDePresion

  let { salinidad, qw, estrangulado, tsep, rga, ptp, psep, ttp, qg, tbaj, ph, pbaj, ql, tiempo, fecha, qo, produccionData } = finalObj.historicoDeProduccion

  let wellLogFile = finalObj.evaluacionPetrofisica.imgURL
  let wellBoreFile = finalObj.mecanicoYAparejoDeProduccion.imgURL
  let sistemasArtificialesFile = finalObj.sistemasArtificialesDeProduccion.imgURL

  let labResultsFile
  let simResultsFile
  let incProdFile



  let { objetivo, alcances, tipoDeIntervenciones } = finalObj.objetivoYAlcancesIntervencion

  let { pruebasDeLaboratorioData } = finalObj.pruebasDeLaboratorio


  if (tipoDeIntervenciones === 'estimulacion') {

      console.log("HERERER E", finalObj.propuestaEstimulacion)
      //Propuesta Estimulaction
      var { intervalo, longitudDeIntervalo, volAparejo,
        capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = finalObj.propuestaEstimulacion

      //Simulacion Resultados Estimulacion
      var { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas,
        volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma,
        volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano } = finalObj.resultadosSimulacionEstimulacion

      //EstIncProd
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncEstim } = finalObj.estIncProduccionEstimulacion

      //Est Cost
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes,
        estCostDeN2, estCostHCL } = finalObj.estCostEstimulacion

      var { cedulaData } = finalObj.propuestaEstimulacion

      labResultsFile = finalObj.resultadosSimulacionEstimulacion.imgURL
      incProdFile = finalObj.estIncProduccionEstimulacion.imgURL
      simResultsFile = finalObj.resultadosSimulacionEstimulacion.imgURL
  }
  else if (tipoDeIntervenciones === 'acido') {
      //Propuesta De Fracturamiento Acido
      var { intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal } = finalObj.propuestaAcido

      //Resultados De La Simulacion
      var { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = finalObj.resultadosSimulacionAcido

      //Estimacion Del Incremento De Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncAcido } = finalObj.estIncProduccionAcido

       //Estimacion De Costos
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo,
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac,
        estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante  } = finalObj.estCostAcido
 
      var { cedulaData } = finalObj.propuestaAcido

      labResultsFile = finalObj.resultadosSimulacionAcido.imgURL
      incProdFile = finalObj.estIncProduccionAcido.imgURL
      simResultsFile = finalObj.resultadosSimulacionAcido.imgURL
  }

  else if (tipoDeIntervenciones === 'apuntalado') {
      //Propuesta De Fracturamiento Apuntalado
      var { intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante,
        volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido } = finalObj.propuestaApuntalado

      //Resultados de simulacion Apuntalado
      var { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
        fcd, presionNeta, eficienciaDeFluidoDeFractura  } = finalObj.resultadosSimulacionApuntalado


      //Est Inc Produccion
      var { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncApuntalado } = finalObj.estIncProduccionApuntalado


      //Est Cost Apuntalado
      var { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo,
        estCostDeSistemaNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac,
        estCostBacheNeutralizador, estCostProtectorDeArbol } = finalObj.estCostApuntalado

      var { cedulaData } = finalObj.propuestaApuntalado

      labResultsFile = finalObj.resultadosSimulacionApuntalado.imgURL
      incProdFile = finalObj.estIncProduccionApuntalado.imgURL
      simResultsFile = finalObj.resultadosSimulacionApuntalado.imgURL
  }



  // write to db
  let fieldFormacionID = Math.floor(Math.random() * 1000000000)
  let wellFormacionID = Math.floor(Math.random() * 1000000000)
  let interventionID = Math.floor(Math.random() * 1000000000)
  let inputInterventionID
  let intervalID
  let zoneID

  connection.beginTransaction(function(err) {
    if (err) { throw err; }

    connection.query(INSERT_FIELDS_QUERY, [
    fieldFormacionID, subdireccion, activo, campo, formacion,
    descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
    dpPerAnoField, tyacField, prField, tipoDeFluidoField, densidadDelAceiteField, pSatField,
    rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
    porosidadField, swField, kPromedioField, caaField, cgaField,
    qoField, qgField, rgaField, fwField, npField,
    gpField, wpField, rraField, rrgField, rrpceField,
    h2sField, co2Field, n2Field], (err, results) => {
      console.log('field', err)
      console.log('field', results)

      connection.query(INSERT_WELL_QUERY, [
      wellFormacionID, subdireccion, activo, campo, pozo,
      formacion, intervaloProductor, espesorBruto, espesorNeto, caliza,
      dolomia, arcilla, porosidad, permeabilidad, sw,
      caa, cga, tipoDePozo, pwsFecha, pwfFecha,
      deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador,
      profSensorPYT, tipoDeSistemo ], (err, results) => {
        console.log('well', err)
        console.log('well', results)

        let values = []

        historialIntervencionesData.forEach(i => {
          inputInterventionID = Math.floor(Math.random() * 1000000000)
          values.push([wellFormacionID, inputInterventionID, i.fecha, i.intervenciones])
        })

        connection.query(INSERT_HIST_INTERVENCIONES_QUERY, [values], (err, results) => {
          console.log('user input intervention', err)
          console.log('user input intervention', results)

          values = []

          layerData.forEach(i => {
            intervalID = Math.floor(Math.random() * 1000000000)
            values.push([intervalID, wellFormacionID, i.interval, i.cimaMD, i.baseMD,
              i.cimaMV, i.baseMV, i.vArc, i.porosity, i.sw, i.dens, i.resis, i.perm])
          })

          connection.query(INSERT_LAYER_QUERY, [values], (err, results) => {
            console.log('layers', err)
            console.log('layers', results)

            values = []

            mudLossData.forEach(i => {
              zoneID = Math.floor(Math.random() * 1000000000)
              values.push([zoneID, wellFormacionID, i.cimaMD, i.baseMD, i.lodoPerdido, i.densidad])
            })

            connection.query(INSERT_MUD_LOSS_QUERY, [values], (err, results) => {
              console.log('mud loss', err)
              console.log('mud loss', results)


              connection.query(INSERT_MECANICO_QUERY, [
                wellFormacionID, tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
                tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase,
                diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
                volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular
              ], (err, results) => {
                console.log('mecanico', err)
                console.log('mecanico', results)

                connection.query(INSERT_ANALISIS_AGUA_QUERY, [
                    wellFormacionID, pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
                    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
                    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
                    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
                    densidadAt20 
                ], (err, results) => {
                  console.log('agua', err)
                  console.log('agua', results)

                  let query = 'SELECT(1) FROM WellProductionSystemsEmboloViajero'

                  switch(tipoDeSistemo) {
                    case 'emboloViajero':
                      query = `INSERT INTO WellProductionSystemsEmboloViajero (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO) VALUES
                        (?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV]
                      break
                    case 'bombeoNeumatico':
                      query = `INSERT INTO WellProductionSystemsBombeoNeumatico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                        ORIFICIO, VOLUMEN_DE_GAS_INYECTADO) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN,
                        profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN]
                      break
                    case 'bombeoHidraulico':
                      query = `INSERT INTO WellProductionSystemsBombeoHidraulico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH,
                        tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH]
                      break
                    case 'bombeoCavidadesProgresivas':
                      query = `INSERT INTO WellProductionSystemsBombeoCavidadesProgresivas (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                        TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
                        hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP]
                      break
                    case 'bombeoElectrocentrifugo':
                      query = `INSERT INTO WellProductionSystemsBombeoElectrocentrifugo (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                        TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                      values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE,
                        amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE]
                      break
                    case 'bombeoMecanico':
                      query = `INSERT INTO WellProductionSystemsBombeoMecanico (
                        WELL_FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                        TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                        PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO) VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                        values = [wellFormacionID, presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
                          tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
                          nivelDinamico, nivelEstatico]
                    break;
                  }


                  connection.query(query, values, (err, results) => {
                    console.log('sistemas', err)
                    console.log('sistemas', results)

                    values = []

                    presionDataCampo.forEach(i => {
                      values.push([fieldFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr])
                    })

                    connection.query(INSERT_FIELD_PRESSURE_QUERY, [values], (err, results) => {
                      console.log('field pressure', err)
                      console.log('field pressure', results)

                      values = []

                      console.log(presionDataPozo)

                      presionDataPozo.forEach(i => {
                        values.push([wellFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr])
                      })

                      connection.query(INSERT_WELL_PRESSURE_QUERY, [values], (err, results) => {
                        console.log('well pressure', err)
                        console.log('well pressure', results)

                        connection.query(INSERT_WELL_AFOROS_QUERY, [
                        wellFormacionID, fecha, estrangulado, ptp, ttp, pbaj, tbaj, psep, tsep,
                        ql, qo, qg, qw, rga, salinidad, ph], (err, results) => {
                          console.log('well aforos', err)
                          console.log('well aforos', results)

                          values = []
                          produccionData.forEach(i => {
                            values.push([wellFormacionID, i.fecha, i.dias, i.qo, i.qw, i.qg, i.qgl, i.np, i.wp, i.gp, i.gi, i.rga, i.fw, i.pozosProdActivos])
                          })

                          connection.query(INSERT_WELL_PRODUCCION_QUERY, [values], (err, results) => {
                            console.log('well prod', err)
                            console.log('well prod', results)

                            values = [
                              [wellFormacionID, 'Well Log', wellLogFile],
                              [wellFormacionID, 'Well Bore Diagram', wellBoreFile],
                              [wellFormacionID, 'Sistemas Artificiales', sistemasArtificialesFile]
                            ]

                            connection.query(INSERT_WELL_IMAGE_QUERY, [values], (err, results) => {
                              console.log('well img', err)
                              console.log('well img', results)

                              connection.query(INSERT_INTERVENTION_BASE_QUERY, [
                                interventionID, wellFormacionID, objetivo, alcances, tipoDeIntervenciones 
                              ], (err, results) => {
                                console.log('intervention base', err)
                                console.log('intervention base', results)

                                console.log(tipoDeIntervenciones)

                                query = tipoDeIntervenciones === 'estimulacion' ? INSERT_INTERVENTION_ESIMULACION_QUERY : tipoDeIntervenciones === 'acido' ? INSERT_INTERVENTION_ACIDO_QUERY : INSERT_INTERVENTION_APUNTALADO_QUERY

                                values = tipoDeIntervenciones === 'estimulacion' ? [
                                    interventionID, wellFormacionID, intervalo, longitudDeIntervalo, volAparejo,
                                    capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
                                    volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido,
                                    volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas,
                                    volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma,
                                    volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano,
                                    estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                    estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                    estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                    estIncGastoCompromisoQg, obervacionesEstIncEstim
                                  ]

                                  : tipoDeIntervenciones === 'acido' ? [
                                      interventionID, wellFormacionID, intervalo,
                                      longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
                                      volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal,
                                      moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, 
                                      longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
                                      conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                      estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                      estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                      estIncGastoCompromisoQg, obervacionesEstIncAcido
                                    ] : [
                                      interventionID, wellFormacionID, intervalo,
                                      longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante,
                                      volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido,
                                      moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
                                      relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos,
                                      longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad,
                                      fcd, presionNeta, eficienciaDeFluidoDeFractura,
                                      estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
                                      estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
                                      estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
                                      estIncGastoCompromisoQg, obervacionesEstIncApuntalado
                                    ]


                                connection.query(query, values, (err, results) => {
                                  console.log('intervention', err)
                                  console.log('intervention', results)

                                  values = []
                                  console.log(pruebasDeLaboratorioData)

                                  const labResultValues = []
                                  const labExtraValues = []
                                  pruebasDeLaboratorioData.forEach(i => {
                                    const labID = Math.floor(Math.random() * 1000000000)
                                    values.push([labID, interventionID, wellFormacionID, i.type, i.fechaMuestreo, i.fechaPrueba, i.compania, i.superviso, i.obervaciones])
                                    i.sistemasTable.forEach(i => {
                                      let resultID = Math.floor(Math.random() * 1000000000)
                                      labResultValues.push([resultID, labID, interventionID, wellFormacionID, i.sistem, i.tiempoRompimiento, i.interfase, i.solidosFiltrar, i.resultado])
                                    })

                                    let newRow = [labID, interventionID, wellFormacionID, i.contenidoDeAceite, i.contenidoDeAgua, i.contenidoDeEmulsion, i.contenidoDeSolidos, i.tipoDeSolidos, i.densidadDelAceite, i.densidadDelAgua, i.densidadDeLaEmulsion, i.contenidoDeAsfaltenos, i.contenidoDeParafinas, i.contenidoDeResinas, i.indiceDeEstabilidadDelColoidal, i.indiceDeEstabilidadDelAgua, i.pH, i.salinidad, i.viscosidadDelAceite]
                                    if (tipoDeIntervenciones === 'acido') {
                                      newRow = newRow.concat([i.sistemAcido, i.pesoMuestraInicial, i.pesoMuestraFinal, i.solubilidad, i.sistemAcidoGrabado, i.nucleoDeFormacion, i.grabado, i.tipoDeGelLineal, i.viscosidadDelGelLineal, i.tiempoDeReticulacion, i.pHGelLineal, i.tiempoDeRompedorDelGel])
                                      labExtraValues.push(newRow)
                                    }
                                    else if (tipoDeIntervenciones === 'apuntalado') {
                                      newRow = newRow.concat([i.tipoDeGelLineal, i.viscosidadDelGelLineal, i.tiempoDeReticulacion, i.pHGelLineal, i.tiempoDeRompedorDelGel, i.tamanoDelApuntalante, i.gravedadEspecifica, i.esfericidad, i.redondeo, i.turbidez, i.psi, i.pruebaDeSolubilidadConAcida])
                                      labExtraValues.push(newRow)
                                    }
                                  })
                                  
                                  connection.query(INSERT_LAB_TEST_QUERY, [values], (err, results) => {
                                    console.log('lab tests', err)
                                    console.log('lab tests', results)


                                    query = tipoDeIntervenciones === 'estimulacion' ? INSERT_CEDULA_ESTIMULACION_QUERY : tipoDeIntervenciones === 'acido' ? INSERT_CEDULA_ACIDO_QUERY : INSERT_CEDULA_APUNTALADO_QUERY

                                    values = []

                                    if (tipoDeIntervenciones === 'estimulacion') {
                                      cedulaData.forEach(i => {
                                        let cedulaID = Math.floor(Math.random() * 1000000000)
                                        values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo])
                                      })
                                    } 
                                    else {
                                      cedulaData.forEach(i => {
                                        let cedulaID = Math.floor(Math.random() * 1000000000)
                                        values.push([cedulaID, interventionID, wellFormacionID, i.etapa, i.sistema, i.tipoDeApuntalante, i.concentraciDeApuntalante, i.volLiquid, i.gastoN2, i.gastoLiqudo, i.gastoEnFondo, i.calidad, i.volN2, i.volLiquidoAcum, i.volN2Acum, i.relN2Liq, i.tiempo])
                                      })
                                    }

                                    connection.query(query, [values], (err, results) => {
                                      console.log('cedula', err)
                                      console.log('cedula', results)

                                      connection.query(INSERT_LAB_RESULTS_QUERY, [labResultValues], (err, results) => {
                                        console.log('lab results', err)
                                        console.log('lab results', results)

                                        query =  tipoDeIntervenciones === 'estimulacion' ? `select(1) FROM Users LIMIT 1` : tipoDeIntervenciones === 'acido' ? INSERT_LAB_ACIDO_QUERY : INSERT_LAB_APUNTALADO_QUERY
                                        
                                        connection.query(query, [labExtraValues], (err, results) => {
                                          console.log('lab extras', err)
                                          console.log('lab extras', results)


                                          values = []
                                          if (tipoDeIntervenciones === 'estimulacion') {
                                            Object.keys(finalObj.estCostEstimulacion).forEach(key => {
                                              let obj = finalObj.estCostEstimulacion[key]
                                              let costID = Math.floor(Math.random() * 1000000000)
                                              values.push([costID, interventionID, key, obj.company, obj.cost])
                                            })
                                          }
                                          else if (tipoDeIntervenciones === 'acido') {
                                            Object.keys(finalObj.estCostAcido).forEach(key => {
                                              let obj = finalObj.estCostAcido[key]
                                              let costID = Math.floor(Math.random() * 1000000000)
                                              values.push([costID, interventionID, key, obj.company, obj.cost])
                                            })
                                          }
                                          else if (tipoDeIntervenciones === 'apuntalado') {
                                            Object.keys(finalObj.estCostApuntalado).forEach(key => {
                                              let obj = finalObj.estCostApuntalado[key]
                                              let costID = Math.floor(Math.random() * 1000000000)
                                              values.push([costID, interventionID, key, obj.company, obj.cost])
                                            })
                                          }

                                          connection.query(INSERT_COSTS_QUERY, [values], (err, results) => {
                                            console.log('costs', err)
                                            console.log('costs', results)

                                            values = [
                                              [interventionID, 'Lab Results', labResultsFile],
                                              [interventionID, 'Est Inc Prod', incProdFile],
                                              [interventionID, 'Simulation Results', simResultsFile]
                                            ]

                                            connection.query(INSERT_INTERVENTION_IMAGE_QUERY, [values], (err, results) => {
                                              console.log('intervention img', err)
                                              console.log('intervention img', results)



                                                connection.commit(function(err) {
                                                    if (err) {
                                                      return connection.rollback(function() {
                                                        throw err;
                                                      });
                                                    }
                                                    console.log('success!');
                                                    var log = 'Post ' + results + ' added';
                                                    console.log(log)
                                                    res.json({message: 'success'});

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
      })
    })
  })
}