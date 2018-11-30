import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import HistoricoDeAforosResults from './HistoricoDeAforosResults'
import Tratamientos from './Tratamientos'
import Evaluaciones from './Evaluaciones'
import GraficaTratamiento from './GraficaTratamiento'
import { setMergeResultsMeta } from '../../../../redux/actions/results'
import EstimacionCostosResults from './EstimacionCostosResults'
import ResultadosGenerales from './ResultadosGenerales'

import { setIsLoading, setShowForms } from '../../../../redux/actions/global'
import StickySubtabs from '../Components/StickySubtabs'

const forms = [
  {'title' : 'Datos generales', 'content': <ResultadosGenerales /> },
  {'title' : 'Gráfica de tratamiento', 'content': <GraficaTratamiento /> },
  {'title' : 'Aforos', 'content': <HistoricoDeAforosResults /> },
  {'title' : 'Tratamiento', 'content': <Tratamientos /> },
  {'title' : 'Evaluación', 'content': <Evaluaciones /> },
  {'title' : 'Costos de la intervención', 'content': <EstimacionCostosResults /> }
]

const mergeKeys = elem => {
  const key = Object.keys(elem)[0]
  return { [key]: elem[key] }
}

@autobind class ResultsMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }
  }

  async componentDidMount() {
    const { propuestaID, token, setMergeResultsMeta } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    const metaDataArray = await Promise.all([
      fetch(`api/getLayer?transactionID=${propuestaID}`, {headers}).then(r => r.json()),
      fetch(`api/getInterventionBase?transactionID=${propuestaID}`, {headers}).then(r => r.json()),
    ]).catch(r => console.log('something went wrong', r))

    let metaData = Object.assign({}, ...metaDataArray.map(mergeKeys))
    const { evaluacionPetrofisica, objetivoYAlcancesIntervencion } = metaData
    const intervals = evaluacionPetrofisica.layerData.map(({ cimaMD, baseMD }) => `${baseMD}-${cimaMD}`)
    const interventionType = objetivoYAlcancesIntervencion.tipoDeIntervenciones
    const interventionTypeCapitalized = interventionType.replace(/./, interventionType.toUpperCase()[0])
    
    const interventionSpecificData = await Promise.all([
      fetch(`api/getCedula${interventionTypeCapitalized}?transactionID=${propuestaID}`, {headers})
        .then(r => r.json())
        .then(r => {

          const { propuestaCompany } = r[Object.keys(r)[0]]
          return { propuestaCompany }
        }),
        fetch(`api/getIntervention${interventionTypeCapitalized}?transactionID=${propuestaID}`, {headers})
        .then(r => r.json())
        .then(r => {
          return { propuesta: r[`propuesta${interventionTypeCapitalized}`] }
        }),
    ]).catch(r => console.log('something went wrong', r))
    
    metaData = Object.assign(metaData, ...interventionSpecificData.map(mergeKeys))
    const { propuestaCompany } = metaData

    const metaForRedux = {
      intervals,
      interventionType,
      propuestaCompany,
    }
    if (interventionType === 'estimulacion') {
      metaForRedux.stimulationType = metaData.propuesta.tipoDeEstimulacion
    }
    setMergeResultsMeta(metaForRedux)
  }




  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){
    if (forms.length > this.state.currentStep + 1) {
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
    let { setShowForms, hasSubmitted, hasErrorsHistoricoDeAforosResults, hasErrorsEstCostResults, hasErrorsTratamientoEstimulacion, 
      hasErrorsTratamientoAcido, hasErrorsTratamientoApuntalado, tipoDeIntervencionesResults, hasErrorsEvaluacionApuntalado, 
      hasErrorsEvaluacionAcido, hasErrorsEvaluacionEstimulacion, hasErrorsTratamientoTermico, hasErrorsEvaluacionTermica, hasErrorsResultadosGenerales, stimulationType, wasCancelled } = this.props
    let className = 'subtab'

    let evaluacionErrors = 
      tipoDeIntervencionesResults === 'estimulacion' 
        ? (stimulationType === 'matricial' ? hasErrorsEvaluacionEstimulacion : false) 
        : tipoDeIntervencionesResults === 'acido' 
          ? hasErrorsEvaluacionAcido 
          : tipoDeIntervencionesResults === 'apuntalado' 
            ? hasErrorsEvaluacionApuntalado
            : hasErrorsEvaluacionTermica

    let tratamientoError = 
      tipoDeIntervencionesResults === 'estimulacion' 
        ? hasErrorsTratamientoEstimulacion 
        : tipoDeIntervencionesResults === 'acido' 
          ? hasErrorsTratamientoAcido 
          : tipoDeIntervencionesResults === 'apuntalado' 
            ? hasErrorsTratamientoApuntalado
            : hasErrorsTratamientoTermico

    let errors = [hasErrorsResultadosGenerales, false, hasErrorsHistoricoDeAforosResults, tratamientoError, evaluacionErrors, hasErrorsEstCostResults]

    let title = forms[this.state.currentStep].title

    let formsDupl = forms
    wasCancelled ? formsDupl = [formsDupl[0]] : null

    return (
       <div className={`multistep-form`}>
        <StickySubtabs>
            {formsDupl.map( (tab, index) => {
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
                {wasCancelled ? null : <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>}
                {wasCancelled ? null : <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button>}
            </div>

          {formsDupl[this.state.currentStep].content}

        </div>
      </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
    setShowForms : values => { dispatch(setShowForms(values))},
    setMergeResultsMeta : obj => dispatch(setMergeResultsMeta(obj)),
})

const mapStateToProps = state => ({
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  wasCancelled: state.getIn(['resultadosGenerales', 'wasCancelled']),
  token: state.getIn(['user', 'token']),
  propuestaID: state.getIn(['global', 'transactionID']),
  stimulationType: state.getIn(['resultsMeta', 'stimulationType']),
  hasErrorsHistoricoDeAforosResults: state.getIn(['historicoDeAforosResults', 'hasErrors']),
  hasErrorsEstCostResults: state.getIn(['estCostResults', 'hasErrors']),
  hasErrorsTratamientoEstimulacion: state.getIn(['tratamientoEstimulacion', 'hasErrors']),
  hasErrorsTratamientoAcido: state.getIn(['tratamientoAcido', 'hasErrors']),
  hasErrorsTratamientoTermico: state.getIn(['tratamientoTermico', 'hasErrors']),
  hasErrorsTratamientoApuntalado: state.getIn(['tratamientoApuntalado', 'hasErrors']),
  hasErrorsEvaluacionApuntalado: state.getIn(['evaluacionApuntalado', 'hasErrors']),
  hasErrorsEvaluacionAcido: state.getIn(['evaluacionAcido', 'hasErrors']),
  hasErrorsEvaluacionEstimulacion: state.getIn(['evaluacionEstimulacion', 'hasErrors']),
  hasErrorsEvaluacionTermica: state.getIn(['evaluacionTermica', 'hasErrors']),
  hasErrorsResultadosGenerales: state.getIn(['resultadosGenerales', 'hasErrors']),
  tipoDeIntervencionesResults: state.getIn(['resultsMeta', 'interventionType']),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultsMultiStepForm)

