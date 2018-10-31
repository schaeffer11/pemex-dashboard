import { fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    longitudApuntalada: '',
    alturaTotalDeFractura: '',
    anchoPromedio: '',
    concentracionAreal: '',
    conductividad: '',
    fcd: '',
    presionNeta: '',
    eficienciaDeFluidoDeFractura: '',
    tipoDeFluido: '',
    volumenPrecolchon: '',
    gastoPromedio: '',
    presionRuptura: '',
    presionPromedio: '',
    isip: '',
    gradienteFractura: '',
    presionCierreSuperior: '',
    gradienteCierre: '',
    tiempoCierre: '',
    presionYacimiento: '',
    gradientePoro: '',
    perdidaFiltrado: '',
    eficienciaFluido: '',
    geometria: [{
      intervalo: '',
      imgURL: '',
      imgName: '',
    }],
})


const evaluacionApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEvaluacionApuntalado':
        return state.setIn(action.location, fromJS(action.value))
    case 'set_mergeEvaluacionApuntalado':
        return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default evaluacionApuntalado
