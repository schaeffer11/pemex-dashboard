import { Map, fromJS } from 'immutable'

const initialState = fromJS({
    checked: [],
    produccionData: [{
        fecha: null,
        dias: '',
        qo: '',
        qw: '',
        qg: '',
        qgi: '',
        qo_vol: '',
        qw_vol: '',
        qg_vol: '',
        qgi_vol: '',
        np: '',
        wp: '',
        gp: '',
        gi: '',
        rga: '',
        fw: '',
    }],
})


const historicoDeProduccion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_produccionData':
        return state.set('produccionData', fromJS(action.value))
    case 'set_forms_checked' :
        if(action.form == 'historicoDeProduccion')
          return state.set('checked', fromJS(action.value))
        return state
    case 'set_historicoProduccion':
        return state = fromJS(action.value)
    case 'set_historicoProduccionLocal':
        // console.log('in here', action.location, action.value)
        console.log('satte', state.getIn([0, 'fecha']))
        console.log('what the', state)
        return state.setIn(action.location, action.value)
    default:
      return state
  }
}

export default historicoDeProduccion
