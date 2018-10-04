import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { connect } from 'react-redux'
import AnalisisDelAguaGraph from './AnalisisDelAguaGraph'
import { setWaterAnalysisBool, setPH, setTemperaturaDeConductividad, setResistividad, setSalinidadConConductimetro, setSolidosDisueltosTotales, setDurezaTotalComoCaCO3, setDurezaDeCalcioComoCaCO3, setDurezaDeMagnesioComoCaCO3, setAlcalinidadTotalComoCaCO3, setAlcalinidadALaFenolftaleinaComoCaCO3, setSalinidadComoNaCl, setSodio, setCalcio, setMagnesio, setFierro, setCloruros, setBicarbonatos, setSulfatos, setCarbonatos, setDensidadAt15, setDensidadAt20, setChecked } from '../../../../redux/actions/pozo'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers';


const yesOrNoOptions = [{
  label: 'Sí',
  value: true
}, {
  label: 'No',
  value: false
}]

@autobind class AnalisisDelAgua extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        pH: {
          type: 'numbernumber',
          value: null,
        },
        temperaturaDeConductividad: {
          type: 'number',
          value: null,
        },
        resistividad: {
          type: 'number',
          value: null,
        },
        salinidadConConductimetro: {
          type: 'number',
          value: null,
        },
        solidosDisueltosTotales: {
          type: 'number',
          value: null,
        },
        durezaTotalComoCaCO3: {
          type: 'number',
          value: null,
        },
        durezaDeCalcioComoCaCO3: {
          type: 'number',
          value: null,
        },
        durezaDeMagnesioComoCaCO3: {
          type: 'number',
          value: null,
        },
        alcalinidadTotalComoCaCO3: {
          type: 'number',
          value: null,
        },
        alcalinidadALaFenolftaleinaComoCaCO3: {
          type: 'number',
          value: null,
        },
        salinidadComoNaCl: {
          type: 'number',
          value: null,
        },
        sodio: {
          type: 'number',
          value: null,
        },
        calcio: {
          type: 'number',
          value: null,
        },
        magnesio: {
          type: 'number',
          value: null,
        },
        fierro: {
          type: 'number',
          value: null,
        },
        cloruros: {
          type: 'number',
          value: null,
        },
        bicarbonatos: {
          type: 'number',
          value: null,
        },
        sulfatos: {
          type: 'number',
          value: null,
        },
        carbonatos: {
          type: 'number',
          value: null,
        },
        densidadAt15: {
          type: 'number',
          value: null,
        },
        densidadAt20: {
          type: 'number',
          value: null,
        },
      }
    }
  }

  componentDidMount(){

  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        checkEmpty(formData[elem], elem, errors, this.updateErrors)
      } else if (errObj.type === 'date') {
        checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.updateErrors)
      }
    })
  }

  updateErrors(errors) {
    this.setState({ errors })
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
        <InputRow header="pH" name='pH' value={pH} onChange={setPH} unit='' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Temperatura de conductividad" name='temperaturaDeConductividad' value={temperaturaDeConductividad} onChange={setTemperaturaDeConductividad} unit='°C' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Resistividad" name='resistividad' value={resistividad} onChange={setResistividad} unit='Ohm*m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Salinidad con conductimetro" name='salinidadConConductimetro' value={salinidadConConductimetro} onChange={setSalinidadConConductimetro} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Solidos disueltos totales" name='solidosDisueltosTotales' value={solidosDisueltosTotales} onChange={setSolidosDisueltosTotales} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Dureza total como CaCO<sub>3</sub></div>} name='durezaTotalComoCaCO3' value={durezaTotalComoCaCO3} onChange={setDurezaTotalComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Dureza de calcio como CaCO<sub>3</sub></div>} name='durezaDeCalcioComoCaCO3' value={durezaDeCalcioComoCaCO3} onChange={setDurezaDeCalcioComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Dureza de magnesio como CaCO<sub>3</sub></div>} name='durezaDeMagnesioComoCaCO3' value={durezaDeMagnesioComoCaCO3} onChange={setDurezaDeMagnesioComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Alcalinidad total como CaCO<sub>3</sub></div>} name='alcalinidadTotalComoCaCO3' value={alcalinidadTotalComoCaCO3} onChange={setAlcalinidadTotalComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Alcalinidad a la fenolftaleína como CaCO<sub>3</sub></div>} name='alcalinidadALaFenolftaleinaComoCaCO3' value={alcalinidadALaFenolftaleinaComoCaCO3} onChange={setAlcalinidadALaFenolftaleinaComoCaCO3} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Salinidad como NaCl" name='salinidadComoNaCl' value={salinidadComoNaCl} onChange={setSalinidadComoNaCl} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Sodio" name='sodio' value={sodio} onChange={setSodio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Calcio" name='calcio' value={calcio} onChange={setCalcio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Magnesio" name='magnesio' value={magnesio} onChange={setMagnesio} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Fierro" name='fierro' value={fierro} onChange={setFierro} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Cloruros" name='cloruros' value={cloruros} onChange={setCloruros} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Bicarbonatos" name='bicarbonatos' value={bicarbonatos} onChange={setBicarbonatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Sulfatos" name='sulfatos' value={sulfatos} onChange={setSulfatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Carbonatos" name='carbonatos' value={carbonatos} onChange={setCarbonatos} unit='mg/L o PPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Densidad @ 15.5 °C" name='densidadAt15' value={densidadAt15} onChange={setDensidadAt15} unit={<div>g/cm<sup>3</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Densidad @ 20 °C" name='densidadAt20' value={densidadAt20} onChange={setDensidadAt20} unit={<div>g/cm<sup>3</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  render() {
    let { setWaterAnalysisBool, formData } = this.props
    formData = formData.toJS()
    let { waterAnalysisBool } = formData

    console.log('render agua')
    return (
      <div className="form analisis-del-agua">
        <div className='left'>
        <InputRowSelectUnitless header='¿El pozo tiene análisis de agua?' name='waterAnalysisBool' value={waterAnalysisBool} callback={(e) => setWaterAnalysisBool(e.value)} options={yesOrNoOptions} />
        { waterAnalysisBool === true ? this.makeValoresForm() : null }
        </div>
        <div className='right'>
          <div className="image"/>
          <AnalisisDelAguaGraph />
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('analisisDelAgua'),
})

const mapDispatchToProps = dispatch => ({
  setWaterAnalysisBool: val => dispatch(setWaterAnalysisBool(val)),
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
