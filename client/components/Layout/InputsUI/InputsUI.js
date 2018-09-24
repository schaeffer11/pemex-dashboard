import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';
import { connect } from 'react-redux'

import GeneralData from './Components/GeneralData'
import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'
import BaseIntervenciones from './IntervencionesForms/BaseIntervenciones'
import PozoMultiStepForm from './PozoForms/PozoMultiStepForm'
import { setShowForms } from '../../../redux/actions/global'
import { submitForm } from '../../../redux/actions/pozoFormActions'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      selectedSubtab: 'tecnicaDelPozo',
      error: ''
    }

    this.pozoMultiStepForm = React.createRef();
    this.intervencionesForm = React.createRef();
  }


  handleSelectTab(val) {
    let selectedSub = val === 'Pozo' ? Object.keys(pagesPozo)[0] : Object.keys(pagesIntervenciones)[0]

    this.setState({
      selectedTab: val,
      selectedSubtab: selectedSub,
      error: ''
    })
  }

  handleSelectSubtab(val) {

    this.setState({
      selectedSubtab: val,
    })
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  handleSubmit(action){
    console.log('hanlding sub', action)
    if( this.validate() ){
      this.props.submitPozoForm(action)
      this.setState({'error': ''})
      console.log('Validate Succeeded')
    } else {
      this.setState({'error': 'Esta forma contiene errores. Todos los campos son requeridos.'})
      console.log('Validate Failed')
    }
  }

  validate(){
    if(this.pozoMultiStepForm.current)
      return this.pozoMultiStepForm.current.getWrappedInstance().validate()

    return true
  }

  render() {
    let { selectedTab, selectedSubtab, error } = this.state
    let { global } = this.props
    let pozoFormSubmitting = this.props.formsState.get('pozoFormSubmitting')
    const errors = this.props.formsState.get('pozoFormError')

    global = global.toJS()

    let { showForms } = global


    let form = null

    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      form = <PozoMultiStepForm ref={this.pozoMultiStepForm} />
    }
    else if (selectedTab === 'Intervenciones') {
      form = <BaseIntervenciones ref={this.intervencionesForm} />
    }

    if (!showForms) {
      return ( 
        <div className="input-forms">
          <GeneralData />
        </div>
      )  
    } 
    else {
      return (
        <div className="input-forms">
          <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
          <div className="tab-content">
            { form }
          </div>
          <button className="submit save-button" disabled={pozoFormSubmitting} onClick={(e) => this.handleSubmit('save')}>{pozoFormSubmitting ? 'Guardando...' : 'Guardar'}</button>
          <button className="submit submit-button" disabled={pozoFormSubmitting} onClick={(e) => this.handleSubmit('submit')}>{pozoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>
          <div className="form-error">{this.state.error}</div> 
          <div style={{height: '10px'}}></div>
          <Notification />
          <Loading />
        </div>
      )
    }      
  }
}

const mapStateToProps = state => ({
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  global: state.get('global'),
  formsState: state.get('forms'),
 
})

const mapDispatchToProps = dispatch => ({
  submitPozoForm: values => {dispatch(submitForm(values))},
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
