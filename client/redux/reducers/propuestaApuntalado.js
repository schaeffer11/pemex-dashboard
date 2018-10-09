import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    intervalo: '',
    longitudDeIntervalo: '',
    volAparejo: '',
    capacidadTotalDelPozo: '',
    volumenPrecolchonN2: '',
    volumenDeApuntalante: '',
    volumenDeGelDeFractura: '',
    volumenDesplazamiento: '',
    volumenTotalDeLiquido: '',
    hasErrors: true,
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
        sistema: '',
        nombreComercial: '',
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
    }]
})

const propuestaApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsPropuestaApuntalado':
      return state.set('hasErrors', fromJS(action.value))
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
    case 'set_volumenDeApuntalante':
        return state.set('volumenDeApuntalante', fromJS(action.value))
    case 'set_volumenDeGelDeFractura':
        return state.set('volumenDeGelDeFractura', fromJS(action.value))
    case 'set_volumenDesplazamiento':
        return state.set('volumenDesplazamiento', fromJS(action.value))
    case 'set_volumenTotalDeLiquido':
        return state.set('volumenTotalDeLiquido', fromJS(action.value))
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
        let newState = state.set('cedulaData', fromJS(action.cedula))
        if (action.volumes !== null) {
            newState = newState.mergeDeep(action.volumes)
        }
        return newState
    case 'set_propuestaCompany':
        return state.set('propuestaCompany', fromJS(action.value))
    default:
      return state
  }
}

export default propuestaApuntalado
