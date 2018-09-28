import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    intervalos: [],
    longitudDeIntervalo: '',
    volAparejo: '',
    capacidadTotalDelPozo: '',
    volumenPrecolchonN2: '',
    volumenSistemaNoReativo: '',
    volumenSistemaReactivo: '',
    volumenSistemaDivergente: '',
    volumenDesplazamientoLiquido: '',
    volumenDesplazamientoGelLineal: '',  
        moduloYoungArena: '',
    moduloYoungLutitas: '',
    relacPoissonArena: '',
    relacPoissonLutatas: '',
    gradienteDeFractura: '',
    densidadDeDisparos: '',
    diametroDeDisparos: '',
    propuestaCompany: '',
    cedulaData: [{
        etapa: 1,
        index: 0,
        intervalo: '',
        nombreComercial: '',
        sistema: '',
        tipoDeApuntalante: '',
        concentraciDeApuntalante: '',
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


const propuestaAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_intervalo':
        return state.set('intervalos', fromJS(action.value))
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
    case 'set_volumenDesplazamientoGelLineal':
        return state.set('volumenDesplazamientoGelLineal', fromJS(action.value))
    case 'set_moduloYoungArena':
        return state.set('moduloYoungArena', fromJS(action.value))
    case 'set_moduloYoungLutitas':
        return state.set('moduloYoungLutitas', fromJS(action.value))
    case 'set_relacPoissonArena':
        return state.set('relacPoissonArena', fromJS(action.value))
    case 'set_relacPoissonLutatas':
        return state.set('relacPoissonLutatas', fromJS(action.value))
    case 'set_gradienteDeFractura':
        return state.set('gradienteDeFractura', fromJS(action.value))
    case 'set_densidadDeDisparos':
        return state.set('densidadDeDisparos', fromJS(action.value))
    case 'set_diametroDeDisparos':
        return state.set('diametroDeDisparos', fromJS(action.value))
    case 'set_cedulaData':
        return state.set('cedulaData', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'propuestaAcido')
          return state.set('checked', fromJS(action.value))
        return state
    case 'set_propuestaCompany':
        return state.set('propuestaCompany', fromJS(action.value))
    default:
      return state
  }
}

export default propuestaAcido
