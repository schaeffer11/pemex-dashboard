import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class MecanicoYAparejo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }
  makeTerminacionForm() {
    return (
      <div className='terminacion-form' >
        <div className='header'>
          Terminacion
        </div>
        TIPO
        <InputRowUnitless header="Tipo de Terminacion" name='' />
        <InputRow header="h (intervalo productor)" name='' unit='m' />
        <InputRow header="Empacador" name='' unit='m' />
        <InputRow header="Presion Dif. Empacador" name='' unit='psi' />
        <InputRow header="Sensor P y T" name='' unit='m' />
        LINER
        <InputRowUnitless header="Tipo de Liner" name='' />
        <InputRow header="Diametro de Liner" name='' unit='pg' />
        DISPAROS
        <InputRowUnitless header="Tipo de Pistolas" name=''  />
        <InputRow header="Densidad de Disparos" name='' unit='c/m' />
        <InputRow header="Fase" name='' unit='Grados' />
        <InputRow header="Diametro de Orificio" name='' unit='pg' />
        <InputRow header="Penetracion" name='' unit='pg' />
        SAP
        <InputRowUnitless header="Tipo de SAP" name='' />

      </div>
    )
  }
  
  makeCapacidadForm() {
    return (
      <div className='capacidad-form' >
        <div className='header'>
          Capacidad
        </div>
        VOLUMEN
        <InputRow header="Tratamiento por" name='' unit='(ej- TP, TR-TP, EA)' />
        <InputRow header="Volumen Aparejo de Produccion" name='' unit='m3' />
        <InputRow header="Volumen @ Cima de Intervalo" name='' unit='m3' />
        <InputRow header="Volumen @ Base de Intervalo" name='' unit='m3' />
        <InputRow header="Volumen de Espacio Anular (EA)" name='' unit='m3' />

      </div>
    )
  }

  render() {

    return (
      <div className="form mecanico-y-aparejo">
        { this.makeTerminacionForm() }
        { this.makeCapacidadForm() }
        <div style={{color: 'red'}}>TODO: add upload well bore diagram file (image)</div>
        <div style={{color: 'red'}}>TODO: add upload aparejo de produccion (image or csv)??</div>
      </div>
    )
  }
}


export default MecanicoYAparejo
