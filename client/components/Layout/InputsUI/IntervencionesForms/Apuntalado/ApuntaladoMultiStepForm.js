import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios'

import PropuestaDeApuntalado from './PropuestaDeApuntalado'
import PruebasDeLaboratorioApuntalado from './PruebasDeLaboratorioApuntalado'
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
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorioApuntalado/> },
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
     let className = 'subtab'
     let title = this.forms[this.state.currentStep].title

     return (
         <div className='multistep-form'>
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
         </div>
     );
  }
}

export default ApuntaladoMultiStepForm;
