import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    showForms: false
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_showForms':
        return state.set('showForms', fromJS(action.value))
    default:
   		return state
  }
}

export default global