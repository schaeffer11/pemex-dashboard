import { fromJS } from 'immutable'

const initialState = fromJS({
    hasErrors: true,
    propuestaCompany: '',
    volumenVapor: '',
    calidad: '',
    gastoInyeccion: '',
    presionMaximaSalidaGenerador: '',
    temperaturaMaximaGenerador: '',
    cedulaData: [{
        etapa: 1,
        index: 0,
        error: true,
        actividad: '',
        descripcion: '',
        justificacion: '',
    }],
})


const tratamientoTermico = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergeTratamientoTermico':
      return state.mergeDeep(fromJS(action.value))
    case 'set_cedulaTratamientoTermico':
      let newState = state.set('cedulaData', fromJS(action.cedula))
      if (action.volumes !== null) {
          newState = newState.mergeDeep(action.volumes)
      }
      return newState
    default:
      return state
  }
}

export default tratamientoTermico
