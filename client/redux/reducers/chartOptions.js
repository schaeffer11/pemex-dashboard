import { fromJS } from 'immutable'

const initialState = fromJS({
  gotData: false,
  remainingOil: { stacking: 'normal' },
  firstMonthsProduction: { months: 3 },
  eurTrends: { chartType: 'scatter' },
})

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GOT_DATA':
      return state.set('gotData', action.value)
    case 'SET_OPTION_VALUE':
      return state.setIn(action.location, action.value)
    default:
      return state
  }
}

export default app