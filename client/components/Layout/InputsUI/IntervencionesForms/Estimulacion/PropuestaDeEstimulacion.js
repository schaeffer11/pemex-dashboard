import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'

@autobind class PropuestaDeEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCedulaForm() {
    return (
      <div className='cedula-form' >
        <div className='header'>
          Cedula
        </div>
        <InputRowUnitless header="Etapa" name='' />
        <InputRowUnitless header="Sistema (NR-R-D)" name='' />
        <InputRow header="Vol. Liquid" name='' unit='m3' />
        <InputRow header="Gasto N2" name='' unit='m3/min' />
        <InputRow header="Gasto Liquido" name='' unit='bpm' />
        <InputRow header="Gasto en fondo" name='' unit='bpm' />
        <InputRow header="Calidad" name='' unit='%' />
        <InputRow header="Vol. N2" name='' unit='m3 std' />
        <InputRow header="Vol. Liquido Acum." name='' unit='m3' />
        <InputRow header="Vol. N2 Acum." name='' unit='m3 std' />
        <InputRow header="Rel. N2/Liq" name='' unit='m3 std/m3' />
        <InputRow header="Tiempo" name='' unit='min' />
      </div>
    )
  }

  makeGeneralForm() {
    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowUnitless header="Intervalo(s)" name='' />
        <InputRow header="Longitud de intervalo a tratar" name='' unit='m' />
        <InputRow header="Vol. Aparejo (VAP)" name='' unit='m3' />
        <InputRow header="Capacidad total del pozo (cima/base)" name='' unit='m3/m3' />
      </div>
    )
  }

  makeDetallesForm() {
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <InputRow header="Volumen Precolchon N2" name='' unit='m3' />
        <InputRow header="Volumen Sistema No. Reactivo" name='' unit='m3' />
        <InputRow header="Volumen Sistema Reactivo" name='' unit='m3' />
        <InputRow header="Volumen Sistema Divergente" name='' unit='m3' />
        <InputRow header="Volumen Desplazamiento Liquido" name='' unit='m3' />
        <InputRow header="Volumen Desplazamiento N2" name='' unit='m3' />
        <InputRow header="Volumen Total de Liqudo" name='' unit='m3' />
      </div>
    )
  }

  render() {

    return (
      <div className="form propuesta-de-estimulacion">
        <div className="left">
          { this.makeCedulaForm() }
        </div>
        <div className="right">
          { this.makeGeneralForm() }
          { this.makeDetallesForm() }
        </div>
      </div>
    )
  }
}


export default PropuestaDeEstimulacion
