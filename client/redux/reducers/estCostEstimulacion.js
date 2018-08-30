import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estCostCompaniaDeServicio: '',
    estCostoDeRentaDeBarco: '',
    estCostDeSistemaReactivo: '',
    estCostDeSistemaNoReactivo: '',
    estCostDeDivergenes: '',
    estCostDeN2: '',
    estCostHCL: '',
})


const estCostEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estCostCompaniaDeServicio':
        return state.set('estCostCompaniaDeServicio', fromJS(action.value))
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




   
    default:
      return state
  }
}

export default estCostEstimulacion