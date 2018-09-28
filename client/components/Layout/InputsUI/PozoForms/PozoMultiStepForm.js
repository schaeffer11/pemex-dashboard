import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import AriaModal from 'react-aria-modal'
import '../../../../styles/components/_query_modal.css'

import { setIsLoading, setShowForms } from '../../../../redux/actions/global'
import TecnicaDelPozo from './TecnicaDelPozo'
import TecnicaDelCampo from './TecnicaDelCampo'
import SistemasArtificialesDeProduccion from './SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from './EvaluacionPetrofisica'
import MecanicoYAparejo from './MecanicoYAparejo'
import HistoricoDePresionCampo from './HistoricoDePresionCampo'
import HistoricoDePresionPozo from './HistoricoDePresionPozo'
import HistoricoDeAforos from './HistoricoDeAforos'
import HistoricoDeProduccion from './HistoricoDeProduccion'
import AnalisisDelAgua from './AnalisisDelAgua'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'

import { setFichaTecnicaDelCampo, setFichaTecnicaDelPozo, setEvaluacionPetrofisica, setMecanicoYAparejoDeProduccion, 
  setAnalisisDelAgua, setSistemasArtificialesDeProduccion, setPresionDataCampo, setPresionDataPozo, setHistoricoProduccion, setHistoricoDeAforos, setChecked } from '../../../../redux/actions/pozo'

@autobind class PozoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0,
      isOpen: false,
      selectedTransaction: null,
      transactionOptions: [],
      selectedField: null,
      selectedWell: null,
    }

    this.fichaTecnicaDelCampo = React.createRef();
    this.fichaTecnicaDelPozo = React.createRef();
    this.evaluacionPetrofisica = React.createRef();
    this.mecanicoYAparejo = React.createRef();
    this.analisisDelAgua = React.createRef();
    this.sistemasArtificialesDeProduccion = React.createRef();
    this.historicoDePresionCampo = React.createRef();
    this.historicoDePresionPozo = React.createRef();
    this.historicoDeProduccion = React.createRef();
    this.historicoDeAforos = React.createRef();
    

    // TODO: Refactor the tabs to be children instead
    this.forms = [
      {'title' : 'Ficha Técnica del Campo', 'type': 'TecnicaDelCampo', 'content': <TecnicaDelCampo ref={Ref =>  this.fichaTecnicaDelCampo=Ref } containsErrors={this.containsErrors} /> },
      {'title' : 'Ficha Técnica del Pozo' , 'type':'TecnicaDelPozo',  'content':<TecnicaDelPozo ref={Ref =>  this.fichaTecnicaDelPozo=Ref } containsErrors={this.containsErrors} /> },
      {'title' : 'Evaluación Petrofísica', 'type':'EvaluacionPetrofisica', 'content': <EvaluacionPetrofisica ref={Ref => this.evaluacionPetrofisica=Ref} containsErrors={this.containsErrors}  /> },
      {'title' : 'Edo. Mecánico y Aparejo de Producción', 'type':'MecanicoYAparejo',  'content': <MecanicoYAparejo ref={Ref => this.mecanicoYAparejo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Análisis del Agua', 'type':'AnalisisDelAgua', 'content': <AnalisisDelAgua ref={Ref => this.analisisDelAgua=Ref } containsErrors={this.containsErrors}  /> }, 
      {'title' : 'Información de Sistemas Artificiales de Producción', 'type':'SistemasArtificialesDeProduccion', 'content': <SistemasArtificialesDeProduccion ref={Ref => this.sistemasArtificialesDeProduccion=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Presión - Campo', 'type':'HistoricoDePresionCampo', 'content': <HistoricoDePresionCampo ref={Ref => this.historicoDePresionCampo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Presión - Pozo', 'type':'HistoricoDePresionPozo', 'content': <HistoricoDePresionPozo ref={Ref => this.historicoDePresionPozo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Aforos', 'type':'HistoricoDeAforos', 'content': <HistoricoDeAforos ref={Ref => this.historicoDeAforos=Ref } containsErrors={this.containsErrors} /> },
      {'title' : 'Histórico de Producción', 'type':'HistoricoDeProduccion', 'content': <HistoricoDeProduccion ref={Ref => this.historicoDeProduccion=Ref } containsErrors={this.containsErrors}  /> },
    ];
  }


  async loadTecnicaDelCampo() {
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelCampo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { campo, pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionField?fieldID=${campo}`)
      .then(res => res.json())
      .then(res => res.transactionID)
    if (transactionID) {
      let data = await fetch(`api/getFields?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err) {
        setFichaTecnicaDelCampo(data.fichaTecnicaDelCampo)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      }
    }
    else {
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }

  async loadTecnicaDelPozo() {
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelPozo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getWell?transactionID=${transactionID}`).then(r => r.json())
      let interventionData = await fetch(`api/getHistIntervenciones?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err && !interventionData.err) {
        let newObj = data.fichaTecnicaDelPozo
        newObj.historialIntervencionesData = interventionData.fichaTecnicaDelPozo.historialIntervencionesData

        setFichaTecnicaDelPozo(newObj)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })

      }
    }
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }

  async loadEvaluacionPetrofisica() {
    let { fichaTecnicaDelPozoHighLevel, setEvaluacionPetrofisica, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)


    if (transactionID) {
      let data = await fetch(`api/getMudLoss?transactionID=${transactionID}`).then(r => r.json())
      let layerData = await fetch(`api/getLayer?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err && !layerData.err) {

        let newObj = data.evaluacionPetrofisica
        newObj.layerData = layerData.evaluacionPetrofisica.layerData

        setEvaluacionPetrofisica(newObj)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      }
    }
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }


  async loadMecanicoYAparejo() {
    let { fichaTecnicaDelPozoHighLevel, setMecanicoYAparejoDeProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getMecanico?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err) {
        setMecanicoYAparejoDeProduccion(data.mecanicoYAparejoDeProduccion)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      }
    }
    else {
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }

  async loadAnalisisDelAgua() {
    let { fichaTecnicaDelPozoHighLevel, setAnalisisDelAgua, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getAnalisisAgua?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err) {
        setAnalisisDelAgua(data.analisisDelAgua)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      }
    }
    else {
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }

  async loadSistemasArtificialesDeProduccion() {
    let { fichaTecnicaDelPozoHighLevel, setSistemasArtificialesDeProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let type = await fetch(`api/getWell?transactionID=${transactionID}`).then(r => r.json())

      if (!type.err) {
        type = type.sistemasArtificialesDeProduccion.tipoDeSistemo

        let data

        if (type === 'emboloViajero') {
          data = await fetch(`api/getEmboloViajero?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoNeumatico') {
          data = await  fetch(`api/getBombeoNeumatico?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoHidraulico') {
          data = await fetch(`api/getBombeoHidraulico?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoCavidadesProgresivas') {
          data = await fetch(`api/getBombeoCavidades?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoElectrocentrifugo') {
          data = await fetch(`api/getBombeoElectrocentrifugo?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoMecanico') {
          data = await  fetch(`api/getBombeoMecanico?transactionID=${transactionID}`).then(r => r.json())
        }

        if (data && !data.err) {
        
          let newObj = data.sistemasArtificialesDeProduccion
          newObj.tipoDeSistemo = type

          setSistemasArtificialesDeProduccion(newObj)
          setLoading({ 
            isLoading: false,
            showNotification: true,
            notificationType: 'success',
            notificationText: `Se ha descargado informacion del pozo: ${pozo}`
          })
        }
        else {
          console.log('no data found')
          setLoading({ 
            isLoading: false,
            showNotification: true,
            notificationType: 'warning',
            notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
          })
        }
      }
    }
    else {
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }


  async loadHistoricoDePresionCampo() {
    let { fichaTecnicaDelPozoHighLevel, setPresionDataCampo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)


    if (transactionID) {
      let data = await fetch(`api/getFieldPressure?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err) {

        let newObj = data.historicoDePresion.presionDataCampo

        setPresionDataCampo(newObj)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })

      }
    }
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }


  async loadHistoricoDePresionPozo() {
    let { fichaTecnicaDelPozoHighLevel, setPresionDataPozo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getWellPressure?transactionID=${transactionID}`).then(r => r.json())

      if (data && !data.err) {

        let newObj = data.historicoDePresion.presionDataPozo
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
        setPresionDataPozo(newObj)

      }
    }
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }




  async loadHistoricoDeProduccion() {
    let { fichaTecnicaDelPozoHighLevel, setHistoricoProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let aforosData = await fetch(`api/getWellAforos?transactionID=${transactionID}`).then(r => r.json())
      let produccionData = await fetch(`api/getWellProduccion?transactionID=${transactionID}`).then(r => r.json())

      if (!produccionData.err && !aforosData.err) {

        let newObj = aforosData.historicoDeProduccion
        newObj.produccionData = produccionData.historicoDeProduccion.produccionData

        setHistoricoProduccion(newObj)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      }
    }
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  containsErrors(el, errors){
    if(el === undefined) return false

    var found = this.forms.findIndex((form) => form.type == el._reactInternalFiber.type.name)
    if(found !== -1)
      this.forms[found]['error'] = errors
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

  validate() {
    let { setChecked } = this.props

    const forms = [
      this.fichaTecnicaDelCampo,
      this.fichaTecnicaDelPozo,
      this.evaluacionPetrofisica,
      this.mecanicoYAparejo,
      this.analisisDelAgua,
      this.sistemasArtificialesDeProduccion,
      this.historicoDePresionCampo,
      this.historicoDePresionPozo,
      this.historicoDeProduccion
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

  deactivateModal() {
    this.setState({
      isOpen: false,
      // transactionName: null
    })
  }

  activateModal() {
    this.setState({
      isOpen: true,
    })
  }

  handleSelectTransaction(id) {
    this.setState({
      selectedTransaction: id
    })
  }

  handleSelectField(e) {
    this.setState({
      selectedField: e.value
    })
  }
  
  handleSelectWell(e) {
    this.setState({
      selectedWell: e.value
    })
  }

  buildModal() {
    let { transactionOptions, selectedTransaction, selectedField, selectedWell } = this.state
    let { fieldWellOptions } = this.props

    let fieldOptions = []
    let wellOptions = []

    if (fieldWellOptions.length > 0) {
      fieldWellOptions.forEach(item => {
        if (!fieldOptions.map(i => i.value).includes(item.FIELD_FORMACION_ID)) {
          fieldOptions.push({label: item.FIELD_NAME, value: item.FIELD_FORMACION_ID})
        }
      })
    }

    if (selectedField && fieldWellOptions.length > 0) {
      wellOptions = fieldWellOptions.filter(i => i.FIELD_FORMACION_ID === parseInt(selectedField)).map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID}))
    }


    console.log('im here', transactionOptions, selectedTransaction)
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
          Load Data from database 
        </div>
        <div className="modal-info"> 
          Please select which well you would like to load data from


          <InputRowSelectUnitless header="Campo" name="campo" value={selectedField} options={fieldOptions} callback={this.handleSelectField} name='campo' />
          <InputRowSelectUnitless header="Pozo" name="pozo" value={selectedWell} options={wellOptions} callback={this.handleSelectWell} name='pozo' />
          <button className="submit submit-load-options" disabled={!selectedField || !selectedWell} onClick={this.handleLoad}>Cargar borrdador</button>

        </div>
        <div className="modal-body">
 {/*           {transactionOptions.map(i => {
              let className = i.id === selectedTransaction ? 'save-item active-save' : 'save-item'
              return (
                <div className={className} onClick={(e) => this.handleSelectTransaction(i.id)}>{i.name}</div>
                )
            })}*/}
        </div> 
        <button className="submit submit-load" onClick={this.handleLoad} >Cargar borrdador</button>
      </div>
      </AriaModal>
    )
  }





  render() {
    let { setShowForms, fieldWellOptions } = this.props
    let { isOpen } = this.state
    let className = 'subtab'
    let title = this.forms[this.state.currentStep].title
    
    let pozoFormSubmitting = this.props.formsState.get('pozoFormSubmitting')
    const submitting = pozoFormSubmitting ? 'submitting' : ''
    const errors = this.props.formsState.get('pozoFormError')

    const errorClass = errors.length ? 'error' : ''


    let loadFunctions = [this.loadTecnicaDelCampo, this.loadTecnicaDelPozo, this.loadEvaluacionPetrofisica, this.loadMecanicoYAparejo, this.loadAnalisisDelAgua, this.loadSistemasArtificialesDeProduccion, this.loadHistoricoDePresionCampo, this.loadHistoricoDePresionPozo, this.loadHistoricoDeProduccion]
    let loadFunction =loadFunctions[this.state.currentStep]
    

    return (
       <div className={`multistep-form ${submitting} ${errorClass}`}>
        <div className="subtabs">
            {this.forms.map( (tab, index) => {
               const active = this.state.currentStep === index ? 'active' : ''; 
               const tabError = tab.error ? 'error' : ''
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
            <button className="cta load" onClick={this.activateModal}>Cargar última intervención</button> 
          </div>

          {this.forms[this.state.currentStep].content}
        </div>

        <div style={{display: 'none'}}>
          {this.forms.map((form, index) => {
             if(index != this.state.currentStep)
               return this.forms[index].content}
          )}
        </div>
      
        { errors.length > 0 &&
            <div className="error">Se han encontrado errores en la forma.</div>
        }
      { isOpen ? this.buildModal() : null }
       </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  setShowForms : values => { dispatch(setShowForms(values))},
  setFichaTecnicaDelCampo : values => { dispatch(setFichaTecnicaDelCampo(values))},
  setFichaTecnicaDelPozo : values => { dispatch(setFichaTecnicaDelPozo(values))},
  setEvaluacionPetrofisica : values => { dispatch(setEvaluacionPetrofisica(values))},
  setMecanicoYAparejoDeProduccion : values => { dispatch(setMecanicoYAparejoDeProduccion(values))},
  setAnalisisDelAgua : values => { dispatch(setAnalisisDelAgua(values))},
  setSistemasArtificialesDeProduccion : values => {dispatch(setSistemasArtificialesDeProduccion(values))},
  setPresionDataPozo : values => {dispatch(setPresionDataPozo(values))},
  setPresionDataCampo : values => {dispatch(setPresionDataCampo(values))},
  setHistoricoProduccion : values => {dispatch(setHistoricoProduccion(values))},
  setHistoricoDeAforos: values => {dispatch(HistoricoDeAforos(values))},
  setLoading: obj => {dispatch(setIsLoading(obj))},
  setChecked: values => {dispatch(setChecked(values))}
})

const mapStateToProps = state => ({
  everything: state,
  formsState: state.get('forms'),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua'),
  historicoDeAforos: state.get('historicoDeAforos'),
  user: state.get('user')
})


export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(PozoMultiStepForm)
