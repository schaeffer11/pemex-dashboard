import { Map, fromJS } from 'immutable'

const initialState = Map({
    /*
    intervalo: '',
    longitudDeIntervalo: '',
    volAparejo: '',
    capacidadTotalDelPozo: '',
    volumenPrecolchonN2: '',
    volumenSistemaNoReativo: '',
    volumenSistemaReactivo: '',
    volumenSistemaDivergente: '',
    volumenDesplazamientoLiquido: '',
    volumenDesplazamientoN2: '',
    volumenTotalDeLiquido: '',
    */
    propuestaCompany: '',
    tipoDeEstimulacion: '',
    tipoDeColocacion: '',
    tiempoDeContacto: '',
    cedulaData: [{
        etapa: 1,
        index: 0,
        intervalo: '',
        nombreComercial: '',
        sistema: '',
        volLiquid: '',
        gastoN2: '',
        gastoLiqudo: '',
        gastoEnFondo: '',
        calidad: '',
        volN2: '',
        volLiquidoAcum: '',
        volN2Acum: '',
        relN2Liq: '',
        tiempo: '',
    }],
    checked: []
})


const propuestaEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_intervalo':
        return state.set('intervalo', fromJS(action.value))
    case 'set_longitudDeIntervalo':
        return state.set('longitudDeIntervalo', fromJS(action.value))
    case 'set_volAparejo':
        return state.set('volAparejo', fromJS(action.value))
    case 'set_capacidadTotalDelPozo':
        return state.set('capacidadTotalDelPozo', fromJS(action.value))
    case 'set_volumenPrecolchonN2':
        return state.set('volumenPrecolchonN2', fromJS(action.value))
    case 'set_volumenSistemaNoReativo':
        return state.set('volumenSistemaNoReativo', fromJS(action.value))
    case 'set_volumenSistemaReactivo':
        return state.set('volumenSistemaReactivo', fromJS(action.value))
    case 'set_volumenSistemaDivergente':
        return state.set('volumenSistemaDivergente', fromJS(action.value))
    case 'set_volumenDesplazamientoLiquido':
        return state.set('volumenDesplazamientoLiquido', fromJS(action.value))
    case 'set_volumenDesplazamientoN2':
        return state.set('volumenDesplazamientoN2', fromJS(action.value))
    case 'set_volumenTotalDeLiquido':
        return state.set('volumenTotalDeLiquido', fromJS(action.value))
    case 'set_cedulaData':
        return state.set('cedulaData', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'propuestaEstimulacion')
            return state.set('checked', fromJS(action.value))
        return state
    case 'set_propuestaCompany':
        return state.set('propuestaCompany', fromJS(action.value))
    case 'set_tipoDeEstimulacion':
        return state.set('tipoDeEstimulacion', fromJS(action.value))
     case 'set_tipoDeColocacion':
        return state.set('tipoDeColocacion', fromJS(action.value))
    case 'set_tiempoDeContacto':
        return state.set('tiempoDeContacto', fromJS(action.value))
    default:
      return state
  }
}

export default propuestaEstimulacion
