import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: false,
    fromSave: false,
    showEstim: false,
    showAcido: false,
    showApuntalado: false,
    showTermico: false,
    historicoEstimulacionData: [],
    historicoAcidoData: [],
    historicoApuntaladoData: [],
    historicoTermicoData: []
})


const historialDeIntervenciones = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsHistorialDeIntervenciones':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_fromSaveHistorialDeIntervenciones':
      return state.set('fromSave', fromJS(action.value))
    case 'set_historicoEstimulacionData':
        return state.set('historicoEstimulacionData', fromJS(action.value))
    case 'set_historicoAcidoData':
        return state.set('historicoAcidoData', fromJS(action.value))
    case 'set_historicoApuntaladoData':
        return state.set('historicoApuntaladoData', fromJS(action.value))
    case 'set_historicoTermicoData':
        return state.set('historicoTermicoData', fromJS(action.value))
    case 'set_historialDeIntervenciones':
        return state = fromJS(action.value)
    case 'set_showEstim':
         return state.set('showEstim', fromJS(action.value))
    case 'set_showApuntalado':
         return state.set('showApuntalado', fromJS(action.value))
    case 'set_showAcido':
         return state.set('showAcido', fromJS(action.value))
    case 'set_showTermico':
         return state.set('showTermico', fromJS(action.value))
    default:
      return state
  }
}

export default historialDeIntervenciones
