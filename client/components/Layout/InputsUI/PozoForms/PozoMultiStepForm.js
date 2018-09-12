import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import axios from 'axios';

import {submitForm} from '../../../../redux/actions/pozoFormActions'
import TecnicaDelPozoHighLevel from './TecnicaDelPozoHighLevel'
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

    this.forms = [
      {'title' : 'Ficha Técnica del Campo', 'content': <TecnicaDelCampo containsErrors={this.containsErrors}/>},
      {'title' : 'Ficha Técnica del Pozo' , 'content':<TecnicaDelPozoHighLevel containsErrors={this.containsErrors}/>},
      {'title' : 'Ficha Técnica del Pozo' , 'content':<TecnicaDelPozo containsErrors={this.containsErrors}/>},
      {'title' : 'Evaluación Petrofísica', 'content': <EvaluacionPetrofisica containsErrors={this.containsErrors} /> },
      {'title' : 'Edo. Mecánico y Aparejo de Producción', 'content': <MecanicoYAparejo containsErrors={this.containsErrors} /> },
      {'title' : 'Análisis del Agua', 'content': <AnalisisDelAgua containsErrors={this.containsErrors} /> }, 
      {'title' : 'Información de Sistemas Artificiales de Producción', 'content': <SistemasArtificialesDeProduccion containsErrors={this.containsErrors} /> },
      {'title' : 'Histórico de Presión - Campo', 'content': <HistoricoDePresionCampo containsErrors={this.containsErrors} />},
      {'title' : 'Histórico de Presión - Pozo', 'content': <HistoricoDePresionPozo containsErrors={this.containsErrors} />},
      {'title' : 'Histórico de Producción', 'content': <HistoricoDeProduccion containsErrors={this.containsErrors} /> },


    ];

  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  containsErrors(el, errors){
    if(el === undefined) return false

    var found = this.forms.findIndex((form) => form.content.type.WrappedComponent.name == el._reactInternalFiber.type.name)
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

  handleSubmit(){
    this.props.submitPozoForm(this.props)
  }

  downloadMasterTemplate() {
    window.location = `/api/getTemplate`
  }
  
  render() {
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
          <button className="submit" disabled={pozoFormSubmitting} onClick={this.handleSubmit}>{pozoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>
          { errors.length > 0 &&
              <div className="error">Se han encontrado errores en la forma.</div>
          }
         </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  submitPozoForm: values => {dispatch(submitForm(values))}
})

const mapStateToProps = state => ({
  formsState: state.get('forms'),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua')

})


export default connect(mapStateToProps, mapDispatchToProps)(PozoMultiStepForm)
