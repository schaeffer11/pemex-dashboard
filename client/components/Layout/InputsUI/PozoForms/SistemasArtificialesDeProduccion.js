import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class SistemasArtificialesDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSistema: null
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeEmboloViajeroForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='kg/cm2'/>
        <InputRowUnitless header="Numero de descargas o ciclos" name='' />
        <InputRowUnitless header="Volumen desplazado por ciclo" name='' />
      </div>
    )
  }

  makeBombeoNeumaticoForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de Inyeccion" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de descarga" name='' unit='Kg/cm2'/>
        <InputRowUnitless header="Numero de valvulas" name='' />
        <InputRow header="Profundiddad de la vulvula operante" name='' unit='m'/>
        <InputRow header="Orificio" name='' unit='pg'/>
        <InputRow header="Volumen de gas inyectado" name='' unit='m3'/>
      </div>
    )
  }

  makeBombeoHidraulicoForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='Kg/cm2'/>
        <InputRow header="Profundidad de la bomba" name='' unit='m'/>
        <InputRowUnitless header="Tipo y marca de Bomba" name='' />
        <InputRow header="Orificio" name='' unit='pg'/>
        <InputRow header="Tipo de camisa" name='' unit='pg'/>
        <InputRowUnitless header="Fluido motriz" name='' />
        <InputRow header="Equipo Superficial" name='' unit='HP'/>
      </div>
    )
  }

  makeBombeoCavidadesProgresivasForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='Kg/cm2'/>
        <InputRowUnitless header="Motor y Tipo de motor" name='' />
        <InputRowUnitless header="Profunidad del motor" name='' />
        <InputRow header="Velocidad" name='' unit=''/>
        <InputRow header="HP" name='' unit=''/>
        <InputRow header="Arreglo de varillas" name='' unit=''/>
        <InputRow header="Tipo de elastomero (compoicion quimica)" name='' unit=''/>
        <InputRow header="Profundidad del ancla antitorque" name='' unit=''/>

      </div>
    )
  }

  makeBombeoElectrocentrifugoForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='Kg/cm2'/>
        <InputRow header="Profundidad del motor" name='' unit='m'/>
        <InputRow header="Diametro" name='' unit='pg'/>
        <InputRow header="Volts" name='' unit='V'/>
        <InputRow header="Amparaje" name='' unit='A'/>
        <InputRowUnitless header="Armadura (Bomba)" name='' />
        <InputRowUnitless header="Tipo de cable" name='' />
        <InputRow header="Longitud de cable" name='' unit='m'/>
        <InputRowUnitless header="RPM" name='' />

      </div>
    )
  }

  makeBombeoMecanicoForm() {
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' unit='Kg/cm2'/>
        <InputRowUnitless header="Tipo de unidad" name=''/>
        <InputRow header="Velocidad" name='' unit='EPM'/>
        <InputRow header="Longitud de carera" name='' unit='pg'/>
        <InputRowUnitless header="Tipo de bomba subsuperficial" name='' />
        <InputRowUnitless header="Tamano de Bomba Subsuperficial" name='' />
        <InputRow header="Profundidad de la bomba" name='' unit='m'/>
        <InputRowUnitless header="Arreglo de varillas" name='' />
        <InputRowUnitless header="Cuanta con Ancla mecanico o empacador" name=''/>
        <InputRow header="Nivel dinamico" name='' unit='m'/>
        <InputRow header="Nivel estatico" name='' unit='m'/>
      </div>
    )
  }



  handleSelectSistema(val) {
    this.setState({
      selectedSistema: val.value
    })
  }



  render() {
    let { selectedSistema } = this.state

    let options = [
      { label: 'Ninguna', value: 'none' },
      { label: 'Embolo Viajero', value: 'emboloViajero' },
      { label: 'Bombeo Neumatico', value: 'bombeoNeumatico' },
      { label: 'Bombeo Hidraulico', value: 'bombeoHidraulico' },
      { label: 'Bombeo Cavidades Progresivas', value: 'bombeoCavidadesProgresivas' },
      { label: 'Bombeo Electrocentrifugo', value: 'bombeoElectrocentrifugo' },
      { label: 'Bombeo Mecanico', value: 'bombeoMecanico' },
    ]

    let forms = {
      none: null,
      emboloViajero: this.makeEmboloViajeroForm(),
      bombeoNeumatico: this.makeBombeoNeumaticoForm(),
      bombeoHidraulico: this.makeBombeoHidraulicoForm(),
      bombeoCavidadesProgresivas: this.makeBombeoCavidadesProgresivasForm(),
      bombeoElectrocentrifugo: this.makeBombeoElectrocentrifugoForm(),
      bombeoMecanico: this.makeBombeoMecanicoForm(),
    }

    return (
      <div className="form sistemas-artificiales-de-produccion">
        <div className='select-sistema' >
          <InputRowSelectUnitless header='Tipo de Sistemo' options={options} callback={this.handleSelectSistema} />
        </div>
        { forms[selectedSistema]}
      </div>
    )
  }
}


export default SistemasArtificialesDeProduccion
