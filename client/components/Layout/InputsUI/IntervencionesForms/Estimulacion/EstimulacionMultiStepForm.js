import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import { setIsLoading, setShowForms } from '../../../../../redux/actions/global'
import PropuestaDeEstimulacion from './PropuestaDeEstimulacion'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionEstimulacion from './ResultadosDeLaSimulacionEstimulacion'
import EstimacionIncProduccionEstimulacion from './EstimacionIncProduccionEstimulacion'
import EstimacionCostos from '../EstimacionCostos'


@autobind class EstimulacionMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }
  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){
    const forms = [
      {'title' : 'Propuesta de Tratamiento de Estimulación' },  
      {'title' : 'Pruebas de Laboratorio' },
      {'title' : 'Pruebas de Laboratorio de Estimulación' },
      {'title' : 'Resultados de la Simulación de Estimulación' },
      {'title' : 'Estimación del Incremento de Producción' },
      {'title' : 'Estimación de Costos de Estimulación' }
    ]

    if(forms.length > this.state.currentStep + 1){
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


    const forms = [
      {'title' : 'Propuesta de Tratamiento de Estimulación', 'content': <PropuestaDeEstimulacion /> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio /> },
      {'title' : 'Pruebas de Laboratorio de Estimulación', 'content': <PruebasDeLaboratorioExtra /> },
      {'title' : 'Resultados de la Simulación de Estimulación', 'content': <ResultadosDeLaSimulacionEstimulacion /> },
      {'title' : 'Estimación del Incremento de Producción', 'content': <EstimacionIncProduccionEstimulacion  /> },
      {'title' : 'Estimación de Costos de Estimulación', 'content': <EstimacionCostos /> }
    ]


     let title = forms[this.state.currentStep].title

     return (
         <div className={`multistep-form`}>
          <div className="subtabs">
              {forms.map( (tab, index) => {
                 let active = this.state.currentStep === index ? 'active' : ''; 
                   return <div className={`${className} ${active}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
                 }
              )}
          </div>
          <div className="content">
            <div className="tab-title">
              <i className="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => setShowForms(false)}></i>
              { title }
              <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
              <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
            </div>

            {forms[this.state.currentStep].content}

          </div>
         </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
    setShowForms : values => { dispatch(setShowForms(values))},
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimulacionMultiStepForm)

