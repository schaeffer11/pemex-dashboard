import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estCostoDeRentaDeBarco: {
            cost: '',
            company: ''
        },
    estCostDeSistemaReactivo: {
            cost: '',
            company: ''
        },
    estCostDeSistemaNoReactivo: {
            cost: '',
            company: ''
        },
    estCostDeDivergenes: {
            cost: '',
            company: ''
        },
    estCostDeN2: {
            cost: '',
            company: ''
        },
    estCostHCL: {
            cost: '',
            company: ''
        },
    checked:[]
})


const estCostEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estCostoDeRentaDeBarco':
        return state.set('estCostoDeRentaDeBarco', fromJS(action.value))
    case 'set_estCostDeSistemaReactivo':
        return state.set('estCostDeSistemaReactivo', fromJS(action.value))
    case 'set_estCostDeSistemaNoReactivo':
        return state.set('estCostDeSistemaNoReactivo', fromJS(action.value))
    case 'set_estCostDeDivergenes':
        return state.set('estCostDeDivergenes', fromJS(action.value))
    case 'set_estCostDeN2':
        return state.set('estCostDeN2', fromJS(action.value))
    case 'set_estCostHCL':
        return state.set('estCostHCL', fromJS(action.value))
    case 'set_etapa':
        return state.set('etapa', fromJS(action.value))
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    default:
      return state
  }
}

export default estCostEstimulacion
