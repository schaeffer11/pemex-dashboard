import { Map, fromJS } from 'immutable'

const initialState = fromJS({
  subdireccion: null,
  activo: null,
  field: null,
  well: null,
  job: null,
  formation: null,
  jobType: null,
  company: null,
  interventionType: null,
  terminationType: null,
  groupBy: null,
  groups: [],
  minDate: null,
  maxDate: null,
  lowDate: null,
  highDate: null,
  lowMonth: null,
  lowYear: null,
  highMonth: null,
  highYear: null
})


const global = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalGlobalAnalysis': 
      return state.setIn(action.location, fromJS(action.value))
    case 'set_activo':
      return state.set('activo', fromJS(action.value))
    case 'set_field':
      return state.set('field', fromJS(action.value))
    case 'set_well':
      return state.set('well', fromJS(action.value))
    case 'set_job':
      return state.set('job', fromJS(action.value))
    case 'set_formation':
      return state.set('formation', fromJS(action.value))
    case 'set_jobType':
      return state.set('jobType', fromJS(action.value))
    default:
   		return state
  }
}

export default global