import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class ResultadosDeLaSimulacionApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }


  makeResultForm() {
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud Apuntalada" name='' unit="m"/>
        <InputRow header="Altura Total de Fractura" name='' unit="m"/>
        <InputRow header="Ancho Promedio" name='' unit="pg."/>
        <InputRow header="Concentracion Areal" name='' unit="lb/pg2"/>
        <InputRow header="Conductividad" name='' unit="mD*ft"/>
        <InputRow header="FCD" name='' unit="adim."/>
        <InputRow header="Presion Neta" name='' unit="psi"/>
        <InputRow header="Eficiencia de Fluido  de Fractura" name='' unit="%"/>
      </div>
    )
  }


  render() {

    return (
      <div className="form resultados-de-simulacion-apuntalado">
          { this.makeResultForm() }
          <div style={{color: 'red'}}>TODO add uevidence of simulation</div>

      </div>
    )
  }
}


export default ResultadosDeLaSimulacionApuntalado
