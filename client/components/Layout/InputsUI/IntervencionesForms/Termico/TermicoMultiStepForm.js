import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import { setIsLoading, setShowForms, setCurrentPage } from '../../../../../redux/actions/global'
import PropuestaTermica from './PropuestaTermica'
// import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
// import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
// import ResultadosDeLaSimulacionEstimulacion from './ResultadosDeLaSimulacionEstimulacion'
// import EstimacionIncProduccionEstimulacion from './EstimacionIncProduccionEstimulacion'
import EstimacionCostos from '../EstimacionCostos'


    const forms = [
      {'title' : 'Propuesta de Tratamiento Térmico', 'content': <PropuestaTermica /> },
      // {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio /> },
      // {'title' : 'Pruebas de Laboratorio Térmicas', 'content': <PruebasDeLaboratorioExtra /> },
      // {'title' : 'Resultados de la Simulación de Estimulación', 'content': <ResultadosDeLaSimulacionEstimulacion /> },
      // {'title' : 'Estimación del Incremento de Producción', 'content': <EstimacionIncProduccionEstimulacion  /> },
      {'title' : 'Estimación de Costos de Estimulación', 'content': <EstimacionCostos /> }
    ]

@autobind class TermicoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }
  }

  handleClick(i){
    let { setCurrentPage } = this.props

    setCurrentPage(forms[i].title)
    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){
    let { setCurrentPage } = this.props

    if(forms.length > this.state.currentStep + 1){
      setCurrentPage(forms[this.state.currentStep + 1].title)
      this.setState({
        currentStep: this.state.currentStep + 1
      }) 
    }
  }

  handlePrevSubtab(){
    let { setCurrentPage } = this.props

    if( this.state.currentStep - 1 >= 0){
      setCurrentPage(forms[this.state.currentStep - 1].title)
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }



  render() {
    let { setShowForms, hasSubmitted, propuestaHasErrors, estCostsHasErrors } = this.props
     let className = 'subtab'



   let errors = [propuestaHasErrors, estCostsHasErrors]

     let title = forms[this.state.currentStep].title

     return (
         <div className={`multistep-form`}>
          <div className="subtabs">
              {forms.map( (tab, index) => {
                let active = this.state.currentStep === index ? 'active' : '';
                let error = errors[index]
                const errorClass = (error && hasSubmitted) ? 'error' : ''; 

                   return <div className={`${className} ${active} ${errorClass}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
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
      setCurrentPage: values => {dispatch(setCurrentPage(values))},
})

const mapStateToProps = state => ({
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  propuestaHasErrors: state.getIn(['propuestaTermica', 'hasErrors']),
  // resultadosSimulacionHasErrors: state.getIn(['resultadosSimulacionEstimulacion', 'hasErrors']),
  // estIncProduccionHasErrors: state.getIn(['estIncProduccionEstimulacion', 'hasErrors']),
  estCostsHasErrors: state.getIn(['estCost', 'hasErrors']),
})

export default connect(mapStateToProps, mapDispatchToProps)(TermicoMultiStepForm)

