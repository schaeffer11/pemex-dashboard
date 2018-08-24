import { Map, fromJS } from 'immutable'

const initialState = Map({ uwi: null })
const well = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_UWI':
      return state.set('uwi', fromJS(action.value))

    default:
      return state
  }
}

export default well
