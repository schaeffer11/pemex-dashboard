import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class EstimacionCostosEstimulacion extends Component {
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
        <InputRow header="Costo de sistema reactivo" name='' unit="MNX"/>
        <InputRow header="Costo de sistema no reactive" name='' unit="MNX"/>
        <InputRow header="Costo de divergentes" name='' unit="MNX"/>
        <InputRow header="Costo de N2" name='' unit="MNX"/>
        <InputRow header="Costo de HCl" name='' unit="MNX"/>
      </div>
    )
  }


  render() {

    return (
      <div className="form estimacion-costos-estimulacion">
            { this.makeCostosForm() }
          <div style={{color: 'red'}}>TODO summation as total at bottom</div>

      </div>
    )
  }
}


export default EstimacionCostosEstimulacion
