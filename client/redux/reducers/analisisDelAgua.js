import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    pH: '',
    temperaturaDeConductividad: '',
    resistividad: '',
    salinidadConConductimetro: '',
    solidosDisueltosTotales: '',
    durezaTotalComoCaCO3: '',
    durezaDeCalcioComoCaCO3: '',
    durezaDeMagnesioComoCaCO3: '',
    alcalinidadTotalComoCaCO3: '',
    alcalinidadALaFenolftaleinaComoCaCO3: '',
    salinidadComoNaCl: '',
    sodio: '',
    calcio: '',
    magnesio: '',
    fierro: '',
    cloruros: '',
    bicarbonatos: '',
    sulfatos: '',
    carbonatos: '',
    densidadAt15: '',
    densidadAt20: '',
    checked: []
})


const analisisDelAgua = (state = initialState, action) => {
  switch (action.type) {
    case 'set_pH':
        return state.set('pH', fromJS(action.value))
    case 'set_temperaturaDeConductividad':
        return state.set('temperaturaDeConductividad', fromJS(action.value))
    case 'set_resistividad':
        return state.set('resistividad', fromJS(action.value))
    case 'set_salinidadConConductimetro':
        return state.set('salinidadConConductimetro', fromJS(action.value))
    case 'set_solidosDisueltosTotales':
        return state.set('solidosDisueltosTotales', fromJS(action.value))
    case 'set_durezaTotalComoCaCO3':
        return state.set('durezaTotalComoCaCO3', fromJS(action.value))
    case 'set_durezaDeCalcioComoCaCO3':
        return state.set('durezaDeCalcioComoCaCO3', fromJS(action.value))
    case 'set_durezaDeMagnesioComoCaCO3':
        return state.set('durezaDeMagnesioComoCaCO3', fromJS(action.value))
    case 'set_alcalinidadTotalComoCaCO3':
        return state.set('alcalinidadTotalComoCaCO3', fromJS(action.value))
    case 'set_alcalinidadALaFenolftaleinaComoCaCO3':
        return state.set('alcalinidadALaFenolftaleinaComoCaCO3', fromJS(action.value))
    case 'set_salinidadComoNaCl':
        return state.set('salinidadComoNaCl', fromJS(action.value))
    case 'set_sodio':
        return state.set('sodio', fromJS(action.value))
    case 'set_calcio':
        return state.set('calcio', fromJS(action.value))
    case 'set_magnesio':
        return state.set('magnesio', fromJS(action.value))
    case 'set_fierro':
        return state.set('fierro', fromJS(action.value))
    case 'set_cloruros':
        return state.set('cloruros', fromJS(action.value))
    case 'set_bicarbonatos':
        return state.set('bicarbonatos', fromJS(action.value))
    case 'set_sulfatos':
        return state.set('sulfatos', fromJS(action.value))
    case 'set_carbonatos':
        return state.set('carbonatos', fromJS(action.value))
    case 'set_densidadAt15':
        return state.set('densidadAt15', fromJS(action.value))
    case 'set_densidadAt20':
        return state.set('densidadAt20', fromJS(action.value))
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    case 'set_analisisDelAgua':
        return state = fromJS(action.value)
    case 'set_forms_checked' :
        if(action.form == 'analisisDelAgua')
          return state.set('checked', fromJS(action.value))
        return state
    default:
      return state
  }
}




export default analisisDelAgua
