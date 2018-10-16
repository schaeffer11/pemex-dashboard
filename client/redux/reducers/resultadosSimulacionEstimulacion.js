import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    hasErrors: true,
    penetracionRadial: '',
    longitudDeAgujeroDeGusano: '',
    imgURL: null,
    imgName: '',
    evidenceSimulationImgURL: '',
})


const resultadosSimulacionEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsResultadosSimulacionEstimulacion':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_penetracionRadial':
        return state.set('penetracionRadial', fromJS(action.value))
    case 'set_longitudDeAgujeroDeGusano':
        return state.set('longitudDeAgujeroDeGusano', fromJS(action.value))
    case 'set_evidenceSimulationImgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name))
    default:
      return state
  }
}

export default resultadosSimulacionEstimulacion
