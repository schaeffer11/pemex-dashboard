import { fromJS } from 'immutable'

const initialState = fromJS({
  hasErrors: true,
  qo: '',
  qw: '',
  qg: '',
})

const evaluacionTermica = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalEvaluacionTermica':
        return state.setIn(action.location, fromJS(action.value))
    case 'set_mergeEvaluacionTermica':
        return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default evaluacionTermica
