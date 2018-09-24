import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estimacionCostosData: [{
        index: 0,
        length: 1
    }]
})

const estCostAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estimacionCostos':
        return state.set('estimacionCostosData', fromJS(action.value))
    default:
      return state
  }
}

export default estCostAcido