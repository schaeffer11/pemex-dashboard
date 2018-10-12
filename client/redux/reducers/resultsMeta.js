import { fromJS } from 'immutable'

const initialState = fromJS({
    intervals: [],
    interventionType: '',
    propuestaCompany: '',
})

const ResultsMeta = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeResultsMeta':
      return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default ResultsMeta
