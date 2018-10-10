import { Map, fromJS } from 'immutable'

const initialState = fromJS({
    hasErrors: true,
    fromSave: false,
    aforosData: [{
        fecha: null,
        tiempo: '',
        estrangulador: '',
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
        error: true,
    }],
})


const historicoDeAforos = (state = initialState, action) => {
  switch (action.type) {
    case 'set_fromSaveHistoricoDeAforos':
      return state.set('fromSave', fromJS(action.value))
    case 'set_hasErrorsHistoricoDeAforos':
      return state.set('hasErrors', fromJS(action.value))
    case 'set_aforosData':
        return state.set('aforosData', fromJS(action.value))
    case 'set_historicoDeAforos':
        return state = fromJS(action.value)
    default:
      return state
  }
}

export default historicoDeAforos
