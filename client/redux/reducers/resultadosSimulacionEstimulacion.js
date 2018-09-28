import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    volumenDelSistemaAcidoLimpieza: '',
    volumenDelSistemaNoAcidoLimpieza: '',
    tipoDeColocacion: '',
    tiempoDeContacto: '',
    numeroDeEtapas: '',
    volumenDelSistemAcido: '',
    volumenDelSistemNoAcido: '',
    volumenDeDivergente: '',
    volumenDeN2: '',
    calidadDeEspuma: '',
    volumenDePrecolchonN2: '',
    volumenDeDesplazamiento: '',
    penetracionRadial: '',
    longitudDeAgujeroDeGusano: '',
    imgURL: null,
    evidenceSimulationImgURL: '',
    checked: []
})


const resultadosSimulacionEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_volumenDelSistemaAcidoLimpieza':
        return state.set('volumenDelSistemaAcidoLimpieza', fromJS(action.value))
    case 'set_volumenDelSistemaNoAcidoLimpieza':
        return state.set('volumenDelSistemaNoAcidoLimpieza', fromJS(action.value))
    case 'set_tipoDeColocacion':
        return state.set('tipoDeColocacion', fromJS(action.value))
    case 'set_tiempoDeContacto':
        return state.set('tiempoDeContacto', fromJS(action.value))
    case 'set_numeroDeEtapas':
        return state.set('numeroDeEtapas', fromJS(action.value))
    case 'set_volumenDelSistemAcido':
        return state.set('volumenDelSistemAcido', fromJS(action.value))
    case 'set_volumenDelSistemNoAcido':
        return state.set('volumenDelSistemNoAcido', fromJS(action.value))
    case 'set_volumenDeDivergente':
        return state.set('volumenDeDivergente', fromJS(action.value))
    case 'set_volumenDeN2':
        return state.set('volumenDeN2', fromJS(action.value))
    case 'set_calidadDeEspuma':
        return state.set('calidadDeEspuma', fromJS(action.value))
    case 'set_volumenDePrecolchonN2':
        return state.set('volumenDePrecolchonN2', fromJS(action.value))
    case 'set_volumenDeDesplazamiento':
        return state.set('volumenDeDesplazamiento', fromJS(action.value))
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
