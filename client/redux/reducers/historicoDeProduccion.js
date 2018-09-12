import { Map, fromJS } from 'immutable'

const initialState = Map({
    fecha: '',
    tiempo: '',
    estrangulado: '',
    ptp: '',
    ttp: '',
    pbaj: '',
    tbaj: '',
    psep: '',
    tsep: '',
    ql: '',
    qo: '',
    qg: '',
    qw: '',
    rga: '',
    salinidad: '',
    ph: '',
    produccionData: [{
        fecha: '',
        dias: '',
        qo: '',
        qw: '',
        qg: '',
        qgl: '',
        np: '',
        wp: '',
        gp: '',
        gi: '',
        rga: '',
        fw: '',
        pozosProdActivos: '',
    }],


})


const historicoDeProduccion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_produccionData':
        return state.set('produccionData', fromJS(action.value))
    case 'set_fecha':
        return state.set('fecha', fromJS(action.value))
    case 'set_tiempo':
        return state.set('tiempo', fromJS(action.value))
    case 'set_estrangulado':
        return state.set('estrangulado', fromJS(action.value))
    case 'set_ptp':
        return state.set('ptp', fromJS(action.value))
    case 'set_ttp':
        return state.set('ttp', fromJS(action.value))
    case 'set_pbaj':
        return state.set('pbaj', fromJS(action.value))
    case 'set_tbaj':
        return state.set('tbaj', fromJS(action.value))
    case 'set_psep':
        return state.set('psep', fromJS(action.value))
    case 'set_tsep':
        return state.set('tsep', fromJS(action.value))
    case 'set_ql':
        return state.set('ql', fromJS(action.value))
    case 'set_qo':
        return state.set('qo', fromJS(action.value))
    case 'set_qg':
        return state.set('qg', fromJS(action.value))
    case 'set_qw':
        return state.set('qw', fromJS(action.value))
    case 'set_rga':
        return state.set('rga', fromJS(action.value))
    case 'set_salinidad':
        return state.set('salinidad', fromJS(action.value))
    case 'set_ph':
        return state.set('ph', fromJS(action.value))
    default:
      return state
  }
}

export default historicoDeProduccion