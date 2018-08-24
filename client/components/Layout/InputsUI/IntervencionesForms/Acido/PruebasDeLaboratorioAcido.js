import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class PruebasDeLaboratorioAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeGeneralesForm() {
    return (
      <div className='generales-form' >
        <div className='header'>
          Datos Generales
        </div>
        <InputRowUnitless header="Tipo de Analisis" name='' />
        <InputRow header="Fecha de Muestreo" name='' unit="dd/mm/aa"/>
        <InputRow header="Fecha de prueba" name='' unit="dd/mm/aa"/>
        <InputRowUnitless header="Compania" name='' />
        <InputRowUnitless header="Personal de Pemex que superviso" name='' />
      </div>
    )
  }


  render() {

    return (
      <div className="form pruebas-de-laboratorio-acido">
          { this.makeGeneralesForm() }
          <div style={{color: 'red'}}>TODO add table to add differant lab tests?</div>
          <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} />
          <div style={{color: 'red'}}>TODO add upload evidence of lab test</div>

      </div>
    )
  }
}


export default PruebasDeLaboratorioAcido
