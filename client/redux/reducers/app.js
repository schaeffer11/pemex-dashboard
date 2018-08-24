import { Map, fromJS } from 'immutable'

const initialState = Map()
const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VERSION':
      return fromJS(action.value)

    default:
      return state
  }
}

export default app
