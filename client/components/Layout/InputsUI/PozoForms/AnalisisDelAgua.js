import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { connect } from 'react-redux'
import { setPH, setTemperaturaDeConductividad, setResistividad, setSalinidadConConductimetro, setSolidosDisueltosTotales, setDurezaTotalComoCaCO3, setDurezaDeCalcioComoCaCO3, setDurezaDeMagnesioComoCaCO3, setAlcalinidadTotalComoCaCO3, setAlcalinidadALaFenolftaleinaComoCaCO3, setSalinidadComoNaCl, setSodio, setCalcio, setMagnesio, setFierro, setCloruros, setBicarbonatos, setSulfatos, setCarbonatos, setDensidadAt15, setDensidadAt20 } from '../../../../redux/actions/analisisDelAgua'

@autobind class AnalisisDelAgua extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors === undefined
      })
    }
  }

  makeValoresForm() {
    let { setPH, setTemperaturaDeConductividad, setResistividad, setSalinidadConConductimetro, setSolidosDisueltosTotales, setDurezaTotalComoCaCO3, setDurezaDeCalcioComoCaCO3, setDurezaDeMagnesioComoCaCO3, setAlcalinidadTotalComoCaCO3, setAlcalinidadALaFenolftaleinaComoCaCO3, setSalinidadComoNaCl, setSodio, setCalcio, setMagnesio, setFierro, setCloruros, setBicarbonatos, setSulfatos, setCarbonatos, setDensidadAt15, setDensidadAt20, formData } = this.props
    formData = formData.toJS()
    let { pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales, durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3, salinidadComoNaCl, sodio, calcio, magnesio, fierro, cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15, densidadAt20 } = formData
    
    return (
      <div className='valores-form' >
        <div className='header'>
          Valores
        </div>
        <InputRow header="pH" name='' value={pH} onChange={setPH} unit='Adim.' />
        <InputRow header="Temperatura de conductividad" name='' value={temperaturaDeConductividad} onChange={setTemperaturaDeConductividad} unit='°C' />
        <InputRow header="Resistividad" name='' value={resistividad} onChange={setResistividad} unit='Ohm*m' />
        <InputRow header="Salinidad con conductimetro" name='' value={salinidadConConductimetro} onChange={setSalinidadConConductimetro} unit='mg/L o PPM' />
        <InputRow header="Solidos disueltos totales" name='' value={solidosDisueltosTotales} onChange={setSolidosDisueltosTotales} unit='mg/L o PPM' />
        <InputRow header="Dureza total como CaCO3" name='' value={durezaTotalComoCaCO3} onChange={setDurezaTotalComoCaCO3} unit='mg/L o PPM' />
        <InputRow header="Dureza de calcio como CaCO3" name='' value={durezaDeCalcioComoCaCO3} onChange={setDurezaDeCalcioComoCaCO3} unit='mg/L o PPM' />
        <InputRow header="Dureza de magnesio como CaCO3" name='' value={durezaDeMagnesioComoCaCO3} onChange={setDurezaDeMagnesioComoCaCO3} unit='mg/L o PPM' />
        <InputRow header="Alcalinidad total como CaCO3" name='' value={alcalinidadTotalComoCaCO3} onChange={setAlcalinidadTotalComoCaCO3} unit='mg/L o PPM' />
        <InputRow header="Alcalinidad a la fenolftaleína como CaCoO3" name='' value={alcalinidadALaFenolftaleinaComoCaCO3} onChange={setAlcalinidadALaFenolftaleinaComoCaCO3} unit='mg/L o PPM' />
        <InputRow header="Salinidad como NaCl" name='' value={salinidadComoNaCl} onChange={setSalinidadComoNaCl} unit='mg/L o PPM' />
        <InputRow header="Sodio" name='' value={sodio} onChange={setSodio} unit='mg/L o PPM' />
        <InputRow header="Calcio" name='' value={calcio} onChange={setCalcio} unit='mg/L o PPM' />
        <InputRow header="Magnesio" name='' value={magnesio} onChange={setMagnesio} unit='mg/L o PPM' />
        <InputRow header="Fierro" name='' value={fierro} onChange={setFierro} unit='mg/L o PPM' />
        <InputRow header="Cloruros" name='' value={cloruros} onChange={setCloruros} unit='mg/L o PPM' />
        <InputRow header="Bicarbonatos" name='' value={bicarbonatos} onChange={setBicarbonatos} unit='mg/L o PPM' />
        <InputRow header="Sulfatos" name='' value={sulfatos} onChange={setSulfatos} unit='mg/L o PPM' />
        <InputRow header="Carbonatos" name='' value={carbonatos} onChange={setCarbonatos} unit='mg/L o PPM' />
        <InputRow header="Densidad @ 15.5 °C" name='' value={densidadAt15} onChange={setDensidadAt15} unit='g/cm3' />
        <InputRow header="Densidad @ 20 °C" name='' value={densidadAt20} onChange={setDensidadAt20} unit='g/cm3' />
      </div>
    )
  }

  render() {

    return (
      <div className="form analisis-del-agua">
        { this.makeValoresForm() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('analisisDelAgua'),
})

const mapDispatchToProps = dispatch => ({
  setSubdireccion: val => dispatch(setSubdireccion(val)), 
  setPH: val => dispatch(setPH(val)),
  setTemperaturaDeConductividad: val => dispatch(setTemperaturaDeConductividad(val)),
  setResistividad: val => dispatch(setResistividad(val)),
  setSalinidadConConductimetro: val => dispatch(setSalinidadConConductimetro(val)),
  setSolidosDisueltosTotales: val => dispatch(setSolidosDisueltosTotales(val)),
  setDurezaTotalComoCaCO3: val => dispatch(setDurezaTotalComoCaCO3(val)),
  setDurezaDeCalcioComoCaCO3: val => dispatch(setDurezaDeCalcioComoCaCO3(val)),
  setDurezaDeMagnesioComoCaCO3: val => dispatch(setDurezaDeMagnesioComoCaCO3(val)),
  setAlcalinidadTotalComoCaCO3: val => dispatch(setAlcalinidadTotalComoCaCO3(val)),
  setAlcalinidadALaFenolftaleinaComoCaCO3: val => dispatch(setAlcalinidadALaFenolftaleinaComoCaCO3(val)),
  setSalinidadComoNaCl: val => dispatch(setSalinidadComoNaCl(val)),
  setSodio: val => dispatch(setSodio(val)),
  setCalcio: val => dispatch(setCalcio(val)),
  setMagnesio: val => dispatch(setMagnesio(val)),
  setFierro: val => dispatch(setFierro(val)),
  setCloruros: val => dispatch(setCloruros(val)),
  setBicarbonatos: val => dispatch(setBicarbonatos(val)),
  setSulfatos: val => dispatch(setSulfatos(val)),
  setCarbonatos: val => dispatch(setCarbonatos(val)),
  setDensidadAt15: val => dispatch(setDensidadAt15(val)),
  setDensidadAt20: val => dispatch(setDensidadAt20(val)),

})

export default connect(mapStateToProps, mapDispatchToProps)(AnalisisDelAgua)
