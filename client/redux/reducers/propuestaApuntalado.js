import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    etapa: '',
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
    intervalo: '',
    longitudDeIntervalo: '',
    volAparejo: '',
    capacidadTotalDelPozo: '',
    volumenPrecolchonN2: '',
    volumenDeApuntalante: '',
    volumenDeGelDeFractura: '',
    volumenDesplazamiento: '',
    volumenTotalDeLiquido: '',
        moduloYoungArena: '',
    moduloYoungLutitas: '',
    relacPoissonArena: '',
    relacPoissonLutatas: '',
    gradienteDeFractura: '',
    densidadDeDisparos: '',
    diametroDeDisparos: '',    
})

const propuestaApuntalado = (state = initialState, action) => {
  switch (action.type) {

    case 'set_etapa':
        return state.set('etapa', fromJS(action.value))
    case 'set_sistema':
        return state.set('sistema', fromJS(action.value))
    case 'set_tipoDeApuntalante':
        return state.set('tipoDeApuntalante', fromJS(action.value))
    case 'set_concentraciDeApuntalante':
        return state.set('concentraciDeApuntalante', fromJS(action.value))
    case 'set_volLiquid':
        return state.set('volLiquid', fromJS(action.value))
    case 'set_gastoN2':
        return state.set('gastoN2', fromJS(action.value))
    case 'set_gastoLiqudo':
        return state.set('gastoLiqudo', fromJS(action.value))
    case 'set_gastoEnFondo':
        return state.set('gastoEnFondo', fromJS(action.value))
    case 'set_calidad':
        return state.set('calidad', fromJS(action.value))
    case 'set_volN2':
        return state.set('volN2', fromJS(action.value))
    case 'set_volLiquidoAcum':
        return state.set('volLiquidoAcum', fromJS(action.value))
    case 'set_volN2Acum':
        return state.set('volN2Acum', fromJS(action.value))
    case 'set_relN2Liq':
        return state.set('relN2Liq', fromJS(action.value))
    case 'set_tiempo':
        return state.set('tiempo', fromJS(action.value))
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
   
    default:
      return state
  }
}

export default propuestaApuntalado