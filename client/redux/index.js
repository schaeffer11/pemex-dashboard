import { combineReducers } from 'redux-immutable'
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
import resultadosSimulacionEstimulacion from './reducers/resultadosSimulacionEstimulacion'
import resultadosSimulacionAcido from './reducers/resultadosSimulacionAcido'
import resultadosSimulacionApuntalado from './reducers/resultadosSimulacionApuntalado'
import estIncProduccionEstimulacion from './reducers/estIncProduccionEstimulacion'
import estIncProduccionAcido from './reducers/estIncProduccionAcido'
import estIncProduccionApuntalado from './reducers/estIncProduccionApuntalado'
import estCostEstimulacion from './reducers/estCostEstimulacion'
import estCostAcido from './reducers/estCostAcido'
import estCostApuntalado from './reducers/estCostApuntalado'


export default combineReducers({
  app,
  user,
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
	pruebasDeLaboratorioAcido,
	pruebasDeLaboratorioApuntalado,
	resultadosSimulacionEstimulacion,
	resultadosSimulacionAcido,
	resultadosSimulacionApuntalado,
	estIncProduccionEstimulacion,
	estIncProduccionAcido,
	estIncProduccionApuntalado,
	estCostEstimulacion,
	estCostAcido,
	estCostApuntalado,
})
