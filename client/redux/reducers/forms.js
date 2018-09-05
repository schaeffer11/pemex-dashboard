import { Map, fromJS } from 'immutable'

const initialState = Map({
  pozoFormSubmitting: false,
  pozoFormError: {},
  acidoFormSubmitting: false,
  acidoFormError: {},
  apuntaladoFormSubmitting: false,
  apuntaladoFormError: {}
})

const forms = (state = initialState, action) => {
  switch (action.type) {
    /* POZO FORM */
    case 'POZO_FORM_SUBMIT':
      return state.set('pozoFormSubmitting', true)
    case 'POZO_FORM_SUCCESS': 
      return state.set('pozoFormSubmitting', false)
    case 'POZO_FORM_ERROR':
     return state.set('pozoFormError', fromJS(action.value))
    /* ACIDO FORM */
    case 'ACIDO_FORM_SUBMIT':
     return  state.set('acidoFormSubmitting', true)
    case 'ACIDO_FORM_SUCCESS':
     return  state.set('acidoFormSubmitting', false)
    case 'ACIDO_FORM_ERROR':
     return  state.set('acidoFormError', fromJS(action.value))
    case 'APUNTALADO_FORM_SUBMIT':
     return  state.set('apuntaladoFormSubmitting', true)
    case 'APUNTALADO_FORM_SUCCESS':
     return  state.set('apuntaladoFormSubmitting', false)
    case 'APUNTALADO_FORM_ERROR':
     return  state.set('apuntaladoFormError', fromJS(action.value))
    case 'ESTIMULACION_FORM_SUBMIT':
     return  state.set('estimulacionFormSubmitting', fromJS(action.value))
    case 'ESTIMULACION_FORM_SUCCESS':
     return  state.set('estimulacionFormSubmitting', fromJS(action.value))
    case 'ESTIMULACION_FORM_ERROR':
     return  state.set('estimulacionFormError', fromJS(action.value))
    default:
     return state;
  }
}

export default forms;
