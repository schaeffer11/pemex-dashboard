import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class ResultadosDeLaSimulacionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeLimpiezaForm() {
    return (
      <div className='limpieza-form' >
        <div className='header'>
          Limpieza
        </div>
        <InputRow header="Volumen del sistema acido" name='' unit="m3"/>
        <InputRow header="Volumen del sistema no acido" name='' unit="m3"/>
        <InputRowUnitless header="Tipo de colocacion" name='' />
        <InputRow header="Tiempo de contacto" name='' unit="min"/>
      </div>
    )
  }

  makeMatricialForm() {
    return (
      <div className='matricail-form' >
        <div className='header'>
          Matricial
        </div>
        <InputRow header="Numero de etapas" name='' unit="Numero"/>
        <InputRow header="Volumen del sistema acido" name='' unit="m3"/>
        <InputRow header="Volumen del sistema no acido" name='' unit="m3"/>
        <InputRow header="Volumen de divergente" name='' unit="m3"/>
        <InputRow header="Volumen de N2" name='' unit="m3"/>
        <InputRow header="Calidad de Espuma" name='' unit="%"/>
        <InputRow header="Volumen de precolchon N2" name='' unit="m3"/>
        <InputRow header="Volumen de desplazamiento (N2 o liquido)" name='' unit="m3"/>
        <InputRow header="Penetracion radial" name='' unit="pg"/>
        <InputRow header="Longitud de agujero de gusano" name='' unit="pg"/>
      </div>
    )
  }


  render() {

    return (
      <div className="form resultados-de-simulacion">
          { this.makeLimpiezaForm() }
          { this.makeMatricialForm() }
          <div style={{color: 'red'}}>TODO add uevidence of simulation</div>

      </div>
    )
  }
}


export default ResultadosDeLaSimulacionEstimulacion
