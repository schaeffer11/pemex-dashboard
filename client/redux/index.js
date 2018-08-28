import { combineReducers } from 'redux-immutable'
import app from './reducers/app'
import user from './reducers/user'
import fichaTecnicaDelPozoHighLevel from './reducers/fichaTecnicaDelPozoHighLevel'
import fichaTecnicaDelPozo from './reducers/fichaTecnicaDelPozo'
import fichaTecnicaDelCampo from './reducers/fichaTecnicaDelCampo'
import sistemasArtificialesDeProduccion from './reducers/sistemasArtificialesDeProduccion'
import mecanicoYAparejoDeProduccion from './reducers/mecanicoYAparejoDeProduccion'
import analisisDelAgua from './reducers/analisisDelAgua'

export default combineReducers({
  app,
  user,
  fichaTecnicaDelPozoHighLevel,
  fichaTecnicaDelPozo,
  fichaTecnicaDelCampo,
  sistemasArtificialesDeProduccion,
  mecanicoYAparejoDeProduccion,
  analisisDelAgua
})
