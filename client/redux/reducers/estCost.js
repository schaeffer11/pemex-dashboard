import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    MNXtoDLS: 1,
    estimacionCostosData: [{
        index: 0,
        length: 1
    }],
    checked: []
})

const estCostAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estimacionCostos':
        return state.set('estimacionCostosData', fromJS(action.value))
    case 'set_MNXtoDLS':
        return state.set('MNXtoDLS', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'estCost')
            return state.set('checked', fromJS(action.value))
        return state
    default:
      return state
  }
}

export default estCostAcido