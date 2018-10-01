import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { List, Map, is } from 'immutable' 
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, setImgBoreDiagramURL, setImgAparejoDeProduccionURL, setChecked} from '../../../../redux/actions/pozo'
import { connect } from 'react-redux'

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
      containsErrors: false,
      errors: [],
      checked: []
    }
  }
  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
      let foundErrors = false
      let errors = Object.assign({}, this.state.errors);
      let {formData} = this.props
      formData = formData.toJS()

      const checked = formData.checked  || []
        checked.forEach((checked) => {
            if(errors[checked]){
                errors[checked].checked = true
                foundErrors = true
            }
        })

        if(foundErrors !== this.state.containsErrors){
            this.setState({
                errors: errors,
                containsErrors: foundErrors
            })
        }

  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)
    }
    return errors
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
        <InputRowSelectUnitless header="Tipo de terminación" value={tipoDeTerminacion} callback={this.handleSelectTipoDeTerminacion} options={tipoDeTerminacionOptions} name='tipoDeTerminacion' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="h (intervalo productor)" value={hIntervaloProductor} onChange={setHIntervaloProductor} name='hIntervaloProductor' unit='mv' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Empacador" name='empacador' value={empacador} onChange={setEmpacador} unit='mv' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Presión dif. empacador" name='presionDifEmpacador' value={presionDifEmpacador} onChange={setPresionDifEmpacador} unit='psi' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Profundidad Sensor P y T" name='sensorPyt' value={sensorPyt} onChange={setSensorPyt} unit='mv' onBlur={this.validate} errors={this.state.errors} />
        LINER
        <InputRowSelectUnitless header="Tipo de liner" name='tipoDeLiner' value={tipoDeLiner} options={tipoDeLinerOptions} callback={(e) => setTipoDeLiner(e.value)} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Diámetro de liner" name='diametroDeLiner' value={diametroDeLiner} onChange={setDiametroDeLiner} unit='pg' onBlur={this.validate} errors={this.state.errors} />
        {
          tipoDeTerminacion === 'Agujero Descubierto (AD)' ? null :
          <div>
            DISPAROS
            <InputRowUnitless header="Tipo de pistolas" name='tipoDePistolas' value={tipoDePistolas} onChange={setTipoDePistolas}  onBlur={this.validate} errors={this.state.errors} />
            <InputRow header="Densidad de disparos" name='densidadDeDisparosMecanico' value={densidadDeDisparosMecanico} onChange={setDensidadDeDisparosMecanico} unit='c/m' onBlur={this.validate} errors={this.state.errors} />
            <InputRow header="Fase" name='fase' value={fase} onChange={setFase} unit='Grados' onBlur={this.validate} errors={this.state.errors} />
            <InputRow header="Diámetro de orificio" name='diametroDeOrificio' value={diametroDeOrificio} onChange={setDiametroDeOrificio} unit='pg' onBlur={this.validate} errors={this.state.errors} />
            <InputRow header="Penetración" name='penetracion' value={penetracion} onChange={setPenetracion} unit='pg' onBlur={this.validate} errors={this.state.errors} />
          </div>
        }
{/*        SAP
        <InputRowUnitless header="Tipo de SAP" name='tipoDeSAP' value={tipoDeSAP} onChange={setTipoDeSAP}/>*/}

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
        <InputRowSelectUnitless header="Tratamiento por" name='tratamientoPor' value={tratamientoPor} callback={(e) => setTratamientoPor(e.value)} options={tratamientoPorOptions} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Volumen aparejo de producción" name='volumenAparejoDeProduccion' value={volumenAparejoDeProduccion} onChange={setVolumenAparejoDeProduccion} unit={<div>m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Volumen @ cima de intervalo" name='volumenCimaDeIntervalo' value={volumenCimaDeIntervalo} onChange={setVolumenCimaDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Volumen @ base de intervalo" name='volumenBaseDeIntervalo' value={volumenBaseDeIntervalo} onChange={setVolumenBaseDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Volumen de espacio anular (EA)" name='volumenDeEspacioAnular' value={volumenDeEspacioAnular} onChange={setVolumenDeEspacioAnular} unit={<div>m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
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
        { this.state.errors.imgURL && this.state.errors.imgURL.checked &&
          <div className="error">{this.state.errors.imgURL.message}</div>
        }
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


const validate = values => {
    const errors = {}

    if(!values.tipoDeTerminacion ){
       errors.tipoDeTerminacion = {message: "Este campo no puede estar vacio"}
    }

    if(!values.hIntervaloProductor ){
       errors.hIntervaloProductor = {message: "Este campo no puede estar vacio"}
    }

    if(!values.empacador ){
       errors.empacador = {message: "Este campo no puede estar vacio"}
    }

    if(!values.presionDifEmpacador ){
       errors.presionDifEmpacador = {message: "Este campo no puede estar vacio"}
    }

    if(!values.sensorPyt ){
       errors.sensorPyt = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tipoDeLiner ){
       errors.tipoDeLiner = {message: "Este campo no puede estar vacio"}
    }

    if(!values.diametroDeLiner ){
       errors.diametroDeLiner = {message: "Este campo no puede estar vacio"}
    }

    if(values.tipoDeTerminacion && values.tipoDeTerminacion != 'Agujero Descubierto (AD)') {

        if (!values.tipoDePistolas) {
            errors.tipoDePistolas = {message: "Este campo no puede estar vacio"}
        }

        if (!values.densidadDeDisparosMecanico) {
            errors.densidadDeDisparosMecanico = {message: "Este campo no puede estar vacio"}
        }

        if (!values.fase) {
            errors.fase = {message: "Este campo no puede estar vacio"}
        }

        if (!values.diametroDeOrificio) {
            errors.diametroDeOrificio = {message: "Este campo no puede estar vacio"}
        }

        if (!values.penetracion) {
            errors.penetracion = {message: "Este campo no puede estar vacio"}
        }
    }

    if(!values.tratamientoPor ){
       errors.tratamientoPor = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenAparejoDeProduccion ){
       errors.volumenAparejoDeProduccion = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenCimaDeIntervalo ){
       errors.volumenCimaDeIntervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenBaseDeIntervalo ){
       errors.volumenBaseDeIntervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDeEspacioAnular ){
       errors.volumenDeEspacioAnular = {message: "Este campo no puede estar vacio"}
    }

    if(!values.imgURL){
      errors.imgURL = {message: "Este campo puede estar vacio."}
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('mecanicoYAparejoDeProduccion'),
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
  setChecked: val => dispatch(setChecked(val, 'mecanicoYAparejoDeProduccion'))
})


export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(MecanicoYAparejo)
)
