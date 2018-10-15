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

const estCostResults = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEstCostResults':
      return state.setIn(action.location, fromJS(action.value))
    default:
      return state
  }
}

export default estCostResults