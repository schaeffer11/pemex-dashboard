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
import HistoricoDeIntervenciones from './HistoricoDeIntervenciones'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'

import { setFichaTecnicaDelCampo, setHistorialDeIntervenciones, setFichaTecnicaDelPozo, setEvaluacionPetrofisica, setMecanicoYAparejoDeProduccion, 
  setAnalisisDelAgua, setSistemasArtificialesDeProduccion, setPresionDataCampo, setPresionDataPozo, setHistoricoProduccion, setHistoricoDeAforos, setChecked } from '../../../../redux/actions/pozo'
import { setPage } from '../../../../redux/actions/global'

const forms = [
  {'title' : 'Ficha Técnica del Campo', content: <TecnicaDelCampo /> },
  {'title' : 'Ficha Técnica del Pozo' , content:<TecnicaDelPozo /> },
  {'title' : 'Histórico De Intervenciones', content: <HistoricoDeIntervenciones />},
  {'title' : 'Evaluación Petrofísica', content: <EvaluacionPetrofisica /> },
  {'title' : 'Edo. Mecánico y Aparejo de Producción', content: <MecanicoYAparejo /> },
  {'title' : 'Análisis del Agua', content: <AnalisisDelAgua  /> }, 
  {'title' : 'Información de Sistemas Artificiales de Producción', content: <SistemasArtificialesDeProduccion  /> },
  {'title' : 'Histórico de Presión - Campo', content: <HistoricoDePresionCampo  /> },
  {'title' : 'Histórico de Presión - Pozo', content: <HistoricoDePresionPozo  /> },
  {'title' : 'Histórico de Aforos', content: <HistoricoDeAforos /> },
  {'title' : 'Histórico de Producción', content: <HistoricoDeProduccion  /> },
];




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
      fieldWellOptions: [],
    }
  }

  componentDidMount() {
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    fetch('/api/getSubmittedFieldWellMapping', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })

  }

  async loadTecnicaDelCampo() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelCampo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { campo, pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })
    
    this.setState({
      isOpen: false
    })

    let data = await fetch(`api/getFields?transactionID=${selectedTransaction}`, headers).then(r => r.json())

    if (data && !data.err) {
      setFichaTecnicaDelCampo(data.fichaTecnicaDelCampo)
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
    this.setState({
      selectedTransaction: null
    })


  }

  async loadHistoricoDeIntervenciones() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setHistorialDeIntervenciones, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { campo, pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })
    const token = this.props.user.get('token')
    
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    this.setState({
      isOpen: false
    })

    let dataEstimulacion = await fetch(`api/getHistIntervencionesEstimulacionNew?transactionID=${selectedTransaction}`, headers).then(r => r.json())
    let dataAcido = await fetch(`api/getHistIntervencionesAcidoNew?transactionID=${selectedTransaction}`, headers).then(r => r.json())
    let dataApuntalado = await fetch(`api/getHistIntervencionesApuntaladoNew?transactionID=${selectedTransaction}`, headers).then(r => r.json())


    if (dataEstimulacion && !dataEstimulacion.err && dataAcido && !dataAcido.err && dataApuntalado && !dataApuntalado.err) {
      let newObj = dataEstimulacion.historialDeIntervenciones
      newObj.historicoAcidoData = dataAcido.historialDeIntervenciones.historicoAcidoData
      newObj.historicoApuntaladoData = dataApuntalado.historialDeIntervenciones.historicoApuntaladoData

      setHistorialDeIntervenciones(newObj)
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
    this.setState({
      selectedTransaction: null
    })


  }


  async loadTecnicaDelPozo() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelPozo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })


    this.setState({
      isOpen: false
    })

    let data = await fetch(`api/getWell?transactionID=${selectedTransaction}`, headers).then(r => r.json())
    let interventionData = await fetch(`api/getHistIntervenciones?transactionID=${selectedTransaction}`, headers).then(r => r.json())

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
    else {
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
    this.setState({
      selectedTransaction: null
    })

  }

  async loadEvaluacionPetrofisica() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setEvaluacionPetrofisica, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })


     this.setState({
      isOpen: false
    })

      let data = await fetch(`api/getMudLoss?transactionID=${selectedTransaction}`, headers).then(r => r.json())
      let layerData = await fetch(`api/getLayer?transactionID=${selectedTransaction}`, headers).then(r => r.json())

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
      else {
        console.log('no data found')
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'warning',
          notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
        })
      }
    this.setState({
      selectedTransaction: null
    })

  }


  async loadMecanicoYAparejo() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setMecanicoYAparejoDeProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    setLoading({ isLoading: true, loadText: 'Descargando' })
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    this.setState({
      isOpen: false
    })

      let data = await fetch(`api/getMecanico?transactionID=${selectedTransaction}`, headers).then(r => r.json())

      if (data && !data.err) {
        setMecanicoYAparejoDeProduccion(data.mecanicoYAparejoDeProduccion)
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
    this.setState({
      selectedTransaction: null
    })
  }

  async loadAnalisisDelAgua() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setAnalisisDelAgua, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })


    this.setState({
      isOpen: false
    })

      let data = await fetch(`api/getAnalisisAgua?transactionID=${selectedTransaction}`, headers).then(r => r.json())

      if (data && !data.err) {
        setAnalisisDelAgua(data.analisisDelAgua)
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
    this.setState({
      selectedTransaction: null
    })
  }

  async loadSistemasArtificialesDeProduccion() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setSistemasArtificialesDeProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })


    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`, headers)
    .then(res => res.json())
    .then(res => res.transactionID)

    this.setState({
      isOpen: false
    })

      let type = await fetch(`api/getWell?transactionID=${selectedTransaction}`, headers).then(r => r.json())

      if (!type.err) {
        type = type.sistemasArtificialesDeProduccion.tipoDeSistemo

        let data

        if (type === 'emboloViajero') {
          data = await fetch(`api/getEmboloViajero?transactionID=${selectedTransaction}`, headers).then(r => r.json())
        }
        else if (type === 'bombeoNeumatico') {
          data = await  fetch(`api/getBombeoNeumatico?transactionID=${selectedTransaction}`, headers).then(r => r.json())
        }
        else if (type === 'bombeoHidraulico') {
          data = await fetch(`api/getBombeoHidraulico?transactionID=${selectedTransaction}`, headers).then(r => r.json())
        }
        else if (type === 'bombeoCavidadesProgresivas') {
          data = await fetch(`api/getBombeoCavidades?transactionID=${selectedTransaction}`, headers).then(r => r.json())
        }
        else if (type === 'bombeoElectrocentrifugo') {
          data = await fetch(`api/getBombeoElectrocentrifugo?transactionID=${selectedTransaction}`, headers).then(r => r.json())
        }
        else if (type === 'bombeoMecanico') {
          data = await  fetch(`api/getBombeoMecanico?transactionID=${selectedTransaction}`, headers).then(r => r.json())
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
        this.setState({
          selectedTransaction: null
        })
      }


  }


  async loadHistoricoDePresionCampo() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setPresionDataCampo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })

    this.setState({
      isOpen: false
    })

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`, headers)
      .then(res => res.json())
      .then(res => res.transactionID)



      let data = await fetch(`api/getFieldPressure?transactionID=${selectedTransaction}`, headers).then(r => r.json())

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
    else { 
      console.log('no data found')
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
    this.setState({
      selectedTransaction: null
    })
  }


  async loadHistoricoDePresionPozo() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setPresionDataPozo, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })

    
    this.setState({
      isOpen: false
    })

      let data = await fetch(`api/getWellPressure?transactionID=${selectedTransaction}`, headers).then(r => r.json())

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
      else { 
        console.log('no data found')
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'warning',
          notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
        })
      }
    this.setState({
      selectedTransaction: null
    })
  }




  async loadHistoricoDeProduccion() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setHistoricoProduccion, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })

    this.setState({
      isOpen: false
    })

      let produccionData = await fetch(`api/getWellProduccion?transactionID=${selectedTransaction}`, headers).then(r => r.json())

    if (produccionData && !produccionData.err ) {

      let newObj = produccionData.historicoDeProduccion

      setHistoricoProduccion(newObj)
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
    this.setState({
      selectedTransaction: null
    })

  }


  async loadHistoricoDeAforos() {
    let { selectedTransaction } = this.state
    let { fichaTecnicaDelPozoHighLevel, setHistoricoDeAforos, setLoading } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    setLoading({ isLoading: true, loadText: 'Descargando' })

    this.setState({
      isOpen: false
    })

      let aforosData = await fetch(`api/getWellAforos?transactionID=${selectedTransaction}`, headers).then(r => r.json())
      

    if (aforosData && !aforosData.err) {

      let newObj = aforosData.historicoDeAforos


      setHistoricoDeAforos(newObj)
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'success',
        notificationText: `Se ha descargado informacion del pozo: ${pozo}`
      })
    }
    else { 
      setLoading({ 
        isLoading: false,
        showNotification: true,
        notificationType: 'warning',
        notificationText: `No se ha encontrado informacion del pozo: ${pozo}`
      })
    }
    this.setState({
      selectedTransaction: null
    })

  }



  handleClick(i){
    const type = forms[i].type
    // this.props.setCurrentPage(type)
    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){
    if(forms.length > this.state.currentStep + 1){
      this.setState({
        currentStep: this.state.currentStep + 1
      })
    }
  }

  handlePrevSubtab(){
    const { currentStep } = this.state
    const newStep = currentStep - 1
    if(newStep >= 0){
      // const { setCurrentPage } = this.props
      const type = forms[newStep].type
      // setCurrentPage(type)
      this.setState({
        currentStep: newStep
      })
    }
  }

  deactivateModal() {
    this.setState({
      isOpen: false,
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
      selectedField: e.value,
      selectedWell: null
    })
  }
  
  handleSelectWell(e) {
    this.setState({
      selectedWell: e.value
    })
  }

  fetchLoadFromDatabaseOptions() {
    let { selectedWell } = this.state
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    fetch(`/api/getWellTransactions?wellID=${selectedWell}`, headers)
      .then(r => r.json())
      .then(r => {
        this.setState({
          transactionOptions: r
        })
      })
  }

  handleLoad() {
    let loadFunctions = [this.loadTecnicaDelCampo, this.loadTecnicaDelPozo, this.loadHistoricoDeIntervenciones, this.loadEvaluacionPetrofisica, this.loadMecanicoYAparejo, this.loadAnalisisDelAgua, this.loadSistemasArtificialesDeProduccion, this.loadHistoricoDePresionCampo, this.loadHistoricoDePresionPozo, this.loadHistoricoDeAforos, this.loadHistoricoDeProduccion]
    let loadFunction = loadFunctions[this.state.currentStep]

    loadFunction()
  }


  buildModal() {
    let { transactionOptions, selectedTransaction, selectedField, selectedWell, fieldWellOptions } = this.state

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
        </div>
        <div className="modal-info">
          Seleccione un pozo para descargar su información

          <InputRowSelectUnitless header="Campo" name="campo" value={selectedField} options={fieldOptions} callback={this.handleSelectField} name='campo' />
          <InputRowSelectUnitless header="Pozo" name="pozo" value={selectedWell} options={wellOptions} callback={this.handleSelectWell} name='pozo' />
          <button className="submit submit-load-options" disabled={!selectedField || !selectedWell} onClick={this.fetchLoadFromDatabaseOptions}>Mostrar opciones</button>

        </div>
        <div className="modal-body">
            {transactionOptions.length > 0 ? transactionOptions.map(i => {
              let className = i.id === selectedTransaction ? 'save-item active-save' : 'save-item'
              let date = new Date(i.date)
              date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
              return (
                <div className={className} onClick={(e) => this.handleSelectTransaction(i.id)}>{i.user} {date}</div>
                )
            }): null  }
        </div> 
        <button className="submit submit-load" disabled={!selectedTransaction} onClick={this.handleLoad} >Descargar borrdador</button>
      </div>
      </AriaModal>
    )
  }

  render() {
    let { setShowForms } = this.props
    let { fieldWellOptions } = this.state
    let { isOpen } = this.state
    let className = 'subtab'
    let title = forms[this.state.currentStep].title
    


    return (
       <div className={`multistep-form`}>
        <div className="subtabs">
            {forms.map( (tab, index) => {
               const active = this.state.currentStep === index ? 'active' : ''; 
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
            <button className="cta load" onClick={this.activateModal}>Descargar intervención</button> 
          </div>

          {forms[this.state.currentStep].content}
        </div>

      { isOpen ? this.buildModal() : null }
       </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  setShowForms : values => { dispatch(setShowForms(values))},
  setFichaTecnicaDelCampo : values => { dispatch(setFichaTecnicaDelCampo(values))},
  setHistorialDeIntervenciones: values => { dispatch(setHistorialDeIntervenciones(values))},
  setFichaTecnicaDelPozo : values => { dispatch(setFichaTecnicaDelPozo(values))},
  setEvaluacionPetrofisica : values => { dispatch(setEvaluacionPetrofisica(values))},
  setMecanicoYAparejoDeProduccion : values => { dispatch(setMecanicoYAparejoDeProduccion(values))},
  setAnalisisDelAgua : values => { dispatch(setAnalisisDelAgua(values))},
  setSistemasArtificialesDeProduccion : values => {dispatch(setSistemasArtificialesDeProduccion(values))},
  setPresionDataPozo : values => {dispatch(setPresionDataPozo(values))},
  setPresionDataCampo : values => {dispatch(setPresionDataCampo(values))},
  setHistoricoProduccion : values => {dispatch(setHistoricoProduccion(values))},
  setHistoricoDeAforos: values => {dispatch(setHistoricoDeAforos(values))},
  setLoading: values => {dispatch(setIsLoading(values))},
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


export default connect(mapStateToProps, mapDispatchToProps)(PozoMultiStepForm)
