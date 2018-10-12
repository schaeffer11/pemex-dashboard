import { fromJS } from 'immutable'

const initialState = fromJS({
  hasErrors: true,
  longitudTotal: '',
  longitudEfectivaGrabada: '',
  alturaGrabada: '',
  anchoPromedio: '',
  concentracionDelAcido: '',
  conductividad: '',
  fcd: '',
  presionNeta: '',
  eficienciaDeFluidoDeFractura: '',
  geometria: [{
    intervalo: '',
    imgURL: '',
  }]
})

const evaluacionAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEvaluacionAcido':
        console.log('da state here', state)
        return state.setIn(action.location, fromJS(action.value))
    case 'set_mergeEvaluacionAcido':
        return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default evaluacionAcido
