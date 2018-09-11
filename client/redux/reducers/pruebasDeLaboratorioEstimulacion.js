import { Map, fromJS } from 'immutable'

const initialState = Map({ 
    labEvidenceImgURL: null,

})


const prubasDeLaboratorioEstimulacion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_labEvidenceImgURL':
        return state.set('labEvidenceImgURL', fromJS(action.value))
   
    default:
      return state
  }
}

export default prubasDeLaboratorioEstimulacion