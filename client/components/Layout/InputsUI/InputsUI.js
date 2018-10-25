import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';
import { connect } from 'react-redux'
import AriaModal from 'react-aria-modal'
import '../../../styles/components/_query_modal.css'

import GeneralData from './Components/GeneralData'
import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'
import BaseIntervenciones from './IntervencionesForms/BaseIntervenciones'
import PozoMultiStepForm from './PozoForms/PozoMultiStepForm'
import ResultsMultiStepForm from './ResultsForms/ResultsMultiStepForm'
import { submitForm } from '../../../redux/actions/pozoFormActions'
import { submitResultsForm } from '../../../redux/actions/results'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'
import { setHasSubmitted, setIsLoading, setCurrentPage, setSaveName } from '../../../redux/actions/global'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      isOpen: false,
      isOpenBug: false,
      error: '', 
      fieldWellOptions: [],
      bugResponseError: false,
      bugResponseSuccess: false,
      comment: '',
      saveName: null
    }

    this.pozoMultiStepFormRef = React.createRef();
    this.intervencionesFormRef = React.createRef();
    this.resultsFromRef = React.createRef();

    this.pozoMultiStepForm = React.createElement(PozoMultiStepForm, { ref: this.pozoMultiStepFormRef });
    this.intervencionesForm = React.createElement(BaseIntervenciones,  { ref: this.intervencionesFormRef});
    this.resultsForm = React.createElement(ResultsMultiStepForm, { ref: this.resultsFromRef})
  }


  componentDidMount() {
    const { token, saveName } = this.props
    console.log('mounted,', saveName)
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    fetch('/api/getFieldWellMapping', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r,
          saveName: saveName
        })
    })

  }

  componentDidUpdate(prevProps) {
    let { saveName } = this.props
    if (saveName !== prevProps.saveName) {
      console.log('updatigngggggggg')
      this.setState({
        saveName: saveName
      })
    }
  }

  handleSelectTab(val) {
    let { setCurrentPage, tipoDeIntervenciones } = this.props

    console.log(val)
    if (val === 'Intervenciones') {
      let name = tipoDeIntervenciones === 'estimulacion' 
                ? 'propuestaEstimulacion' 
                : tipoDeIntervenciones === 'acido' 
                      ? 'propuestaAcido' 
                      : tipoDeIntervenciones === 'apuntalado' 
                          ? 'propuestaApuntalado'
                          : 'propuestaTermica'
      setCurrentPage(name)
    }
    else {
      setCurrentPage('Ficha Technica del Campo')
    }
    this.setState({
      selectedTab: val,
      error: '',
      comment: '',
    })
  }

  handleSubmit(action) {
    let { saveName } = this.state
    let { tipoDeIntervenciones, hasErrorsFichaTecnicaDelPozo, hasErrorsFichaTecnicaDelCampo, hasErrorsHistorialDeIntervenciones, hasErrorsEvaluacionPetrofisica, 
      hasErrorsMecanicoYAparejoDeProduccion, hasErrorsAnalisisDelAgua, hasErrorsHistoricoDePresionCampo, hasErrorsHistoricoDePresionPozo,
      hasErrorsPropuestaEstimulacion, hasErrorsPropuestaApuntalado, hasErrorsPropuestaAcido, hasErrorsResultadosSimulacionAcido, 
      hasErrorsResultadosSimulacionEstimulacion, hasErrorsResultadosSimulacionApuntalado, hasErrorsEstIncProduccionAcido,
      hasErrorsEstIncProduccionEstimulacion, hasErrorsEstIncProduccionApuntalado, hasErrorsEstCosts, hasErrorsHistoricoDeProduccion,
      setHasSubmitted, hasErrorsHistoricoDeAforos, hasErrorsSistemasArtificialesDeProduccion, hasErrorsPropuestaTermica, setIsLoading, setSaveName } = this.props


    if (action === 'submit') {
      let hasErrors = false
      setHasSubmitted(true)
      if (hasErrorsFichaTecnicaDelPozo  || hasErrorsFichaTecnicaDelCampo || hasErrorsHistorialDeIntervenciones || hasErrorsEvaluacionPetrofisica
        || hasErrorsMecanicoYAparejoDeProduccion || hasErrorsAnalisisDelAgua || hasErrorsSistemasArtificialesDeProduccion || hasErrorsHistoricoDePresionPozo || hasErrorsHistoricoDePresionCampo
        || hasErrorsHistoricoDeProduccion || hasErrorsHistoricoDeAforos) {
        hasErrors = true
      }
      if (tipoDeIntervenciones === 'estimulacion' && (hasErrorsPropuestaEstimulacion || hasErrorsResultadosSimulacionEstimulacion || hasErrorsEstIncProduccionEstimulacion)) {
        hasErrors = true
      }
      else if (tipoDeIntervenciones === 'acido' && (hasErrorsPropuestaAcido || hasErrorsResultadosSimulacionAcido || hasErrorsEstIncProduccionAcido)) {
        hasErrors = true
      }      
      else if (tipoDeIntervenciones === 'apuntalado' && (hasErrorsPropuestaApuntalado || hasErrorsResultadosSimulacionApuntalado || hasErrorsEstIncProduccionApuntalado)) {
        hasErrors = true
      }
      else if (tipoDeIntervenciones === 'termico' && (hasErrorsPropuestaTermica)) {
        hasErrors = true
      }

      if (hasErrorsEstCosts) {
        hasErrors = true
      }

      if (!hasErrors) {
        this.props.submitPozoForm(action, this.props.token, saveName)
        this.setState({'error': ''})
      }
      else {
        setIsLoading({
          showNotification: true,
          notificationType: 'error',
          notificationText: 'Su información no se ha guardado. Hay campos que no pueden estar vacios.'
        })
        console.log('there was an errror, im out')
      }
    }
    else {
      const cleanSaveName = saveName.trim()
      this.props.submitPozoForm(action, this.props.token, cleanSaveName)
      setSaveName(cleanSaveName)
      this.setState({'error': ''})
      this.deactivateModal()
    }
  }

  handleSubmitResults(action) {
    let { setHasSubmitted, hasErrorsHistoricoDeAforosResults, hasErrorsEstCostResults, 
      hasErrorsTratamientoEstimulacion, hasErrorsTratamientoAcido, hasErrorsTratamientoApuntalado,
      tipoDeIntervencionesResults, hasErrorsEvaluacionApuntalado, hasErrorsEvaluacionAcido, hasErrorsEvaluacionEstimulacion,
      stimulationType } = this.props

    hasErrorsEvaluacionEstimulacion = stimulationType === 'matricial' ? hasErrorsEvaluacionEstimulacion : false

    if (action === 'submit') {
      let hasErrors = false
      setHasSubmitted(true)
      
      if (hasErrorsHistoricoDeAforosResults || hasErrorsEstCostResults) {
        hasErrors = true
      }
      if (tipoDeIntervencionesResults === 'estimulacion' && (hasErrorsTratamientoEstimulacion || hasErrorsEvaluacionEstimulacion)) {
        hasErrors = true
      }
      else if (tipoDeIntervencionesResults === 'acido' && (hasErrorsTratamientoAcido || hasErrorsEvaluacionAcido)) {
        hasErrors = true
      }      
      else if (tipoDeIntervencionesResults === 'apuntalado' && (hasErrorsTratamientoApuntalado || hasErrorsEvaluacionApuntalado)) {
        hasErrors = true
      }

      if (!hasErrors) {
        this.props.submitResultsForm(action, this.props.token)
        this.setState({'error': ''})
      }
      else {
        setIsLoading({
          showNotification: true,
          notificationType: 'error',
          notificationText: 'Su información no se ha guardado. Hay campos que no pueden estar vacios.'
        })
        console.log('there was an errror, im out')
      }
    }
  }


  deactivateModal() {
    this.setState({
      isOpen: false,
    })
  }


  deactivateBugModal() {
    this.setState({
      bugResponseError: false,
      bugResponseSuccess: false,
      isOpenBug: false,
      comment: '',
    })
  }

  activateModal() {
    this.setState({
      isOpen: true,
    })
  }

  activateBugModal() {
    this.setState({
      isOpenBug: true,
    })
  }


  buildModal() {
    let {saveName} = this.state
    return (
      <AriaModal
        titleId="save-modal"
        onExit={this.deactivateModal}
        underlayClickExits={true}
        verticallyCenter={true}
        focusDialog={true}
        dialogClass="queryModalPartialReset"
        dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '2%'}}

      >
      <div className="modalTest" >
        <div className="modal-title">
          Guardar sesión
        </div>
        <div className="modal-info"> 
          Dar nombre a la sesion a guardar
        </div>
        <div className="modal-body">
          <input onChange={(e) => this.setState({saveName: e.target.value})} value={saveName}></input>
          <br></br>
          <button className="submit save-button" style={{marginTop: '25px'}} disabled={!saveName} onClick={(e) => this.handleSubmit('save')}>{'Guardar'}</button>
        </div> 
      </div>
      </AriaModal>
    )
  }

  handleCommentInput(e) {
    this.setState({
      comment: e.target.value
    })
  }

  handleSubmitBug() {

      let { comment } = this.state
      let { token, user, global } = this.props
      global = global.toJS()
      let { currentPage } = global
      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      let selectedSubtab = 'est'

      const formData = new FormData()
      const cleanComment = comment.trim().replace(/&nbsp;/g, '').replace(/<[^\/>][^>]*><\/[^>]+>/g, '').replace(/\s+$/, '')
      formData.append('comment', JSON.stringify(cleanComment))
      formData.append('page', JSON.stringify(currentPage))
      formData.append('user', JSON.stringify(user))
      fetch('/api/comment', {
        headers,
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then((res) => {
          if (res.success) {
            this.setState({
              bugResponseError: false,
              bugResponseSuccess: true,
            })
          } else {
            this.setState({
              bugResponseError: true,
              bugResponseSuccess: false,
            })
          }
    })
  }
 

  buildBugModal() {
    let {comment, bugResponseError, bugResponseSuccess} = this.state

    const isBlank = /^\s*$/.test(comment)
    const disabled = bugResponseSuccess || !comment || comment === '' || isBlank
    return (
      <AriaModal
        titleId="save-modal"
        onExit={this.deactivateBugModal}
        underlayClickExits={true}
        verticallyCenter={true}
        focusDialog={true}
        dialogClass="queryModalPartialReset"
        dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '2%'}}

      >
      <div className="modalTest" >
        <div className="modal-title">
            Comentarios sobre pagina
        </div>
        <div className="modal-info"> 
          Cualquier error o comentario que tenga acerca de la página en turno, hacerlo aquí y enviar.
        </div>
        <div className="modal-body">
          <textarea style={{ width: '500px', height: '200px' }} value={comment} onChange={this.handleCommentInput}> </textarea><br/>
          <button disabled={disabled} className="submit save-button"  onClick={(e) => this.handleSubmitBug() }>{'Enviar'}</button>
          {bugResponseError && <div style={{color: 'red', fontWeight: 500}}>Comentarios son limitados a 1000 caracteres</div>}
          {bugResponseSuccess && <div style={{color: 'green', fontWeight: 500}}>
              <p>Gracias por su retroalimentación.</p>
              <p>El equipo de desarrolladores se pondra en contacto con usted si una clarificación es necesaria.</p>
          </div>}
        </div> 
      </div>
      </AriaModal>
    )
  }



  render() {
    let { selectedTab, error, isOpen, isOpenBug, saveName, fieldWellOptions } = this.state
    let { global } = this.props

    global = global.toJS()



    let { showForms } = global
    let form = null
    if (showForms === true) {
      if (selectedTab === 'Pozo') {
        form = this.pozoMultiStepForm
      }
      else if (selectedTab === 'Intervenciones') {
        form = this.intervencionesForm
      }
    }
    else if (showForms === 'results') {
      form = this.resultsForm
    }

    if (showForms === false) {
      return ( 
        <div className="input-forms">
          <GeneralData fieldWellOptions={fieldWellOptions}/>
        </div>
      )  
    } 
    else if (showForms === true) {
      return (
        <div className="input-forms">
          <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
          <div className="tab-content">
            { form }
          </div>
          <button className="submit save-button"  onClick={(e) => this.activateModal()}>Guardar</button>
          <button className="submit submit-button" onClick={(e) => this.handleSubmit('submit')}>Enviar</button>
          <button className="submit bug-button" onClick={(e) => this.activateBugModal()}>Comentarios</button>
          <div className="form-error">{this.state.error}</div> 
          <div style={{height: '10px'}}></div>
          <Notification />
          <Loading />
          { isOpen ? this.buildModal() : null }
          { isOpenBug ? this.buildBugModal() : null }
        </div>
      )
    }  
    else {
      return (
        <div className="input-forms">
          <div className='tabs'>
            <div className={`tab active`} >Results</div>
          </div>
          <div className='tab-content'> 
           { form }
          </div>
          <button className="submit submit-button" onClick={(e) => this.handleSubmitResults('submit')}>Enviar</button>
        <Notification />
        <Loading />
        </div>
        )
    }   
  }
}

const mapStateToProps = state => ({
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  global: state.get('global'),
  user: state.getIn(['user', 'id']),
  formsState: state.get('forms'),
  token: state.getIn(['user', 'token']),
  stimulationType: state.getIn(['resultsMeta', 'stimulationType']),
  hasErrorsFichaTecnicaDelPozo: state.getIn(['fichaTecnicaDelPozo', 'hasErrors']),
  hasErrorsFichaTecnicaDelCampo: state.getIn(['fichaTecnicaDelCampo', 'hasErrors']),
  hasErrorsHistorialDeIntervenciones: state.getIn(['historialDeIntervenciones', 'hasErrors']),
  hasErrorsEvaluacionPetrofisica: state.getIn(['evaluacionPetrofisica', 'hasErrors']),
  hasErrorsMecanicoYAparejoDeProduccion: state.getIn(['mecanicoYAparejoDeProduccion', 'hasErrors']),
  hasErrorsAnalisisDelAgua: state.getIn(['analisisDelAgua', 'hasErrors']),
  hasErrorsSistemasArtificialesDeProduccion: state.getIn(['sistemasArtificialesDeProduccion', 'hasErrors']),
  hasErrorsHistoricoDePresionCampo: state.getIn(['historicoDePresionCampo', 'hasErrors']),
  hasErrorsHistoricoDePresionPozo: state.getIn(['historicoDePresionPozo', 'hasErrors']),
  hasErrorsHistoricoDeProduccion: state.getIn(['historicoDeProduccion', 'hasErrors']),
  hasErrorsHistoricoDeAforos: state.getIn(['historicoDeAforos', 'hasErrors']),
  hasErrorsPropuestaEstimulacion: state.getIn(['propuestaEstimulacion', 'hasErrors']),
  hasErrorsPropuestaApuntalado: state.getIn(['propuestaApuntalado', 'hasErrors']),
  hasErrorsPropuestaAcido: state.getIn(['propuestaAcido', 'hasErrors']),
  hasErrorsPropuestaTermica: state.getIn(['propuestaTermica', 'hasErrors']),
  hasErrorsResultadosSimulacionAcido: state.getIn(['resultadosSimulacionAcido', 'hasErrors']),
  hasErrorsResultadosSimulacionEstimulacion: state.getIn(['resultadosSimulacionEstimulacion', 'hasErrors']),
  hasErrorsResultadosSimulacionApuntalado: state.getIn(['resultadosSimulacionApuntalado', 'hasErrors']),
  hasErrorsEstIncProduccionAcido: state.getIn(['estIncProduccionAcido', 'hasErrors']),
  hasErrorsEstIncProduccionEstimulacion: state.getIn(['estIncProduccionEstimulacion', 'hasErrors']),
  hasErrorsEstIncProduccionApuntalado: state.getIn(['estIncProduccionApuntalado', 'hasErrors']),
  hasErrorsEstCosts: state.getIn(['estCost', 'hasErrors']),
  hasErrorsHistoricoDeAforosResults: state.getIn(['historicoDeAforosResults', 'hasErrors']),
  hasErrorsEstCostResults: state.getIn(['estCostResults', 'hasErrors']),
  hasErrorsTratamientoEstimulacion: state.getIn(['tratamientoEstimulacion', 'hasErrors']),
  hasErrorsTratamientoAcido: state.getIn(['tratamientoAcido', 'hasErrors']),
  hasErrorsTratamientoApuntalado: state.getIn(['tratamientoApuntalado', 'hasErrors']),
  hasErrorsEvaluacionApuntalado: state.getIn(['evaluacionApuntalado', 'hasErrors']),
  hasErrorsEvaluacionAcido: state.getIn(['evaluacionAcido', 'hasErrors']),
  hasErrorsEvaluacionEstimulacion: state.getIn(['evaluacionEstimulacion', 'hasErrors']),
  tipoDeIntervenciones: state.getIn(['objetivoYAlcancesIntervencion', 'tipoDeIntervenciones']),
  tipoDeIntervencionesResults: state.getIn(['resultsMeta', 'interventionType']),
  saveName: state.getIn(['global', 'saveName']),
})

const mapDispatchToProps = dispatch => ({
  setHasSubmitted: val => dispatch(setHasSubmitted(val)),
  setIsLoading: val => dispatch(setIsLoading(val)),
  submitPozoForm: (action, token, name) => {dispatch(submitForm(action, token, name))},
  submitResultsForm: (action, token) => {dispatch(submitResultsForm(action, token))},
  setCurrentPage: val => {dispatch(setCurrentPage(val))},
  setSaveName: val => {dispatch(setSaveName(val))},
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
