import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'
import { compose } from 'redux'
import objectPath from 'object-path'

import { setObjetivo, setAlcances, setTipoDeIntervenciones } from '../../../../redux/actions/intervencionesEstimulacion'
import { setSubdireccion, setActivo, setCampo, setPozo, setFormacion, setChecked } from '../../../../redux/actions/pozo'
import { setShowForms, setIsLoading } from '../../../../redux/actions/global'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Notification from '../../Common/Notification'
import Loading from '../../Common/Loading'
// import {withValidate} from '../../Common/Validate'

@autobind class GeneralData extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      // containsErrors: false,
      // errors: [],
      // checked: [],
      fieldWellOptions: []
    }
  }

  componentDidMount(){
    // this.validate()
    // this.containsErrors()
    // this.props.containsErrors(this, this.state.containsErrors)
    
    fetch('/api/getFieldWellMapping')
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })
  }

  componentDidUpdate(){
    //this.validate()
    // this.containsErrors()
    // this.props.containsErrors(this, this.state.containsErrors)
  }

  handleSelectSubdireccion(val) {
    let { subdireccion, setSubdireccion, setActivo } = this.props

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setActivo('')   
    }
  }

  handleSelectField(val) {
    let { campo, setCampo, setPozo } = this.props

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

    if (!!(objetivo) && !!(alcances) && !!(tipoDeIntervenciones) && !!(subdireccion) && !!(activo) && !!(campo)  && !!(pozo) && !!(formacion)) {
      return false
    }

    return true
  }

  makeGeneralInterventionForm() {
    let { setObjetivo, setAlcances, setTipoDeIntervenciones, interventionFormData } = this.props

    interventionFormData = interventionFormData.toJS()

    
    let { objetivo, alcances, tipoDeIntervenciones } = interventionFormData

    let tipoDeIntervencionesOptions = [
      {label: 'Tratamiento de Estimulacion', value: 'estimulacion'},
      {label: 'Fracuramiento Acido', value: 'acido'},
      {label: 'Fracturamiento Apuntalado', value: 'apuntalado'},
    ]

        return (
          <div className='intervention-form'>
            <div className='header'>
              Intervention Data
            </div>
            <TextAreaUnitless header="Objetivo - Describir el objetivo de la intervención indicando la causa principal, tipo de tratamiento a aplicar y técnica de colocación de los sistemas." name='objetivo' className={'objetivo'} value={objetivo} onChange={setObjetivo} errors={this.state.errors} />
            <TextAreaUnitless header="Alcances - Describir los alcances que se pretenden obtener con la intervención programada a ejecutar." name='alcances' className={'alcances'} value={alcances} onChange={setAlcances} errors={this.state.errors}/>
            <InputRowSelectUnitless header='Tipo de intervenciones' name='tipoDeIntervenciones' value={tipoDeIntervenciones} options={tipoDeIntervencionesOptions} callback={(e) => setTipoDeIntervenciones(e.value)} errors={this.state.errors} />
          </div>

        )
  }

  makeGeneralForm() {
    let { fieldWellOptions } = this.state
    let { setActivo, setCampo, setPozo, setFormacion, formData, forms } = this.props


    formData = formData.toJS()
    

    forms = forms.toJS()

    let { subdireccion, activo, campo, pozo, formacion } = formData
    const errors = forms.pozoFormError

    let subdireccionOptions = [
      {label: 'Subdirección de Especialidad Técnica de Explotación (SETE)', value: 'SETE'},
      {label: 'Subdirección de producción Bloques Aguas Someras AS-01', value: 'AS-01'},
      {label: 'Subdirección de producción Bloques Aguas Someras AS-02', value: 'AS-02'},
      {label: 'Subdirección de producción Bloques Sur', value: 'SUR'},
      {label: 'Subdirección de producción Bloques Norte', value: 'NORTE'},
    ]

    let activoOptionsMap = {
      'SETE': [
        {label: 'Gerencia de Producción (GP)', value: 'GP'}
      ],
      'AS-01': [
        {label: 'Activo Integral Producción Bloque AS01-01', value: 'AS01-01'},
        {label: 'Activo Integral Producción Bloque AS01-02', value: 'AS01-02'},
      ],
      'AS-02': [
        {label: 'Activo Integral Producción Bloque AS01-03', value: 'AS01-03'},
        {label: 'Activo Integral Producción Bloque AS01-04', value: 'AS01-04'},
      ],
      'SUR': [
        {label: 'Activo Integral Producción Bloque S01', value: 'S01'},
        {label: 'Activo Integral Producción Bloque S02', value: 'S02'},
        {label: 'Activo Integral Producción Bloque S03', value: 'S03'},
        {label: 'Activo Integral Producción Bloque S04', value: 'S04'},
      ],
      'NORTE': [
        {label: 'Activo Integral Bloques N01', value: 'N01'},
        {label: 'Activo Integral Bloques N02', value: 'N02'},
        {label: 'Activo Integral Bloques N03', value: 'N03'},
      ]
    }

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

    let activoOptions = subdireccion ? activoOptionsMap[subdireccion] : []

    let fieldOptions = []
    let wellOptions = []

    if (fieldWellOptions.length > 0) {
      fieldWellOptions.forEach(item => {
        if (!fieldOptions.map(i => i.value).includes(item.FIELD_FORMACION_ID)) {
          fieldOptions.push({label: item.FIELD_NAME, value: item.FIELD_FORMACION_ID})
        }
      })
    }

    if (campo && fieldWellOptions.length > 0) {
      wellOptions = fieldWellOptions.filter(i => i.FIELD_FORMACION_ID === parseInt(campo)).map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID}))
    }


    return (
      <div className='general-form'>
        <div className='header'>
          General Data
        </div>
        <InputRowSelectUnitless header='Subdirección' name="subdireccion" value={subdireccion} options={subdireccionOptions} callback={this.handleSelectSubdireccion} onBlur={this.validate} errors={this.state.errors} />
        <InputRowSelectUnitless header='Activo' name="activo" value={activo} options={activoOptions} callback={(e) => setActivo(e.value)} onBlur={this.validate} errors={this.state.errors} />
        <InputRowSelectUnitless header="Campo" name="campo" value={campo} options={fieldOptions} callback={this.handleSelectField} onBlur={this.validate} name='campo' errors={this.state.errors} />
        <InputRowSelectUnitless header="Pozo" name="pozo" value={pozo} options={wellOptions} callback={(e) => setPozo(e.value)} onBlur={this.validate} name='pozo' errors={this.state.errors} />
        <InputRowSelectUnitless header="Formación" value={formacion} options={formacionOptions} callback={(e) => setFormacion(e.value)} onBlur={this.validate} name='formacion' errors={this.state.errors} />
        <div style={{color: 'red'}}>TODO: agregar logica para subir resultados (add logic for upload results)</div>
      </div>

    )
  }

  
  async handleLoad() {
    let { user, formData, setLoading } = this.props
    setLoading({ isLoading: true })
    user = user.toJS()
    formData = formData.toJS()


    const wellID = formData.pozo
    const userID = user.id

    console.log(wellID, userID)

    let data = await fetch(`/api/getSave?userID=${userID}`)
      .then(res => res.json())

    let { transactionID, tipoDeIntervenciones } = data

    console.log(transactionID)

    let labQuery

    if (tipoDeIntervenciones === 'estimulacion') {
      labQuery = `api/getCedulaEstimulacion?transactionID=${transactionID}&saved=1`
    }
    else if (tipoDeIntervenciones === 'acido') {
      labQuery = `api/getLabAcido?transactionID=${transactionID}&saved=1`
    }
    else if (tipoDeIntervenciones === 'apuntalado') {
      labQuery = `api/getLabApuntalado?transactionID=${transactionID}&saved=1`
    }

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
      // fetch(`api/getLabResults?transactionID=${transactionID}`).then(r => r.json()),
      fetch(labQuery).then(r => r.json()),
      // fetch(`api/getCosts?transactionID=${transactionID}`).then(r => r.json()),
    ])
      .catch(error => console.log('some error i found', error))
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
        setLoading({ isLoading: false, isSaved: true })
        this.props.loadFromSave(newState)
      })
  }

  downloadMasterTemplate() {
    window.location = `/api/getTemplate`
  }

  render() {
    let { setShowForms } = this.props

    return (
      <div className='form general-data'>
        { this.makeGeneralForm() }
        { this.makeGeneralInterventionForm() }
        <button className="submit submit-load" onClick={this.handleLoad} >Load</button>
        <button className='submit submit-continue' disabled={this.checkIncomplete()} onClick={(e) => setShowForms(true)} >Continue</button>
        <button className="submit download-template" onClick={this.downloadMasterTemplate}>{'Descarga el Formato General'}</button>
        <Notification />
        <Loading />
      </div>
    )
  }
}




const validate = values => {
    const errors = {}

    if(!values.campo ){
       errors.campo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pozo ){
       errors.pozo = {message: "Este campo no puede estar vacio"}
    }
    return errors
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

// export default withValidate(
//   validate, 
//   connect(mapStateToProps, mapDispatchToProps)(GeneralData)
// )

export default connect(mapStateToProps, mapDispatchToProps)(GeneralData)