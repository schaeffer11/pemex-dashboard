import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import objectPath from 'object-path'
import axios from 'axios';

import { submitForm } from '../../../../redux/actions/pozoFormActions'
import { setShowForms } from '../../../../redux/actions/global'
import TecnicaDelPozo from './TecnicaDelPozo'
import TecnicaDelCampo from './TecnicaDelCampo'
import SistemasArtificialesDeProduccion from './SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from './EvaluacionPetrofisica'
import MecanicoYAparejo from './MecanicoYAparejo'
import HistoricoDePresionCampo from './HistoricoDePresionCampo'
import HistoricoDePresionPozo from './HistoricoDePresionPozo'
import HistoricoDeProduccion from './HistoricoDeProduccion'
import AnalisisDelAgua from './AnalisisDelAgua'


@autobind class PozoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    // TODO: Refactor the tabs to be children instead
    this.forms = [
      {'title' : 'Ficha Técnica del Campo', 'type': 'TecnicaDelCampo', 'content': <TecnicaDelCampo containsErrors={this.containsErrors}/>},
      {'title' : 'Ficha Técnica del Pozo' , 'type':'TecnicaDelPozo',  'content':<TecnicaDelPozo containsErrors={this.containsErrors}/>},
      {'title' : 'Evaluación Petrofísica', 'type':'EvaluacionPetrofisica', 'content': <EvaluacionPetrofisica containsErrors={this.containsErrors} /> },
      {'title' : 'Edo. Mecánico y Aparejo de Producción', 'type':'MecanicoYAparejo',  'content': <MecanicoYAparejo containsErrors={this.containsErrors} /> },
      {'title' : 'Análisis del Agua', 'type':'AnalisisDelAgua', 'content': <AnalisisDelAgua containsErrors={this.containsErrors} /> }, 
      {'title' : 'Información de Sistemas Artificiales de Producción', 'type':'SistemasArtificialesDeProduccion', 'content': <SistemasArtificialesDeProduccion containsErrors={this.containsErrors} /> },
      {'title' : 'Histórico de Presión - Campo', 'type':'HistoricoDePresionCampo', 'content': <HistoricoDePresionCampo containsErrors={this.containsErrors} />},
      {'title' : 'Histórico de Presión - Pozo', 'type':'HistoricoDePresionPozo', 'content': <HistoricoDePresionPozo containsErrors={this.containsErrors} />},
      {'title' : 'Histórico de Producción', 'type':'HistoricoDeProduccion', 'content': <HistoricoDeProduccion containsErrors={this.containsErrors} /> },


    ];

  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  containsErrors(el, errors){
    if(el === undefined) return false

    var found = this.forms.findIndex((form) => form.type == el._reactInternalFiber.type.name)
    if(found !== -1)
      this.forms[found]['error'] = errors
  }

  handleNextSubtab(){
    if(this.forms.length > this.state.currentStep + 1){
      this.setState({
        currentStep: this.state.currentStep + 1
      }) 
    }
  }

  handlePrevSubtab(){
    if( this.state.currentStep - 1 >= 0){
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }

  handleSubmit(action){
    console.log('hanlding sub', action)
    this.props.submitPozoForm(action)
  }

  downloadMasterTemplate() {
    window.location = `/api/getTemplate`
  }
  
  async handleLoad() {
    // let { user, fichaTecnicaDelPozoHighLevel } = this.props
    // user = user.toJS()
    // fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    // wellID = fichaTecnicaDelPozoHighLevel.pozo,

    // These ids are just for testing
    const wellID = 449251665
    const userID = 30
    const transactionID = await fetch(`/api/getSaveID?wellID=${wellID}&userID=${userID}`)
      .then(res => res.json())
      .then(r => r.transactionID)
    console.log('ok i have a transaction', transactionID)

    Promise.all([
      fetch(`/api/getFields?transactionID=${transactionID}`).then(r => r.json()),
      fetch(`api/getMudLoss?transactionID=${transactionID}`).then(r => r.json()),
      fetch(`api/getLayer?transactionID=${transactionID}`).then(r => r.json()),
    ])
      .catch(error => console.log('some error i found', error))
      .then((results) => {
        const newState = {}
        console.log(results)
        results.forEach(r => {
          /**
           * Results is an array from all the fetches done above, we loop through each response and get the keys associated
           * These keys (rKeys) represent the name of the register (e.g. evaluacionPetrofisica, fichaTecnicaDelCampo etc)
           * We then get all the keys inside the rKeys and individually set them to our new state using object-path
           * object-path allows you to set the following: evaluacionPetrofisica.mudloss and evaluacionPetrofisica.layerData
           * This will not replace the entire evaluacion petrofisica rather it will just add the new key. Use this!
           * Otherwise, if you do evaluacionPetrofisica[mudloss] and evaluacionPetrofisica[layerData] evaluacionPetrofisica will be replaced
           */
          const rKeys = Object.keys(r)
          rKeys.forEach(registerName => {
            Object.keys(r[registerName]).forEach(key => {
              objectPath.set(newState, `${registerName}.${key}`, r[registerName][key])
            })
          })
        })
        this.props.loadFromSave(newState)
      })
}



  render() {
    let { setShowForms } = this.props
    let className = 'subtab'
    let title = this.forms[this.state.currentStep].title
    let pozoFormSubmitting = this.props.formsState.get('pozoFormSubmitting')
    const submitting = pozoFormSubmitting ? 'submitting' : ''
    const errors = this.props.formsState.get('pozoFormError')

    const errorClass = errors.length ? 'error' : ''

    return (
       <div className={`multistep-form ${submitting} ${errorClass}`}>
        <div className="subtabs">
            {this.forms.map( (tab, index) => {
               const active = this.state.currentStep === index ? 'active' : ''; 
               const tabError = tab.error ? 'error' : ''
               return <div className={`${className} ${active} ${tabError}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
               }
            )}
        </div>
        <div className="content">
          <div className="tab-title">
            { title }
            <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
            <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
          </div>

          {this.forms[this.state.currentStep].content}
        </div>
        <button className="submit" onClick={this.downloadMasterTemplate}>{'Descarga el Formato General'}</button>
        <button className="submit" disabled={pozoFormSubmitting} onClick={(e) => this.handleSubmit('save')}>{pozoFormSubmitting ? 'Saving...' : 'Save'}</button>
        <button className="submit" onClick={this.handleLoad} >Load</button>
        <button className="submit" disabled={pozoFormSubmitting} onClick={(e) => this.handleSubmit('submit')}>{pozoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>
        <button className="submit" onClick={(e) => setShowForms(false)}>Back to beginning</button>
        { errors.length > 0 &&
            <div className="error">Se han encontrado errores en la forma.</div>
        }
       </div>
     );
  }
}

const testLoadFromSave = (saved) => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOAD_SAVE', saved })
  }
}

const mapDispatchToProps = dispatch => ({
  submitPozoForm: values => {dispatch(submitForm(values))},
  loadFromSave: values => {dispatch(testLoadFromSave(values))}
  setShowForms : values => { dispatch(setShowForms(values))}
})

const mapStateToProps = state => ({
  everything: state,
  formsState: state.get('forms'),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua'),
  user: state.get('user')

})


export default connect(mapStateToProps, mapDispatchToProps)(PozoMultiStepForm)
