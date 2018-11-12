import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'


import { setIsLoading, setShowForms, setCurrentPage } from '../../../../../redux/actions/global'
import EstimacionCostos from '../EstimacionCostos'
import EstimacionIncProduccionAcido from './EstimacionIncProduccionAcido'
import PropuestaDeAcido from './PropuestaDeAcido'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionAcido from './ResultadosDeLaSimulacionAcido'


     const forms = [
      {'title' : 'Propuesta de Fracturamiento Ácido', 'content': <PropuestaDeAcido /> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio /> },
      {'title' : 'Pruebas de Laboratorio de Fracturamiento Ácido', 'content': <PruebasDeLaboratorioExtra /> },
      {'title' : 'Resultados de la Simulación de Fracturamiento Ácido', 'content': <ResultadosDeLaSimulacionAcido /> },
      {'title' : 'Estimación del Incremento de Producción', 'content': <EstimacionIncProduccionAcido /> },
      {'title' : 'Estimación de Costos de Fracturamiento Acido', 'content': <EstimacionCostos /> }
    ]


@autobind class AcidoMultiStepForm extends Component {

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
    let { setShowForms, hasSubmitted, propuestaHasErrors, resultadosSimulacionHasErrors, estIncProduccionHasErrors, estCostsHasErrors } = this.props
    let className = 'subtab'


    
    let errors = [propuestaHasErrors, false, false, resultadosSimulacionHasErrors, estIncProduccionHasErrors, estCostsHasErrors]
    let title = forms[this.state.currentStep].title
    let formClassName = forms[this.state.currentStep].content.type.WrappedComponent.name

     return (
         <div className={`multistep-form`}>
          <div className ={`banner ${formClassName}`}></div>
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
              { title }
            </div>
            <div className="tab-actions">
               <button className="cta clear" onClick={(e) => setShowForms(false)}><i className="fa fa-undo">&nbsp;</i></button>
               <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
               <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button>
               <button className="cta clear load" onClick={this.activateModal}><i className="fa fa-download">&nbsp;</i></button>
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
  propuestaHasErrors: state.getIn(['propuestaAcido', 'hasErrors']),
  resultadosSimulacionHasErrors: state.getIn(['resultadosSimulacionAcido', 'hasErrors']),
  estIncProduccionHasErrors: state.getIn(['estIncProduccionAcido', 'hasErrors']),
  estCostsHasErrors: state.getIn(['estCost', 'hasErrors']),
})


export default connect(mapStateToProps, mapDispatchToProps)(AcidoMultiStepForm);
