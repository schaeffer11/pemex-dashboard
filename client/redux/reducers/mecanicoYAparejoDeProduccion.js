import { Map, fromJS } from 'immutable'

const initialState = Map({ 
	tipoDeTerminacion: '',
    hIntervaloProductor: '',
    empacador: '',
    presionDifEmpacador: '',
    sensorPyt: '',
    tipoDeLiner: '',
    diametroDeLiner: '',
    tipoDePistolas: '',
    densidadDeDisparosMecanico: '',
    fase: '',
    diametroDeOrificio: '',
    penetracion: '',
    tipoDeSAP: '',
    tratamientoPor: '',
    volumenAparejoDeProduccion: '',
    volumenCimaDeIntervalo: '',
    volumenBaseDeIntervalo: '',
    volumenDeEspacioAnular: '',
    imgAparejoDeProduccionURL: null,
    checked: []
})


const mecanicoYAparejoDeProduccion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_tipoDeTerminacion':
    	return state.set('tipoDeTerminacion', fromJS(action.value))
    case 'set_hIntervaloProductor':
        return state.set('hIntervaloProductor', fromJS(action.value))
    case 'set_empacador':
        return state.set('empacador', fromJS(action.value))
    case 'set_presionDifEmpacador':
        return state.set('presionDifEmpacador', fromJS(action.value))
    case 'set_sensorPyt':
        return state.set('sensorPyt', fromJS(action.value))
    case 'set_tipoDeLiner':
        return state.set('tipoDeLiner', fromJS(action.value))
    case 'set_diametroDeLiner':
        return state.set('diametroDeLiner', fromJS(action.value))
    case 'set_tipoDePistolas':
        return state.set('tipoDePistolas', fromJS(action.value))
    case 'set_densidadDeDisparosMecanico':
        return state.set('densidadDeDisparosMecanico', fromJS(action.value))
    case 'set_fase':
        return state.set('fase', fromJS(action.value))
    case 'set_diametroDeOrificio':
        return state.set('diametroDeOrificio', fromJS(action.value))
    case 'set_penetracion':
        return state.set('penetracion', fromJS(action.value))
    case 'set_tipoDeSAP':
        return state.set('tipoDeSAP', fromJS(action.value))
    case 'set_tratamientoPor':
        return state.set('tratamientoPor', fromJS(action.value))
    case 'set_volumenAparejoDeProduccion':
        return state.set('volumenAparejoDeProduccion', fromJS(action.value))
    case 'set_volumenCimaDeIntervalo':
        return state.set('volumenCimaDeIntervalo', fromJS(action.value))
    case 'set_volumenBaseDeIntervalo':
        return state.set('volumenBaseDeIntervalo', fromJS(action.value))
    case 'set_volumenDeEspacioAnular':
        return state.set('volumenDeEspacioAnular', fromJS(action.value))
    case 'set_imgBoreDiagramURL':
        return state.set('imgURL', fromJS(action.value))
    case 'set_imgAparejoDeProduccionURL':
        return state.set('imgAparejoDeProduccionURL', fromJS(action.value))
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    default:
      return state
  }
}

export default mecanicoYAparejoDeProduccion
