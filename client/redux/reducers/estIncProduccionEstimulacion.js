import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    estIncEstrangulador: '',
    estIncPtp: '',
    estIncTtp: '',
    estIncPbaj: '',
    estIncTbaj: '',
    estIncPtr: '',
    estIncQl: '',
    estIncQo: '',
    estIncQg: '',
    estIncQw: '',
    estIncRGA: '',
    estIncSalinidad: '',
    estIncIP: '',
    estIncDeltaP: '',
    estIncGastoCompromisoQo: '',
    estIncGastoCompromisoQg: '',
    obervacionesEstIncEstim: '',
    imgURL: null,
    imgName: '',
})


const estIncProduccionEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsEstIncProduccionEstimulacion':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_estIncEstrangulador':
        return state.set('estIncEstrangulador', fromJS(action.value))
    case 'set_estIncPtp':
        return state.set('estIncPtp', fromJS(action.value))
    case 'set_estIncTtp':
        return state.set('estIncTtp', fromJS(action.value))
    case 'set_estIncPbaj':
        return state.set('estIncPbaj', fromJS(action.value))
    case 'set_estIncTbaj':
        return state.set('estIncTbaj', fromJS(action.value))
    case 'set_estIncPtr':
        return state.set('estIncPtr', fromJS(action.value))
    case 'set_estIncQl':
        return state.set('estIncQl', fromJS(action.value))
    case 'set_estIncQo':
        return state.set('estIncQo', fromJS(action.value))
    case 'set_estIncQg':
        return state.set('estIncQg', fromJS(action.value))
    case 'set_estIncQw':
        return state.set('estIncQw', fromJS(action.value))
    case 'set_estIncRGA':
        return state.set('estIncRGA', fromJS(action.value))
    case 'set_estIncSalinidad':
        return state.set('estIncSalinidad', fromJS(action.value))
    case 'set_estIncIP':
        return state.set('estIncIP', fromJS(action.value))
    case 'set_estIncDeltaP':
        return state.set('estIncDeltaP', fromJS(action.value))
    case 'set_estIncGastoCompromisoQo':
        return state.set('estIncGastoCompromisoQo', fromJS(action.value))
    case 'set_estIncGastoCompromisoQg':
        return state.set('estIncGastoCompromisoQg', fromJS(action.value))
    case 'set_obervacionesEstIncEstim':
        return state.set('obervacionesEstIncEstim', fromJS(action.value))
    case 'set_estIncProdEstimulationImgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name))
    default:
      return state
  }
}

export default estIncProduccionEstimulacion
