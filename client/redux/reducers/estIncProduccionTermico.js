import { fromJS } from 'immutable'

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
    observacionesEstIncTermico: '',
    imgURL: null,
    imgName: '',
    imgSource: null,
})

const estIncProduccionTermico = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEstProduccionTermico':
      return state.set(action.loc, fromJS(action.val))
    case 'set_estIncProdTermicoImgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name)).set('imgSource', 'local')
    default:
      return state
  }
}

export default estIncProduccionTermico
