import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { connect } from 'react-redux'
import { setPH, setTemperaturaDeConductividad, setResistividad, setSalinidadConConductimetro, setSolidosDisueltosTotales, setDurezaTotalComoCaCO3, setDurezaDeCalcioComoCaCO3, setDurezaDeMagnesioComoCaCO3, setAlcalinidadTotalComoCaCO3, setAlcalinidadALaFenolftaleinaComoCaCO3, setSalinidadComoNaCl, setSodio, setCalcio, setMagnesio, setFierro, setCloruros, setBicarbonatos, setSulfatos, setCarbonatos, setDensidadAt15, setDensidadAt20, setChecked } from '../../../../redux/actions/pozo'

@autobind class AnalisisDelAgua extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      values: {
      },
      errors: [],
      checked: []
    }
  }

  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    }

  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)

      this.setState({
        checked: checked
      })
    }

  }

  setCheck(field){
    let {setChecked, formData} = this.props
    formData = formData.toJS()
    const checked = [ ...formData.checked, field ]

    checked.forEach(field => {
      if(errors[field])
        errors[field].checked = true
    })

    this.setState({
      checked: checked
    })

    setChecked(checked)
  }

  makeValoresForm() {
    let { setPH, setTemperaturaDeConductividad, setResistividad, setSalinidadConConductimetro, setSolidosDisueltosTotales, setDurezaTotalComoCaCO3, setDurezaDeCalcioComoCaCO3, setDurezaDeMagnesioComoCaCO3, setAlcalinidadTotalComoCaCO3, setAlcalinidadALaFenolftaleinaComoCaCO3, setSalinidadComoNaCl, setSodio, setCalcio, setMagnesio, setFierro, setCloruros, setBicarbonatos, setSulfatos, setCarbonatos, setDensidadAt15, setDensidadAt20, formData, forms } = this.props

    formData = formData.toJS()
    forms = forms.toJS()

    let { pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales, durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3, salinidadComoNaCl, sodio, calcio, magnesio, fierro, cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15, densidadAt20 } = formData
    const errors = forms.pozoFormError
    
    return (
      <div className='valores-form' >
        <div className='header'>
          Valores
        </div>
        <InputRow header="pH" name='pH' value={pH} onChange={setPH} unit='Adim.' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Temperatura de conductividad" name='temperaturaDeConductividad' value={temperaturaDeConductividad} onChange={setTemperaturaDeConductividad} unit='°C' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Resistividad" name='resistividad' value={resistividad} onChange={setResistividad} unit='Ohm*m' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Salinidad con conductimetro" name='salinidadConConductimetro' value={salinidadConConductimetro} onChange={setSalinidadConConductimetro} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Solidos disueltos totales" name='solidosDisueltosTotales' value={solidosDisueltosTotales} onChange={setSolidosDisueltosTotales} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Dureza total como CaCO3" name='durezaTotalComoCaCO3' value={durezaTotalComoCaCO3} onChange={setDurezaTotalComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Dureza de calcio como CaCO3" name='durezaDeCalcioComoCaCO3' value={durezaDeCalcioComoCaCO3} onChange={setDurezaDeCalcioComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Dureza de magnesio como CaCO3" name='durezaDeMagnesioComoCaCO3' value={durezaDeMagnesioComoCaCO3} onChange={setDurezaDeMagnesioComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Alcalinidad total como CaCO3" name='alcalinidadTotalComoCaCO3' value={alcalinidadTotalComoCaCO3} onChange={setAlcalinidadTotalComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Alcalinidad a la fenolftaleína como CaCoO3" name='alcalinidadALaFenolftaleinaComoCaCO3' value={alcalinidadALaFenolftaleinaComoCaCO3} onChange={setAlcalinidadALaFenolftaleinaComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Salinidad como NaCl" name='salinidadComoNaCl' value={salinidadComoNaCl} onChange={setSalinidadComoNaCl} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Sodio" name='sodio' value={sodio} onChange={setSodio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Calcio" name='calcio' value={calcio} onChange={setCalcio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Magnesio" name='magnesio' value={magnesio} onChange={setMagnesio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Fierro" name='fierro' value={fierro} onChange={setFierro} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Cloruros" name='cloruros' value={cloruros} onChange={setCloruros} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Bicarbonatos" name='bicarbonatos' value={bicarbonatos} onChange={setBicarbonatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Sulfatos" name='sulfatos' value={sulfatos} onChange={setSulfatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Carbonatos" name='carbonatos' value={carbonatos} onChange={setCarbonatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Densidad @ 15.5 °C" name='densidadAt15' value={densidadAt15} onChange={setDensidadAt15} unit='g/cm3' errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Densidad @ 20 °C" name='densidadAt20' value={densidadAt20} onChange={setDensidadAt20} unit='g/cm3' errors={this.state.errors} onBlur={this.validate}/>
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

const validate = values => {
    const errors = {}

    if(!values.pH ){
       errors.pH = {message: "Este campo no puede estar vacio"}
    }

    if(!values.temperaturaDeConductividad ){
       errors.temperaturaDeConductividad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.resistividad ){
       errors.resistividad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.salinidadConConductimetro ){
       errors.salinidadConConductimetro = {message: "Este campo no puede estar vacio"}
    }

    if(!values.solidosDisueltosTotales ){
       errors.solidosDisueltosTotales = {message: "Este campo no puede estar vacio"}
    }

    if(!values.durezaTotalComoCaCO3 ){
       errors.durezaTotalComoCaCO3 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.durezaDeCalcioComoCaCO3 ){
       errors.durezaDeCalcioComoCaCO3 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.durezaDeMagnesioComoCaCO3 ){
       errors.durezaDeMagnesioComoCaCO3 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.alcalinidadTotalComoCaCO3 ){
       errors.alcalinidadTotalComoCaCO3 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.alcalinidadALaFenolftaleinaComoCaCO3){
       errors.alcalinidadALaFenolftaleinaComoCaCO3= {message: "Este campo no puede estar vacio"}
    }

    if(!values.salinidadComoNaCl){
       errors.salinidadComoNaCl= {message: "Este campo no puede estar vacio"}
    }

    if(!values.sodio){
       errors.sodio= {message: "Este campo no puede estar vacio"}
    }

    if(!values.calcio){
       errors.calcio= {message: "Este campo no puede estar vacio"}
    }

    if(!values.magnesio){
       errors.magnesio= {message: "Este campo no puede estar vacio"}
    }

    if(!values.fierro){
       errors.fierro= {message: "Este campo no puede estar vacio"}
    }

    if(!values.cloruros){
       errors.cloruros= {message: "Este campo no puede estar vacio"}
    }

    if(!values.bicarbonatos){
       errors.bicarbonatos= {message: "Este campo no puede estar vacio"}
    } 

    if(!values.sulfatos){
       errors.sulfatos= {message: "Este campo no puede estar vacio"}
    }

    if(!values.carbonatos){
       errors.carbonatos= {message: "Este campo no puede estar vacio"}
    }

    if(!values.densidadAt15){
       errors.densidadAt15= {message: "Este campo no puede estar vacio"}
    }

    if(!values.densidadAt20){
       errors.densidadAt20= {message: "Este campo no puede estar vacio"}
    }

    return errors
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
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(AnalisisDelAgua)
)
