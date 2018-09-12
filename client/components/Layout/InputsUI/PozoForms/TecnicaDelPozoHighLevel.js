import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import Select from 'react-select'
import { connect } from 'react-redux'
import { setSubdireccion, setBloque, setActivo, setCampo, setPozo, setFormacion } from '../../../../redux/actions/pozo'

@autobind class TechnicaDelPozoHighLevel extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  handleSelectSubdireccion(val) {
    let { subdireccion, setSubdireccion, setBloque } = this.props

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setBloque('')   
    }
  }

  handleSelectFormacion(val) {
    let { formacion, setFormacion } = this.props

    if (formacion !== val.value) {
      setFormacion(val.value) 
    }
  }

  handleSelectBloque(val) {
    let { setBloque } = this.props

    setBloque(val.value)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return ['subdireccion', 'bloque', 'activo', 'campo', 'pozo', 'formacion'].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    } 
  }

  render() {
    let { setActivo, setCampo, setPozo, setFormacion, formData, forms } = this.props

    formData = formData.toJS()
    forms = forms.toJS()

    let { subdireccion, bloque, activo, campo, pozo, formacion } = formData
    const errors = forms.pozoFormError

    let subdireccionOptions = [
      {label: 'Subdirección de Especialidad Técnica de Explotación (SETE)', value: 'SETE'},
      {label: 'Subdirección de producción Bloques Aguas Someras AS-01', value: 'AS-01'},
      {label: 'Subdirección de producción Bloques Aguas Someras AS-02', value: 'AS-02'},
      {label: 'Subdirección de producción Bloques Sur', value: 'SUR'},
      {label: 'Subdirección de producción Bloques Norte', value: 'NORTE'},
    ]

    let bloqueOptionsMap = {
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

    let bloqueOptions = subdireccion ? bloqueOptionsMap[subdireccion] : []

    return (
      <form className="form tecnica-del-pozo-high-level">
        <div className='main-form'>

          <InputRowSelectUnitless header='Subdirección' name="subdireccion" value={subdireccion} options={subdireccionOptions} callback={this.handleSelectSubdireccion} errors={errors} />
          <InputRowSelectUnitless header='Bloque' name="bloque" value={bloque} options={bloqueOptions} callback={this.handleSelectBloque} errors={errors} />
          <InputRowUnitless header="Activo" name="activo" value={activo} onChange={setActivo} name='activo' errors={errors} />
          <InputRowUnitless header="Campo" value={campo} onChange={setCampo} name='campo' errors={errors} />
          <InputRowUnitless header="Pozo" value={pozo} onChange={setPozo} name='pozo' errors={errors} />
          <InputRowSelectUnitless header="Formación" value={formacion} options={formacionOptions} callback={this.handleSelectFormacion} name='formacion' errors={errors} />

          <div style={{color: 'red'}}>TODO: agregar logica para nueva propuesta y opcion para subir resultados (add logic for new proposal/upload results)</div>
          <div style={{color: 'red'}}>TODO: agregar opcion de pozo nuevo o seleccionar pozo excistente (add new well/select well?)</div>
        </div>
      </form>
    )
  }
}



const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelPozoHighLevel'),
  forms: state.get('forms')
})

const mapDispatchToProps = dispatch => ({
  setSubdireccion: val => dispatch(setSubdireccion(val)), 
  setBloque: val => dispatch(setBloque(val)), 
  setActivo: val => dispatch(setActivo(val)), 
  setCampo: val => dispatch(setCampo(val)), 
  setPozo: val => dispatch(setPozo(val)), 
  setFormacion: val => dispatch(setFormacion(val)),
  
})

export default connect(mapStateToProps, mapDispatchToProps)(TechnicaDelPozoHighLevel)

