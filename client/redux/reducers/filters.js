import { fromJS } from 'immutable'

const initialState = fromJS({
  subdireccion: [],
  activo: [],
  field: [],
  well: [],
  formation: [],
  company: [],
  interventionType: [],
  terminationType: [],
})


const filters = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalFilters':
      console.log('what is the state?', state)
      return fromJS(action.value)
    default:
   		return state
  }
}

export default filters
