import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import {submitForm} from '../../../../redux/actions/pozoFormActions'

import TecnicaDelPozoHighLevel from './TecnicaDelPozoHighLevel'
import TecnicaDelPozo from './TecnicaDelPozo'
import TecnicaDelCampo from './TecnicaDelCampo'
import SistemasArtificialesDeProduccion from './SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from './EvaluacionPetrofisica'
import MecanicoYAparejo from './MecanicoYAparejo'
import HistoricoDePresion from './HistoricoDePresion'
import HistoricoDeProduccion from './HistoricoDeProduccion'
import AnalisisDelAgua from './AnalisisDelAgua'


@autobind class PozoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.forms = [
      {'title' : 'Ficha Técnica del Pozo' , 'content':<TecnicaDelPozoHighLevel/>},
      {'title' : 'Ficha Técnica del Pozo' , 'content':<TecnicaDelPozo/>},
      {'title' : 'Ficha Técnica del Campo', 'content': <TecnicaDelCampo/>},
      {'title' : 'Información de Sistemas Artificiales de Producción', 'content': <SistemasArtificialesDeProduccion /> },
      {'title' : 'Evaluación Petrofísica', 'content': <EvaluacionPetrofisica /> },
      {'title' : 'Edo. Mecánico y Aparejo de Producción', 'content': <MecanicoYAparejo /> },
      {'title' : 'Histórico de Presión', 'content': <HistoricoDePresion />},
      {'title' : 'Histórico de Producción', 'content': <HistoricoDeProduccion /> },
      {'title' : 'Análisis del Agua', 'content': <AnalisisDelAgua /> }	
    ];

  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
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

  render() {
     let className = 'subtab'
     let title = this.forms[this.state.currentStep].title
     let pozoFormSubmitting = this.props.forms.get('pozoFormSubmitting')
     let submitting = pozoFormSubmitting ? 'submitting' : ''

     return (
         <div className={`multistep-form ${submitting}`}>
          <div className="subtabs">
              {this.forms.map( (tab, index) => {
                 let active = this.state.currentStep === index ? 'active' : ''; 
                   return <div className={`${className} ${active}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
                 }
              )}
          </div>
          <div class="content">
            <div className="tab-title">
              { title }
              <button class="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
              <button class="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
            </div>

            {this.forms[this.state.currentStep].content}
          </div>

          <button className="submit" disabled={pozoFormSubmitting} onClick={this.handleSubmit}>{pozoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>

         </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  submitPozoForm: values => {dispatch(submitForm(values))}
})

const mapStateToProps = state => ({
  forms: state.get('forms'),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua')

})


export default connect(mapStateToProps, mapDispatchToProps)(PozoMultiStepForm)
