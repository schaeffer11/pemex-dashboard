import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { List, Map, is } from 'immutable' 
import { connect } from 'react-redux'

import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setHasErrorsMecanicoYAparejoDeProduccion, setFromSaveMecanicoYAparejoDeProduccion, setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, 
  setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, 
  setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, setTratamientoPor, setVolumenAparejoDeProduccion, 
  setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, setImgBoreDiagramURL, 
  setImgAparejoDeProduccionURL } from '../../../../redux/actions/pozo'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'


let tipoDeTerminacionOptions = [
  { label: 'Agujero Descubierto (AD)', value: 'Agujero Descubierto (AD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Cola extendida', value: 'Cola extendida' }
]

let tipoDeLinerOptions = [
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Liner Disparado (LD)', value: 'Liner Disparado (LD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Cola extendida', value: 'Cola extendida' },
]

let tratamientoPorOptions = [
  { label: 'Tubería de Producción (TP)', value: 'Tubería de Producción (TP)' },
  { label: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)', value: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)' },
  { label: 'Espacio Anular (EA)', value: 'Espacio Anular (EA)' },
  { label: 'Espacio Anular-Tuberia de Producción (EA-TP)', value: 'Espacio Anular-Tuberia de Producción (EA-TP)' },
]
@autobind class MecanicoYAparejo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        tipoDeTerminacion: {
          type: 'text',
          values: '',
        },
        hIntervaloProductor: {
          type: 'number',
          values: '',
        },
        empacador: {
          type: 'number',
          values: '',
        },
        presionDifEmpacador: {
          type: 'number',
          values: '',
        },
        sensorPyt: {
          type: 'number',
          values: '',
        },
        tipoDeLiner: {
          type: 'text',
          values: '',
        },
        diametroDeLiner: {
          type: 'number',
          values: '',
        },
        tipoDePistolas: {
          type: 'text',
          values: '',
        },
        densidadDeDisparosMecanico: {
          type: 'number',
          values: '',
        },
        fase: {
          type: 'number',
          values: '',
        },
        diametroDeOrificio: {
          type: 'number',
          values: '',
        },
        penetracion: {
          type: 'number',
          values: '',
        },
        tratamientoPor: {
          type: 'text',
          values: '',
        },
        volumenAparejoDeProduccion: {
          type: 'number',
          values: '',
        },
        volumenCimaDeIntervalo: {
          type: 'number',
          values: '',
        },
        volumenBaseDeIntervalo: {
          type: 'number',
          values: '',
        },
        volumenDeEspacioAnular: {
          type: 'number',
          values: '',
        },
      }

    }
  }

  
  componentDidMount(){
    let { setHasErrorsMecanicoYAparejoDeProduccion, hasErrors, hasSubmitted, fromSave, setFromSaveMecanicoYAparejoDeProduccion } = this.props

    if (hasSubmitted || fromSave) {
      let hasErrors = this.checkAllInputs()
      setHasErrorsMecanicoYAparejoDeProduccion(hasErrors)
      fromSave ? setFromSaveMecanicoYAparejoDeProduccion(false) : null
    }
  }

  componentWillReceiveProps(nextProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== nextProps.hasSubmitted) {
      this.checkAllInputs()
    }
  }

  checkAllInputs() {
    let { formData, fromSave } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, fromSave)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, fromSave)
      }

      error === true ? hasErrors = true : null
    })

    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsMecanicoYAparejoDeProduccion } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    console.log('herherer', hasErrorNew, hasErrors)
    if (hasErrorNew != hasErrors) {
      setHasErrorsMecanicoYAparejoDeProduccion(hasErrorNew)
    }

    this.setState({ errors })
  }


  handleSelectTerminacion(val) {
    let { tipoDeTerminacion, setTipoDeTerminacion } = this.props

    if (tipoDeTerminacion !== val.value) {
      setTipoDeTerminacion(val.value) 
    }
  }

  handleSelectTipoDeTerminacion(val) {
    let { setTipoDeTerminacion, setTipoDePistolas, setDensidadDeDisparosMecanico, 
      setFase, setDiametroDeOrificio, setPenetracion } = this.props

    if (val.value === 'Agujero Descubierto (AD)') {
      setTipoDePistolas(null) 
      setDensidadDeDisparosMecanico(null)
      setFase(null) 
      setDiametroDeOrificio(null) 
      setPenetracion(null)  
    }

    setTipoDeTerminacion(val.value)
  }

  makeTerminacionForm() {
    let { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase, diametroDeOrificio, penetracion, tipoDeSAP } = formData
    
    return (
      <div className='terminacion-form' >
        <div className='header'>
          Terminación
        </div>
        TIPO
        <InputRowSelectUnitless header="Tipo de terminación" value={tipoDeTerminacion} callback={this.handleSelectTipoDeTerminacion} options={tipoDeTerminacionOptions} name='tipoDeTerminacion' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="h (intervalo productor)" value={hIntervaloProductor} onChange={setHIntervaloProductor} name='hIntervaloProductor' unit='mv' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Empacador" name='empacador' value={empacador} onChange={setEmpacador} unit='mv' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Presión dif. empacador" name='presionDifEmpacador' value={presionDifEmpacador} onChange={setPresionDifEmpacador} unit='psi' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Profundidad Sensor P y T" name='sensorPyt' value={sensorPyt} onChange={setSensorPyt} unit='mv' onBlur={this.updateErrors} errors={this.state.errors} />
        LINER
        <InputRowSelectUnitless header="Tipo de liner" name='tipoDeLiner' value={tipoDeLiner} options={tipoDeLinerOptions} callback={(e) => setTipoDeLiner(e.value)} onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Diámetro de liner" name='diametroDeLiner' value={diametroDeLiner} onChange={setDiametroDeLiner} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
        {
          tipoDeTerminacion === 'Agujero Descubierto (AD)' ? null :
          <div>
            DISPAROS
            <InputRowUnitless header="Tipo de pistolas" name='tipoDePistolas' value={tipoDePistolas} onChange={setTipoDePistolas}  onBlur={this.updateErrors} errors={this.state.errors} />
            <InputRow header="Densidad de disparos" name='densidadDeDisparosMecanico' value={densidadDeDisparosMecanico} onChange={setDensidadDeDisparosMecanico} unit='c/m' onBlur={this.updateErrors} errors={this.state.errors} />
            <InputRow header="Fase" name='fase' value={fase} onChange={setFase} unit='Grados' onBlur={this.updateErrors} errors={this.state.errors} />
            <InputRow header="Diámetro de orificio" name='diametroDeOrificio' value={diametroDeOrificio} onChange={setDiametroDeOrificio} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
            <InputRow header="Penetración" name='penetracion' value={penetracion} onChange={setPenetracion} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
          </div>
        }
      </div>
    )
  }
  
  makeCapacidadForm() {
    let { setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, formData } = this.props
    formData = formData.toJS()
    let { tratamientoPor, volumenAparejoDeProduccion, volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular} = formData
 
    return (
      <div className='capacidad-form' >
        <div className='header'>
          Capacidad
        </div>
        VOLUMEN
        <InputRowSelectUnitless header="Tratamiento por" name='tratamientoPor' value={tratamientoPor} callback={(e) => setTratamientoPor(e.value)} options={tratamientoPorOptions} onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Volumen aparejo de producción" name='volumenAparejoDeProduccion' value={volumenAparejoDeProduccion} onChange={setVolumenAparejoDeProduccion} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Volumen @ cima de intervalo" name='volumenCimaDeIntervalo' value={volumenCimaDeIntervalo} onChange={setVolumenCimaDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Volumen @ base de intervalo" name='volumenBaseDeIntervalo' value={volumenBaseDeIntervalo} onChange={setVolumenBaseDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Volumen de espacio anular (EA)" name='volumenDeEspacioAnular' value={volumenDeEspacioAnular} onChange={setVolumenDeEspacioAnular} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
      </div>
    )
  }
  
  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeBoreDiagramInput() {
    let { formData, setImgBoreDiagramURL} = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar diagrama del aparejo de producción
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setImgBoreDiagramURL)}></input>
       
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  makeAparejoDeProduccionInput() {
    let { formData, setImgAparejoDeProduccionURL } = this.props
    formData = formData.toJS()
    let { imgAparejoDeProduccionURL } = formData

    return (
      <div style={{marginBot: '20px'}}>
        <div style={{color: 'red'}}> TODO: figure out Aparejo De Produccion (can we treat it as reg table?)</div>
      </div>
    )
  }

  render() {
    console.log('render mecanico')
    return (
      <div className="form mecanico-y-aparejo">
        <div className='image'/>
        <div className='left'>
          { this.makeTerminacionForm() }
        </div>
        <div className='right'>
          { this.makeCapacidadForm() }
          { this.makeBoreDiagramInput() }
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('mecanicoYAparejoDeProduccion'),
  hasErrors: state.getIn(['mecanicoYAparejoDeProduccion', 'hasErrors']),
  fromSave: state.getIn(['mecanicoYAparejoDeProduccion', 'fromSave']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setTipoDeTerminacion: val => dispatch(setTipoDeTerminacion(val)),
  setHIntervaloProductor: val => dispatch(setHIntervaloProductor(val)),
  setEmpacador: val => dispatch(setEmpacador(val)),
  setPresionDifEmpacador: val => dispatch(setPresionDifEmpacador(val)),
  setSensorPyt: val => dispatch(setSensorPyt(val)),
  setTipoDeLiner: val => dispatch(setTipoDeLiner(val)),
  setDiametroDeLiner: val => dispatch(setDiametroDeLiner(val)),
  setTipoDePistolas: val => dispatch(setTipoDePistolas(val)),
  setDensidadDeDisparosMecanico: val => dispatch(setDensidadDeDisparosMecanico(val)),
  setFase: val => dispatch(setFase(val)),
  setDiametroDeOrificio: val => dispatch(setDiametroDeOrificio(val)),
  setPenetracion: val => dispatch(setPenetracion(val)),
  setTipoDeSAP: val => dispatch(setTipoDeSAP(val)),
  setTratamientoPor: val => dispatch(setTratamientoPor(val)),
  setVolumenAparejoDeProduccion: val => dispatch(setVolumenAparejoDeProduccion(val)),
  setVolumenCimaDeIntervalo: val => dispatch(setVolumenCimaDeIntervalo(val)),
  setVolumenBaseDeIntervalo: val => dispatch(setVolumenBaseDeIntervalo(val)),
  setVolumenDeEspacioAnular: val => dispatch(setVolumenDeEspacioAnular(val)),
  setImgBoreDiagramURL: val => dispatch(setImgBoreDiagramURL(val)),
  setImgAparejoDeProduccionURL: val => dispatch(setImgAparejoDeProduccionURL(val)),
  setHasErrorsMecanicoYAparejoDeProduccion: val => dispatch(setHasErrorsMecanicoYAparejoDeProduccion(val)),
  setFromSaveMecanicoYAparejoDeProduccion: val => dispatch(setFromSaveMecanicoYAparejoDeProduccion(val)),
})


export default connect(mapStateToProps, mapDispatchToProps)(MecanicoYAparejo)
