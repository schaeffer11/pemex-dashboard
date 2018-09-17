import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)

const INSERT_ESTIMULACION_QUERY = `INSERT INTO InterventionsTratamientoDeEstimulacions (
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

const INSERT_ACIDO_QUERY = `INSERT INTO InterventionsFractuarmientosAcido (
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

const INSERT_APUNTALADO_QUERY = `INSERT INTO InterventionsFractuarmientosApuntalado (
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
        

exports.create = function(req, res, next){
  let { objetivo, alcances, tipoDeIntervenciones } = req.body
  //Pruebas De Laboratoro 
  //TODO add lab tests
  // let { tipoDeAnalisis } = req.body

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

      query = INSERT_ESTIMULACION_QUERY;

      data = [objetivo, alcances, etapa, sistema, volLiquid, gastoN2, gastoLiquido,
        gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum,
        relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo,
        capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente,
        volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido,
        'need to add',
        volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas,
        volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma,
        volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano,
        estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncEstim, estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo,
        estCostDeSistemaNoReactivo, estCostDeDivergenes, estCostDeN2, estCostHCL
      ]
  }
  else if (tipoDeIntervenciones === 'acido') {
      //Propuesta De Fracturamiento Acido
      let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid,
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2,
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal } = req.body

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
 
      query = INSERT_ACIDO_QUERY;

      data = [objetivo, alcances, etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid,
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2,
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo,
        volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal,
        'need to add', longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido,
        conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura, estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj,
        estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw,
        estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo,
        estIncGastoCompromisoQg, obervacionesEstIncAcido, estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo,
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac,
        estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante
      ]
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

      query = INSERT_APUNTALADO_QUERY

      data = [
        objetivo, alcances, etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid,
        gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2,
        volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo,
        longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante,
        volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido,
        'need to add',
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

  connection.query(query, data, (err, results) => {
    if (err) {
      return { status: 500, error: true }
    }

    res.json({message: 'success'})
  })
}
