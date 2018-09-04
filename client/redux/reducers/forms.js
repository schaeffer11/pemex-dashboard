import { Map, fromJS } from 'immutable'

const initialState = Map({
  pozoFormSubmitting: false,
  pozoFormSuccess: {},
  pozoFormError: {}
})

const forms = (state = initialState, action) => {
  switch (action.type) {
    case 'POZO_FORM_SUBMIT':
      return state.set('pozoFormSubmitting', true)
    case 'POZO_FORM_SUCCESS': 
      return state.set('pozoFormSubmitting', false)
    case 'POZO_FORM_ERROR':
     return state.set('pozoFormError', fromJS(action.value))
    default:
     return state;
  }
}

export default forms;
