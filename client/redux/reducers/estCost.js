import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estimacionCostosData: [{
        index: 0,
        length: 1,
        fecha: null,
        cost: '',
        costDLS: '',
        MNXtoDLS: '',
        companiea: '',
    }],
    checked: []
})

const estCostAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estimacionCostos':
        return state.set('estimacionCostosData', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'estCost')
            return state.set('checked', fromJS(action.value))
        return state
    default:
      return state
  }
}

export default estCostAcido