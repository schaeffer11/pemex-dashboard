import { Map, fromJS } from 'immutable'

const initialState = Map({ 
	intervaloProductor: '',
	espesorBruto: '',
	espesorNeto: '',
	caliza: '',
	dolomia: '',
	arcilla: '',
	porosidad: '',
	permeabilidad: '',
	sw: '',
	caa: '',
	cga: '',
	tipoDePozo: '',
	pwsFecha: '',
	pwfFecha: '',
	deltaPPerMes: '',
	tyac: '',
	pvt: '',
	aparejoDeProduccion: '',
	profEmpacador: '',
	profSensorPYT: '',
	tipoDeSap: '',
	moduloYoungArena: '',
	moduloYoungLutitas: '',
	relacPoissonArena: '',
	relacPoissonLutatas: '',
	gradienteDeFractura: '',
	densidadDeDisparos: '',
	diametroDeDisparos: ''
})


const fichaTecnicaDelPozo = (state = initialState, action) => {
  switch (action.type) {
    case 'set_intervaloProductor':
    	return state.set('intervaloProductor', fromJS(action.value))
    case 'set_espesorBruto':
    	return state.set('espesorBruto', fromJS(action.value))
    case 'set_espesorNeto':
    	return state.set('espesorNeto', fromJS(action.value))
    case 'set_caliza':
    	return state.set('caliza', fromJS(action.value))
    case 'set_dolomia':
    	return state.set('dolomia', fromJS(action.value))
    case 'set_arcilla':
    	return state.set('arcilla', fromJS(action.value))
    case 'set_porosidad':
    	return state.set('porosidad', fromJS(action.value))
    case 'set_permeabilidad':
    	return state.set('permeabilidad', fromJS(action.value))
    case 'set_sw':
    	return state.set('sw', fromJS(action.value))
    case 'set_caa':
    	return state.set('caa', fromJS(action.value))
    case 'set_cga':
    	return state.set('cga', fromJS(action.value))
    case 'set_tipoDePozo':
    	return state.set('tipoDePozo', fromJS(action.value))
    case 'set_pwsFecha':
    	return state.set('pwsFecha', fromJS(action.value))
    case 'set_pwfFecha':
    	return state.set('pwfFecha', fromJS(action.value))
    case 'set_deltaPPerMes':
    	return state.set('deltaPPerMes', fromJS(action.value))
    case 'set_tyac':
    	return state.set('tyac', fromJS(action.value))
    case 'set_pvt':
    	return state.set('pvt', fromJS(action.value))
    case 'set_aparejoDeProduccion':
    	return state.set('aparejoDeProduccion', fromJS(action.value))
    case 'set_profEmpacador':
    	return state.set('profEmpacador', fromJS(action.value))
    case 'set_profSensorPYT':
    	return state.set('profSensorPYT', fromJS(action.value))
    case 'set_tipoDeSap':
    	return state.set('tipoDeSap', fromJS(action.value))
    case 'set_moduloYoungArena':
    	return state.set('moduloYoungArena', fromJS(action.value))
    case 'set_moduloYoungLutitas':
    	return state.set('moduloYoungLutitas', fromJS(action.value))
    case 'set_relacPoissonArena':
    	return state.set('relacPoissonArena', fromJS(action.value))
    case 'set_relacPoissonLutatas':
    	return state.set('relacPoissonLutatas', fromJS(action.value))
    case 'set_gradienteDeFractura':
    	return state.set('gradienteDeFractura', fromJS(action.value))
    case 'set_densidadDeDisparos':
    	return state.set('densidadDeDisparos', fromJS(action.value))
    case 'set_diametroDeDisparos':
    	return state.set('diametroDeDisparos', fromJS(action.value))

    default:
      return state
  }
}

export default fichaTecnicaDelPozo


