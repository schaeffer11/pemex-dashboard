import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import {submitForm} from '../../../../../redux/actions/pozoFormActions'

import PropuestaDeApuntalado from './PropuestaDeApuntalado'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioApuntaladoExtra from './PruebasDeLaboratorioApuntaladoExtra'
import ResultadosDeLaSimulacionApuntalado from './ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from './EstimacionIncProduccionApuntalado'
import EstimacionCostosApuntalado from './EstimacionCostosApuntalado'

@autobind class ApuntaladoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.forms = [
      {'title' : 'Propuesta de Fracturamiento Apuntalado', 'content': <PropuestaDeApuntalado/> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio/> },
      {'title' : 'Pruebas de Laboratorio de Fracturamiento Apuntalado', 'content': <PruebasDeLaboratorioApuntaladoExtra/> },
      {'title' : 'Resultados de la Simulacion de Fracturamiento Apuntalado', 'content': <ResultadosDeLaSimulacionApuntalado/> },
      {'title' : 'Estimacion del Incremento de Produccion', 'content': <EstimacionIncProduccionApuntalado/> },
      {'title' : 'Estimacion de Costos de Fracturamiento Apuntalado', 'content': <EstimacionCostosApuntalado/> }
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

  handleSubmit(){
    this.props.submitApuntaladoForm()
  }

  handlePrevSubtab(){
    if( this.state.currentStep - 1 >= 0){
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }

  render() {
     let className = 'subtab'
     let title = this.forms[this.state.currentStep].title
     let apuntaladoFormSubmitting = this.props.forms.get('apuntaladoFormSubmitting')
     let submitting = apuntaladoFormSubmitting ? 'submitting' : ''

     return (
         <div className={`multistep-form ${submitting}`}>
          <div className="subtabs">
              {this.forms.map( (tab, index) => {
                 let active = this.state.currentStep === index ? 'active' : ''; 
                   return <div className={`${className} ${active}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
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

          <button className="submit" disabled={apuntaladoFormSubmitting} onClick={this.handleSubmit}>{apuntaladoFormSubmitting ? 'Enviando...' : 'Enviar'}</button>
         </div>
     );
  }
}


const mapDispatchToProps = dispatch => ({
  submitApuntaladoForm: values => {dispatch(submitForm(values))}
})

const mapStateToProps = state => ({
  forms: state.get('forms'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'),
  propuestaApuntalado: state.get('propuestaApuntalado'),
  pruebasDeLaboratorioApuntalado: state.get('pruebasDeLaboratorioApuntalado'),
  resultadosSimulacionApuntalado: state.get('resultadosSimulacionApuntalado'),
  estIncProduccionApuntalado: state.get('estIncProduccionApuntalado'),
  estCostApuntalado: state.get('estCostApuntalado')
})


export default connect(mapStateToProps, mapDispatchToProps)(ApuntaladoMultiStepForm);
