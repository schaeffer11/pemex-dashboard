import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    hasErrors: true,
    penetracionRadial: '',
    longitudDeAgujeroDeGusano: '',
    imgURL: null,
    evidenceSimulationImgURL: '',
    checked: []
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
        return state.set('imgURL', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'resultadosSimulacionEstimulacion')
            return state.set('checked', fromJS(action.value))
        return state
    default:
      return state
  }
}

export default resultadosSimulacionEstimulacion
