import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class TecnicaDelCampo extends Component {
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
          Generales
        </div>
        <InputRowUnitless header="Descubrimiento" name='descubrimiento'/>
        <InputRowUnitless header="Fecha de Explotacion" name='fechaDeExplotacion'/>
        <InputRowUnitless header="No. de Pozo Operando" name='noDePozoOperando'/>
      </div>
    )
  }

  makeExplotacionForm() {
    return (
      <div className='explotacion-form' >
        <div className='header'>
          Explotacion
        </div>
        <InputRow header="P. Inicial (ANO)" name='espesorBruto' unit='Kg/cm2' />
        <InputRow header="P. Actual (FECHA)" name='espesorNeto' unit='Kg/cm2' />
        <InputRow header="DP/ano" name='caliza' unit='Kg/cm2/ano' />
        <InputRow header="T yac" name='dolomia' unit='°C' />
        <InputRow header="P.R." name='arcilla' unit='mvbnm' />

      </div>
    )
  }

  makeFluidoForm() {
    return (
      <div className='fluido-form' >
        <div className='header'>
          Fluido
        </div>
        <InputRow header="Densidad del aceite" name='densidadDelAceite' unit='°API' />
        <InputRow header="P sat" name='pSat' unit='Kg/cm2' />
        <InputRow header="RGA" name='rga' unit='m3/m3' />
        <InputRow header="Salinidad" name='salinidad' unit='ppm' />
        <InputRowUnitless header="PVT representativo" name='pvtRepresentativo' />
      </div>
    )
  }

  makeFormacionForm() {
    return (
      <div className='formacion-form' >
        <div className='header'>
          Formacion
        </div>
        <InputRowUnitless header="Litologia" name='litologia'/>
        <InputRow header="Espesor Neto" name='espesorNeto' unit='m' />
        <InputRow header="Porosidad" name='porosidad' unit='m' />
        <InputRow header="Sw" name='Sw' unit='%' />
        <InputRow header="K promedio" name='kPromedio' unit='mD' />
        <InputRow header="CAA" name='caa' unit='m' />
        <InputRow header="CGA" name='cga' unit='m' />
      </div>
    )
  }

  makeProduccionForm() {
    return (
      <div className='produccion-form' >
        <div className='header'>
          Produccion @ Formacion
        </div>
        <InputRow header="Qo" name='qo' unit='bpd' />
        <InputRow header="Qg" name='qg' unit='bpd' />
        <InputRow header="RGA" name='rgaProd' unit='m3/m3' />
        <InputRow header="Fw" name='fw' unit='%' />
        <InputRow header="Np" name='np' unit='MMb' />
        <InputRow header="Gp" name='gp' unit='MMMpc' />
        <InputRow header="Wp" name='wp' unit='MMb' />
        <InputRow header="RRA" name='rra' unit='MMb' />
        <InputRow header="RRG" name='rrg' unit='MMMpc' />
        <InputRow header="RRPCE" name='rrpce' unit='MMb' />
        <InputRow header="H2S" name='h2s' unit='%' />
        <InputRow header="CO2" name='co2' unit='%' />
        <InputRow header="N2" name='n2' unit='%' />
      </div>
    )
  }

  render() {


    return (
      <div className="form tecnica-del-campo">
        <div className="left">
          { this.makeGeneralesForm() }
          { this.makeExplotacionForm() }
        </div>
        <div className="middle">
          { this.makeFluidoForm() }
          { this.makeFormacionForm() }
        </div>
        <div className="right">
          { this.makeProduccionForm() }
        </div>
      </div>
    )
  }
}


export default TecnicaDelCampo
