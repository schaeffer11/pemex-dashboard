import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    estCostCompaniaDeServicio: '',
    estCostoDeRentaDeBarco: '',
    estCostUnidadesDeAltaPresion: '',
    estCostDelGelDeFractura: '',
    estCostDeSistemoRactivo: '',
    estCostDeSistemaNoRactivo: '',
    estCostDeDivergentes: '',
    estCostDeN2: '',
    estCostDeHCL: '',
    estCostDeSistemasAcidosRetardados: '',
    estCostDeCostoEquipoDeFacturamientoDePozos: '',
    estCostGelLineal: '',
    estCostTrabajosDeBombeoDiversos: '',
    estCostLlenadoDePozoYPruebaDeAdmision: '',
    estCostMinifrac: '',
    estCostBacheNeutralizador: '',
    estCostProtectorDeArbol: '',
})


const estCostApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_estCostCompaniaDeServicio':
        return state.set('estCostCompaniaDeServicio', fromJS(action.value))
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


    default:
      return state
  }
}

export default estCostApuntalado