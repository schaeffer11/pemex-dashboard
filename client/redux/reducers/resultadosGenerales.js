import { fromJS } from 'immutable'

const initialState = fromJS({
  fechaIntervencion: null,
  justificacionIntervencion: null,
  comentariosIntervencion: null,
  hasErrors: true,
  wasCancelled: false
})

const resultadosGenerales = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalResultadosGenerales':
        return state.setIn(action.location, fromJS(action.value))
    default:
      return state
  }
}

export default resultadosGenerales