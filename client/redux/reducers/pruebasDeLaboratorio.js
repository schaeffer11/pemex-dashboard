import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    pruebasDeLaboratorioData: [{
        index: 0,
        type: null,
        fechaMuestreo: null,
        fechaPrueba: null,
        compania: '',
        superviso: '',
        length: 1
    }],
})


const pruebasDeLaboratorio = (state = initialState, action) => {
  switch (action.type) {
    case 'set_pruebasDeLaboratorioData':
        return state.set('pruebasDeLaboratorioData', fromJS(action.value))

   
    default:
      return state
  }
}

export default pruebasDeLaboratorio