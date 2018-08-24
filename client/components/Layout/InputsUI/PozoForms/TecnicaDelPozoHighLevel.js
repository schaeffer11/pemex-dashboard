import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import Select from 'react-select'

@autobind class TechnicaDelPozoHighLevel extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      subdireccion: null,
      bloque: null
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  handleSelectSubdireccion(val) {
    let { subdireccion } = this.state



    if (subdireccion !== val) {
      this.setState({
        subdireccion: val,
        bloque: null
      })      
    }
  }

  handleSelectBloque(val) {
    this.setState({
      bloque: val
    })
  }

  render() {
    let { subdireccion, bloque } = this.state

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



    let bloqueOptions = subdireccion ? bloqueOptionsMap[subdireccion.value] : []


    return (
      <form className="form tecnica-del-pozo-high-level">
        <div className='main-form'>
          <InputRowSelectUnitless header='Subdireccion' value={subdireccion} options={subdireccionOptions} callback={this.handleSelectSubdireccion} />
          <InputRowSelectUnitless header='Bloque' value={bloque} options={bloqueOptions} callback={this.handleSelectBloque} />
          <InputRowUnitless header="Activo" name='activo' />
          <InputRowUnitless header="Campo" name='campo' />
          <InputRowUnitless header="Pozo" name='pozo' />
          <InputRowUnitless header="Formacion" name='formacion' />
          <div style={{color: 'red'}}>TODO: add logic for new proposal/upload results</div>
          <div style={{color: 'red'}}>TODO: add new well/select well? </div>
        </div>
      </form>
    )
  }
}


export default TechnicaDelPozoHighLevel

