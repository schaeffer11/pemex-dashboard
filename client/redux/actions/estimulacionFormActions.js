import axios from 'axios'

export function submitForm(fields) {
  let data = getFieldsAsDataObject(fields)
  return (dispatch, getState) => {
    dispatch({type: 'ESTIMULACION_FORM_SUBMIT'})
    if(formIsValid(data)){
      return postForm(data)
       .then(
          res  => dispatch({type: 'ESTIMULACION_FORM_SUCCESS', response: res}),
          error => dispatch({type: 'ESTIMULACION_FORM_ERROR', error: error})
       )
    }else {
      dispatch({type: 'ESTIMULACION_FORM_ERROR'})
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
  let {objetivoYAlcancesIntervencion, pruebasDeLaboratorio, propuestaEstimulacion, resultadosSimulacionEstimulacion, estIncProduccionEstimulacion, estCostEstimulacion} = form

  objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS();
  pruebasDeLaboratorio = pruebasDeLaboratorio.toJS();
  propuestaEstimulacion = propuestaEstimulacion.toJS();
  resultadosSimulacionEstimulacion = resultadosSimulacionEstimulacion.toJS();
  estIncProduccionEstimulacion = estIncProduccionEstimulacion.toJS();
  estCostEstimulacion = estCostEstimulacion.toJS();

  let { objetivo, alcances, tipoDeIntervenciones } = objetivoYAlcancesIntervencion

  let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = pruebasDeLaboratorio

  let { etapa, sistema, volLiquid, gastoN2, gastoLiquido, gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo, 
            intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, 
            volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = propuestaEstimulacion
  let { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas, 
            volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, volumenDePrecolchonN2, 
            volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano} = resultadosSimulacionEstimulacion
  let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, 
            estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, estIncGastoCompromisoQg, 
            obervacionesEstIncEstim } = estIncProduccionEstimulacion
  let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes, 
            estCostDeN2, estCostHCL } = estCostEstimulacion

  const data = {
        objetivo: objetivo,
        alcances: alcances,
        tipoDeIntervenciones: tipoDeIntervenciones,
        etapa: etapa,
        sistema: sistema,
        volLiquid: volLiquid,
        gastoN2: gastoN2,
        gastoLiquido: gastoLiquido,
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
        volumenDesplazamientoN2: volumenDesplazamientoN2,
        volumenTotalDeLiquido : volumenTotalDeLiquido,
        tipoDeAnalisis: tipoDeAnalisis,
        fechaDeMuestreo: fechaDeMuestreo,
        fechaDePrueba: fechaDePrueba,
        compania: compania,
        personalDePemexQueSuperViso: personalDePemexQueSuperViso,
        obervacionesLab: obervacionesLab,
        volumenDelSistemaAcidoLimpieza: volumenDelSistemaAcidoLimpieza,
        volumenDelSistemaNoAcidoLimpieza: volumenDelSistemaNoAcidoLimpieza,
        tipoDeColocacion: tipoDeColocacion,
        tiempoDeContacto: tiempoDeContacto,
        numeroDeEtapas: numeroDeEtapas,
        volumenDelSistemAcido: volumenDelSistemAcido,
        volumenDelSistemNoAcido: volumenDelSistemNoAcido,
        volumenDeDivergente: volumenDeDivergente,
        volumenDeN2: volumenDeN2,
        calidadDeEspuma: calidadDeEspuma,
        volumenDePrecolchonN2: volumenDePrecolchonN2,
        volumenDeDesplazamiento: volumenDeDesplazamiento,
        penetracionRadial: penetracionRadial,
        longitudDeAgujeroDeGusano: longitudDeAgujeroDeGusano,
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
        obervacionesEstIncEstim: obervacionesEstIncEstim,
        estCostCompaniaDeServicio: estCostCompaniaDeServicio,
        estCostoDeRentaDeBarco: estCostoDeRentaDeBarco,
        estCostDeSistemaReactivo: estCostDeSistemaReactivo,
        estCostDeSistemaNoReactivo: estCostDeSistemaNoReactivo,
        estCostDeDivergenes: estCostDeDivergenes,
        estCostDeN2: estCostDeN2,
        estCostHCL: estCostHCL
  }

  return data;
}
