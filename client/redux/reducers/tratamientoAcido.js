import { fromJS } from 'immutable'

const initialState = fromJS({ 
    volumenPrecolchonN2: '',
    volumenSistemaNoReativo: '',
    volumenSistemaReactivo: '',
    volumenSistemaDivergente: '',
    volumenDesplazamientoLiquido: '',
    volumenDesplazamientoGelLineal: '',  
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

const tratamientoAcido = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeTratamientoAcido':
      return state.mergeDeep(fromJS(action.value))
    default:
      return state
  }
}

export default tratamientoAcido
