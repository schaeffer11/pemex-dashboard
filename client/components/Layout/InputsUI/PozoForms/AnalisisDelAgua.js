import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class AnalisisDelAgua extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeValoresForm() {
    return (
      <div className='valores-form' >
        <div className='header'>
          Valores
        </div>
        <InputRow header="pH" name='' unit='Adim.' />
        <InputRow header="Temperatura de Conductividad" name='' unit='°C' />
        <InputRow header="Resistividad" name='' unit='Ohm*m' />
        <InputRow header="Salinidad con conductimetro" name='' unit='mg/L o PPM' />
        <InputRow header="Solidos Disueltos Totales" name='' unit='mg/L o PPM' />
        <InputRow header="Dureza Total como CaCO3" name='' unit='mg/L o PPM' />
        <InputRow header="Dureza de Calcio como CaCO3" name='' unit='mg/L o PPM' />
        <InputRow header="Dureza de Magnesio como CaCO3" name='' unit='mg/L o PPM' />
        <InputRow header="Alcalinimg/L o PPMd Total como CaCO3" name='' unit='mg/L o PPM' />
        <InputRow header="Alcalinimg/L o PPMd a la Fenolftaleinacomo CaCoO3" name='' unit='mg/L o PPM' />
        <InputRow header="Salinimg/L o PPMd como NaCl" name='' unit='mg/L o PPM' />
        <InputRow header="Sodio" name='' unit='mg/L o PPM' />
        <InputRow header="Calcio" name='' unit='mg/L o PPM' />
        <InputRow header="Magnesio" name='' unit='mg/L o PPM' />
        <InputRow header="Fierro" name='' unit='mg/L o PPM' />
        <InputRow header="Cloruros" name='' unit='mg/L o PPM' />
        <InputRow header="Bicarbonatos" name='' unit='mg/L o PPM' />
        <InputRow header="Sulfatos" name='' unit='mg/L o PPM' />
        <InputRow header="Carbonatos" name='' unit='mg/L o PPM' />
        <InputRow header="Densidad @ 15.5 °C" name='' unit='g/cm3' />
        <InputRow header="Densig/cm3d @ 20 °C" name='' unit='da' />

      </div>
    )
  }

  render() {

    return (
      <div className="form analisis-del-agua">
        { this.makeValoresForm() }
      </div>
    )
  }
}


export default AnalisisDelAgua
