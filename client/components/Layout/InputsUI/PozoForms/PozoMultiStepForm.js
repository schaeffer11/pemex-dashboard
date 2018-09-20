import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
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
        <button className="submit" disabled={pozoFormSubmitting} onClick={(e) => this.handleSubmit('submit')}>{pozoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>
        <button className="submit" onClick={(e) => setShowForms(false)}>Back to beginning</button>
        { errors.length > 0 &&
            <div className="error">Se han encontrado errores en la forma.</div>
        }
       </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  submitPozoForm: values => {dispatch(submitForm(values))},
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
