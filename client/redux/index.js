import { combineReducers } from 'redux-immutable'
import app from './reducers/app'
import user from './reducers/user'
import well from './reducers/well'

export default combineReducers({
  app,
  user,
  well
})
