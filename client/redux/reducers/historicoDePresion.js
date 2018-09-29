import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    presionDataCampo: [{
        fecha: null,
        Pr: '',
    }],
    presionDataPozo: [{
        fecha: null,
        Pws: '',
        Pwf: '',
    }],
    pressureDepthPozo: '',
    pressureDepthCampo: '',
    checked: []
})


const historicoDePresion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_presionDataCampo':
        return state.set('presionDataCampo', fromJS(action.value))
    case 'set_presionDataPozo':
        return state.set('presionDataPozo', fromJS(action.value))
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'historicoDePresion')
          return state.set('checked', fromJS(action.value))
        return state
    case 'set_pressureDepthPozo':
        return state.set('pressureDepthPozo', fromJS(action.value))
    case 'set_pressureDepthCampo':
        return state.set('pressureDepthCampo', fromJS(action.value))
    default:
      return state
  }
}

export default historicoDePresion
