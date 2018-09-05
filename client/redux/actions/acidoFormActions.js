import axios from 'axios'

export function submitForm(fields) {
  let data = getFieldsAsDataObject(fields)
  return (dispatch, getState) => {
    dispatch({type: 'ACIDO_FORM_SUBMIT'})
    if(formIsValid(data)){
      return postForm(data)
       .then(
          res  => dispatch({type: 'ACIDO_FORM_SUCCESS', response: res}),
          error => dispatch({type: 'ACIDO_FORM_ERROR', error: error})
       )
    }else {
      dispatch({type: 'ACIDO_FORM_ERROR'})
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
  let {objetivoYAlcancesIntervencion, pruebasDeLaboratorio, propuestaAcido, pruebasDeLaboratorioAcido, resultadosSimulacionAcido, estIncProduccionAcido, estCostAcido} = form

  objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS();
  propuestaAcido = propuestaAcido.toJS();
  pruebasDeLaboratorioAcido = pruebasDeLaboratorioAcido.toJS();
  resultadosSimulacionAcido = resultadosSimulacionAcido.toJS();
  estIncProduccionAcido = estIncProduccionAcido.toJS();
  estCostAcido = estCostAcido.toJS();

  let { objetivo, alcances, tipoDeIntervenciones } = objetivoYAlcancesIntervencion

  let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = pruebasDeLaboratorio

  let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, gastoN2, gastoLiqudo, gastoEnFondo, calidad, 
        volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, 
        volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido,
        volumenDesplazamientoGelLineal} = propuestaAcido
  let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, densidadDelAceite, densidadDelAgua, 
        densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, contenidoDeResinas, indiceDeEstabilidadDelColoidal, 
        indiceDeEstabilidadDelAgua, pH, salinidad, viscosidadDelAceite, sistemAcido, pesoMuestraInicial, pesoMuestraFinal, solubilidad, 
        sistemaAcidoGrabado, nucleoDeFormacion, grabado, tipoDeGelLineal, viscosidadDelGelLineal, tiempoDeReticulacion, pHGelLineal, 
        tiempoDeRompedorDelGel, obervacionesPruebasLabAcido} = pruebasDeLaboratorioAcido
  let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, 
        eficienciaDeFluidoDeFractura} = resultadosSimulacionAcido
  let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, 
        estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, estIncGastoCompromisoQg, obervacionesEstIncAcido} = estIncProduccionAcido
  let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, 
        estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision,
        estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante} = estCostAcido

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
        volumenSistemaNoReativo: volumenSistemaNoReativo,
        volumenSistemaReactivo: volumenSistemaReactivo,
        volumenSistemaDivergente: volumenSistemaDivergente,
        volumenDesplazamientoLiquido: volumenDesplazamientoLiquido,
        volumenDesplazamientoGelLineal: volumenDesplazamientoGelLineal,
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
        sistemAcido: sistemAcido,
        pesoMuestraInicial: pesoMuestraInicial,
        pesoMuestraFinal: pesoMuestraFinal,
        solubilidad: solubilidad,
        sistemaAcidoGrabado: sistemaAcidoGrabado,
        nucleoDeFormacion: nucleoDeFormacion,
        grabado: grabado,
        tipoDeGelLineal: tipoDeGelLineal,
        viscosidadDelGelLineal: viscosidadDelGelLineal,
        tiempoDeReticulacion: tiempoDeReticulacion,
        pHGelLineal: pHGelLineal,
        tiempoDeRompedorDelGel: tiempoDeRompedorDelGel,
        obervacionesPruebasLabAcido: obervacionesPruebasLabAcido,
        longitudTotal: longitudTotal,
        longitudEfectivaGrabada: longitudEfectivaGrabada,
        alturaGrabada: alturaGrabada,
        anchoPromedio: anchoPromedio,
        concentracionDelAcido: concentracionDelAcido,
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
        obervacionesEstIncAcido: obervacionesEstIncAcido,
        estCostCompaniaDeServicio: estCostCompaniaDeServicio,
        estCostoDeRentaDeBarco: estCostoDeRentaDeBarco,
        estCostUnidadesDeAltaPresion: estCostUnidadesDeAltaPresion,
        estCostDelGelDeFractura: estCostDelGelDeFractura,
        estCostDeSistemoRactivo: estCostDeSistemoRactivo,
        estCostDeSistemoNoRactivo: estCostDeSistemoNoRactivo,
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
        estCostApuntalante: estCostApuntalante,
  }

  return data;   
}
