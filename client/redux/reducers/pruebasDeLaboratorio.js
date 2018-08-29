import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    tipoDeAnalisis: '',
    fechaDeMuestreo: '',
    fechaDePrueba: '',
    compania: '',
    personalDePemexQueSuperViso: '',
    obervacionesLab: '',
})


const pruebasDeLaboratorio = (state = initialState, action) => {
  switch (action.type) {
    case 'set_tipoDeAnalisis':
        return state.set('tipoDeAnalisis', fromJS(action.value))
    case 'set_fechaDeMuestreo':
        return state.set('fechaDeMuestreo', fromJS(action.value))
    case 'set_fechaDePrueba':
        return state.set('fechaDePrueba', fromJS(action.value))
    case 'set_compania':
        return state.set('compania', fromJS(action.value))
    case 'set_personalDePemexQueSuperViso':
        return state.set('personalDePemexQueSuperViso', fromJS(action.value))
    case 'set_obervacionesLab':
        return state.set('obervacionesLab', fromJS(action.value))
   
    default:
      return state
  }
}

export default pruebasDeLaboratorio