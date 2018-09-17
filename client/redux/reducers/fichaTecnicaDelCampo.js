import { Map, fromJS } from 'immutable'

const initialState = Map({ 
	descubrimientoField: '',
    fechaDeExplotacionField: '',
    numeroDePozosOperandoField: '',
    pInicialAnoField: '',
    pActualFechaField: '',
    dpPerAnoField: '',
    tyacField: '',
    prField: '',
    tipoDeFluidoField: '',
    densidadDelAceiteField: '',
    pSatField: '',
    rgaFluidoField: '',
    salinidadField: '',
    pvtRepresentativoField: '',
    litologiaField: '',
    espesorNetoField: '',
    porosidadField: '',
    swField: '',
    kPromedioField: '',
    caaField: '',
    cgaField: '',
    qoField: '',
    qgField: '',
    rgaField: '',
    fwField: '',
    npField: '',
    gpField: '',
    wpField: '',
    rraField: '',
    rrgField: '',
    rrpceField: '',
    h2sField: '',
    co2Field: '',
    n2Field: '',
    checked: []
})


const fichaTecnicaDelCampo = (state = initialState, action) => {
  switch (action.type) {
    case 'set_descubrimientoField':
        return state.set('descubrimientoField', fromJS(action.value))
    case 'set_fechaDeExplotacionField':
        return state.set('fechaDeExplotacionField', fromJS(action.value))
    case 'set_numeroDePozosOperandoField':
        return state.set('numeroDePozosOperandoField', fromJS(action.value))
    case 'set_pInicialAnoField':
        return state.set('pInicialAnoField', fromJS(action.value))
    case 'set_pActualFechaField':
        return state.set('pActualFechaField', fromJS(action.value))
    case 'set_dpPerAnoField':
        return state.set('dpPerAnoField', fromJS(action.value))
    case 'set_tyacField':
        return state.set('tyacField', fromJS(action.value))
    case 'set_prField':
        return state.set('prField', fromJS(action.value))
    case 'set_tipoDeFluidoField':
        return state.set('tipoDeFluidoField', fromJS(action.value))
    case 'set_densidadDelAceiteField':
        return state.set('densidadDelAceiteField', fromJS(action.value))
    case 'set_pSatField':
        return state.set('pSatField', fromJS(action.value))
    case 'set_rgaFluidoField':
        return state.set('rgaFluidoField', fromJS(action.value))
    case 'set_salinidadField':
        return state.set('salinidadField', fromJS(action.value))
    case 'set_pvtRepresentativoField':
        return state.set('pvtRepresentativoField', fromJS(action.value))
    case 'set_litologiaField':
        return state.set('litologiaField', fromJS(action.value))
    case 'set_espesorNetoField':
        return state.set('espesorNetoField', fromJS(action.value))
    case 'set_porosidadField':
        return state.set('porosidadField', fromJS(action.value))
    case 'set_swField':
        return state.set('swField', fromJS(action.value))
    case 'set_kPromedioField':
        return state.set('kPromedioField', fromJS(action.value))
    case 'set_caaField':
        return state.set('caaField', fromJS(action.value))
    case 'set_cgaField':
        return state.set('cgaField', fromJS(action.value))
    case 'set_qoField':
        return state.set('qoField', fromJS(action.value))
    case 'set_qgField':
        return state.set('qgField', fromJS(action.value))
    case 'set_rgaField':
        return state.set('rgaField', fromJS(action.value))
    case 'set_fwField':
        return state.set('fwField', fromJS(action.value))
    case 'set_npField':
        return state.set('npField', fromJS(action.value))
    case 'set_gpField':
        return state.set('gpField', fromJS(action.value))
    case 'set_wpField':
        return state.set('wpField', fromJS(action.value))
    case 'set_rraField':
        return state.set('rraField', fromJS(action.value))
    case 'set_rrgField':
        return state.set('rrgField', fromJS(action.value))
    case 'set_rrpceField':
        return state.set('rrpceField', fromJS(action.value))
    case 'set_h2sField':
        return state.set('h2sField', fromJS(action.value))
    case 'set_co2Field':
        return state.set('co2Field', fromJS(action.value))
    case 'set_n2Field':
        return state.set('n2Field', fromJS(action.value))
    case 'set_checked' :
        return state.set('checked', fromJS(action.value))
    default:
      return state
  }
}

export default fichaTecnicaDelCampo
