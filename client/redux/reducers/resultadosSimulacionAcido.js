import { fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    longitudTotal: null,
    longitudEfectivaGrabada: null,
    alturaGrabada: null,
    anchoPromedio: null,
    concentracionDelAcido: null,
    conductividad: null,
    fcd: null,
    presionNeta: null,
    eficienciaDeFluidoDeFractura: null,
    imgURL: null,
    imgSource: null,
    imgName: null,
})


const resultadosSimulacionAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsResultadosSimulacionAcido':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_longitudTotal':
        return state.set('longitudTotal', fromJS(action.value))
    case 'set_longitudEfectivaGrabada':
        return state.set('longitudEfectivaGrabada', fromJS(action.value))
    case 'set_alturaGrabada':
        return state.set('alturaGrabada', fromJS(action.value))
    case 'set_anchoPromedio':
        return state.set('anchoPromedio', fromJS(action.value))
    case 'set_concentracionDelAcido':
        return state.set('concentracionDelAcido', fromJS(action.value))
    case 'set_conductividad':
        return state.set('conductividad', fromJS(action.value))
    case 'set_fcd':
        return state.set('fcd', fromJS(action.value))
    case 'set_presionNeta':
        return state.set('presionNeta', fromJS(action.value))
    case 'set_eficienciaDeFluidoDeFractura':
        return state.set('eficienciaDeFluidoDeFractura', fromJS(action.value))
    case 'set_evidenceSimulationAcidoImgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name)).set('imgSource', 'local')
    default:
      return state
  }
}

export default resultadosSimulacionAcido
