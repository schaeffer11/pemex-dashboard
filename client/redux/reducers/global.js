import { Map, fromJS } from 'immutable'

const initialState = Map({
    showForms: false,
    isSaved: false,
    isLoading: false,
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_showForms':
      return state.set('showForms', fromJS(action.value))
    case 'set_isSaved':
      return state.set('isSaved', action.value)
    case 'set_isLoading':
      return state.mergeDeep(fromJS(action.obj))
    default:
   		return state
  }
}

export default global