import { fromJS } from 'immutable'

const initialState = null
const user = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return fromJS(action.value)

    case 'LOGOUT':
      return null

    case 'REFRESH':
      return state.set('expires', action.time)

    default:
      return state
  }
}

export default user
