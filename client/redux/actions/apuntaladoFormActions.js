import axios from 'axios'

export function submitForm(fields) {
  let data = getFieldsAsDataObject(fields)
  return (dispatch, getState) => {
    dispatch({type: 'APUNTALADO_FORM_SUBMIT'})
    if(formIsValid(data)){
      return postForm(data)
       .then(
          res  => dispatch({type: 'APUNTALADO_FORM_SUCCESS', response: res}),
          error => dispatch({type: 'APUNTALADO_FORM_ERROR', error: error})
       )
    }else {
      dispatch({type: 'APUNTALADO_FORM_ERROR'})
    }
  }
}

function formIsValid(data){
    return true;
}


function postForm(data){
    return axios.post('api/storeInterventionData', {
      data: data,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
      .then(res => {return res})
      .catch(error => {return error})
}


function getFieldsAsDataObject(form){
  let {objetivoYAlcancesIntervencion, pruebasDeLaboratorio, propuestaApuntalado, pruebasDeLaboratorioApuntalado, resultadosSimulacionApuntalado, estIncProduccionApuntalado, estCostApuntalado} = form

  pruebasDeLaboratorio = pruebasDeLaboratorio.toJS();
  objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS();
  propuestaApuntalado = propuestaApuntalado.toJS();
  pruebasDeLaboratorioApuntalado = pruebasDeLaboratorioApuntalado.toJS();
  resultadosSimulacionApuntalado = resultadosSimulacionApuntalado.toJS();
  estIncProduccionApuntalado = estIncProduccionApuntalado.toJS();
  estCostApuntalado = estCostApuntalado.toJS();

  let { objetivo, alcances, tipoDeIntervenciones } = objetivoYAlcancesIntervencion

  let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = pruebasDeLaboratorio

  let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, volLiquidoAcum, 
            volN2Acum, relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenDeApuntalante, 
            volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido} = propuestaApuntalado
  let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, 
            contenidoDeAsfaltenos, contenidoDeParafinas, contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, 
            viscosidadDelAceite, tipoDeGelLineal, viscosidadDelGelLineal, tiempoDeReticulacion, pHGelLineal, tiempoDeRompedorDelGel, tamanoDelApuntalante, 
            gravedadEspecifica, esfericidad, redondeo, turbidez, resistencia, pruebaDeSolubilidadConAcida, obervacionesPruebasLabApuntalado} = pruebasDeLaboratorioApuntalado
  let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, fcd, presionNeta, 
            eficienciaDeFluidoDeFractura} = resultadosSimulacionApuntalado
  let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, 
            estIncIP, estIncDeltaP, estIncGastoCompromisoQo, estIncGastoCompromisoQg, obervacionesEstIncApuntalado} = estIncProduccionApuntalado
  let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, estCostDeSistemaNoRactivo, 
            estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, 
            estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol} = estCostApuntalado

  const data = {
        objetivo: objetivo,
        alcances: alcances,
        tipoDeIntervenciones: tipoDeIntervenciones,
        etapa: etapa,
        sistema: sistema,
        tipoDeApuntalante: tipoDeApuntalante,
        concentraciDeApuntalante: concentraciDeApuntalante,
        volLiquid: volLiquid,
        gastoN2: gastoN2,
        gastoLiqudo: gastoLiqudo,
        gastoEnFondo: gastoEnFondo,
        calidad: calidad,
        volN2: volN2,
        volLiquidoAcum: volLiquidoAcum,
        volN2Acum: volN2Acum,
        relN2Liq: relN2Liq,
        tiempo: tiempo,
        intervalo: intervalo,
        longitudDeIntervalo: longitudDeIntervalo,
        volAparejo: volAparejo,
        capacidadTotalDelPozo: capacidadTotalDelPozo,
        volumenPrecolchonN2: volumenPrecolchonN2,
        volumenDeApuntalante: volumenDeApuntalante,
        volumenDeGelDeFractura: volumenDeGelDeFractura,
        volumenDesplazamiento: volumenDesplazamiento,
        volumenTotalDeLiquido: volumenTotalDeLiquido,
        tipoDeAnalisis: tipoDeAnalisis,
        contenidoDeAceite: contenidoDeAceite,
        contenidoDeAgua: contenidoDeAgua,
        contenidoDeEmulsion: contenidoDeEmulsion,
        contenidoDeSolidos: contenidoDeSolidos,
        tipoDeSolidos: tipoDeSolidos,
        densidadDelAceite: densidadDelAceite,
        densidadDelAgua: densidadDelAgua,
        densidadDeLaEmulsion: densidadDeLaEmulsion,
        contenidoDeAsfaltenos: contenidoDeAsfaltenos,
        contenidoDeParafinas: contenidoDeParafinas,
        contenidoDeResinas: contenidoDeResinas,
        indiceDeEstabilidadDelColoidal: indiceDeEstabilidadDelColoidal,
        indiceDeEstabilidadDelAgua: indiceDeEstabilidadDelAgua,
        pH: pH,
        salinidad: salinidad,
        viscosidadDelAceite: viscosidadDelAceite,
        tipoDeGelLineal: tipoDeGelLineal,
        viscosidadDelGelLineal: viscosidadDelGelLineal,
        tiempoDeReticulacion: tiempoDeReticulacion,
        pHGelLineal: pHGelLineal,
        tiempoDeRompedorDelGel: tiempoDeRompedorDelGel,
        tamanoDelApuntalante: tamanoDelApuntalante,
        gravedadEspecifica: gravedadEspecifica,
        esfericidad: esfericidad,
        redondeo: redondeo,
        turbidez: turbidez,
        resistencia: resistencia,
        pruebaDeSolubilidadConAcida: pruebaDeSolubilidadConAcida,
        obervacionesPruebasLabApuntalado: obervacionesPruebasLabApuntalado,
        longitudApuntalada: longitudApuntalada,
        alturaTotalDeFractura: alturaTotalDeFractura,
        anchoPromedio: anchoPromedio,
        concentractionAreal: concentractionAreal,
        conductividad: conductividad,
        fcd: fcd,
        presionNeta: presionNeta,
        eficienciaDeFluidoDeFractura: eficienciaDeFluidoDeFractura,
        estIncEstrangulador: estIncEstrangulador,
        estIncPtp: estIncPtp,
        estIncTtp: estIncTtp,
        estIncPbaj: estIncPbaj,
        estIncTbaj: estIncTbaj,
        estIncPtr: estIncPtr,
        estIncQl: estIncQl,
        estIncQo: estIncQo,
        estIncQg: estIncQg,
        estIncQw: estIncQw,
        estIncRGA: estIncRGA,
        estIncSalinidad: estIncSalinidad,
        estIncIP: estIncIP,
        estIncDeltaP: estIncDeltaP,
        estIncGastoCompromisoQo: estIncGastoCompromisoQo,
        estIncGastoCompromisoQg: estIncGastoCompromisoQg,
        obervacionesEstIncApuntalado: obervacionesEstIncApuntalado,
        estCostCompaniaDeServicio: estCostCompaniaDeServicio,
        estCostoDeRentaDeBarco: estCostoDeRentaDeBarco,
        estCostUnidadesDeAltaPresion: estCostUnidadesDeAltaPresion,
        estCostDelGelDeFractura: estCostDelGelDeFractura,
        estCostDeSistemoRactivo: estCostDeSistemoRactivo,
        estCostDeSistemaNoRactivo: estCostDeSistemaNoRactivo,
        estCostDeDivergentes: estCostDeDivergentes,
        estCostDeN2: estCostDeN2,
        estCostDeHCL: estCostDeHCL,
        estCostDeSistemasAcidosRetardados: estCostDeSistemasAcidosRetardados,
        estCostDeCostoEquipoDeFacturamientoDePozos: estCostDeCostoEquipoDeFacturamientoDePozos,
        estCostGelLineal: estCostGelLineal,
        estCostTrabajosDeBombeoDiversos: estCostTrabajosDeBombeoDiversos,
        estCostLlenadoDePozoYPruebaDeAdmision: estCostLlenadoDePozoYPruebaDeAdmision,
        estCostMinifrac: estCostMinifrac,
        estCostBacheNeutralizador: estCostBacheNeutralizador,
        estCostProtectorDeArbol: estCostProtectorDeArbol,
  }

  

  return data;
}
