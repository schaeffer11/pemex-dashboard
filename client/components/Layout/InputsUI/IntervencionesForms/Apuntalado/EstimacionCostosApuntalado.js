import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class EstimacionCostosApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCostosForm() {
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowUnitless header="Compania de Servicio" name='' />
        <InputRow header="Costo de renta de barco" name='' unit="MNX"/>
        <InputRow header="Costo Unidades de alta presion" name='' unit="MNX"/>
        <InputRow header="Costo del gel de fractura" name='' unit="MNX"/>
        <InputRow header="Costo de sistema reactivo" name='' unit="MNX"/>
        <InputRow header="Costo de sistema no reactivo" name='' unit="MNX"/>
        <InputRow header="Costo de divergentes" name='' unit="MNX"/>
        <InputRow header="Costo de N2" name='' unit="MNX"/>
        <InputRow header="Costo de HCL" name='' unit="MNX"/>
        <InputRow header="Costo de sistemas acidos retardados" name='' unit="MNX"/>
        <InputRow header="Costo equipo de fracturamiento de pozos" name='' unit="MNX"/>
        <InputRow header="Costo gel lineal" name='' unit="MNX"/>
        <InputRow header="Costo de trabajos de bombeo diversos" name='' unit="MNX"/>
        <InputRow header="Costo de llenado de pozo y prueba de admision" name='' unit="MNX"/>
        <InputRow header="Costo del Minifrac" name='' unit="MNX"/>
        <InputRow header="Costo de Bache neutralizador" name='' unit="MNX"/>
        <InputRow header="Protector de arbol" name='' unit="MNX"/>
      </div>
    )
  }


  render() {

    return (
      <div className="form estimacion-costos-apuntalado">
            { this.makeCostosForm() }
          <div style={{color: 'red'}}>TODO summation as total at bottom</div>

      </div>
    )
  }
}


export default EstimacionCostosApuntalado
