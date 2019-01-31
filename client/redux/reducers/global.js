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
    companyOptions: [],
    justificationOptions: [],
    litologiaOptions: [],
    tipoDeTerminationOptions: [],
    tipoDeLinerOptions: [],
    formacionOptions: [],
    tipoDePozoOptions: [],
    tratamientoPorOptions: [],
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
    case 'set_justificationOptions':
      return state.set('justificationOptions', action.value)
    case 'set_litologiaOptions':
      return state.set('litologiaOptions', action.value)
    case 'set_tipoDeTerminationOptions':
      return state.set('tipoDeTerminationOptions', action.value)
    case 'set_tipoDeLinerOptions':
      return state.set('tipoDeLinerOptions', action.value)
    case 'set_formacionOptions':
      return state.set('formacionOptions', action.value)
    case 'set_tipoDePozoOptions':
      return state.set('tipoDePozoOptions', action.value)
    case 'set_tratamientoPorOptions':
      return state.set('tratamientoPorOptions', action.value)
    default:
   		return state
  }
}

export default global