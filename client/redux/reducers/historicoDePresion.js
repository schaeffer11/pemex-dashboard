import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    presionDataCampo: [{
        fecha: 0,
        Qo: '',
        Np: '',
        Pws: '',
        Pr: '',
    }],
    presionDataPozo: [{
        fecha: 0,
        Qo: '',
        Np: '',
        Pws: '',
        Pr: '',
    }],

})


const historicoDePresion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_presionDataCampo':
        return state.set('presionDataCampo', fromJS(action.value))
    case 'set_presionDataPozo':
        return state.set('presionDataPozo', fromJS(action.value))
    default:
      return state
  }
}

export default historicoDePresion