import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)

const INSERT_WELL_QUERY = `INSERT INTO Wells (
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

const INSERT_FIELDS_QUERY = `INSERT INTO Fields (
      FIELD_ID, FORMACION_ID, SUBDIRECCION, BLOQUE, ACTIVO, CAMPO, FORMACION, DESCUBRIMIENTO, FECHA_DE_EXPLOTACION,
      NUMERO_DE_POZOS_OPERANDO, P_INICIAL_ANO, P_ACTUAL_FECHA, DP_PER_ANO, TYAC, PR, DENSIDAD_DEL_ACEITE, P_SAT,
      RGA_FLUIDO, SALINIDAD, PVT_REPRESENTATIVO, LITOLOGIA, ESPESOR_NETO, POROSIDAD, SW, K_PROMEDIO, CAA, CGA,
      Qo, Qg, RGA, Fw, Np, Gp, Wp, RESERVA_REMANENTE_DE_ACEITE, RESERVA_REMONENTE_DE_GAS, RESERVA_REMANENTE_DE_PETROLEO_CRUDO_EQUIVALENTE,
      H2S, CO2, N2) VALUES
      (1, 1, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

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


exports.create = function(req, res, next){

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

    
    connection.beginTransaction(function(err) {
      if (err) { throw err; }

        connection.query(INSERT_WELL_QUERY, [
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
          densidadAt20], function (error, results, fields) {

          const wellId = results.insertId;

          if (error) {
            return connection.rollback(function() {
              console.log('rollback');
              throw error;
            });
          }

          connection.query(INSERT_FIELDS_QUERY, [
            subdireccion, bloque, activo, campo, formacion,
            descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField,
            dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField,
            rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField,
            porosidadField, swField, kPromedioField, caaField, cgaField,
            qoField, qgField, rgaField, fwField, npField,
            gpField, wpField, rraField, rrgField, rrpceField,
            h2sField, co2Field, n2Field], (err, results) => {

            let query;
            let vals;

            console.log(tipoDeSistemo)

            switch(tipoDeSistemo) {
              case 'emboloViajero':
                query = `INSERT INTO ProductionSystemsEmboloViajero (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  NUMERO_DE_DESCARGAS_O_CIRCLOS, VOLUMEN_DESPLAZADO_POR_CIRCLO) VALUES
                  (1, ?, 1, ?, ?, ?, ?)`
                vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV]
                break
              case 'bombeoNeumatico':
                query = `INSERT INTO ProductionSystemsBombeoNeumatico (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  PRESION_DE_INYECCION, PRESION_DE_DESCARGA, NUMERO_DE_VALVULAS, PREFUNDIDAD_DE_LA_VALVULA_OPERANTE,
                  ORIFICIO, VOLUMEN_DE_GAS_INYECTADO) VALUES
                  (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
                vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN,
                  profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN]
                break
              case 'bombeoHidraulico':
                query = `INSERT INTO ProductionSystemsBombeoHidraulico (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  PROFUNDIDAD_DE_LA_BOMBA, TIPO_Y_MARCA_DE_BOMBA, ORIFICIO, TIPO_DE_CAMISA, FLUIDO_MOTRIZ) VALUES
                  (1, ?, 1, ?, ?, ?, ?, ?, ?, ?)`
                vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH,
                  tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH]
                break
              case 'bombeoCavidadesProgresivas':
                query = `INSERT INTO ProductionSystemsBombeoCavidadesProgresivas (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  MOTOR_Y_TIPO_DE_MOTOR, PROFUNDIDAD_DEL_MOTOR, VELOCIDAD, HP, ARREGLO_DE_VARILLAS,
                  TIPO_DE_ELASTOMERO, PROFUNDIDAD_DEL_ANCLA_ANTITORQUE) VALUES
                  (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP,
                  hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP]
                break
              case 'bombeoElectrocentrifugo':
                query = `INSERT INTO ProductionSystemsBombeoElectrocentrifugo (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  PROFUNDIDAD_DEL_MOTOR, DIAMETRO, VOLTS, AMPERAJE, ARMADURA,
                  TIPO_DE_CABLE, LONGITUD_DE_CABLE, RPM) VALUES
                  (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE,
                  amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE]
                break
              case 'bombeoMecanico':
                query = `INSERT INTO ProductionSystemsBombeoMecanico (
                  SYSTEM_ID, WELL_ID, FORMACION_ID, PRESION_DE_CABEZA, PRESION_DE_LINEA_O_DE_SEPARADOR,
                  TIPO_DE_UNIDAD, VELOCIDAD, LONGITUD_DE_CARERA, TIPO_DE_BOMBA_SUBSUPERFICIAL, TAMANO_DE_BOMBA_SUBSUPERFICIAL,
                  PROFUNDIDAD_DE_LA_BOMBA, ARREGLO_DE_VARILLAS, CUANTA_CON_ANCIA_MECHANICO_O_EMPACADOR, NIVEL_DINAMICO, NIVEL_ESTATICO) VALUES
                  (1, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                  vals = [wellId, presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM,
                    tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM,
                    nivelDinamico, nivelEstatico]
              break;
            }

            if(query){ 
              return connection.query(query, vals, (err, results) => {

                connection.commit(function(err) {
                  if (err) {
                    return connection.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('success!');
                  var log = 'Post ' + results.insertId + ' added';
                  console.log(log)
                   res.json({message: 'success'});

                })
              })
            }else {
               var err = new Error('failed');
               err.status = 500;
               next(err);
            }

         })
      })
    })
}


