import { fromJS } from 'immutable'

const initialState = fromJS({
    hasErrors: true,
    tratamientoCompany: '',
    tipoDeColocacion: '',
    tiempoDeContacto: '',
    cedulaData: [{
        etapa: 1,
        index: 0,
        error: true,
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
})


const tratamientoEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeTratamientoEstimulacion':
      return state.mergeDeep(fromJS(action.value))
    case 'set_cedulaTratamientoEstimulacion':
      let newState = state.set('cedulaData', fromJS(action.cedula))
      if (action.volumes !== null) {
          newState = newState.mergeDeep(action.volumes)
      }
      return newState
    default:
      return state
  }
}

export default tratamientoEstimulacion
