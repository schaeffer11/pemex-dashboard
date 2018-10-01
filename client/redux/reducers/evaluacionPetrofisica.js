import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    layerData: [{
        index: 0,
        interval: 1,
        cimaMD: '',
        baseMD: '',
        espesorBruto: 0,
        espesorNeto: 0,
        // cimaMV: '',
        // baseMV: '',
        vArc: '',
        porosity: '',
        sw: '',
        dens: '',
        resis: '',
        perm: '',
        length: 1
    }],
    mudLossData: [{
        cimaMD: '',
        baseMD: '',
        lodoPerdido: '',
        densidad: '',
        length: 1
    }],
    imgURL: null,
    checked: []
})


const evaluacionPetrofisica = (state = initialState, action) => {
  switch (action.type) {
    case 'set_layerData':
        return state.set('layerData', fromJS(action.value))
    case 'set_mudLossData':
        return state.set('mudLossData', fromJS(action.value))   
    case 'set_imgURL':
        return state.set('imgURL', fromJS(action.value))
    case 'set_evaluacionPetrofisica':
        return state = fromJS(action.value)
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'evaluacionPetrofisica')
          return state.set('checked', fromJS(action.value))
        return state
    default:
      return state
  }
}

export default evaluacionPetrofisica
