import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import PropuestaDeEstimulacion from './PropuestaDeEstimulacion'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioEstimulacionExtra from './PruebasDeLaboratorioEstimulacionExtra'
import ResultadosDeLaSimulacionEstimulacion from './ResultadosDeLaSimulacionEstimulacion'
import EstimacionIncProduccionEstimulacion from './EstimacionIncProduccionEstimulacion'
import EstimacionCostosEstimulacion from './EstimacionCostosEstimulacion'
import { setShowForms } from '../../../../../redux/actions/global'

@autobind class EstimulacionMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.forms = [
      {'title' : 'Propuesta de Tratamiento de Estimulacion', 'content': <PropuestaDeEstimulacion/> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio/> },
      {'title' : 'Pruebas de Laboratorio de Estimulacion', 'content': <PruebasDeLaboratorioEstimulacionExtra/> },
      {'title' : 'Resultados de la Simulacion de Estimulacion', 'content': <ResultadosDeLaSimulacionEstimulacion/> },
      {'title' : 'Estimacion del Incremento de Produccion', 'content': <EstimacionIncProduccionEstimulacion/> },
      {'title' : 'Estimacion de Costos de Estimulacion', 'content': <EstimacionCostosEstimulacion/> }
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

  render() {
        let { setShowForms } = this.props
     let className = 'subtab'
     let title = this.forms[this.state.currentStep].title
     let estimulacionFormSubmitting = this.props.forms.get('estimulacionFormSubmitting')
     let submitting = estimulacionFormSubmitting ? 'submitting':''

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
              <i class="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => setShowForms(false)}></i>
              { title }
              <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
              <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
            </div>

            {this.forms[this.state.currentStep].content}
          </div>
         </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
    setShowForms : values => { dispatch(setShowForms(values))},
})

const mapStateToProps = state => ({
  forms: state.get('forms'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'),
  propuestaEstimulacion: state.get('propuestaEstimulacion'),
  resultadosSimulacionEstimulacion: state.get('resultadosSimulacionEstimulacion'),
  estIncProduccionEstimulacion: state.get('estIncProduccionEstimulacion'),
  estCostEstimulacion: state.get('estCostEstimulacion')
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimulacionMultiStepForm);

