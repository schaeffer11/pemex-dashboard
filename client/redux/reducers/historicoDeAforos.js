import { Map, fromJS } from 'immutable'

const initialState = fromJS({
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
    }],
    checked: [],
})


const historicoDeAforos = (state = initialState, action) => {
  switch (action.type) {
    case 'set_aforosData':
        return state.set('aforosData', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'historicoDeAforos')
           return state.set('checked', fromJS(action.value))
        return state
    case 'set_historicoDeAforos':
        return state = fromJS(action.value)
    default:
      return state
  }
}

export default historicoDeAforos
