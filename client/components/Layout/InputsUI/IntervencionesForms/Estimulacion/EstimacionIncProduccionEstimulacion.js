import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class EstimacionIncProduccionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeModeladoForm() {
    return (
      <div className='modelado-form' >
        <div className='header'>
          Modelado
        </div>
        <InputRow header="Estrangulador" name='' unit="pg"/>
        <InputRow header="PTP" name='' unit="Kg/cm2"/>
        <InputRow header="TTP" name='' unit="C"/>
        <InputRow header="PBAJ" name='' unit="Kg/cm2"/>
        <InputRow header="TBAJ" name='' unit="C"/>
        <InputRow header="PTR" name='' unit="Kg/cm2"/>
        <InputRow header="Ql" name='' unit="bpd"/>
        <InputRow header="Qo" name='' unit="bpd"/>
        <InputRow header="Qg" name='' unit="MMpcd"/>
        <InputRow header="Qw" name='' unit="bpd"/>
        <InputRow header="RGA" name='' unit="m3/m3"/>
        <InputRow header="Salinidad" name='' unit="ppm"/>
        <InputRow header="IP estimado" name='' unit="bpd/psi"/>
        <InputRow header="ΔP" name='' unit="Kg/cm2"/>

      </div>
    )
  }

  makeGastoCompromisoForm() {
    return (
      <div className='gasto-compromiso-form' >
        <div className='header'>
          Gasto Compromiso
        </div>
        <InputRow header="QO" name='' unit="bpd"/>
        <InputRow header="QG" name='' unit="MMpcd"/>
      </div>
    )
  }

  makeObservacionesForm() {
    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} />
      </div>
    )
  }

  render() {

    return (
      <div className="form estimacion-inc-produccion-estimulacion">
          <div className='left'>
            { this.makeModeladoForm() }
          </div>
          <div className='right'>
            { this.makeGastoCompromisoForm() }
            { this.makeObservacionesForm() }
          </div>
          
          <div style={{color: 'red'}}>TODO add evidence of estimation of increase (csv/image)</div>

      </div>
    )
  }
}


export default EstimacionIncProduccionEstimulacion
