import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    hasErrors: true,
    longitudApuntalada: null,
    alturaTotalDeFractura: null,
    anchoPromedio: null,
    concentractionAreal: null,
    conductividad: null,
    fcd: null,
    presionNeta: null,
    eficienciaDeFluidoDeFractura: null,
    imgURL: null,
    imgName: null,
    imgSource: null,
})


const resultadosSimulacionApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsResultadosSimulacionApuntalado':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_longitudApuntalada':
        return state.set('longitudApuntalada', fromJS(action.value))
    case 'set_alturaTotalDeFractura':
        return state.set('alturaTotalDeFractura', fromJS(action.value))
    case 'set_anchoPromedio':
        return state.set('anchoPromedio', fromJS(action.value))
    case 'set_concentractionAreal':
        return state.set('concentractionAreal', fromJS(action.value))
    case 'set_conductividad':
        return state.set('conductividad', fromJS(action.value))
    case 'set_fcd':
        return state.set('fcd', fromJS(action.value))
    case 'set_presionNeta':
        return state.set('presionNeta', fromJS(action.value))
    case 'set_eficienciaDeFluidoDeFractura':
        return state.set('eficienciaDeFluidoDeFractura', fromJS(action.value))
    case 'set_evidenceSimulationApuntaladoImgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name)).set('imgSource', 'local')
    default:
      return state
  }
}

export default resultadosSimulacionApuntalado
