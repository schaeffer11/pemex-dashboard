import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import axios from 'axios'

import PropuestaDeApuntalado from './PropuestaDeApuntalado'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionApuntalado from './ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from './EstimacionIncProduccionApuntalado'
import EstimacionCostos from '../EstimacionCostos'
import { setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
import { setShowForms } from '../../../../../redux/actions/global'

@autobind class ApuntaladoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.propuestaDeApuntalado = React.createRef();
    this.pruebasDeLaboratorio = React.createRef();
    this.pruebasDeLaboratorioEstimulacionExtra = React.createRef();
    this.resultadosDeLaSimulacionApuntalado = React.createRef();
    this.estimacionIncProduccionApuntalado = React.createRef();
    this.estimacionCostosEstimulacion = React.createRef();

    this.forms = [
      {'title' : 'Propuesta de Fracturamiento Apuntalado', 'content': <PropuestaDeApuntalado ref={Ref =>this.propuestaDeApuntalado =Ref }/> },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio ref={Ref =>this.pruebasDeLaboratorio =Ref }/> },
      {'title' : 'Pruebas de Laboratorio de Fracturamiento Apuntalado', 'content': <PruebasDeLaboratorioExtra ref={Ref =>this.pruebasDeLaboratorioEstimulacionExtra =Ref }/> },
      {'title' : 'Resultados de la Simulacion de Fracturamiento Apuntalado', 'content': <ResultadosDeLaSimulacionApuntalado ref={Ref =>this.resultadosDeLaSimulacionApuntalado =Ref }/> },
      {'title' : 'Estimacion del Incremento de Produccion', 'content': <EstimacionIncProduccionApuntalado ref={Ref =>this.estimacionIncProduccionApuntalado =Ref }/> },
      {'title' : 'Estimacion de Costos de Fracturamiento Apuntalado', 'content': <EstimacionCostos ref={Ref =>this.estimacionCostosEstimulacion =Ref }/> }
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
      this.propuestaDeApuntalado,
//      this.pruebasDeLaboratorio,
//      this.pruebasDeLaboratorioEstimulacionExtra,
      this.resultadosDeLaSimulacionApuntalado,
      this.estimacionIncProduccionApuntalado,
//      this.estimacionCostosEstimulacion
    ];

    let allErrors = {}
    let allChecked = []
    forms.forEach((form) => {

      let {errors, checked} = form.selector.props.forceValidation()
      allErrors = Object.assign({}, allErrors, errors);
      allChecked.push(...checked)
    });

    setChecked(allChecked)

    return allErrors.length == 0;

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
  propuestaApuntalado: state.get('propuestaApuntalado'),
  pruebasDeLaboratorioApuntalado: state.get('pruebasDeLaboratorioApuntalado'),
  resultadosSimulacionApuntalado: state.get('resultadosSimulacionApuntalado'),
  estIncProduccionApuntalado: state.get('estIncProduccionApuntalado'),
  estCostApuntalado: state.get('estCostApuntalado')
})


export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ApuntaladoMultiStepForm);
