
import { Map, fromJS } from 'immutable'

const initialState = fromJS({
  touched: []
})

const forms = (state = initialState, action) => {
  switch(action.type){
    case 'set_forms_checked':
//      const 
//      return state.set('touched', fromJS(action.value))
        return state;
    default:
     return state;
  }
}

export default forms;
