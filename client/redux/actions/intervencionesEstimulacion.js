import { costMap } from '../../lib/maps'

export const setHasErrorsPropuestaEstimulacion = value => ({ type: 'set_hasErrorsPropuestaEstimulacion', value})
export const setHasErrorsResultadosSimulacionEstimulacion = value => ({ type: 'set_hasErrorsResultadosSimulacionEstimulacion', value})
export const setHasErrorsEstIncProduccionEstimulacion = value => ({ type: 'set_hasErrorsEstIncProduccionEstimulacion', value})

export const setObjetivo = value => ({ type: 'set_objetivo', value})
export const setAlcances = value => ({ type: 'set_alcances', value})
export const setTipoDeIntervenciones = value => ({ type: 'set_tipoDeIntervenciones', value})

export const setIntervalo = value => ({ type: 'set_intervalo', value})
export const setLongitudDeIntervalo = value => ({ type: 'set_longitudDeIntervalo', value})
export const setVolAparejo = value => ({ type: 'set_volAparejo', value})
export const setCapacidadTotalDelPozo = value => ({ type: 'set_capacidadTotalDelPozo', value})
export const setVolumenPrecolchonN2 = value => ({ type: 'set_volumenPrecolchonN2', value})
export const setVolumenSistemaNoReativo = value => ({ type: 'set_volumenSistemaNoReativo', value})
export const setVolumenSistemaReactivo = value => ({ type: 'set_volumenSistemaReactivo', value})
export const setVolumenSistemaDivergente = value => ({ type: 'set_volumenSistemaDivergente', value})
export const setVolumenDesplazamientoLiquido = value => ({ type: 'set_volumenDesplazamientoLiquido', value})
export const setVolumenDesplazamientoN2 = value => ({ type: 'set_volumenDesplazamientoN2', value})
export const setVolumenTotalDeLiquido = value => ({ type: 'set_volumenTotalDeLiquido', value})
export const setPropuestaCompany = value => ({ type: 'set_propuestaCompany', value})
export const setTipoDeEstimulacion = value => ({ type: 'set_tipoDeEstimulacion', value})
export const setTipoDeColocacion = value => ({ type: 'set_tipoDeColocacion', value})
export const setTiempoDeContacto = value => ({ type: 'set_tiempoDeContacto', value})
export const setCedulaData = (cedula, volumes) => ({
  type: 'set_cedulaData',
  volumes,
  cedula: cedula.map((row) => {
    row.etapa = row.index + 1
    return row
  }),
})


export const setLabEvidenceImgURL = value => ({ type: 'set_labEvidenceImgURL', value})

export const setPenetracionRadial = value => ({ type: 'set_penetracionRadial', value})
export const setLongitudDeAgujeroDeGusano = value => ({ type: 'set_longitudDeAgujeroDeGusano', value})


export const setEstIncEstrangulador = value => ({ type: 'set_estIncEstrangulador', value})
export const setEstIncPtp = value => ({ type: 'set_estIncPtp', value})
export const setEstIncTtp = value => ({ type: 'set_estIncTtp', value})
export const setEstIncPbaj = value => ({ type: 'set_estIncPbaj', value})
export const setEstIncTbaj = value => ({ type: 'set_estIncTbaj', value})
export const setEstIncPtr = value => ({ type: 'set_estIncPtr', value})
export const setEstIncQl = value => ({ type: 'set_estIncQl', value})
export const setEstIncQo = value => ({ type: 'set_estIncQo', value})
export const setEstIncQg = value => ({ type: 'set_estIncQg', value})
export const setEstIncQw = value => ({ type: 'set_estIncQw', value})
export const setEstIncRGA = value => ({ type: 'set_estIncRGA', value})
export const setEstIncSalinidad = value => ({ type: 'set_estIncSalinidad', value})
export const setEstIncIP = value => ({ type: 'set_estIncIP', value})
export const setEstIncDeltaP = value => ({ type: 'set_estIncDeltaP', value})
export const setEstIncGastoCompromisoQo = value => ({ type: 'set_estIncGastoCompromisoQo', value})
export const setEstIncGastoCompromisoQg = value => ({ type: 'set_estIncGastoCompromisoQg', value})
export const setObervacionesEstIncEstim = value => ({ type: 'set_obervacionesEstIncEstim', value})
export const setEstIncProdEstimulationImgURL = value => ({ type: 'set_estIncProdEstimulationImgURL', value})



export const setPruebasDeLaboratorioData = value => ({ type: 'set_pruebasDeLaboratorioData', value})

export const setEstimacionCostosData = value => ({ 
  type: 'set_estimacionCostos', 
  value: value.map(i => {
    i.unit = i.length > 0 && costMap.find(j => j.item === i.item) ? costMap.find(j => j.item === i.item).unit : ''
    return i
  })
})
export const setHasErrorsEstCosts = value => ({ type: 'set_hasErrorsEstCosts', value})