import { fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    penetracionRadial: '',
    longitudDeAgujeroDeGusano: '',
    geometria: [{
      intervalo: '',
      imgURL: '',
      imgName: '',
    }],
})


const evaluacionEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEvaluacionEstimulacion':
        return state.setIn(action.location, fromJS(action.value))
    case 'set_mergeEvaluacionEstimulacion':
        return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default evaluacionEstimulacion
