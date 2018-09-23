import { Map, fromJS } from 'immutable'

const initialState = Map({
    showForms: false,
    saved: null,
    loaded: null,
    submitted: null,
    loadText: null,
    isLoading: false,
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_showForms':
      return state.set('showForms', fromJS(action.value))
    case 'set_saved':
      return state.set('saved', action.value)
    case 'set_isLoading':
      return state.mergeDeep(fromJS(action.obj))
    default:
   		return state
  }
}

export default global