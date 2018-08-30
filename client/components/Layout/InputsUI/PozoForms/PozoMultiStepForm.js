import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';

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

    this.handleClick
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

export default PozoMultiStepForm;
