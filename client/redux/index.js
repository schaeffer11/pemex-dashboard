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
import pruebasDeLaboratorio from './reducers/pruebasDeLaboratorio'
import resultadosSimulacionEstimulacion from './reducers/resultadosSimulacionEstimulacion'
import resultadosSimulacionAcido from './reducers/resultadosSimulacionAcido'
import resultadosSimulacionApuntalado from './reducers/resultadosSimulacionApuntalado'
import estIncProduccionEstimulacion from './reducers/estIncProduccionEstimulacion'
import estIncProduccionAcido from './reducers/estIncProduccionAcido'
import estIncProduccionApuntalado from './reducers/estIncProduccionApuntalado'
import estCost from './reducers/estCost'
import evaluacionPetrofisica from './reducers/evaluacionPetrofisica'
import historicoDePresion from './reducers/historicoDePresion'
import historicoDeProduccion from './reducers/historicoDeProduccion'
import historialDeIntervenciones from './reducers/historialDeIntervenciones'
import historicoDeAforos from './reducers/historicoDeAforos'
import forms from './reducers/forms'
import global from './reducers/global'

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
  pruebasDeLaboratorio,
  resultadosSimulacionEstimulacion,
  resultadosSimulacionAcido,
  resultadosSimulacionApuntalado,
  estIncProduccionEstimulacion,
  estIncProduccionAcido,
  estIncProduccionApuntalado,
  estCost,
  evaluacionPetrofisica,
  historicoDePresion,
  historicoDeProduccion,
  historialDeIntervenciones,
  historicoDeAforos,
  global
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
    if (action.type === 'RESET_APP') {
      return state = Map({ user, app })
    }
    if (action.type === 'LOGOUT') {
      state = undefined
    }
  }
  return appReducer(state, action)
}


export default rootReducer