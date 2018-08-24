import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'

@autobind class PruebasDeLaboratorioApuntaladoExtra extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCaracterizacionForm() {
    return (
      <div className='caracterizacion-form' >
        <div className='header'>
          Caracterizacion de los Fluidos Producidos
        </div>
        <InputRow header="Contenido de aceite" name='' unit="%"/>
        <InputRow header="Contenido de agua" name='' unit="%"/>
        <InputRow header="Contenido de emulsion" name='' unit="%"/>
        <InputRow header="Contenido de solidos" name='' unit="%"/>
        <InputRow header="Tipo de solidossssssssssssssssssss" name=''/>
        <InputRow header="Densidad del aceite" name='' unit="g/cm3"/>
        <InputRow header="Densidad del agua" name='' unit="g/cm3"/>
        <InputRow header="Densidad de la emulsion" name='' unit="g/cm3"/>
        <InputRow header="Contenido de asfaltenos" name='' unit="%"/>
        <InputRow header="Contenido de parafinas" name='' unit="%"/>
        <InputRow header="Contenido de resinas" name='' unit="%"/>
        <InputRow header="Indice de estabilidad coloidal" name='' unit="adim"/>
        <InputRow header="Indice de estabilidad del agua" name='' unit="adim"/>
        <InputRow header="pH" name='' unit="adim"/>
        <InputRow header="Salinidad" name='' unit="ppm"/>
        <InputRow header="Viscosidad del aceite" name='' unit="cp"/>
      </div>
    )
  }


  makeGelLinealForm() {
    return (
      <div className='gel-lineal-form' >
        <div className='header'>
          Prueba Para Gel Lineal
        </div>
        <InputRowUnitless header="Tipo de Gel Lineal" name=''/>
        <InputRow header="Viscosidad del Gel Lineal" name='' unit="cp"/>
        <InputRow header="Tiempo de reticulacion" name='' unit="min"/>
        <InputRow header="pH gel lineal" name='' unit="adim"/>
        <InputRow header="Tiempo de rompedor del gel" name='' unit="min"/>
      </div>
    )
  }


  makeApuntalanteForm() {
    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba Para Apuntalante
        </div>
        <InputRow header="Tamano del apuntalante" name='' unit="malla"/>
        <InputRow header="Gravedad especifica" name='' unit="adim"/>
        <InputRow header="Esfericidad" name='' unit="adim"/>
        <InputRow header="Redondeo" name='' unit="adim"/>
        <InputRow header="Turbidez" name='' unit="FTU"/>
        <InputRow header="Resistencia" name='' unit="psi"/>
        <InputRow header="Prueba de solubilidad con acida" name='' unit="%"/>
      </div>
    )
  }


  render() {

    return (
      <div className="form pruebas-de-laboratorio-apuntalado-extra">
          <div className='left'>
            { this.makeCaracterizacionForm() }
          </div>
          <div className='right'>
            { this.makeGelLinealForm() }
            { this.makeApuntalanteForm() }
            <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} /> 
          </div>

          <div style={{color: 'red'}}>TODO add upload evidence of lab test</div>

      </div>
    )
  }
}


export default PruebasDeLaboratorioApuntaladoExtra
