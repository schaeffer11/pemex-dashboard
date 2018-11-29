import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'
import { compose } from 'redux'
import objectPath from 'object-path'
import AriaModal from 'react-aria-modal'

import { setObjetivo, setAlcances, setTipoDeIntervenciones } from '../../../../redux/actions/intervencionesEstimulacion'
import { setSubdireccion, setActivo, setCampo, setPozo, setFormacion, setFechaProgramadaIntervencion, setFromSaveFichaTecnicaHighLevel, setHasErrorsFichaTecnicaHighLevel, setIntervencionProgramada } from '../../../../redux/actions/pozo'
import { setShowForms, setIsLoading, setTransactionID, setSaveName, setCompanyOptions, setJustificationOptions, setLitologiaOptions, setTipoDeTerminationOptions, setTipoDeLinerOptions } from '../../../../redux/actions/global'
import { InputDate, InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Notification from '../../Common/Notification'
import Loading from '../../Common/Loading'
import { sortLabels, handleImagesFromServer } from '../../../../lib/formatters'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import ButtonGroup from './ButtonGroup'

@autobind class GeneralData extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      isOpen: false,
      formType: 'new',
      saveOptions: [],
      proposalOptions: [],
      selectedProposal: null,
      selectedSave: null,
      selectedSaveName: null,
      deleteVal: null,
      errors: {
        subdireccion: {
          type: 'number',
          value: '',
        },
        bloque: {
          type: 'number',
          value: '',
        },
        activo: {
          type: 'number',
          value: '',
        },
        campo: {
          type: 'number',
          value: '',
        },
        pozo: {
          type: 'number',
          value: '',
        },
        formacion: {
          type: 'number',
          value: '',
        },
        fechaProgramadaIntervencion: {
          type: 'number',
          value: '',
        },
      }
    }
  }

  componentDidMount(){
    let { user, hasSubmitted, setCompanyOptions, setJustificationOptions, setLitologiaOptions, setTipoDeTerminationOptions, setTipoDeLinerOptions } = this.props
    user = user.toJS()
    const { token, id } = user
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsFichaTecnicaHighLevel(hasErrors)
    fetch(`/api/getAllSaves?userID=${id}`, headers)
      .then(r => r.json())
      .then( r => {
        this.setState({
          saveOptions: r
        })
      })

    fetch(`/api/getTransactionNoResults?userID=${id}`, headers)
      .then(r => r.json())
      .then( r => {
        this.setState({
          proposalOptions: r
        })
      })


    fetch('/api/getCompanyMap', headers)
      .then(r => r.json())
      .then( r => {
        setCompanyOptions(r)
      })

    fetch('/api/getJustificationMap', headers)
      .then(r => r.json())
      .then( r => {
        setJustificationOptions(r)
      })

    fetch('/api/getLitologiaMap', headers)
      .then(r => r.json())
      .then( r => {
        setLitologiaOptions(r)
      })

    fetch('/api/getTipoDeTerminationMap', headers)
      .then(r => r.json())
      .then( r => {
        setTipoDeTerminationOptions(r)
      })

    fetch('/api/getTipoDeLinerMap', headers)
      .then(r => r.json())
      .then( r => {
        setTipoDeLinerOptions(r)
      })
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveFichaTecnicaHighLevel, setHasErrorsFichaTecnicaHighLevel } = this.props
    formData = formData ? formData.toJS() : {}
    let { fromSave } = formData
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true, formData)
      setHasErrorsFichaTecnicaHighLevel(err)
      if (fromSave === true) {
        setFromSaveFichaTecnicaHighLevel(false)
      }
    }
  }

  checkAllInputs(showErrors, data=null) {
    let { formData } = this.props
    formData = formData ? formData.toJS() : {}
    formData = data !== null ? data : formData
    const { errors } = this.state
    let hasErrors = false
    let error 
    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, showErrors)
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, showErrors)
      }
      else if (errObj.type === 'table') {
        error = errObj.value === '' ? true : errObj.value
      }
      error === true ? hasErrors = true : null
    })
    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsFichaTecnicaHighLevel } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    if (hasErrorNew != hasErrors) {
      setHasErrorsFichaTecnicaHighLevel(hasErrorNew)
    }
    this.setState({ errors })
  }

  handleSelectSubdireccion(val) {
    let { setSubdireccion, setActivo, setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { subdireccion } = formData

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setActivo('')   
      setCampo('')
      setPozo({value: '', label:''})
    }
  }

  handleSelectActivo(val) {
    let { setSubdireccion, setActivo, setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { activo } = formData

    if (activo !== val.value) {
      setActivo(val.value) 
      setCampo('')
      setPozo({value: '', label:''})
    }
  }

  handleSelectField(val) {
    let { setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { campo } = formData

    if (campo !== val.value) {
      setCampo(val.value)
      setPozo({value: '', label:''})
    }
  }

  handleSelectWell(val) {
      this.props.setPozo(val)
  }

  checkIncomplete() {
    return false
    let { interventionFormData, formData } = this.props

    interventionFormData = interventionFormData.toJS()
    formData = formData.toJS()
    
    
    let { objetivo, alcances, tipoDeIntervenciones, fechaProgramadaIntervencion, intervencionProgramada } = interventionFormData
    let { subdireccion, activo, campo, pozo, formacion } = formData

    if (!!(objetivo) && !!(alcances) && !!(tipoDeIntervenciones) && !!(subdireccion) && !!(activo) && !!(campo) && !!(pozo) && !!(formacion) && !!(fechaProgramadaIntervencion) && intervencionProgramada !== '') {
      return false
    }

    return true
  }

  deactivateModal() {
    this.setState({
      isOpen: false,
      saveName: null
    })
  }

  activateModal() {
    this.setState({
      isOpen: true,
    })
  }

  buildModal() {
    let { saveOptions, selectedSave, selectedSaveName, deleteVal } = this.state

    return (
      <AriaModal
        titleId="save-modal"
        onExit={this.deactivateModal}
        underlayClickExits={true}
        verticallyCenter={true}
        focusDialog={true}
        dialogClass="queryModalPartialReset"
        dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '130px'}}

      >
      <div className="modalTest" >
        <div className="modal-title">
          Menu de descarga
        </div>
        <div className="modal-info"> 
          Seleccione borrador para descargar
        </div>
        <div className="modal-body" style={{ height: '200px' }}>
            <div className="save-item-container">
              {saveOptions.map(i => {
                let className = i.id === selectedSave ? 'save-item active-save' : 'save-item'
                return (
                  <div key={`saveOption_${i.id}`} className={className} onClick={(e) => this.handleSelectSave(i.id, i.name)}>{i.name}</div>
                  )
              })}
            </div>
        </div> 
        <button disabled={!selectedSave} className="submit submit-load" onClick={this.handleLoad}>Descargar borrador</button>
        <br/>
        <div>  - OR - </div>
        <div> Delete Save </div>
        <div> To be able to delete you must type the name of the save in</div>
        <input value={deleteVal} onChange={e => this.setState({deleteVal: e.target.value})}/>
        <br/>
        <button style={{background: '#b22222'}} disabled={!selectedSave || selectedSaveName !== deleteVal} className="submit submit-load" onClick={this.deleteSave}>Delete borrador</button>
        
      </div>
      </AriaModal>
    )
  }

  handleSelectSave(id, name) {
    this.setState({
      selectedSave: id,
      selectedSaveName: name
    })
  }

    handleSelectProposal(id) {
    this.setState({
      selectedProposal: id
    })
  }


  makeGeneralInterventionForm() {
    let { setObjetivo, setAlcances, setTipoDeIntervenciones, interventionFormData, setFechaProgramadaIntervencion, setIntervencionProgramada } = this.props
    interventionFormData = interventionFormData ? interventionFormData.toJS() : {}
    let { objetivo, alcances, tipoDeIntervenciones, fechaProgramadaIntervencion, intervencionProgramada } = interventionFormData
    let tipoDeIntervencionesOptions = [
      {label: 'Tratamiento de Estimulación', value: 'estimulacion'},
      {label: 'Fracturamiento Ácido', value: 'acido'},
      {label: 'Fracturamiento Apuntalado', value: 'apuntalado'},
      {label: 'Tratamiento Térmico', value: 'termico'},
    ]
    return (
      <div className='intervention-form'>
        <div className='header'>
          Intervención
        </div>
        <div className="input-table">
          <TextAreaUnitless header="Objetivo" name='objetivo' className={'objetivo'} value={objetivo} onChange={setObjetivo} tooltip='Describir el objetivo de la intervención indicando la causa principal, tipo de tratamiento a aplicar y técnica de colocación de los sistemas.' />
          <TextAreaUnitless header="Alcances" name='alcances' className={'alcances'} value={alcances} onChange={setAlcances} tooltip='Describir los alcances que se pretenden obtener con la intervención programada a ejecutar.' />
          <InputRowSelectUnitless header='Tipo de intervenciones' name='tipoDeIntervenciones' value={tipoDeIntervenciones} options={tipoDeIntervencionesOptions} callback={(e) => setTipoDeIntervenciones(e.value)} />
          <InputDate
            header="Fecha Programada de Intervención"
            name='fechaProgramadaIntervencion'
            value={fechaProgramadaIntervencion}
            onChange={setFechaProgramadaIntervencion}
            onBlur={this.updateErrors}
            errors={this.state.errors}
          />
          <InputRowSelectUnitless
            header='Intervención Programada'
            name='tipoDeIntervenciones'
            value={intervencionProgramada}
            options={[
              {label: 'Sí', value: true},
              {label: 'No', value: false},
            ]}
            callback={(e) => setIntervencionProgramada(e.value)}
          />
        </div>
      </div>
    )
  }

  makeGeneralForm() {
    let { setSubdireccion, setActivo, setCampo, setPozo, setFormacion, formData, fieldWellOptions, user } = this.props

    user = user ? user.toJS() : {}
    formData = formData ? formData.toJS() : {}
    
    let { subdireccion, activo, campo, pozo, formacion } = formData

    let formacionOptions = [
      {label: 'JSO', value: 'JSO'},
      {label: 'JSK', value: 'JSK'},
      {label: 'JST', value: 'JST'},
      {label: 'KI', value: 'KI'},
      {label: 'KM', value: 'KM'},
      {label: 'KS', value: 'KS'},
      {label: 'Paleoceno', value: 'paleoceno'},
      {label: 'Eoceno', value: 'eoceno'},
      {label: 'Mioceno', value: 'Mioceno'},
      {label: 'Mioceno Inferior', value: 'Mioceno Inferior'},
      {label: 'Mioceno Medio', value: 'Mioceno Medio'},
      {label: 'Encanto', value: 'Encanto'},
      {label: 'Concepción Inferior', value: 'Concepción Inferior'},
      {label: 'Concepción Superior', value: 'Concepción Superior'},
      {label: 'Filisola', value: 'Filisola'},
      {label: 'CCE', value: 'CCE'},
      {label: 'KS-KM-KI', value: 'KS-KM-KI'},
      {label: 'KS-KM', value: 'KS-KM'},
      {label: 'KM-KI', value: 'KM-KI'},
    ]
    let disabled = false

    if (user.activoID && user.subdireccionID) {
      disabled = true
      if (user.activoID !== activo) {
        activo = user.activoID
        setActivo(user.activoID)
      }

      if (user.subdireccionID !== subdireccion) {
        subdireccion = user.subdireccionID  
        setSubdireccion(user.subdireccionID)
      }

    }

    let subdireccionOptions = []
    let activoOptions = []
    let fieldOptions = []
    let wellOptions = []

    let activoSubset = []
    let fieldSubset = []

    if (fieldWellOptions.length > 0) {
      fieldWellOptions.forEach(item => {
        if (!subdireccionOptions.map(i => i.value).includes(item.SUBDIRECCION_ID)) {
          subdireccionOptions.push({label: item.SUBDIRECCION_NAME, value: item.SUBDIRECCION_ID})
        }
      })
      subdireccionOptions.sort(sortLabels)

      if (subdireccion) {
        activoSubset = fieldWellOptions.filter(i => i.SUBDIRECCION_ID === parseInt(subdireccion))
        let usedActivos = []
        let activos = []
        activoSubset.forEach(i => {
          if (!usedActivos.includes(i.ACTIVO_ID)) {
            usedActivos.push(i.ACTIVO_ID)
            activos.push(i)
          }
        })

        activoOptions = activos.map(i => ({label: i.ACTIVO_NAME, value: i.ACTIVO_ID})).sort(sortLabels)
      }

      if (activo) {
        fieldSubset = activoSubset.filter(i => i.ACTIVO_ID === parseInt(activo))
        let usedFields = []
        let fields = []
        fieldSubset.forEach(i => {
          if (!usedFields.includes(i.FIELD_FORMACION_ID)) {
            usedFields.push(i.FIELD_FORMACION_ID)
            fields.push(i)
          }
        })

        fieldOptions = fields.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID})).sort(sortLabels)
      }

      if (campo) {
        let wellSubset = fieldSubset.filter(i => i.FIELD_FORMACION_ID === parseInt(campo))
        let usedWells = []
        let wells = []
        wellSubset.forEach(i => {
          if (!usedWells.includes(i.WELL_FORMACION_ID)) {
            usedWells.push(i.WELL_FORMACION_ID)
            wells.push(i)
          }
        })

        wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)

      }
    }


    return (
      <div className='general-form'>
        <div className='header'>
          Pozo
        </div>
        <div className="input-table">
          <InputRowSelectUnitless header='Subdirección' name="subdireccion" value={subdireccion} disabled={disabled} options={subdireccionOptions} callback={this.handleSelectSubdireccion}  />
          <InputRowSelectUnitless header='Activo' name="activo" value={activo} disabled={disabled} options={activoOptions} callback={this.handleSelectActivo}  />
          <InputRowSelectUnitless header="Campo" name="campo" value={campo} options={fieldOptions} callback={this.handleSelectField} name='campo'  />
          <InputRowSelectUnitless header="Pozo" name="pozo" value={pozo} options={wellOptions} callback={this.handleSelectWell} name='pozo'  />
          <InputRowSelectUnitless header="Formación" value={formacion} options={formacionOptions} callback={(e) => setFormacion(e.value)} name='formacion'  />
        </div>
      </div>

    )
  }

  makeUploadResultsForm() {
    let { proposalOptions, selectedProposal } = this.state

    return (
      <div className='upload-form'>
        <div className='header'>
          Seleccione una intervención
        </div>
         <div className="body" style={{ height: '390px' }}>
            {proposalOptions.map(i => {
              let className = i.TRANSACTION_ID === selectedProposal ? 'save-item active-save' : 'save-item'
               let date = new Date(i.INSERT_TIME)
               let proposedDate = new Date(i.FECHA_PROGRAMADA_INTERVENCION)
              date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
              proposedDate = `${proposedDate.getDate()}/${proposedDate.getMonth() + 1}/${proposedDate.getFullYear()}`
              return (
                <div key={`proposalOption_${i.TRANSACTION_ID}`} className={className} onClick={(e) => this.handleSelectProposal(i.TRANSACTION_ID)}>Pozo: <b>{i.WELL_NAME}</b>  Fecha de la propuesta: <b>{proposedDate}</b>  Tipo de intervención: <b>{i.TIPO_DE_INTERVENCIONES}</b></div>
                )
            })}
        </div> 
      </div>
    )
  }

  
  async handleLoad() {
    let { selectedSave, selectedSaveName } = this.state
    let { user, formData, setLoading, setSaveName } = this.props

    this.setState({
      isOpen: false
    })

    setLoading({ isLoading: true, loadText: 'Descargando' })
    user = user.toJS()
    formData = formData.toJS()

    const wellID = formData.pozo
    const userID = user.id
    const { token } = user
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }


    let data = await fetch(`/api/getSave?transactionID=${selectedSave}`, headers)
      .then(res => res.json())

    let { transactionID, tipoDeIntervenciones } = data

    const results = await Promise.all([
      fetch(`api/getWell?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getFields?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getHistIntervencionesEstimulacionNew?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getHistIntervencionesAcidoNew?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getHistIntervencionesApuntaladoNew?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getHistIntervencionesTermicoNew?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getMudLoss?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getLayer?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getHistIntervenciones?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getMecanico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getSurvey?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getAnalisisAgua?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getFieldPressure?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getWellPressure?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getWellAforos?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getWellProduccion?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getInterventionBase?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getInterventionEstimulacion?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getInterventionAcido?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getInterventionApuntalado?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getInterventionTermico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getLabTest?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
      fetch(`api/getCedulaEstimulacion?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),   
      fetch(`api/getCedulaAcido?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),   
      fetch(`api/getCedulaApuntalado?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()), 
      fetch(`api/getCedulaTermico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),      
      fetch(`api/getCosts?transactionID=${transactionID}&saved=1`, headers).then(r => r.json()),
    ])
      .catch(error => {
        console.log('some error i found', error)
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'error',
          notificationText: `No se ha descargado informacion del pozo: ${pozo}`
        })
      })

    let sapData
    switch (results[0].sistemasArtificialesDeProduccion.tipoDeSistemo) {
      case 'emboloViajero':
        sapData = await fetch(`api/getEmboloViajero?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      case 'bombeoNeumatico':
        sapData = await fetch(`api/getBombeoNeumatico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      case 'bombeoHidraulico':
        sapData = await fetch(`api/getBombeoHidraulico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      case 'bombeoCavidadesProgresivas':
        sapData = await fetch(`api/getBombeoCavidades?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      case 'bombeoElectrocentrifugo':
        sapData = await fetch(`api/getBombeoElectrocentrifugo?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      case 'bombeoMecanico':
        sapData = await fetch(`api/getBombeoMecanico?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
        break;
      default:
        sapData = {
          sistemasArtificialesDeProduccion: {
            hasErrors: false,
            tipoDeSistemo: 'none'
          }
        }
        break    
    }

    results.push(sapData)

    let newState = {}
    results.forEach(r => {
      const rKeys = Object.keys(r)
      rKeys.forEach(registerName => {
        Object.keys(r[registerName]).forEach(key => {
          objectPath.set(newState, `${registerName}.${key}`, r[registerName][key])
        })
      })
    })


    const allImages = await fetch(`api/getImages?transactionID=${transactionID}&saved=1`, headers).then(r => r.json())
    newState = handleImagesFromServer(allImages, newState)

    setLoading({ 
      isLoading: false,
      showNotification: true,
      notificationType: 'success',
      notificationText: `Se ha descargado informacion del pozo: ${wellID}`
    })
    setSaveName(selectedSaveName)
    this.props.loadFromSave(newState)
  }



  deleteSave() {
    let { selectedSave, selectedSaveName } = this.state
    let { user, setLoading } = this.props


    setLoading({ isLoading: true, loadText: 'Deleting' })
    user = user.toJS()

    const { token, id } = user
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    fetch(`/api/deleteSave?transactionID=${selectedSave}`, headers)
      .then(res => res.json())
      .then(res => {

        fetch(`/api/getAllSaves?userID=${id}`, headers)
          .then(r => r.json())
          .then( r => {

            setLoading({ 
              isLoading: false,
              showNotification: true,
              notificationType: 'success',
              notificationText: `Successfully deleted`
            })

            this.setState({
              saveOptions: r,
              selectedSave: null,
              deleteVal: null,
              selectedSaveName: null
            })
          })
    })
  }

  handleSelectFormType(val) {
    this.setState({
      formType: val
    })
  }

  handleSiguienteResults() {
    let { selectedProposal } = this.state
    let { setShowForms, setTransactionID } = this.props

    setShowForms('results')
    setTransactionID(selectedProposal)
  }

  render() {
    let { isOpen, selectedSave, formType, selectedProposal, deleteVal } = this.state
    let { setShowForms } = this.props

    return (
      <div className='general-data-outer'>
        <div className='banner image' style={{backgroundImage:'url(/images/homepageBannerThin2.jpg)'}}></div>
         <ButtonGroup 
            className={'button-group'}
            buttons={
              [
                { label: 'Propuesta', value: 'new', },
                { label: 'Resultados', value: 'upload' },
              ]
            }
            onClick={this.handleSelectFormType}
            individualButtonClass={'submit'}
            active={formType}
            disabled={false}
          />
        { formType === 'new' ?   
        <div className='form general-data'>
          { this.makeGeneralForm() }
          { this.makeGeneralInterventionForm() }
          <button className="submit submit-load" onClick={this.activateModal}> Descargar borrador</button>
          <button className='cta next submit-continue' disabled={this.checkIncomplete()} onClick={(e) => setShowForms(true)} >Siguiente</button>
          <Notification />
          <Loading />
          { isOpen ? this.buildModal() : null }
        </div>
       : <div className='form general-data-upload'>
          { this.makeUploadResultsForm() }
          <button className='cta next submit-next' disabled={!selectedProposal} onClick={this.handleSiguienteResults}>Siguiente</button>
       </div> }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelPozoHighLevel'),
  user: state.get('user'),
  interventionFormData: state.get('objetivoYAlcancesIntervencion'),
  forms: state.get('forms'),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const testLoadFromSave = (saved) => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOAD_SAVE', saved })
  }
}

const mapDispatchToProps = dispatch => ({
  setSubdireccion: val => dispatch(setSubdireccion(val)), 
  setActivo: val => dispatch(setActivo(val)), 
  setCampo: val => dispatch(setCampo(val)), 
  setPozo: val => dispatch(setPozo(val)),
  setFormacion: val => dispatch(setFormacion(val)),
  setObjetivo : val => dispatch(setObjetivo(val)),
  setAlcances : val => dispatch(setAlcances(val)),
  setTipoDeIntervenciones : val => dispatch(setTipoDeIntervenciones(val)),
  setShowForms : val => dispatch(setShowForms(val)),
  loadFromSave: values => {dispatch(testLoadFromSave(values))},
  setTransactionID: val => dispatch(setTransactionID(val)),
  setLoading: obj => dispatch(setIsLoading(obj)),
  setFechaProgramadaIntervencion: obj => dispatch(setFechaProgramadaIntervencion(obj)),
  setHasErrorsFichaTecnicaHighLevel: obj => dispatch(setHasErrorsFichaTecnicaHighLevel(obj)),
  setHasErrorsFichaTecnicaHighLevel: obj => dispatch(setHasErrorsFichaTecnicaHighLevel(obj)),
  setFromSaveFichaTecnicaHighLevel: obj => dispatch(setFromSaveFichaTecnicaHighLevel(obj)),
  setIntervencionProgramada: obj => dispatch(setIntervencionProgramada(obj)),
  setSaveName: obj => dispatch(setSaveName(obj)),
  setCompanyOptions: val => dispatch(setCompanyOptions(val)),
  setJustificationOptions: val => dispatch(setJustificationOptions(val)),
  setLitologiaOptions: val => dispatch(setLitologiaOptions(val)),
  setTipoDeTerminationOptions: val => dispatch(setTipoDeTerminationOptions(val)),
  setTipoDeLinerOptions: val => dispatch(setTipoDeLinerOptions(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralData)
