import { Map, fromJS } from 'immutable'

const initialState = Map({
    showForms: false,
    saved: null,
    loaded: null,
    submitted: null,
    showNotification: false,
    notificationText: null,
    notificationType: null,
    loadText: null,
    isLoading: false,
    currentPage: '',
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_showForms':
      return state.set('showForms', fromJS(action.value)).set('currentPage', 'TecnicaDelCampo')
    case 'set_saved':
      return state.set('saved', action.value)
    case 'set_currentPage':
      return state.set('currentPage', action.value)
    case 'set_isLoading':
      return state.mergeDeep(fromJS(action.obj))
    case 'reset_notification':
      return state.set('showNotification', false)
                  .set('notificationText', null)
                  .set('notificationType', null)
    default:
   		return state
  }
}

export default global