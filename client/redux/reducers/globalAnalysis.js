import { Map, fromJS } from 'immutable'

const initialState = Map({
    activo: null,
    field: null,
    well: null,
    job: null,
    formation: null,
})


const global = (state = initialState, action) => {
  switch (action.type) {
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
    default:
   		return state
  }
}

export default global