import { combineReducers } from 'redux-immutable'
import { Map, fromJS } from 'immutable'
import app from './reducers/app'
import user from './reducers/user'
import fichaTecnicaDelPozoHighLevel from './reducers/fichaTecnicaDelPozoHighLevel'
import fichaTecnicaDelPozo from './reducers/fichaTecnicaDelPozo'
import fichaTecnicaDelCampo from './reducers/fichaTecnicaDelCampo'
import sistemasArtificialesDeProduccion from './reducers/sistemasArtificialesDeProduccion'
import mecanicoYAparejoDeProduccion from './reducers/mecanicoYAparejoDeProduccion'
import analisisDelAgua from './reducers/analisisDelAgua'
import objetivoYAlcancesIntervencion from './reducers/objetivoYAlcancesIntervencion'
import propuestaEstimulacion from './reducers/propuestaEstimulacion'
import propuestaAcido from './reducers/propuestaAcido'
import propuestaApuntalado from './reducers/propuestaApuntalado'
import propuestaTermica from './reducers/propuestaTermica'
import pruebasDeLaboratorio from './reducers/pruebasDeLaboratorio'
import resultadosSimulacionEstimulacion from './reducers/resultadosSimulacionEstimulacion'
import resultadosSimulacionAcido from './reducers/resultadosSimulacionAcido'
import resultadosSimulacionApuntalado from './reducers/resultadosSimulacionApuntalado'
import estIncProduccionEstimulacion from './reducers/estIncProduccionEstimulacion'
import estIncProduccionTermico from './reducers/estIncProduccionTermico'
import estIncProduccionAcido from './reducers/estIncProduccionAcido'
import estIncProduccionApuntalado from './reducers/estIncProduccionApuntalado'
import estCost from './reducers/estCost'
import estCostResults from './reducers/estCostResults'
import evaluacionPetrofisica from './reducers/evaluacionPetrofisica'
import historicoDePresion from './reducers/historicoDePresion'
import historicoDeProduccion from './reducers/historicoDeProduccion'
import historialDeIntervenciones from './reducers/historialDeIntervenciones'
import historicoDeAforos from './reducers/historicoDeAforos'
import historicoDeAforosResults from './reducers/historicoDeAforosResults'
import tratamientoEstimulacion from './reducers/tratamientoEstimulacion'
import tratamientoAcido from './reducers/tratamientoAcido'
import tratamientoApuntalado from './reducers/tratamientoApuntalado'
import tratamientoTermico from './reducers/tratamientoTermico'
import evaluacionAcido from './reducers/evaluacionAcido'
import evaluacionApuntalado from './reducers/evaluacionApuntalado'
import evaluacionEstimulacion from './reducers/evaluacionEstimulacion'
import evaluacionTermica from './reducers/evaluacionTermica'
import resultsMeta from './reducers/resultsMeta'
import graficaTratamiento from './reducers/graficaTratamiento'
import resultadosGenerales from './reducers/resultadosGenerales'
import forms from './reducers/forms'
import global from './reducers/global'
import { handleImagesFromServer } from '../lib/formatters';
import globalAnalysis from './reducers/globalAnalysis'
import chartOptions from './reducers/chartOptions'

const appReducer = combineReducers({
  app,
  user,
  forms,
  fichaTecnicaDelPozoHighLevel,
  fichaTecnicaDelPozo,
  fichaTecnicaDelCampo,
  sistemasArtificialesDeProduccion,
  mecanicoYAparejoDeProduccion,
  analisisDelAgua,
  objetivoYAlcancesIntervencion,
  propuestaEstimulacion,
  propuestaAcido,
  propuestaApuntalado,
  propuestaTermica,
  pruebasDeLaboratorio,
  resultadosSimulacionEstimulacion,
  resultadosSimulacionAcido,
  resultadosSimulacionApuntalado,
  estIncProduccionEstimulacion,
  estIncProduccionAcido,
  estIncProduccionApuntalado,
  estIncProduccionTermico,
  estCost,
  estCostResults,
  evaluacionPetrofisica,
  historicoDePresion,
  historicoDeProduccion,
  historialDeIntervenciones,
  historicoDeAforos,
  global,
  globalAnalysis,
  historicoDeAforosResults,
  tratamientoEstimulacion,
  tratamientoAcido,
  tratamientoApuntalado,
  tratamientoTermico,
  evaluacionAcido,
  evaluacionApuntalado,
  evaluacionEstimulacion,
  evaluacionTermica,
  graficaTratamiento,
  resultadosGenerales,
  resultsMeta,
  chartOptions
})

const rootReducer = (state, action) => {
  // We remove persisted state so we need to ensure a state exists for the following:
  if (state) {
    const user = state.get('user')
    const app = state.get('app')
    const global = state.get('global')
    const router = state.get('router')
    const forms = state.get('forms')
  
    if (action.type === 'LOAD_SAVE') {
      const { saved } = action
      const newState = { ...saved, user, app, global, router, forms }
      return state = fromJS(newState)
    }
    if (action.type === 'set_imagesInState') {
      let newState = {...state.toJS()}
      if (action.isSaved) {
        newState.pruebasDeLaboratorio = action.pruebasDeLaboratorio
      }
      newState = handleImagesFromServer(action.images, newState)
      return state = fromJS(newState)
    }
    if (action.type === 'RESET_APP') {
      return state = Map({ user, app })
    }
    if (action.type === 'RESET_APP_FROM_SUBMIT') {
      let newGlobal = {
        notificationType: null,
        notificationText: null,
        isLoading: false,
        showNotification: true,
        showForms: false,
        saved: null,
        loaded: null,
        submitted: null,
        loadText: null,
        currentPage: '',
        selectedTab: 'Pozo',
        hasSubmitted: false,
        transactionID: null,
        saveName: null 
      }
      return state = fromJS({ user, app, global: newGlobal })
    }
    if (action.type === 'LOGOUT') {
      state = undefined
    }
  }
  return appReducer(state, action)
}


export default rootReducer