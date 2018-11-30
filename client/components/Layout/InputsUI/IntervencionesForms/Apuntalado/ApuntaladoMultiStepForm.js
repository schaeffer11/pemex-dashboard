import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

import { setIsLoading, setShowForms, setCurrentPage, setTab } from '../../../../../redux/actions/global'
import PropuestaDeApuntalado from './PropuestaDeApuntalado'
import PruebasDeLaboratorio from '../PruebasDeLaboratorio'
import PruebasDeLaboratorioExtra from '../PruebasDeLaboratorioExtra'
import ResultadosDeLaSimulacionApuntalado from './ResultadosDeLaSimulacionApuntalado'
import EstimacionIncProduccionApuntalado from './EstimacionIncProduccionApuntalado'
import EstimacionCostos from '../EstimacionCostos'
import StickySubtabs from '../../Components/StickySubtabs'


    const forms = [
      {'title' : 'Propuesta de Fracturamiento Apuntalado', 'content': <PropuestaDeApuntalado />, className: 'PropuestaDeApuntalado' },  
      {'title' : 'Pruebas de Laboratorio', 'content': <PruebasDeLaboratorio />, className: 'PruebasDeLaboratorio' },
      {'title' : 'Pruebas de Laboratorio de Fracturamiento Apuntalado', 'content': <PruebasDeLaboratorioExtra />, className: 'PruebasDeLaboratorioExtra' },
      {'title' : 'Resultados de la Simulación de Fracturamiento Apuntalado', 'content': <ResultadosDeLaSimulacionApuntalado />, className: 'ResultadosDeLaSimulacionApuntalado' },
      {'title' : 'Estimación del Incremento de Producción', 'content': <EstimacionIncProduccionApuntalado />, className: 'EstimacionIncProduccionApuntalado' },
      {'title' : 'Estimación de Costos de Fracturamiento Apuntalado', 'content': <EstimacionCostos />, className: 'EstimacionCostos' }
    ];


@autobind class ApuntaladoMultiStepForm extends Component {

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
    let { setCurrentPage, setTab } = this.props

    if( this.state.currentStep - 1 >= 0){
      setCurrentPage(forms[this.state.currentStep - 1].title)
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
    else {
      setTab('Pozo')
    }
  }


  render() {
    let { setShowForms, hasSubmitted, propuestaHasErrors, resultadosSimulacionHasErrors, estIncProduccionHasErrors, estCostsHasErrors } = this.props
    let className = 'subtab'


    let errors = [propuestaHasErrors, false, false, resultadosSimulacionHasErrors, estIncProduccionHasErrors, estCostsHasErrors]
    let title = forms[this.state.currentStep].title
    let formClassName = forms[this.state.currentStep].className

     return (
         <div className={`multistep-form`}>
          <div className ={`banner ${formClassName}`}></div>
          <StickySubtabs>
              {forms.map( (tab, index) => {
                let active = this.state.currentStep === index ? 'active' : ''; 
                let error = errors[index]
                const errorClass = (error && hasSubmitted) ? 'error' : '';

                   return <div className={`${className} ${active} ${errorClass}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
                 }
              )}
          </StickySubtabs>
          <div className="content">
              <div className="tab-title">
                  { title }
              </div>
              <div className="tab-actions">
                  <button className="cta clear" onClick={(e) => setShowForms(false)}><i className="fa fa-undo">&nbsp;</i></button>
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
    setTab: values => {dispatch(setTab(values))},
})

const mapStateToProps = state => ({
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  propuestaHasErrors: state.getIn(['propuestaApuntalado', 'hasErrors']),
  resultadosSimulacionHasErrors: state.getIn(['resultadosSimulacionApuntalado', 'hasErrors']),
  estIncProduccionHasErrors: state.getIn(['estIncProduccionApuntalado', 'hasErrors']),
  estCostsHasErrors: state.getIn(['estCost', 'hasErrors']),
})


export default connect(mapStateToProps, mapDispatchToProps)(ApuntaladoMultiStepForm);
