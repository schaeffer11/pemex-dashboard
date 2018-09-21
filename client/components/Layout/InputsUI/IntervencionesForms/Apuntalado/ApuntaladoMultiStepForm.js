import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import PropuestaDeApuntalado from './PropuestaDeApuntalado'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioApuntaladoExtra from './PruebasDeLaboratorioApuntaladoExtra'
import ResultadosDeLaSimulacionApuntalado from './ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from './EstimacionIncProduccionApuntalado'
import EstimacionCostosApuntalado from './EstimacionCostosApuntalado'
import { setShowForms } from '../../../../../redux/actions/global'

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
  propuestaApuntalado: state.get('propuestaApuntalado'),
  pruebasDeLaboratorioApuntalado: state.get('pruebasDeLaboratorioApuntalado'),
  resultadosSimulacionApuntalado: state.get('resultadosSimulacionApuntalado'),
  estIncProduccionApuntalado: state.get('estIncProduccionApuntalado'),
  estCostApuntalado: state.get('estCostApuntalado')
})


export default connect(mapStateToProps, mapDispatchToProps)(ApuntaladoMultiStepForm);
