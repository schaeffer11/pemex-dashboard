import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class HistoricoDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeAforoForm() {
    return (
      <div className='aforo-form' >
        <div className='header'>
          Aforo
        </div>
        <InputRow header="Fecha" name='' unit='dd/mmm/aa' />
        <InputRow header="Tiempo" name='' unit='hrs' />
        <InputRowUnitless header="Tipo de Yac." name=''/>
        <InputRow header="Estrangulador" name='' unit='pg' />
        <InputRow header="PTP" name='' unit='Kg/cm2' />
        <InputRow header="TTP" name='' unit='°C' />
        <InputRow header="PBAJ" name='' unit='Kg/cm2' />
        <InputRow header="TBAJ" name='' unit='°C' />
        <InputRow header="Psep" name='' unit='Kg/cm2' />
        <InputRow header="Tsep" name='' unit='°C' />
        <InputRow header="Ql" name='' unit='bpd' />
        <InputRow header="Qo" name='' unit='bpd' />
        <InputRow header="Qg" name='' unit='MMpcd' />
        <InputRow header="Qw" name='' unit='bpd' />
        <InputRow header="RGA" name='' unit='m3/m3' />
        <InputRow header="Salinidad" name='' unit='ppm' />
        <InputRow header="pH" name='' unit='Adim.' />
      </div>
    )
  }

  render() {

    return (
      <div className="form historico-de-produccion">
        { this.makeAforoForm() }
        <div style={{color: 'red'}}>TODO: add upload los datos de pozo (image or csv??)</div>
      </div>
    )
  }
}


export default HistoricoDeProduccion
