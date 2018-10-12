import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
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
    tratamientoCompany: '', 
    cedulaData: [{
        etapa: 1,
        index: 0,
        error: true,
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

const tratamientoApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeTratamientoApuntalado':
      return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default tratamientoApuntalado
