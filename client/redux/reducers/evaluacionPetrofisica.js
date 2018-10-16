import { fromJS } from 'immutable'

const initialState = fromJS({
    hasErrors: true,
    fromSave: false,
    layerData: [{
        index: 0,
        interval: 1,
        cimaMD: '',
        baseMD: '',
        espesorBruto: 0,
        espesorNeto: '',
        vArc: '',
        vCal: '',
        vDol: '',
        porosity: '',
        sw: '',
        dens: '',
        resis: '',
        perm: '',
        length: 1,
        error: true,
    }],
    mudLossData: [{
        cimaMD: '',
        baseMD: '',
        lodoPerdido: '',
        densidad: '',
        error: true,
        length: 1
    }],
    imgURL: null,
    imgNane: '',
})


const evaluacionPetrofisica = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsEvaluacionPetrofisica':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_fromSaveEvaluacionPetrofisica':
      return state.set('fromSave', fromJS(action.value))
    case 'set_layerData':
        return state.set('layerData', fromJS(action.value))
    case 'set_mudLossData':
        return state.set('mudLossData', fromJS(action.value))   
    case 'set_imgURL':
        return state.set('imgURL', fromJS(action.url)).set('imgName', fromJS(action.name))
    case 'set_evaluacionPetrofisica':
        return state = fromJS(action.value)
    default:
      return state
  }
}

export default evaluacionPetrofisica
