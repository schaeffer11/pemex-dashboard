import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import EstimacionCostos from '../EstimacionCostos'
import EstimacionIncProduccionAcido from './EstimacionIncProduccionAcido'
import PropuestaDeAcido from './PropuestaDeAcido'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionAcido from './ResultadosDeLaSimulacionAcido'
import { setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
import { setShowForms } from '../../../../../redux/actions/global'

@autobind class AcidoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.propuestaDeAcido = React.createRef();
    this.pruebasDeLaboratorio = React.createRef();
    this.pruebasDeLaboratorioExtra = React.createRef();
    this.resultadosDeLaSimulacionAcido = React.createRef();
    this.estimacionIncProduccionAcido = React.createRef();
    this.estimacionCostos = React.createRef();

    this.forms = [
      {'title' : 'Propuesta de Fracturamiento Acido', 'content': <PropuestaDeAcido ref={Ref =>this.propuestaDeAcido =Ref } /> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio ref={Ref =>this.pruebasDeLaboratorio =Ref }/> },
      {'title' : 'Pruebas de Laboratorio de Fracturamiento Acido', 'content': <PruebasDeLaboratorioExtra ref={Ref =>this.pruebasDeLaboratorioExtra =Ref }/> },
      {'title' : 'Resultados de la Simulacion de Fracturamiento Acido', 'content': <ResultadosDeLaSimulacionAcido ref={Ref =>this.resultadosDeLaSimulacionAcido =Ref }/> },
      {'title' : 'Estimacion del Incremento de Produccion', 'content': <EstimacionIncProduccionAcido ref={Ref =>this.estimacionIncProduccionAcido =Ref }/> },
      {'title' : 'Estimacion de Costos de Fracturamiento Acido', 'content': <EstimacionCostos ref={Ref =>this.estimacionCostos =Ref }/> }
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

  validate(){
    let { setChecked } = this.props

    const forms = [
      this.propuestaDeAcido,
      this.pruebasDeLaboratorio,
//      this.pruebasDeLaboratorioEstimulacionExtra,
        this.resultadosDeLaSimulacionAcido,
        this.estimacionIncProduccionAcido,
//      this.estimacionCostos
    ];

    let allErrors = {}
    let allChecked = []
    forms.forEach((form) => {

      let {errors, checked} = form.selector.props.forceValidation()
      allErrors = Object.assign({}, allErrors, errors);
    });


    return allErrors.length == 0;

  }

  render() {
        let { setShowForms } = this.props
     let className = 'subtab'
     let title = this.forms[this.state.currentStep].title
     let acidoFormSubmitting = this.props.forms.get('acidoFormSubmitting')
     let submitting = acidoFormSubmitting ? 'submitting' : ''

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
          <div style={{display: 'none'}}>
            {this.forms.map((form, index) => {
               if(index != this.state.currentStep)
                 return this.forms[index].content}
            )}
          </div>
         </div>
     );
  }
}


const mapDispatchToProps = dispatch => ({
    setShowForms : values => { dispatch(setShowForms(values))},
    setChecked: val => dispatch(setChecked(val))
})

const mapStateToProps = state => ({
  forms: state.get('forms'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'),
  propuestaAcido: state.get('propuestaAcido'),
  pruebasDeLaboratorioAcido: state.get('pruebasDeLaboratorioAcido'),
  resultadosSimulacionAcido: state.get('resultadosSimulacionAcido'),
  estIncProduccionAcido: state.get('estIncProduccionAcido'),
  estCostAcido: state.get('estCostAcido'),
})


export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AcidoMultiStepForm);
