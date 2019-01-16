import { fromJS } from 'immutable'

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
  highYear: null,
})


const globalAnalysis = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalGlobalAnalysis':
      return state.setIn(action.location, fromJS(action.value))
    case 'set_mergeGlobalAnalysis':
      return state.merge(action.obj)
    case 'set_groupByAndGroup':
      return state.set('groupBy', action.groupBy).set('groups', fromJS(action.groups))
    case 'set_wellAndJob':
      return state.set('well', action.value).set('job', null).set('jobType', null)
    // case 'set_activo':
    //   return state.set('activo', fromJS(action.value))
    // case 'set_field':
    //   return state.set('field', fromJS(action.value))
    // case 'set_well':
    //   return state.set('well', fromJS(action.value))
    case 'set_job':
      return state.set('job', fromJS(action.value))
    // case 'set_formation':
    //   return state.set('formation', fromJS(action.value))
    case 'set_jobType':
      return state.set('jobType', fromJS(action.value))
    case 'set_timeSlider':
      return state.set('lowDate', action.lowDate).set('highDate', action.highDate)
    default:
   		return state
  }
}

export default globalAnalysis
