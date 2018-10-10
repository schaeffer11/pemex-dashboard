import { Map, fromJS } from 'immutable'

const initialState = Map({ 
  objetivo: '',
  alcances: '',
  tipoDeIntervenciones: '',
  fechaProgramadaIntervencion: '',
  hasErrors: true,
  fromSave: false,
  intervencionProgramada: '',
})


const objetivoYAlcancesIntervencion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_objetivo':
        return state.set('objetivo', fromJS(action.value))
    case 'set_alcances':
        return state.set('alcances', fromJS(action.value))
    case 'set_tipoDeIntervenciones':
    return state.set('tipoDeIntervenciones', fromJS(action.value))
    case 'set_fechaProgramadaIntervencion':
      return state.set('fechaProgramadaIntervencion', fromJS(action.value))
    case 'set_hasErrorsFichaTecnicaHighLevel':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_fromSaveFichaTecnicaHighLevel':
      return state.set('fromSave', fromJS(action.value))
    case 'set_intervencionProgramada':
      return state.set('intervencionProgramada', fromJS(action.value))
    default:
      return state
  }
}

export default objetivoYAlcancesIntervencion