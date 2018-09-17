import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { connect } from 'react-redux'
import { setTipoDeFluidoField, setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, setPInicialAnoField, setPActualFechaField, setDpPerAnoField, setTyacField, setPrField, setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, setLitologiaField, setEspesorNetoField, setPorosidadField, setSwField, setKPromedioField, setCaaField, setCgaField, setQoField, setQgField, setRgaField, setFwField, setNpField, setGpField, setWpField, setRraField, setRrgField, setRrpceField, setH2sField, setCo2Field, setN2Field, setChecked } from '../../../../redux/actions/pozo'

let fluidoOptions = [
    { label: 'Aceite Negro', value: 'Aceite Negro' },
    { label: 'Acetic Ligero', value: 'Acetic Ligero' },
    { label: 'Gas y Condensado', value: 'Gas y Condensado' },
    { label: 'Gas Hemedo', value: 'Gas Hemedo' },
    { label: 'Gas Seco', value: 'Gas Seco' },
]
@autobind class TecnicaDelCampo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
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
    }

  }

  makeGeneralesForm() {
    let { setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, forms, formData } = this.props

    forms = forms.toJS()
    formData = formData.toJS()

    let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField } = formData
    const errors = forms.pozoFormError

    return (
      <div className='generales-form'>
        <div className='header'>
          Generales
        </div>
        <InputRowUnitless header="Descubrimiento" name='descubrimiento' value={descubrimientoField} onChange={setDescubrimientoField} onBlur={this.validate} errors={this.state.errors}/>
        <InputRowUnitless header="Fecha de explotación" name='fechaDeExplotacion' value={fechaDeExplotacionField} onChange={setFechaDeExplotacionField} onBlur={this.validate} errors={this.state.errors}/>
        <InputRowUnitless header="No. de pozo operando" type='number' name='noDePozoOperando' value={numeroDePozosOperandoField} onChange={setNumeroDePozosOperandoField} onBlur={this.validate} errors={this.state.errors}/>
      </div>
    )
  }

  makeExplotacionForm() {
    let { setPInicialAnoField, setPActualFechaField,setDpPerAnoField, setTyacField, setPrField, forms, formData } = this.props

    forms = forms.toJS()
    formData = formData.toJS()

    let { pInicialAnoField, pActualFechaField,dpPerAnoField, tyacField, prField } = formData
    const errors = forms.pozoFormError

    return (
      <div className='explotacion-form' >
        <div className='header'>
          Explotacion
        </div>
        <InputRow header="P. inicial (año)" name='pInicialAno' value={pInicialAnoField} onChange={setPInicialAnoField} unit='Kg/cm2' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P. actual (fecha)" name='pActualFecha' value={pActualFechaField} onChange={setPActualFechaField} unit='Kg/cm2' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="DP/año" name='dpPerAno' value={dpPerAnoField} onChange={setDpPerAnoField} unit='Kg/cm2/año' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="T yac" name='tyac' value={tyacField} onChange={setTyacField} unit='°C' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P.R." name='pr' value={prField} onChange={setPrField} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />

      </div>
    )
  }

  makeFluidoForm() {
    let { setTipoDeFluidoField, setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, forms, formData } = this.props

    forms = forms.toJS()
    formData = formData.toJS()

    let { tipoDeFluidoField, densidadDelAceiteField, pSatField, rgaFluidoField, salinidadField, pvtRepresentativoField } = formData
    const errors = forms.pozoFormError

    return (
      <div className='fluido-form' >
        <div className='header'>
          Fluido
        </div>
        <InputRowSelectUnitless header='Tipo de Fluido' name='tipoDeFluidoField' value={tipoDeFluidoField} onChange={setTipoDeFluidoField} options={fluidoOptions} />
        <InputRow header="Densidad del aceite" name='densidadDelAceite' value={densidadDelAceiteField} onChange={setDensidadDelAceiteField} unit='°API' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P sat" name='pSat' value={pSatField} onChange={setPSatField} unit='Kg/cm2' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RGA" name='rga' value={rgaFluidoField} onChange={setRgaFluidoField} unit='m3/m3' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Salinidad" name='salinidad' value={salinidadField} onChange={setSalinidadField} unit='ppm' onBlur={this.validate} errors={this.state.errors} />
        <InputRowUnitless header="PVT representativo" name='pvtRepresentativo' value={pvtRepresentativoField} onChange={setPvtRepresentativoField} onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makeFormacionForm() {
    let { setLitologiaField, setEspesorNetoField, setPorosidadField, setSwField, setKPromedioField, setCaaField, setCgaField, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { litologiaField, espesorNetoField, porosidadField, swField, kPromedioField, caaField, cgaField } = formData

    const errors = forms.pozoFormError

    return (
      <div className='formacion-form' >
        <div className='header'>
          Formacion
        </div>
        <InputRowUnitless header="Litología" name='litologia' value={litologiaField} onChange={setLitologiaField} />
        <InputRow header="Espesor neto" name='espesorNeto'value={espesorNetoField} onChange={setEspesorNetoField} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Porosidad" name='porosidad' value={porosidadField} onChange={setPorosidadField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Sw" name='Sw' value={swField} onChange={setSwField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="K promedio" name='kPromedio' value={kPromedioField} onChange={setKPromedioField} unit='mD' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CAA" name='caa' value={caaField} onChange={setCaaField} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CGA" name='cga' value={cgaField} onChange={setCgaField} unit='m' onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makeProduccionForm() {
    let { setQoField, setQgField, setRgaField, setFwField, setNpField, setGpField, setWpField, setRraField, setRrgField, setRrpceField, setH2sField, setCo2Field, setN2Field, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { qoField, qgField, rgaField, fwField, npField, gpField, wpField, rraField, rrgField, rrpceField, h2sField, co2Field, n2Field } = formData

    const errors = forms.pozoFormError

    return (
      <div className='produccion-form' >
        <div className='header'>
          Produccion @ Formacion
        </div>
        <InputRow header="Qo" name='qo' value={qoField} onChange={setQoField} unit='bpd' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Qg" name='qg' value={qgField} onChange={setQgField} unit='MMpcd' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RGA" name='rgaProd' value={rgaField} onChange={setRgaField} unit='m3/m3' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Fw" name='fw' value={fwField} onChange={setFwField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Np" name='np' value={npField} onChange={setNpField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Gp" name='gp' value={gpField} onChange={setGpField} unit='MMMpc' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Wp" name='wp' value={wpField} onChange={setWpField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRA" name='rra' value={rraField} onChange={setRraField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRG" name='rrg' value={rrgField} onChange={setRrgField} unit='MMMpc' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRPCE" name='rrpce' value={rrpceField} onChange={setRrpceField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="H2S" name='h2s' value={h2sField} onChange={setH2sField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CO2" name='co2' value={co2Field} onChange={setCo2Field} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="N2" name='n2' value={n2Field} onChange={setN2Field} unit='%' onBlur={this.validate} errors={this.state.errors} />
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

const validate = values => {
    const errors = {}

    if(!values.descubrimiento ){
       errors.descubrimiento = {message: "Este campo no puede estar vacio"}
    }

    if(!values.fechaDeExplotacion ){
       errors.fechaDeExplotacion = {message: "Este campo no puede estar vacio"}
    }

    if(!values.noDePozoOperando ){
       errors.noDePozoOperando = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pInicialAno ){
       errors.pInicialAno = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pActualFecha ){
       errors.pActualFecha = {message: "Este campo no puede estar vacio"}
    }

    if(!values.dpPerAnoField ){
       errors.dpPerAnoField = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tyacField ){
       errors.tyacField = {message: "Este campo no puede estar vacio"}
    }

    if(!values.prField ){
       errors.prField = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tipoDeFluidoField ){
       errors.tipoDeFluidoField = {message: "Este campo no puede estar vacio"}
    }

    if(!values.densidadDelAceite ){
       errors.densidadDelAceite = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pSat ){
       errors.pSat = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rga ){
       errors.rga = {message: "Este campo no puede estar vacio"}
    }

    if(!values.salinidad ){
       errors.salinidad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pvtRepresentativo ){
       errors.pvtRepresentativo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.litologia ){
       errors.litologia = {message: "Este campo no puede estar vacio"}
    }

    if(!values.espesorNeto ){
       errors.espesorNeto = {message: "Este campo no puede estar vacio"}
    }

    if(!values.porosidad ){
       errors.porosidad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.Sw ){
       errors.Sw = {message: "Este campo no puede estar vacio"}
    }

    if(!values.kPromedio ){
       errors.kPromedio = {message: "Este campo no puede estar vacio"}
    }

    if(!values.caa ){
       errors.caa = {message: "Este campo no puede estar vacio"}
    }

    if(!values.cga ){
       errors.cga = {message: "Este campo no puede estar vacio"}
    }

    if(!values.qo ){
       errors.qo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.qg ){
       errors.qg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rgaProd ){
       errors.rgaProd = {message: "Este campo no puede estar vacio"}
    }

    if(!values.fw ){
       errors.fw = {message: "Este campo no puede estar vacio"}
    }

    if(!values.np ){
       errors.np = {message: "Este campo no puede estar vacio"}
    }

    if(!values.gp ){
       errors.gp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.wp ){
       errors.wp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rra ){
       errors.rra = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rrg ){
       errors.rrg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rrpce ){
       errors.rrpce = {message: "Este campo no puede estar vacio"}
    }

    if(!values.h2s ){
       errors.h2s = {message: "Este campo no puede estar vacio"}
    }

    if(!values.co2 ){
       errors.co2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.n2 ){
       errors.n2 = {message: "Este campo no puede estar vacio"}
    }
    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('fichaTecnicaDelCampo'),
})

const mapDispatchToProps = dispatch => ({
  setDescubrimientoField: val => dispatch(setDescubrimientoField(val)),
  setFechaDeExplotacionField: val => dispatch(setFechaDeExplotacionField(val)),
  setNumeroDePozosOperandoField: val => dispatch(setNumeroDePozosOperandoField(val)),
  setPInicialAnoField: val => dispatch(setPInicialAnoField(val)),
  setPActualFechaField: val => dispatch(setPActualFechaField(val)),
  setDpPerAnoField: val => dispatch(setDpPerAnoField(val)),
  setTyacField: val => dispatch(setTyacField(val)),
  setPrField: val => dispatch(setPrField(val)),
  setDensidadDelAceiteField: val => dispatch(setDensidadDelAceiteField(val)),
  setPSatField: val => dispatch(setPSatField(val)),
  setRgaFluidoField: val => dispatch(setRgaFluidoField(val)),
  setSalinidadField: val => dispatch(setSalinidadField(val)),
  setPvtRepresentativoField: val => dispatch(setPvtRepresentativoField(val)),
  setLitologiaField: val => dispatch(setLitologiaField(val)),
  setEspesorNetoField: val => dispatch(setEspesorNetoField(val)),
  setPorosidadField: val => dispatch(setPorosidadField(val)),
  setSwField: val => dispatch(setSwField(val)),
  setKPromedioField: val => dispatch(setKPromedioField(val)),
  setCaaField: val => dispatch(setCaaField(val)),
  setCgaField: val => dispatch(setCgaField(val)),
  setQoField: val => dispatch(setQoField(val)),
  setQgField: val => dispatch(setQgField(val)),
  setRgaField: val => dispatch(setRgaField(val)),
  setFwField: val => dispatch(setFwField(val)),
  setNpField: val => dispatch(setNpField(val)),
  setGpField: val => dispatch(setGpField(val)),
  setWpField: val => dispatch(setWpField(val)),
  setRraField: val => dispatch(setRraField(val)),
  setRrgField: val => dispatch(setRrgField(val)),
  setRrpceField: val => dispatch(setRrpceField(val)),
  setH2sField: val => dispatch(setH2sField(val)),
  setCo2Field: val => dispatch(setCo2Field(val)),
  setN2Field: val => dispatch(setN2Field(val)),
  setTipoDeFluidoField: val => dispatch(setTipoDeFluidoField(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(TecnicaDelCampo)
)
