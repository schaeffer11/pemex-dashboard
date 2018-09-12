import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estCostoDeRentaDeBarco: {
        cost: '',
        company: ''
    },
    estCostUnidadesDeAltaPresion: {
        cost: '',
        company: ''
    },
    estCostDelGelDeFractura: {
        cost: '',
        company: ''
    },
    estCostDeSistemoRactivo: {
        cost: '',
        company: ''
    },
    estCostDeSistemoNoRactivo: {
        cost: '',
        company: ''
    },
    estCostDeDivergentes: {
        cost: '',
        company: ''
    },
    estCostDeN2: {
        cost: '',
        company: ''
    },
    estCostDeHCL: {
        cost: '',
        company: ''
    },
    estCostDeSistemasAcidosRetardados: {
        cost: '',
        company: ''
    },
    estCostDeCostoEquipoDeFacturamientoDePozos: {
        cost: '',
        company: ''
    },
    estCostGelLineal: {
        cost: '',
        company: ''
    },
    estCostTrabajosDeBombeoDiversos: {
        cost: '',
        company: ''
    },
    estCostLlenadoDePozoYPruebaDeAdmision: {
        cost: '',
        company: ''
    },
    estCostMinifrac: {
        cost: '',
        company: ''
    },
    estCostBacheNeutralizador: {
        cost: '',
        company: ''
    },
    estCostProtectorDeArbol: {
        cost: '',
        company: ''
    },
    estCostApuntalante: {
        cost: '',
        company: ''
    },
})

const estCostAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estCostoDeRentaDeBarco':
        return state.set('estCostoDeRentaDeBarco', fromJS(action.value))
    case 'set_estCostUnidadesDeAltaPresion':
        return state.set('estCostUnidadesDeAltaPresion', fromJS(action.value))
    case 'set_estCostDelGelDeFractura':
        return state.set('estCostDelGelDeFractura', fromJS(action.value))
    case 'set_estCostDeSistemoRactivo':
        return state.set('estCostDeSistemoRactivo', fromJS(action.value))
    case 'set_estCostDeSistemoNoRactivo':
        return state.set('estCostDeSistemoNoRactivo', fromJS(action.value))        
    case 'set_estCostDeDivergentes':
        return state.set('estCostDeDivergentes', fromJS(action.value))
    case 'set_estCostDeN2':
        return state.set('estCostDeN2', fromJS(action.value))
    case 'set_estCostDeHCL':
        return state.set('estCostDeHCL', fromJS(action.value))
    case 'set_estCostDeSistemasAcidosRetardados':
        return state.set('estCostDeSistemasAcidosRetardados', fromJS(action.value))
    case 'set_estCostDeCostoEquipoDeFacturamientoDePozos':
        return state.set('estCostDeCostoEquipoDeFacturamientoDePozos', fromJS(action.value))
    case 'set_estCostGelLineal':
        return state.set('estCostGelLineal', fromJS(action.value))
    case 'set_estCostTrabajosDeBombeoDiversos':
        return state.set('estCostTrabajosDeBombeoDiversos', fromJS(action.value))
    case 'set_estCostLlenadoDePozoYPruebaDeAdmision':
        return state.set('estCostLlenadoDePozoYPruebaDeAdmision', fromJS(action.value))
    case 'set_estCostMinifrac':
        return state.set('estCostMinifrac', fromJS(action.value))
    case 'set_estCostBacheNeutralizador':
        return state.set('estCostBacheNeutralizador', fromJS(action.value))
    case 'set_estCostProtectorDeArbol':
        return state.set('estCostProtectorDeArbol', fromJS(action.value))
    case 'set_estCostApuntalante':
        return state.set('estCostApuntalante', fromJS(action.value))





   
    default:
      return state
  }
}

export default estCostAcido