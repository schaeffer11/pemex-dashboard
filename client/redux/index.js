import { combineReducers } from 'redux-immutable'
import { Map } from 'immutable'
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
import pruebasDeLaboratorioAcido from './reducers/pruebasDeLaboratorioAcido'
import pruebasDeLaboratorioApuntalado from './reducers/pruebasDeLaboratorioApuntalado'
import pruebasDeLaboratorioEstimulacion from './reducers/pruebasDeLaboratorioEstimulacion'
import resultadosSimulacionEstimulacion from './reducers/resultadosSimulacionEstimulacion'
import resultadosSimulacionAcido from './reducers/resultadosSimulacionAcido'
import resultadosSimulacionApuntalado from './reducers/resultadosSimulacionApuntalado'
import estIncProduccionEstimulacion from './reducers/estIncProduccionEstimulacion'
import estIncProduccionAcido from './reducers/estIncProduccionAcido'
import estIncProduccionApuntalado from './reducers/estIncProduccionApuntalado'
import estCostEstimulacion from './reducers/estCostEstimulacion'
import estCostAcido from './reducers/estCostAcido'
import estCostApuntalado from './reducers/estCostApuntalado'
import evaluacionPetrofisica from './reducers/evaluacionPetrofisica'
import historicoDePresion from './reducers/historicoDePresion'
import historicoDeProduccion from './reducers/historicoDeProduccion'
import forms from './reducers/forms'

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
  estCostEstimulacion,
  estCostAcido,
  estCostApuntalado,
  evaluacionPetrofisica,
  historicoDePresion,
  historicoDeProduccion
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    const user = state.get('user')
    const app = state.get('app')
    state = Map({ user, app })
  }
  return appReducer(state, action)
}


export default rootReducer