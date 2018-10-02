import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import PropuestaDeEstimulacion from './PropuestaDeEstimulacion'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionEstimulacion from './ResultadosDeLaSimulacionEstimulacion'
import EstimacionIncProduccionEstimulacion from './EstimacionIncProduccionEstimulacion'
import EstimacionCostos from '../EstimacionCostos'
import { setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
import { setShowForms } from '../../../../../redux/actions/global'

@autobind class EstimulacionMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.propuestaDeEstimulacion = React.createRef();
    this.pruebasDeLaboratorio = React.createRef();
    this.pruebasDeLaboratorioEstimulacionExtra = React.createRef();
    this.resultadosDeLaSimulacionEstimulacion = React.createRef();
    this.estimacionIncProduccionEstimulacion = React.createRef();
    this.estimacionCostosEstimulacion = React.createRef();

    this.forms = [
      {'title' : 'Propuesta de Tratamiento de Estimulación', 'content': <PropuestaDeEstimulacion key="pEstimulacion_1" ref={Ref =>this.propuestaDeEstimulacion =Ref }/> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio key="pEstimulacion_2" ref={Ref => this.pruebasDeLaboratorio=Ref }/> },
      {'title' : 'Pruebas de Laboratorio de Estimulación', 'content': <PruebasDeLaboratorioExtra key="pEstimulacion_3" ref={Ref =>this.pruebasDeLaboratorioEstimulacionExtra =Ref }/> },
      {'title' : 'Resultados de la Simulación de Estimulación', 'content': <ResultadosDeLaSimulacionEstimulacion key="pEstimulacion_4" ref={Ref =>this.resultadosDeLaSimulacionEstimulacion =Ref }/> },
      {'title' : 'Estimación del Incremento de Producción', 'content': <EstimacionIncProduccionEstimulacion key="pEstimulacion_5" ref={Ref =>this.estimacionIncProduccionEstimulacion =Ref } /> },
      {'title' : 'Estimación de Costos de Estimulación', 'content': <EstimacionCostos key="pEstimulacion_6" ref={Ref =>this.estimacionCostosEstimulacion =Ref }/> }
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
      this.propuestaDeEstimulacion,
      this.pruebasDeLaboratorio,
      this.pruebasDeLaboratorioEstimulacionExtra,
      this.resultadosDeLaSimulacionEstimulacion,
      this.estimacionIncProduccionEstimulacion,
      this.estimacionCostosEstimulacion
    ];

    let allErrors = {}
    let allChecked = []
    forms.forEach((form) => {

      let {errors, checked} = form.selector.props.forceValidation()
      allErrors = Object.assign({}, allErrors, errors);
    });


    return Object.keys(allErrors).length == 0;

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
              <i className="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => setShowForms(false)}></i>
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
  propuestaEstimulacion: state.get('propuestaEstimulacion'),
  resultadosSimulacionEstimulacion: state.get('resultadosSimulacionEstimulacion'),
  estIncProduccionEstimulacion: state.get('estIncProduccionEstimulacion'),
  estCostEstimulacion: state.get('estCostEstimulacion'),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(EstimulacionMultiStepForm);

