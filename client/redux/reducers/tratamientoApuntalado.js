import { fromJS } from 'immutable'

const initialState = fromJS({ 
  volumenPrecolchonN2: '',
  volumenApuntalante: '',
  volumenGelFractura: '',
  volumenDesplazamientoLiquido: '',
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
      error: true,
      sistema: '',
      nombreComercial: '',
      tipoDeFluido: '',
      tipoDeApuntalante: '',
      volLiquido: '',
      volLechada: '',
      gastoSuperficie: '',
      gastoN2Superficie: '',
      gastoEnFondo: '',
      calidadN2Fondo: '',
      volEspumaFondo: '',
      concentracionApuntalanteSuperficie: '',
      concentracionApuntalanteFondo: '',
      apuntalanteAcumulado: '',
      tiempo: ''
  }]
})

const tratamientoApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeTratamientoApuntalado':
      return state.mergeDeep(fromJS(action.value))
    case 'set_cedulaTratamientoApuntalado':
      let newState = state.set('cedulaData', fromJS(action.cedula))
      if (action.volumes !== null) {
          newState = newState.mergeDeep(action.volumes)
      }
      return newState
    default:
      return state
  }
}

export default tratamientoApuntalado
