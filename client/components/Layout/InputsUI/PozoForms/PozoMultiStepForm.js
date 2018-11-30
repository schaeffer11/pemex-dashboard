import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import AriaModal from 'react-aria-modal'

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
import StickySubtabs from '../Components/StickySubtabs'

import { setFichaTecnicaDelCampo, setHistorialDeIntervenciones, setFichaTecnicaDelPozo, setEvaluacionPetrofisica, setMecanicoYAparejoDeProduccion, 
  setAnalisisDelAgua, setSistemasArtificialesDeProduccion, setPresionDataCampo, setPressureDepthCampo, setPresionDataPozo, setPressureDepthPozo, setHistoricoProduccion, setHistoricoDeAforos,
  setFromSaveFichaTecnicaDelCampo, setFromSaveHistorialDeIntervenciones, setFromSaveFichaTecnicaDelPozo, setFromSaveEvaluacionPetrofisica, setFromSaveMecanicoYAparejoDeProduccion, setFromSaveAnalisisDelAgua, setFromSaveSistemas, setFromSaveHistoricoDePressionCampo, setFromSaveHistoricoDePressionPozo, setFromSaveHistoricoDeAforos, setFromSaveHistoricoDeProduccion, setAllPressure } from '../../../../redux/actions/pozo'
import { setCurrentPage, setTab } from '../../../../redux/actions/global'

const forms = [
  {'title' : 'Ficha Técnica del Campo', menuTitle: 'Ficha Técnica del Campo', content: <TecnicaDelCampo />, className: 'TecnicaDelCampo' },
  {'title' : 'Ficha Técnica del Pozo', menuTitle: 'Ficha Técnica del Pozo', content:<TecnicaDelPozo /> , className: 'TechnicaDelPozo'},
  {'title' : 'Histórico De Intervenciones', menuTitle: 'Histórico De Intervenciones', content: <HistoricoDeIntervenciones />, className: 'HistorialDeIntervenciones'},
  {'title' : 'Evaluación Petrofísica', menuTitle: 'Petrofísica', content: <EvaluacionPetrofisica /> , className: 'EvaluacionPetrofisica'},
  {'title' : 'Estado Mecánico y Aparejo de Producción', menuTitle: 'Estado Mecánico', content: <MecanicoYAparejo /> , className: 'MecanicoYAparejo'},
  {'title' : 'Análisis del Agua', menuTitle: 'Análisis Agua', content: <AnalisisDelAgua  /> , className: 'AnalisisDelAgua'}, 
  {'title' : 'Información de Sistemas Artificiales de Producción', menuTitle: 'SAP', content: <SistemasArtificialesDeProduccion  /> , className: 'SistemasArtificialesDeProduccion'},
  {'title' : 'Histórico de Presión - Campo',
    menuTitle: 'Histórico de Presión - Campo', 
    content: <HistoricoDePresionCampo  /> , className: 'HistoricoDePresionCampo'},
  {'title' : 'Histórico de Presión - Pozo',
    menuTitle: 'Histórico de Presión - Pozo', 
    content: <HistoricoDePresionPozo  /> , className: 'HistoricoDePresionPozo'},
  {'title' : 'Histórico de Aforos',
    menuTitle: 'Histórico de Aforos', 
    content: <HistoricoDeAforos /> , className: 'HistoricoDeAforos'},
  {'title' : 'Histórico de Producción',
    menuTitle: 'Histórico de Producción', 
    content: <HistoricoDeProduccion  /> , className: 'HistoricoDeProduccion'},
];




@autobind class PozoMultiStepForm extends Component {



  constructor(props) {
    super(props)

    console.log(props, props.global.toJS().currentPage === 'TecnicaDelCampo' ? 0 : 10)

    this.state = {
      currentStep:  props.global.toJS().currentPage === 'TecnicaDelCampo' ? 0 : 10,
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
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelCampo, setLoading, setFromSaveFichaTecnicaDelCampo } = this.props
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
      let newObj = data.fichaTecnicaDelCampo
      newObj.fromSave = true
      setFichaTecnicaDelCampo(newObj)

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
    let { fichaTecnicaDelPozoHighLevel, setHistorialDeIntervenciones, setLoading, setFromSaveHistorialDeIntervenciones } = this.props
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
    let dataTermico = await fetch(`api/getHistIntervencionesTermicoNew?transactionID=${selectedTransaction}`, headers).then(r => r.json())

    if (dataEstimulacion && !dataEstimulacion.err && dataAcido && !dataAcido.err && dataApuntalado && !dataApuntalado.err && dataTermico && !dataTermico.err) {
      let newObj = dataEstimulacion.historialDeIntervenciones
      newObj.historicoAcidoData = dataAcido.historialDeIntervenciones.historicoAcidoData
      newObj.historicoApuntaladoData = dataApuntalado.historialDeIntervenciones.historicoApuntaladoData
      newObj.historicoTermicoData = dataTermico.historialDeIntervenciones.historicoTermicoData

      setHistorialDeIntervenciones(newObj)
      setFromSaveHistorialDeIntervenciones(true)
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
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelPozo, setLoading, setFromSaveFichaTecnicaDelPozo } = this.props
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
      newObj.fromSave = true
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
    let { fichaTecnicaDelPozoHighLevel, setEvaluacionPetrofisica, setLoading, setFromSaveEvaluacionPetrofisica } = this.props
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
        newObj.fromSave = true
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
    let { fichaTecnicaDelPozoHighLevel, setMecanicoYAparejoDeProduccion, setLoading, setFromSaveMecanicoYAparejoDeProduccion } = this.props
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
      let deviationData = await fetch(`api/getSurvey?transactionID=${selectedTransaction}`, headers).then(r => r.json())

      if (data && !data.err && deviationData && !deviationData.err) {
        let newObj = data.mecanicoYAparejoDeProduccion
        newObj.desviacion = deviationData.mecanicoYAparejoDeProduccion.desviacion
        newObj.fromSave = true
        setMecanicoYAparejoDeProduccion(newObj)

        // setMecanicoYAparejoDeProduccion(data.mecanicoYAparejoDeProduccion)
        // setFromSaveMecanicoYAparejoDeProduccion(true)

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
    let { fichaTecnicaDelPozoHighLevel, setAnalisisDelAgua, setLoading, setFromSaveAnalisisDelAgua } = this.props
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
        let newObj = data.analisisDelAgua
        newObj.fromSave = true
        setAnalisisDelAgua(newObj)
        // setFromSaveAnalisisDelAgua(true)
        // setAnalisisDelAgua(data.analisisDelAgua)
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
    let { fichaTecnicaDelPozoHighLevel, setSistemasArtificialesDeProduccion, setLoading, setFromSaveSistemas } = this.props
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
          newObj.fromSave = true
          // setFromSaveSistemas(true)
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
    let { fichaTecnicaDelPozoHighLevel, setLoading, historicoDePresion, setAllPressure } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    historicoDePresion = historicoDePresion.toJS()
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
      historicoDePresion.presionDataCampo = data.historicoDePresion.presionDataCampo
      historicoDePresion.pressureDepthCampo = data.historicoDePresion.pressureDepthCampo
      historicoDePresion.fromSaveCampo = true
      setAllPressure(historicoDePresion)
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
    let { fichaTecnicaDelPozoHighLevel, setLoading, setAllPressure, historicoDePresion } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    historicoDePresion = historicoDePresion.toJS()
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
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${pozo}`
        })
      historicoDePresion.presionDataPozo = data.historicoDePresion.presionDataPozo
      historicoDePresion.pressureDepthPozo = data.historicoDePresion.pressureDepthPozo
      historicoDePresion.fromSavePozo = true
      setAllPressure(historicoDePresion)
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
    let { fichaTecnicaDelPozoHighLevel, setHistoricoProduccion, setLoading, setFromSaveHistoricoDeProduccion } = this.props
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
      newObj.fromSave = true
      // setFromSaveHistoricoDeProduccion(true)
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
    let { fichaTecnicaDelPozoHighLevel, setHistoricoDeAforos, setLoading, setFromSaveHistoricoDeAforos } = this.props
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
      newObj.fromSave = true

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
    let { setCurrentPage } = this.props

    setCurrentPage(forms[i].title)

    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){    
    let { setCurrentPage, setTab } = this.props

    if(forms.length > this.state.currentStep + 1){
      setCurrentPage(forms[this.state.currentStep + 1].title)
      this.setState({
        currentStep: this.state.currentStep + 1
      })
    }
    else {
      setTab('Intervenciones')
    }
  }

  handlePrevSubtab(){
    let { setCurrentPage } = this.props
    const { currentStep } = this.state
    const newStep = currentStep - 1

    if(newStep >= 0){
      setCurrentPage(forms[newStep].title)
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
        dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '20%'}}
      >
      <div className="modalTest" >
        <div className="modal-title">
        </div>
        <div className="modal-info">
          <div className='header'>
              Seleccione un pozo para descargar su información
          </div>
          <div className="input-table">
            <InputRowSelectUnitless header="Campo" name="campo" value={selectedField} options={fieldOptions} callback={this.handleSelectField} name='campo' />
            <InputRowSelectUnitless header="Pozo" name="pozo" value={selectedWell} options={wellOptions} callback={this.handleSelectWell} name='pozo' />
          </div>
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
    let { setShowForms, hasSubmitted, fichaTecnicaDelPozoHasErrors, fichaTecnicaDelCampoHasErrors, 
      historialDeIntervencionesHasErrors, evaluacionPetrofisicaHasErrors, mecanicoYAparejoDeProduccionHasErrors,
      analisisDelAguaHasErrors, historicoDePresionCampoHasErrors, historicoDePresionPozoHasErrors, historicoDeProduccionHasErrors, historicoDeAforosHasErrors,
      sistemasArtificialesDeProduccionHasErrors } = this.props
    let { fieldWellOptions } = this.state
    let { isOpen } = this.state
    let className = 'subtab'
    let title = forms[this.state.currentStep].title
    let formClassName = forms[this.state.currentStep].className
    
    let errors = [fichaTecnicaDelCampoHasErrors, fichaTecnicaDelPozoHasErrors, historialDeIntervencionesHasErrors, evaluacionPetrofisicaHasErrors, mecanicoYAparejoDeProduccionHasErrors, analisisDelAguaHasErrors, sistemasArtificialesDeProduccionHasErrors, historicoDePresionCampoHasErrors, historicoDePresionPozoHasErrors, historicoDeAforosHasErrors, historicoDeProduccionHasErrors]

    return (
       <div className={`multistep-form ${formClassName}`}>
        <div className ={`banner ${formClassName}`}></div>
        <StickySubtabs>
            {forms.map( (tab, index) => {
               const active = this.state.currentStep === index ? 'active' : ''; 
               let error = errors[index]
               const errorClass = (error && hasSubmitted) ? 'error' : '';

               return <div className={`${className} ${active} ${errorClass}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.menuTitle} </div>
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
             <button className="cta clear load" onClick={this.activateModal}><i className="fa fa-download">&nbsp;</i></button>
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
  setPressureDepthCampo: values => {dispatch(setPressureDepthCampo(values))},
  setPressureDepthPozo: values => {dispatch(setPressureDepthPozo(values))},
  setFromSaveFichaTecnicaDelCampo: values => {dispatch(setFromSaveFichaTecnicaDelCampo(values))},
  setFromSaveHistorialDeIntervenciones: values => {dispatch(setFromSaveHistorialDeIntervenciones(values))},
  setFromSaveFichaTecnicaDelPozo: values => {dispatch(setFromSaveFichaTecnicaDelPozo(values))},
  setFromSaveEvaluacionPetrofisica: values => {dispatch(setFromSaveEvaluacionPetrofisica(values))},
  setFromSaveMecanicoYAparejoDeProduccion: values => {dispatch(setFromSaveMecanicoYAparejoDeProduccion(values))},
  setFromSaveAnalisisDelAgua: values => {dispatch(setFromSaveAnalisisDelAgua(values))},
  setFromSaveSistemas: values => {dispatch(setFromSaveSistemas(values))},
  setFromSaveHistoricoDePressionCampo: values => {dispatch(setFromSaveHistoricoDePressionCampo(values))},
  setFromSaveHistoricoDePressionPozo: values => {dispatch(setFromSaveHistoricoDePressionPozo(values))},
  setFromSaveHistoricoDeAforos: values => {dispatch(setFromSaveHistoricoDeAforos(values))},
  setFromSaveHistoricoDePressionCampo: (val, depth) => dispatch(setFromSaveHistoricoDePressionCampo(val, depth)),
  setAllPressure: (val, depth) => dispatch(setAllPressure(val)),
  setCurrentPage: val => dispatch(setCurrentPage(val)),
  setFromSaveHistoricoDeProduccion: values => {dispatch(setFromSaveHistoricoDeProduccion(values))},
  setTab: val => dispatch(setTab(val))
})

const mapStateToProps = state => ({
  everything: state,
  formsState: state.get('forms'),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua'),
  historicoDeAforos: state.get('historicoDeAforos'),
  fichaTecnicaDelPozoHasErrors: state.getIn(['fichaTecnicaDelPozo', 'hasErrors']),
  fichaTecnicaDelCampoHasErrors: state.getIn(['fichaTecnicaDelCampo', 'hasErrors']),
  historialDeIntervencionesHasErrors: state.getIn(['historialDeIntervenciones', 'hasErrors']),
  evaluacionPetrofisicaHasErrors: state.getIn(['evaluacionPetrofisica', 'hasErrors']),
  mecanicoYAparejoDeProduccionHasErrors: state.getIn(['mecanicoYAparejoDeProduccion', 'hasErrors']),
  analisisDelAguaHasErrors: state.getIn(['analisisDelAgua', 'hasErrors']),
  historicoDePresionCampoHasErrors: state.getIn(['historicoDePresion', 'hasErrorsCampo']),
  historicoDePresionPozoHasErrors: state.getIn(['historicoDePresion', 'hasErrorsPozo']),
  historicoDeProduccionHasErrors: state.getIn(['historicoDeProduccion', 'hasErrors']),
  historicoDeAforosHasErrors: state.getIn(['historicoDeAforos', 'hasErrors']),
  sistemasArtificialesDeProduccionHasErrors: state.getIn(['sistemasArtificialesDeProduccion', 'hasErrors']),
  historicoDePresion: state.get('historicoDePresion'),
  user: state.get('user'),
  global: state.get('global')
})


export default connect(mapStateToProps, mapDispatchToProps)(PozoMultiStepForm)
