import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';
import { connect } from 'react-redux'

import GeneralData from './Components/GeneralData'
import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'
import BaseIntervenciones from './IntervencionesForms/BaseIntervenciones'
import PozoMultiStepForm from './PozoForms/PozoMultiStepForm'
import { setShowForms } from '../../../redux/actions/global'
import { submitForm } from '../../../redux/actions/pozoFormActions'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'
import AriaModal from 'react-aria-modal'
import '../../../styles/components/_query_modal.css'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      selectedSubtab: 'tecnicaDelPozo',
      isOpen: false,
      isOpenBug: false,
      error: '', 
      fieldWellOptions: [],
      bugResponseError: false,
      bugResponseSuccess: false,
    }

    this.pozoMultiStepFormRef = React.createRef();
    this.intervencionesFormRef = React.createRef();

    this.pozoMultiStepForm = React.createElement(PozoMultiStepForm, { ref: this.pozoMultiStepFormRef });
    this.intervencionesForm = React.createElement(BaseIntervenciones,  { ref: this.intervencionesFormRef});
  }


  handleSelectTab(val) {
    let selectedSub = val === 'Pozo' ? Object.keys(pagesPozo)[0] : Object.keys(pagesIntervenciones)[0]

    this.setState({
      selectedTab: val,
      selectedSubtab: selectedSub,
      error: '',
      saveName: null,
      comment: '',
    })
  }

  handleSelectSubtab(val) {

    this.setState({
      selectedSubtab: val,
    })
  }

  componentDidMount() {
    const { token } = this.props
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
          fieldWellOptions: r
        })
    })

  }

  componentDidUpdate(prevProps) {

  }

  handleSubmit(action) {
    let { saveName } = this.state


    this.props.submitPozoForm(action, this.props.token, saveName)
    this.setState({'error': ''})

    this.deactivateModal()
  }

  scrollToBottom() {
    this.testScroll.scrollIntoView({ behaviour: 'smooth'})
  }

  deactivateModal() {
    this.setState({
      isOpen: false,
      saveName: null
    })
  }


  deactivateBugModal() {
    this.setState({
      bugResponseError: false,
      bugResponseSuccess: false,
      isOpenBug: false,
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

  validate(){
    return this.pozoMultiStepFormRef.current.getWrappedInstance().validate() &
        this.intervencionesFormRef.current.getWrappedInstance().validate()
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
          <input onChange={(e) => this.setState({saveName: e.target.value})}></input>
          <br></br>
          <button className="submit save-button" disabled={!saveName} onClick={(e) => this.handleSubmit('save')}>{'Guardar'}</button>
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
      let { comment , selectedSubtab} = this.state
      const { token, user } = this.props

      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      const formData = new FormData()

      formData.append('comment', JSON.stringify(comment))
      formData.append('page', JSON.stringify(selectedSubtab))
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
          <textarea style={{}} value={comment} onChange={this.handleCommentInput}> </textarea><br/>
          <button className="submit save-button"  onClick={(e) => this.handleSubmitBug() }>{'Enviar'}</button>
          {bugResponseError && <div style={{color: 'red', fontWeight: 500}}>Comentarios son limitados a 1000 caracteres</div>}
          {bugResponseSuccess && <div style={{color: 'green', fontWeight: 500}}>Gracias por su realimentación</div>}
        </div> 
      </div>
      </AriaModal>
    )
  }



  render() {
    let { selectedTab, selectedSubtab, error, isOpen, isOpenBug, saveName, fieldWellOptions } = this.state
    let { global } = this.props

    global = global.toJS()

    let { showForms } = global

    let form = null
    let otherForm = null

    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      form = this.pozoMultiStepForm
      otherForm = this.intervencionesForm

    }
    else if (selectedTab === 'Intervenciones') {
      form = this.intervencionesForm
      otherForm = this.pozoMultiStepForm
    }

    if (!showForms) {
      return ( 
        <div className="input-forms">
          <GeneralData fieldWellOptions={fieldWellOptions}/>
        </div>
      )  
    } 
    else {
      return (
        <div className="input-forms">
          <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
          <div className="tab-content">
            { form }
          </div>
          <div style={{display: 'none'}}>
            { otherForm }
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
          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.testScroll = el; }}>
          </div>
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
  token: state.getIn(['user', 'token'])
})

const mapDispatchToProps = dispatch => ({
  submitPozoForm: (action, token, name) => {dispatch(submitForm(action, token, name))},
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
