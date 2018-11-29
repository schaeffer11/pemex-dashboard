import { fromJS } from 'immutable'

const initialState = fromJS({ 
    pruebasDeLaboratorioData: [{
        index: 0,
        type: null,
        fechaMuestreo: null,
        fechaPrueba: null,
        compania: '',
        superviso: '',
        length: 1,
    }],
})


const pruebasDeLaboratorio = (state = initialState, action) => {
  switch (action.type) {
    case 'set_pruebasDeLaboratorioData':
        return state.set('pruebasDeLaboratorioData', fromJS(action.value))
    case 'set_pruebasDeLaboratorioImg':
        return state.setIn(['pruebasDeLaboratorioData', action.index, 'imgURL'], action.url)
            .setIn(['pruebasDeLaboratorioData', action.index, 'imgName'], action.name).setIn(['pruebasDeLaboratorioData', action.index, 'imgSource'], 'local')
    default:
      return state
  }
}

export default pruebasDeLaboratorio
