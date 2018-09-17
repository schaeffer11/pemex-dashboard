import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import Select from 'react-select'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { setSubdireccion, setActivo, setCampo, setPozo, setFormacion, setChecked } from '../../../../redux/actions/pozo'

@autobind class TecnicaDelPozoHighLevel extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      values: {
        subdireccion: null, 
        activo: null, 
        campo: null, 
        pozo: null, 
        formacion: null
      },
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
    //this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  handleSelectSubdireccion(val) {
    let { subdireccion, setSubdireccion, setActivo } = this.props

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setActivo('')   
    }
  }
  
  handleSelectFormacion(val) {
    let { formacion, setFormacion } = this.props

    if (formacion !== val.value) {
      setFormacion(val.value) 
    }
  }

  handleSelectActivo(val) {
    let { setActivo } = this.props

    setActivo(val.value)
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
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

  }
/*
  setCheck(field){
    let {setChecked, formData} = this.props
    formData = formData.toJS()
    const checked = [ ...formData.checked, field ]

    checked.forEach(field => {
      if(errors[field])
        errors[field].checked = true
    })

    this.setState({
      checked: checked
    })

    setChecked(checked)
  }
*/

  render() {
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

    return (
      <form className="form tecnica-del-pozo-high-level">
        <div className='main-form'>

          <InputRowSelectUnitless header='Subdirección' name="subdireccion" value={subdireccion} options={subdireccionOptions} onBlur={this.validate} callback={this.handleSelectSubdireccion} errors={this.state.errors} />
          <InputRowSelectUnitless header='Activo' name="activo" value={activo} options={activoOptions} onBlur={this.validate} callback={this.handleSelectActivo} errors={this.state.errors} />
          <InputRowUnitless header="Campo" value={campo} onChange={setCampo} onBlur={this.validate} name='campo' errors={this.state.errors} />
          <InputRowUnitless header="Pozo" value={pozo} onChange={setPozo} onBlur={this.validate} name='pozo' errors={this.state.errors} />
          <InputRowSelectUnitless header="Formación" value={formacion} options={formacionOptions} onBlur={this.validate} callback={this.handleSelectFormacion} name='formacion' errors={this.state.errors} />

          <div style={{color: 'red'}}>TODO: agregar logica para nueva propuesta y opcion para subir resultados (add logic for new proposal/upload results)</div>
          <div style={{color: 'red'}}>TODO: agregar opcion de pozo nuevo o seleccionar pozo excistente (add new well/select well?)</div>
        </div>
      </form>
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
  forms: state.get('forms')  
})

const mapDispatchToProps = dispatch => ({
  setSubdireccion: val => dispatch(setSubdireccion(val)), 
  setActivo: val => dispatch(setActivo(val)), 
  setCampo: val => dispatch(setCampo(val)), 
  setPozo: val => dispatch(setPozo(val)), 
  setFormacion: val => dispatch(setFormacion(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate, 
  connect(mapStateToProps, mapDispatchToProps)(TecnicaDelPozoHighLevel)
)
