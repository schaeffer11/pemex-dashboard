import { fromJS } from 'immutable'

const initialState = fromJS({
  imgURL: '',
})

const graficaTratamiento = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalGraficaTratamiento':
        return state.setIn(action.location, fromJS(action.value))
    default:
      return state
  }
}

export default graficaTratamiento