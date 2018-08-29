import { Map, fromJS } from 'immutable'

const initialState = Map({ 
	objetivo: '',
  alcances: '',
  tipoDeIntervenciones: '',
})


const objetivoYAlcancesIntervencion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_objetivo':
        return state.set('objetivo', fromJS(action.value))
    case 'set_alcances':
        return state.set('alcances', fromJS(action.value))
    case 'set_tipoDeIntervenciones':
        return state.set('tipoDeIntervenciones', fromJS(action.value))

   
    default:
      return state
  }
}

export default objetivoYAlcancesIntervencion