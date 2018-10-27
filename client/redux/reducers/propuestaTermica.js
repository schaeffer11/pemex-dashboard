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


const propuestaTermica = (state = initialState, action) => {
  switch (action.type) {
    case 'set_mergePropuestaTermica':
      return state.mergeDeep(fromJS(action.value))
    case 'set_cedulaPropuestaTermica':
      let newState = state.set('cedulaData', fromJS(action.cedula))
      if (action.volumes !== null) {
          newState = newState.mergeDeep(action.volumes)
      }
      return newState
    default:
      return state
  }
}

export default propuestaTermica
