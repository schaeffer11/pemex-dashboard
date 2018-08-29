import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    contenidoDeAceite: '',
    contenidoDeAgua: '',
    contenidoDeEmulsion: '',
    contenidoDeSolidos: '',
    tipoDeSolidos: '',
    densidadDelAceite: '',
    densidadDelAgua: '',
    densidadDeLaEmulsion: '',
    contenidoDeAsfaltenos: '',
    contenidoDeParafinas: '',
    contenidoDeResinas: '',
    indiceDeEstabilidadDelColoidal: '',
    indiceDeEstabilidadDelAgua: '',
    pH: '',
    salinidad: '',
    viscosidadDelAceite: '',
    tipoDeGelLineal: '',
    viscosidadDelGelLineal: '',
    tiempoDeReticulacion: '',
    pHGelLineal: '',
    tiempoDeRompedorDelGel: '',
    tamanoDelApuntalante: '',
    gravedadEspecifica: '',
    esfericidad: '',
    redondeo: '',
    turbidez: '',
    resistencia: '',
    pruebaDeSolubilidadConAcida: '',
    obervacionesPruebasLabApuntalado: '',
})


const pruebasDeLaboratorioApuntalado = (state = initialState, action) => {
  switch (action.type) {
    case 'set_contenidoDeAceite':
        return state.set('contenidoDeAceite', fromJS(action.value))
    case 'set_contenidoDeAgua':
        return state.set('contenidoDeAgua', fromJS(action.value))
    case 'set_contenidoDeEmulsion':
        return state.set('contenidoDeEmulsion', fromJS(action.value))
    case 'set_contenidoDeSolidos':
        return state.set('contenidoDeSolidos', fromJS(action.value))
    case 'set_tipoDeSolidos':
        return state.set('tipoDeSolidos', fromJS(action.value))
    case 'set_densidadDelAceite':
        return state.set('densidadDelAceite', fromJS(action.value))
    case 'set_densidadDelAgua':
        return state.set('densidadDelAgua', fromJS(action.value))
    case 'set_densidadDeLaEmulsion':
        return state.set('densidadDeLaEmulsion', fromJS(action.value))
    case 'set_contenidoDeAsfaltenos':
        return state.set('contenidoDeAsfaltenos', fromJS(action.value))
    case 'set_contenidoDeParafinas':
        return state.set('contenidoDeParafinas', fromJS(action.value))
    case 'set_contenidoDeResinas':
        return state.set('contenidoDeResinas', fromJS(action.value))
    case 'set_indiceDeEstabilidadDelColoidal':
        return state.set('indiceDeEstabilidadDelColoidal', fromJS(action.value))
    case 'set_indiceDeEstabilidadDelAgua':
        return state.set('indiceDeEstabilidadDelAgua', fromJS(action.value))
    case 'set_pH':
        return state.set('pH', fromJS(action.value))
    case 'set_salinidad':
        return state.set('salinidad', fromJS(action.value))
    case 'set_viscosidadDelAceite':
        return state.set('viscosidadDelAceite', fromJS(action.value))
    case 'set_tipoDeGelLineal':
        return state.set('tipoDeGelLineal', fromJS(action.value))
    case 'set_viscosidadDelGelLineal':
        return state.set('viscosidadDelGelLineal', fromJS(action.value))
    case 'set_tiempoDeReticulacion':
        return state.set('tiempoDeReticulacion', fromJS(action.value))
    case 'set_pHGelLineal':
        return state.set('pHGelLineal', fromJS(action.value))
    case 'set_tiempoDeRompedorDelGel':
        return state.set('tiempoDeRompedorDelGel', fromJS(action.value))
    case 'set_tamanoDelApuntalante':
        return state.set('tamanoDelApuntalante', fromJS(action.value))
    case 'set_gravedadEspecifica':
        return state.set('gravedadEspecifica', fromJS(action.value))
    case 'set_esfericidad':
        return state.set('esfericidad', fromJS(action.value))
    case 'set_redondeo':
        return state.set('redondeo', fromJS(action.value))
    case 'set_turbidez':
        return state.set('turbidez', fromJS(action.value))
    case 'set_resistencia':
        return state.set('resistencia', fromJS(action.value))
    case 'set_pruebaDeSolubilidadConAcida':
        return state.set('pruebaDeSolubilidadConAcida', fromJS(action.value))
    case 'set_obervacionesPruebasLabApuntalado':
        return state.set('obervacionesPruebasLabApuntalado', fromJS(action.value))
    
   
    default:
      return state
  }
}

export default pruebasDeLaboratorioApuntalado