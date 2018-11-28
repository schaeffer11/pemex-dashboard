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
    selectedTab: 'Pozo',
    hasSubmitted: false,
    transactionID: null,
    saveName: null,
    companyOptions: []
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_showForms':
      return state.set('showForms', fromJS(action.value)).set('currentPage', 'TecnicaDelCampo')
    case 'set_saved':
      return state.set('saved', action.value)
    case 'set_currentPage':
      return state.set('currentPage', action.value)
    case 'set_tab':
      return state.set('selectedTab', action.value)
    case 'set_isLoading':
      console.log('setting some loading stuff', action.obj)
      return state.mergeDeep(fromJS(action.obj))
    case 'reset_notification':
      return state.set('showNotification', false)
                  .set('notificationText', null)
                  .set('notificationType', null)
    case 'set_hasSubmitted':
      return state.set('hasSubmitted', action.value)
    case 'set_transactionID':
      return state.set('transactionID', action.value)
    case 'set_saveName':
      return state.set('saveName', action.value)
    case 'set_companyOptions':
      return state.set('companyOptions', action.value)
    default:
   		return state
  }
}

export default global