import { combineReducers } from 'redux-immutable'
import app from './reducers/app'
import user from './reducers/user'
import fichaTecnicaDelPozoHighLevel from './reducers/fichaTecnicaDelPozoHighLevel'
import fichaTecnicaDelPozo from './reducers/fichaTecnicaDelPozo'
import fichaTecnicaDelCampo from './reducers/fichaTecnicaDelCampo'

export default combineReducers({
  app,
  user,
  fichaTecnicaDelPozoHighLevel,
  fichaTecnicaDelPozo,
  fichaTecnicaDelCampo
})
