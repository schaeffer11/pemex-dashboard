import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    presionDataCampo: [{
        fecha: null,
        Pws: '',
        error: true,
    }],
    presionDataPozo: [{
        fecha: null,
        Pws: '',
        Pwf: '',
        error: true,
    }],
    hasErrorsCampo: true,
    hasErrorsPozo: true,
    fromSaveCampo: false,
    fromSavePozo: false,
    pressureDepthPozo: '',
    pressureDepthCampo: '',
})


const historicoDePresion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsHistoricoDePresionCampo':
      return state.set('hasErrorsCampo', fromJS(action.value))
    case 'set_hasErrorsHistoricoDePresionPozo':
      return state.set('hasErrorsPozo', fromJS(action.value))
    case 'set_fromSaveHistoricoDePresionCampo':
      return state.set('fromSaveCampo', fromJS(action.value))
    case 'set_historicoDePresionCampoFromSave':
      return state.set('presionDataCampo', fromJS(action.vaue)).set('fromSaveCampo', true)
    case 'set_historicoDePresionPozoFromSave':
      return state.set('presionDataPozo', fromJS(action.vaue)).set('fromSavePozo', true)
    case 'set_fromSaveHistoricoDePresionPozo':
      return state.set('fromSavePozo', fromJS(action.value))
    case 'set_presionDataCampo':
        return state.set('presionDataCampo', fromJS(action.value))
    case 'set_presionDataPozo':
        return state.set('presionDataPozo', fromJS(action.value))
    case 'set_pressureDepthPozo':
        return state.set('pressureDepthPozo', fromJS(action.value))
    case 'set_pressureDepthCampo':
        return state.set('pressureDepthCampo', fromJS(action.value))
    case 'set_AllPressure':
        return state = fromJS(action.value)
    default:
      return state
  }
}

export default historicoDePresion
