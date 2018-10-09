import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    hasErrors: true,
    fromSave: false,
    waterAnalysisBool: true,
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
    densidadAt20: ''
})

const analisisDelAgua = (state = initialState, action) => {
  switch (action.type) {
    case 'set_hasErrorsAnalisisDelAgua':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_fromSaveAnalisisDelAgua':
      return state.set('fromSave', fromJS(action.value))
    case 'set_waterAnalysisBool':
        return state.set('waterAnalysisBool', fromJS(action.value))
    case 'set_pH':
        return state.set('pH', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_temperaturaDeConductividad':
        return state.set('temperaturaDeConductividad', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_resistividad':
        return state.set('resistividad', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_salinidadConConductimetro':
        return state.set('salinidadConConductimetro', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_solidosDisueltosTotales':
        return state.set('solidosDisueltosTotales', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_durezaTotalComoCaCO3':
        return state.set('durezaTotalComoCaCO3', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_durezaDeCalcioComoCaCO3':
        return state.set('durezaDeCalcioComoCaCO3', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_durezaDeMagnesioComoCaCO3':
        return state.set('durezaDeMagnesioComoCaCO3', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_alcalinidadTotalComoCaCO3':
        return state.set('alcalinidadTotalComoCaCO3', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_alcalinidadALaFenolftaleinaComoCaCO3':
        return state.set('alcalinidadALaFenolftaleinaComoCaCO3', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_salinidadComoNaCl':
        return state.set('salinidadComoNaCl', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_sodio':
        return state.set('sodio', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_calcio':
        return state.set('calcio', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_magnesio':
        return state.set('magnesio', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_fierro':
        return state.set('fierro', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_cloruros':
        return state.set('cloruros', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_bicarbonatos':
        return state.set('bicarbonatos', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_sulfatos':
        return state.set('sulfatos', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_carbonatos':
        return state.set('carbonatos', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_densidadAt15':
        return state.set('densidadAt15', action.value.length > 0 ? fromJS(action.value) : '')
    case 'set_densidadAt20':
        return state.set('densidadAt20', action.value.length > 0 ? fromJS(action.value) : '')
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
