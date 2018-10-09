import { Map, fromJS } from 'immutable'

const initialState = fromJS({ 
    hasErrors: true,
    historicoEstimulacionData: [{
        fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        acidoVol: '',
        acidoNombre: '',
        solventeVol: '',
        solventeNombre: '',
        divergenteVol: '',
        divergenteNombre: '',
        totalN2: '',
        beneficioProgramado: '',
        beneficioOficial: '',
        error: true,
    }],
    historicoAcidoData: [{
        fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        base: '',
        cima: '',
        longitudGravada: '',
        alturaGravada: '',
        anchoGravado: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: '',
        error: true,
    }],
    historicoApuntaladoData: [{
        fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        cima: '',
        base: '',
        longitudApuntalada: '',
        alturaTotalDeFractura: '',
        anchoPromedio: '',
        concentracionAreal: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: '',
        error: true,
    }]
})


const historialDeIntervenciones = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsHistorialDeIntervenciones':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_historicoEstimulacionData':
        return state.set('historicoEstimulacionData', fromJS(action.value))
    case 'set_historicoAcidoData':
        return state.set('historicoAcidoData', fromJS(action.value))
    case 'set_historicoApuntaladoData':
        return state.set('historicoApuntaladoData', fromJS(action.value))
    case 'set_historialDeIntervenciones':
        return state = fromJS(action.value)
    default:
      return state
  }
}

export default historialDeIntervenciones
