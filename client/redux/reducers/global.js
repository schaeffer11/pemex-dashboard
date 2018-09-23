import { Map, fromJS } from 'immutable'

const initialState = Map({
    showForms: false,
    isSaved: false,
})


const global = (state = initialState, action) => {
  console.log('something happens here', action)
  switch (action.type) {
    case 'set_showForms':
        return state.set('showForms', fromJS(action.value))
    case 'set_isSaved':
        console.log('ici setting issaved', action.value)
        return state.set('isSaved', action.value)
    default:
   		return state
  }
}

export default global