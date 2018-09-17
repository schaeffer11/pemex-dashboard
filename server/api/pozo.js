import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { addObject, signedURL, deleteObject, getBuckets } from '../aws/index';


const INSERT_WELL_QUERYold = `INSERT INTO Wells (
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
        (null, 1, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?)`

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

// const INSERT_WELL_IMAGE_QUERY = `INSERT INTO WellImages (
//         WELL_FORMACION_ID, IMAGE_NAME, IMG_URL) VALUES
//         ?`
const INSERT_WELL_IMAGE_QUERY = `SELECT(1) FROM WellImages`


const INSERT_INTERVENTION_BASE_QUERY = `INSERT INTO Intervenciones (
      INTERVENCIONES_ID, WELL_FORMACION_ID, OBJETIVO, ALCANCES, TIPO_DE_INTERVENCIONES)
      VALUES (?, ?, ?, ?, ?)`

// , EST_COSTO_COMPANIA_DE_SERVICIOS, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_DE_SISTEMA_REACTIVO,
//         EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2, EST_COSTO_DE_HCL
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


// EST_COSTO_COMPANIA_DE_SERVICIO, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_UNIDADES_DE_ALTA_PRESION,
//         EST_COSTO_DEL_GEL_DE_FRACTURA, EST_COSTO_DE_SISTEMA_REACTIVO, EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2,
//         EST_COSTO_DE_HCL, EST_COSTO_DE_SISTEMAS_ACIDOS_RETARDADOS, EST_COSTO_EQUIPO_DE_FRACTURAMIENTO_DE_POZOS, EST_COSTO_GEL_LINEAL, EST_COSTO_DE_TRABAJOS_DE_BOMBEO_DIVERSOS,
//         EST_COSTO_DE_LLENADO_DE_POZO_Y_PRUEBA_DE_ADMISION, EST_COSTO_DEL_MINIFRAC, EST_COSTO_DE_BACHE_NEUTRALIZADOR, EST_COSTO_DE_ARBOL, EST_COSTO_DEL_APUNTALANTE

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

// , EST_COSTO_COMPANIA_DE_SERVICIO, EST_COSTO_DE_RENTA_DE_BARCO, EST_COSTO_UNIDADES_DE_ALTA_PRESION,
        // EST_COSTO_DEL_GEL_DE_FRACTURA, EST_COSTO_DE_SISTEMA_REACTIVO, EST_COSTO_DE_SISTEMA_NO_REACTIVO, EST_COSTO_DE_DIVERGENTES, EST_COSTO_DE_N2,
        // EST_COSTO_DE_HCL, EST_COSTO_DE_SISTEMAS_ACIDOS_RETARDADOS, EST_COSTO_EQUIPO_DE_FRACTURAMIENTO_DE_POZOS, EST_COSTO_GEL_LINEAL, EST_COSTO_DE_TRABAJOS_DE_BOMBEO_DIVERSOS,
        // EST_COSTO_DE_LLENADO_DE_POZO_Y_PRUEBA_DE_ADMISION, EST_COSTO_DEL_MINIFRAC, EST_COSTO_DE_BACHE_NEUTRALIZADOR, EST_COSTO_DE_PROTECTOR_DE_ARBOL
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

  // let wellLogFile = finalObj.evaluacionPetrofisica.imgURL
  // let wellBoreFile = finalObj.mecanicoYAparejoDeProduccion.imgURL
  // let sistemasArtificialesFile = finalObj.sistemasArtificialesDeProduccon.imgURL


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
      // console.log('field', err)
      // console.log('field', results)

      connection.query(INSERT_WELL_QUERY, [
      wellFormacionID, subdireccion, activo, campo, pozo,
      formacion, intervaloProductor, espesorBruto, espesorNeto, caliza,
      dolomia, arcilla, porosidad, permeabilidad, sw,
      caa, cga, tipoDePozo, pwsFecha, pwfFecha,
      deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador,
      profSensorPYT, tipoDeSistemo ], (err, results) => {
        // console.log('well', err)
        // console.log('well', results)

        let values = []

        historialIntervencionesData.forEach(i => {
          inputInterventionID = Math.floor(Math.random() * 1000000000)
          values.push([wellFormacionID, inputInterventionID, i.fecha, i.intervenciones])
        })

        connection.query(INSERT_HIST_INTERVENCIONES_QUERY, [values], (err, results) => {
          // console.log('user input intervention', err)
          // console.log('user input intervention', results)

          values = []

          layerData.forEach(i => {
            intervalID = Math.floor(Math.random() * 1000000000)
            values.push([intervalID, wellFormacionID, i.interval, i.cimaMD, i.baseMD,
              i.cimaMV, i.baseMV, i.vArc, i.porosity, i.sw, i.dens, i.resis, i.perm])
          })

          connection.query(INSERT_LAYER_QUERY, [values], (err, results) => {
            // console.log('layers', err)
            // console.log('layers', results)

            values = []

            mudLossData.forEach(i => {
              zoneID = Math.floor(Math.random() * 1000000000)
              values.push([zoneID, wellFormacionID, i.cimaMD, i.baseMD, i.lodoPerdido, i.densidad])
            })

            connection.query(INSERT_MUD_LOSS_QUERY, [values], (err, results) => {
              // console.log('mud loss', err)
              // console.log('mud loss', results)


              connection.query(INSERT_MECANICO_QUERY, [
                wellFormacionID, tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
                tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase,
                diametroDeOrificio, penetracion, tratamientoPor, volumenAparejoDeProduccion,
                volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular
              ], (err, results) => {
                // console.log('mecanico', err)
                // console.log('mecanico', results)

                connection.query(INSERT_ANALISIS_AGUA_QUERY, [
                    wellFormacionID, pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
                    durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
                    salinidadComoNaCl, sodio, calcio, magnesio, fierro,
                    cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
                    densidadAt20 
                ], (err, results) => {
                  // console.log('agua', err)
                  // console.log('agua', results)

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
                    // console.log('sistemas', err)
                    // console.log('sistemas', results)

                    values = []

                    presionDataCampo.forEach(i => {
                      values.push([fieldFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr])
                    })

                    connection.query(INSERT_FIELD_PRESSURE_QUERY, [values], (err, results) => {
                      // console.log('field pressure', err)
                      // console.log('field pressure', results)

                      values = []

                      console.log(presionDataPozo)

                      presionDataPozo.forEach(i => {
                        values.push([wellFormacionID, i.fecha, i.Qo, i.Np, i.Pws, i.Pr])
                      })

                      connection.query(INSERT_WELL_PRESSURE_QUERY, [values], (err, results) => {
                        // console.log('well pressure', err)
                        // console.log('well pressure', results)

                        connection.query(INSERT_WELL_AFOROS_QUERY, [
                        wellFormacionID, fecha, estrangulado, ptp, ttp, pbaj, tbaj, psep, tsep,
                        ql, qo, qg, qw, rga, salinidad, ph], (err, results) => {
                          // console.log('well aforos', err)
                          // console.log('well aforos', results)

                          values = []
                          produccionData.forEach(i => {
                            values.push([wellFormacionID, i.fecha, i.dias, i.qo, i.qw, i.qg, i.qgl, i.np, i.wp, i.gp, i.gi, i.rga, i.fw, i.pozosProdActivos])
                          })

                          connection.query(INSERT_WELL_PRODUCCION_QUERY, [values], (err, results) => {
                            // console.log('well prod', err)
                            // console.log('well prod', results)

                            // values = [
                            //   [wellFormacionID, 'Well Log', wellLogFile],
                            //   [wellFormacionID, 'Well Bore Diagram'. wellBoreFile],
                            //   [wellFormacionID, 'Sistemas Artificiales', sistemasArtificialesFile]
                            // ]

                            connection.query(INSERT_WELL_IMAGE_QUERY, [values], (err, results) => {
                              // console.log('well img', err)
                              // console.log('well img', results)


                              console.log('objectives', finalObj.objetivoYAlcancesIntervencion)

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

                                  pruebasDeLaboratorioData.forEach(i => {
                                    let labID = Math.floor(Math.random() * 1000000000)
                                    values.push([labID, interventionID, wellFormacionID, i.type, i.fechaMuestreo, i.fechaPrueba, i.compania, i.superviso, i.obervaciones])
                                  })
                                  
                                  connection.query(INSERT_LAB_TEST_QUERY, [values], (err, results) => {
                                    console.log('lab tests', err)
                                    console.log('lab tests', results)

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
}




// exports.create = function(req, res, next){

//     //Ficha Tecnica Del Pozo
//     let { subdireccion, bloque, activo, campo, pozo, formacion, intervaloProductor, espesorBruto, espesorNeto, caliza,
//           dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha,
//           deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
//           relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = req.body
          
//     //Ficha Tecnia Del Campo
//     let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
//       dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField,
//       rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
//       porosidadField, swField, kPromedioField, caaField, cgaField,
//       qoField, qgField, rgaField, fwField, npField,
//       gpField, wpField, rraField, rrgField, rrpceField,
//       h2sField, co2Field, n2Field } = req.body

//     //Informacion De Sistemas Artificiales De Produccion
//     let { tipoDeSistemo, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV,
//       presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN,
//       volumenDeGasInyectadoBN, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH,
//       fluidoMotrizBH, equipoSuperficialBH, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
//       hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, profundidadDelMotorBE,
//       diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE,
//       longitudDeCableBE, rmpBE, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
//       tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
//       nivelDinamico, nivelEstatico } = req.body

//     //Mecanico Y Aparejo De Produccion
//     let {tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
//       tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase,
//       diametroDeOrificio, penetracion, tipoDeSAP, tratamientoPor, volumenAparejoDeProduccion,
//       volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular } = req.body

//     //Analisis Del Agu
//     let {pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
//       durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
//       salinidadComoNaCl, sodio, calcio, magnesio, fierro,
//       cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
//       densidadAt20 } = req.body

    
//     connection.beginTransaction(function(err) {
//       if (err) { throw err; }

//         connection.query(INSERT_WELL_QUERY, [
//           subdireccion, bloque, activo, campo, pozo,
//           formacion, intervaloProductor, espesorBruto, espesorNeto, caliza,
//           dolomia, arcilla, porosidad, permeabilidad, sw,
//           caa, cga, tipoDePozo, pwsFecha, pwfFecha,
//           deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador,
//           profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena,
//           relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos, tipoDeSistemo,
//           tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt,
//           tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparos, fase,
//           diametroDeOrificio, penetracion, tipoDeSAP, tratamientoPor, volumenAparejoDeProduccion,
//           volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular,
//           pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales,
//           durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3,
//           salinidadComoNaCl, sodio, calcio, magnesio, fierro,
//           cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15,
//           densidadAt20], function (error, results, fields) {

//           const wellId = results.insertId;

//           if (error) {
//             return connection.rollback(function() {
//               console.log('rollback');
//               throw error;
//             });
//           }

//           connection.query(INSERT_FIELDS_QUERY, [
//             subdireccion, bloque, activo, campo, formacion,
//             descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
//             dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField,
//             rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
//             porosidadField, swField, kPromedioField, caaField, cgaField,
//             qoField, qgField, rgaField, fwField, npField,
//             gpField, wpField, rraField, rrgField, rrpceField,
//             h2sField, co2Field, n2Field], (err, results) => {

//             let query;
//             let vals;

//             console.log(tipoDeSistemo)

//             switch(tipoDeSistemo) {
//               case 'emboloViajero':
//                 query = `INSERT INTO ProductionSystemsEmboloViajero (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO) VALUES
//                   (1, ?, 1, ?, ?, ?, ?)`
//                 vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV]
//                 break
//               case 'bombeoNeumatico':
//                 query = `INSERT INTO ProductionSystemsBombeoNeumatico (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
//                   ORIFICIO, VOLUMEN_DE_GAS_INYECTADO) VALUES
//                   (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
//                 vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN,
//                   profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN]
//                 break
//               case 'bombeoHidraulico':
//                 query = `INSERT INTO ProductionSystemsBombeoHidraulico (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ) VALUES
//                   (1, ?, 1, ?, ?, ?, ?, ?, ?, ?)`
//                 vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH,
//                   tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH]
//                 break
//               case 'bombeoCavidadesProgresivas':
//                 query = `INSERT INTO ProductionSystemsBombeoCavidadesProgresivas (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
//                   TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE) VALUES
//                   (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//                 vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
//                   hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP]
//                 break
//               case 'bombeoElectrocentrifugo':
//                 query = `INSERT INTO ProductionSystemsBombeoElectrocentrifugo (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
//                   TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM) VALUES
//                   (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//                 vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE,
//                   amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE]
//                 break
//               case 'bombeoMecanico':
//                 query = `INSERT INTO ProductionSystemsBombeoMecanico (
//                   SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
//                   TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
//                   PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO) VALUES
//                   (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//                   vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
//                     tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
//                     nivelDinamico, nivelEstatico]
//               break;
//             }

//             if(query){ 
//               return connection.query(query, vals, (err, results) => {

//                 connection.commit(function(err) {
//                   if (err) {
//                     return connection.rollback(function() {
//                       throw err;
//                     });
//                   }
//                   console.log('success!');
//                   var log = 'Post ' + results.insertId + ' added';
//                   console.log(log)
//                    res.json({message: 'success'});

//                 })
//               })
//             }else {
//                var err = new Error('failed');
//                err.status = 500;
//                next(err);
//             }

//          })
//       })
//     })
// }