import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class TechnicaDelPozo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeFormacionForm() {
    return (
      <div className='formacion-form' >
        <div className='header'>
          Los Datos de Formacion
        </div>
        <InputRow header="Intervalos(s) Productor(es)" name='intervalosProductores' unit='md/mv' />
        <InputRow header="Espesor Bruto" name='espesorBruto' unit='m' />
        <InputRow header="Espesor Neto" name='espesorNeto' unit='m' />
        <InputRow header="Caliza" name='caliza' unit='%' />
        <InputRow header="Dolomia" name='dolomia' unit='%' />
        <InputRow header="Arcilla" name='arcilla' unit='%' />
        <InputRow header="Porosidad" name='porosidad' unit='%' />
        <InputRow header="Permeabilidad" name='permeabilidad' unit='mD' />
        <InputRow header="Sw" name='sw' unit='%' />
        <InputRow header="CAA" name='caa' unit='mvbnm' />
        <InputRow header="CGA" name='cga' unit='mvbnm' />
      </div>
    )
  }

  makePozoForm() {

    let wellOptions = [
      { label: 'Productor', value: 'Productor' },
      { label: 'Inyector', value: 'Inyector' },
      { label: 'Cerrado', value: 'Cerrado' }
    ]

    return (
      <div className='pozo-form' >
        <div className='header'>
          Los Datos de Pozo
          <InputRowSelectUnitless header="Tipo de Pozo" name='' options={wellOptions} />
          <InputRow header="Pws (Fecha)" name='pws' unit='Kg/cm2' />
          <InputRow header="Pwf (Fecha)" name='pwf' unit='Kg/cm2' />
          <InputRow header="Δp/mes" name='deltaPperMes' unit='Kg/cm2/mes' />
          <InputRow header="Tyac" name='tyac' unit='°C' />
          <InputRow header="PVT" name='pvt' unit='Pozo' />
          <InputRow header="Aparejo de Produccion" name='aparejoDeProduccion' unit='pg' />
          <InputRow header="Prof. Empacador" name='profEmpacador' unit='md' />
          <InputRow header="Prof. Sensor P y T" name='profSensorPYT' unit='md' />
          <InputRowUnitless header="Tipo de SAP" name='TipoDeSap' />
        </div>

      </div>
    )
  }

  makeIntervencionesForm() {
    return (
      <div className='intervenciones-form' >
        <div className='header'>
          Historial de Intervenciones
          <div style={{color: 'red'}}>TODO: add user input? or is this pulled from db?</div>
        </div>

      </div>
    )
  }

  makeGeomecanicaForm() {
    return (
      <div className='geomecanica-form' >
        <div className='header'>
          Informacion de Geomecanica
        </div>
        <InputRow header="Modulo Young Arena" name='moduloYoungArena' unit='psi' />
        <InputRow header="Modulo Young Lutitas" name='moduloYoungLutitas' unit='psi' />
        <InputRow header="Relac. Poisson Arena" name='relacPoissonArena' unit='adim' />
        <InputRow header="Relac. Poisson Lutatas" name='relacPoissonLutatas' unit='adim' />
        <InputRow header="Gradiente de Fractura" name='gradienteDeFractura' unit='psi/ft' />
        <InputRow header="Densidad de Disparos" name='densidadDeDisparos' unit='c/m' />
        <InputRow header="Diametro de disparos" name='diametroDeDisparos' unit='pg' />
      </div>
    )
  }

  render() {


    return (
      <div className="form tecnica-del-pozo">
        { this.makeFormacionForm() }
        { this.makePozoForm() }
        { this.makeIntervencionesForm() }
        { this.makeGeomecanicaForm() }
      </div>
    )
  }
}


export default TechnicaDelPozo
