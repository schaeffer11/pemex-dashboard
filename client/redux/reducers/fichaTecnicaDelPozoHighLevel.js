import { Map, fromJS } from 'immutable'

const initialState = Map({ 
  subdireccion: '',
  bloque: '',
  activo: '',
  campo: '',
  pozo: '',
  pozoName:'',
  formacion: '',
})


const fichaTechnicaDelPozo = (state = initialState, action) => {
  switch (action.type) {
    case 'set_subdireccion':
    	return state.set('subdireccion', fromJS(action.value))
    case 'set_bloque':
    	return state.set('bloque', fromJS(action.value))
    case 'set_activo':
    	return state.set('activo', fromJS(action.value))
    case 'set_campo':
    	return state.set('campo', fromJS(action.value))
      case 'set_pozo':
        let pozo = action.value
    	return state.set('pozo', fromJS(pozo.value))
                    .set('pozoName', fromJS(pozo.label))
    case 'set_formacion':
    	return state.set('formacion', fromJS(action.value))
    default:
      return state
  }
}

export default fichaTechnicaDelPozo
