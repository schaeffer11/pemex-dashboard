import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'
import { compose } from 'redux'
import objectPath from 'object-path'
import AriaModal from 'react-aria-modal'
import '../../../../styles/components/_query_modal.css'

import { setObjetivo, setAlcances, setTipoDeIntervenciones } from '../../../../redux/actions/intervencionesEstimulacion'
import { setSubdireccion, setActivo, setCampo, setPozo, setFormacion, setChecked } from '../../../../redux/actions/pozo'
import { setShowForms, setIsLoading } from '../../../../redux/actions/global'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Notification from '../../Common/Notification'
import Loading from '../../Common/Loading'

const sortLabels = (a, b) => {
    if(a.label < b.label) return -1;
    if(a.label > b.label) return 1;
    return 0;
}

@autobind class GeneralData extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      isOpen: false,
      saveOptions: [],
      selectedSave: null
    }
  }

  componentDidMount(){
    let { user } = this.props
    user = user.toJS()
    const userID = user.id

    fetch(`/api/getAllSaves?userID=${userID}`)
      .then(r => r.json())
      .then( r => {
        this.setState({
          saveOptions: r
        })
      })
  }

  componentDidUpdate(){
  }

  handleSelectSubdireccion(val) {
    let { setSubdireccion, setActivo, setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { subdireccion } = formData

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setActivo('')   
      setCampo('')
      setPozo('')
    }
  }

  handleSelectActivo(val) {
    let { setSubdireccion, setActivo, setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { activo } = formData

    if (activo !== val.value) {
      setActivo(val.value) 
      setCampo('')
      setPozo('')  
    }
  }

  handleSelectField(val) {
    let { setCampo, setPozo, formData } = this.props
    formData = formData.toJS()
    let { campo } = formData

    if (campo !== val.value) {
      setCampo(val.value)
      setPozo('')
    }
  }

  checkIncomplete() {
    let { interventionFormData, formData } = this.props

    interventionFormData = interventionFormData.toJS()
    formData = formData.toJS()
    
    
    let { objetivo, alcances, tipoDeIntervenciones } = interventionFormData
    let { subdireccion, activo, campo, pozo, formacion } = formData

    if (!!(objetivo) && !!(alcances) && !!(tipoDeIntervenciones) && !!(subdireccion) && !!(activo) && !!(campo) && !!(pozo) && !!(formacion)) {
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
    let { saveOptions, selectedSave } = this.state

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
          Menu de descarga
        </div>
        <div className="modal-info"> 
          Seleccione borrador para descargar
        </div>
        <div className="modal-body">
            {saveOptions.map(i => {
              let className = i.id === selectedSave ? 'save-item active-save' : 'save-item'
              return (
                <div key={`saveOption_${i.id}`} className={className} onClick={(e) => this.handleSelectSave(i.id)}>{i.name}</div>
                )
            })}
        </div> 
        <button className="submit submit-load" onClick={this.handleLoad}>Descargar borrador</button>
      </div>
      </AriaModal>
    )
  }

  handleSelectSave(id) {
    this.setState({
      selectedSave: id
    })
  }


  makeGeneralInterventionForm() {
    let { setObjetivo, setAlcances, setTipoDeIntervenciones, interventionFormData } = this.props

    interventionFormData = interventionFormData.toJS()

    
    let { objetivo, alcances, tipoDeIntervenciones } = interventionFormData

    let tipoDeIntervencionesOptions = [
      {label: 'Tratamiento de Estimulación', value: 'estimulacion'},
      {label: 'Fracturamiento Ácido', value: 'acido'},
      {label: 'Fracturamiento Apuntalado', value: 'apuntalado'},
    ]

        return (
          <div className='intervention-form'>
            <div className='header'>
              Intervención
            </div>
            <TextAreaUnitless header="Objetivo" name='objetivo' className={'objetivo'} value={objetivo} onChange={setObjetivo} tooltip='Describir el objetivo de la intervención indicando la causa principal, tipo de tratamiento a aplicar y técnica de colocación de los sistemas.' />
            <TextAreaUnitless header="Alcances" name='alcances' className={'alcances'} value={alcances} onChange={setAlcances} tooltip='Describir los alcances que se pretenden obtener con la intervención programada a ejecutar.' />
            <InputRowSelectUnitless header='Tipo de intervenciones' name='tipoDeIntervenciones' value={tipoDeIntervenciones} options={tipoDeIntervencionesOptions} callback={(e) => setTipoDeIntervenciones(e.value)} />
          </div>

        )
  }

  makeGeneralForm() {
    let { setActivo, setCampo, setPozo, setFormacion, formData, fieldWellOptions } = this.props


    formData = formData.toJS()
    
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
    ]


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
        <InputRowSelectUnitless header='Subdirección' name="subdireccion" value={subdireccion} options={subdireccionOptions} callback={this.handleSelectSubdireccion} onBlur={this.validate} errors={this.state.errors} />
        <InputRowSelectUnitless header='Activo' name="activo" value={activo} options={activoOptions} callback={this.handleSelectActivo} onBlur={this.validate} errors={this.state.errors} />
        <InputRowSelectUnitless header="Campo" name="campo" value={campo} options={fieldOptions} callback={this.handleSelectField} onBlur={this.validate} name='campo' errors={this.state.errors} />
        <InputRowSelectUnitless header="Pozo" name="pozo" value={pozo} options={wellOptions} callback={(e) => setPozo(e.value)} onBlur={this.validate} name='pozo' errors={this.state.errors} />
        <InputRowSelectUnitless header="Formación" value={formacion} options={formacionOptions} callback={(e) => setFormacion(e.value)} onBlur={this.validate} name='formacion' errors={this.state.errors} />
        {}
      </div>

    )
  }

  
  async handleLoad() {
    let { selectedSave } = this.state
    let { user, formData, setLoading } = this.props

    this.setState({
      isOpen: false
    })

    setLoading({ isLoading: true, loadText: 'Descargando' })
    user = user.toJS()
    formData = formData.toJS()

    const wellID = formData.pozo
    const userID = user.id

    let data = await fetch(`/api/getSave?transactionID=${selectedSave}`)
      .then(res => res.json())

    let { transactionID, tipoDeIntervenciones } = data

    Promise.all([
      fetch(`api/getFields?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getMudLoss?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getLayer?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getWell?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getHistIntervenciones?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getMecanico?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getAnalisisAgua?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getEmboloViajero?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getBombeoNeumatico?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getBombeoHidraulico?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getBombeoCavidades?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getBombeoElectrocentrifugo?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getBombeoMecanico?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getFieldPressure?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getWellPressure?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getWellAforos?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getWellProduccion?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getInterventionBase?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getInterventionEstimulacion?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getInterventionAcido?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getInterventionApuntalado?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getLabTest?transactionID=${transactionID}&saved=1`).then(r => r.json()),
      fetch(`api/getCedulaEstimulacion?transactionID=${transactionID}&saved=1`).then(r => r.json()),   
      fetch(`api/getCedulaAcido?transactionID=${transactionID}&saved=1`).then(r => r.json()),   
      fetch(`api/getCedulaApuntalado?transactionID=${transactionID}&saved=1`).then(r => r.json()),      
      fetch(`api/getCosts?transactionID=${transactionID}&saved=1`).then(r => r.json()),
    ])
      .catch(error => {
        console.log('some error i found', error)
        // setLoading({ isLoading: false, loaded: 'error' })
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'error',
          notificationText: `No se ha descargado informacion del pozo: ${pozo}`
        })
      })
      .then((results) => {
        const newState = {}
        console.log(results)
        results.forEach(r => {
          const rKeys = Object.keys(r)
          rKeys.forEach(registerName => {
            Object.keys(r[registerName]).forEach(key => {
              objectPath.set(newState, `${registerName}.${key}`, r[registerName][key])
            })
          })
        })
        setLoading({ 
          isLoading: false,
          showNotification: true,
          notificationType: 'success',
          notificationText: `Se ha descargado informacion del pozo: ${wellID}`
        })
        this.props.loadFromSave(newState)
      })
  }

  render() {
    let { isOpen, selectedSave } = this.state
    let { setShowForms } = this.props

    return (
      <div className='form general-data'>
        { this.makeGeneralForm() }
        { this.makeGeneralInterventionForm() }
        <button className="submit submit-load" onClick={this.activateModal}> Descargar borrador</button>
        <button className='submit submit-continue' disabled={this.checkIncomplete()} onClick={(e) => setShowForms(true)} >Siguiente</button>
        <Notification />
        <Loading />
        { isOpen ? this.buildModal() : null }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelPozoHighLevel'),
  user: state.get('user'),
  interventionFormData: state.get('objetivoYAlcancesIntervencion'),
  forms: state.get('forms')  
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
  setLoading: obj => dispatch(setIsLoading(obj))
})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralData)
