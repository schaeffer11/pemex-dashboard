import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    estimacionCostosData: [{
        index: 0,
        length: 1,
        fecha: null,
        cost: '',
        costDLS: '',
        MNXtoDLS: '',
        compania: '',
    }],

})

const estCostAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsEstCosts':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_estimacionCostos':
        return state.set('estimacionCostosData', fromJS(action.value))
    default:
      return state
  }
}

export default estCostAcido