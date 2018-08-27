import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import Select from 'react-select'
import { connect } from 'react-redux'
import { setSubdireccion, setBloque, setActivo, setCampo, setPozo, setFormacion } from '../../../../redux/actions/fichaTecnicaDelPozoHighLevel'

@autobind class TechnicaDelPozoHighLevel extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  handleSelectSubdireccion(val) {
    let { subdireccion, setSubdireccion, setBloque } = this.props

    if (subdireccion !== val.value) {
      setSubdireccion(val.value)
      setBloque('')   
    }
  }

  handleSelectBloque(val) {
    let { setBloque } = this.props

    setBloque(val.value)
  }


  render() {

    let { setActivo, setCampo, setPozo, setFormacion, formData } = this.props

    formData = formData.toJS()

    let { subdireccion, bloque, activo, campo, pozo, formacion } = formData


    let subdireccionOptions = [
      {label: 'Subdireccion de Especialidad Tecnica de Explotacion (SETE)', value: 'SETE'},
      {label: 'Subdirector Produccion Bloques Aguas Someras AS-01', value: 'AS-01'},
      {label: 'Subdirector Produccion Bloques Aguas Someras AS-02', value: 'AS-02'},
      {label: 'Subdireccion de Produccion Bloques Sur', value: 'SUR'},
      {label: 'Subdireccion de Produccion Bloques Norte', value: 'NORTE'},
    ]

    let bloqueOptionsMap = {
      'SETE': [
        {label: 'Gerencia de Produccion (GP)', value: 'GP'}
      ],
      'AS-01': [
        {label: 'Activo Integral Produccion Bloque AS01-01', value: 'AS01-01'},
        {label: 'Activo Integral Produccion Bloque AS01-02', value: 'AS01-02'},
      ],
      'AS-02': [
        {label: 'Activo Integral Produccion Bloque AS01-03', value: 'AS01-03'},
        {label: 'Activo Integral Produccion Bloque AS01-04', value: 'AS01-04'},
      ],
      'SUR': [
        {label: 'Activeo Integral Produccion Bloque S01', value: 'S01'},
        {label: 'Activeo Integral Produccion Bloque S02', value: 'S02'},
        {label: 'Activeo Integral Produccion Bloque S03', value: 'S03'},
        {label: 'Activeo Integral Produccion Bloque S04', value: 'S04'},
      ],
      'NORTE': [
        {label: 'Activo Integral Bloques N01', value: 'N01'},
        {label: 'Activo Integral Bloques N02', value: 'N02'},
        {label: 'Activo Integral Bloques N03', value: 'N03'},
      ]
    }


    let bloqueOptions = subdireccion ? bloqueOptionsMap[subdireccion] : []

    return (
      <form className="form tecnica-del-pozo-high-level">
        <div className='main-form'>
          <InputRowSelectUnitless header='Subdireccion' value={subdireccion} options={subdireccionOptions} callback={this.handleSelectSubdireccion} />
          <InputRowSelectUnitless header='Bloque' value={bloque} options={bloqueOptions} callback={this.handleSelectBloque} />
          <InputRowUnitless header="Activo" value={activo} onChange={setActivo} name='activo' />
          <InputRowUnitless header="Campo" value={campo} onChange={setCampo} name='campo' />
          <InputRowUnitless header="Pozo" value={pozo} onChange={setPozo} name='pozo' />
          <InputRowUnitless header="Formacion" value={formacion} onChange={setFormacion} name='formacion' />
          <div style={{color: 'red'}}>TODO: add logic for new proposal/upload results</div>
          <div style={{color: 'red'}}>TODO: add new well/select well? </div>
        </div>
      </form>
    )
  }
}



const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelPozoHighLevel'),
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

