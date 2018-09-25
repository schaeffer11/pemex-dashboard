import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    presionDataCampo: [{
        fecha: '',
        Qo: '',
        Np: '',
        Pws: '',
        Pr: '',
    }],
    presionDataPozo: [{
        fecha: '',
        Qo: '',
        Np: '',
        Pws: '',
        Pr: '',
    }],
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
    default:
      return state
  }
}

export default historicoDePresion
