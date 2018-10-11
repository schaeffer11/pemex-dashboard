import { fromJS } from 'immutable'

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


const historicoDeAforosResults = (state = initialState, action) => {
  switch (action.type) {
    case 'set_generalHistoricoDeAforosResults':
      return state.setIn(action.location, fromJS(action.value))
    default:
      return state
  }
}

export default historicoDeAforosResults
