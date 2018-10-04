import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import moment from 'moment'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { setTipoDeFluidoField, setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, setPInicialField, setPActualField, setPInicialAnoField, setPActualFechaField, setDpPerAnoField, setTyacField, setPrField, setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, setLitologiaField, setEspesorNetoField, setPorosidadField, setSwField, setKPromedioField, setCaaField, setCgaField, setQoField, setQgField, setRgaField, setFwField, setNpField, setGpField, setWpField, setRraField, setRrgField, setRrpceField, setH2sField, setCo2Field, setN2Field, setChecked } from '../../../../redux/actions/pozo'

let fluidoOptions = [
    { label: 'Aceite Negro', value: 'Aceite Negro' },
    { label: 'Aceite Ligero', value: 'Aceite Ligero' },
    { label: 'Gas y Condensado', value: 'Gas y Condensado' },
    { label: 'Gas Húmedo', value: 'Gas Humedo' },
    { label: 'Gas Seco', value: 'Gas Seco' },
]
 
let litologiaOptions = [
    { label: 'Arenas', value: 'Arenas' },
    { label: 'Carbonatos', value: 'Carbonatos'}
]

@autobind class TecnicaDelCampo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {
        descubrimientoField: {
          type: 'text',
          value: null,
        },
        fechaDeExplotacionField: {
          type: 'date',
          value: null,
        },
        numeroDePozosOperandoField: {
          type: 'text',
          value: null,
        },
        tipoDeFluidoField: {
          type: 'text',
          value: null,
        },
      },
    }
  }

  componentDidMount() {
    this.checkAllInputs()
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text') {
        checkEmpty(formData[elem], elem, errors, this.updateErrors)
      } else if (errObj.type === 'date') {
        checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.updateErrors)
      }
    })
  }

  componentDidUpdate(){

  }

  updateErrors(errors) {
    this.setState({ errors })
    // this.setState({ error: })
  }


  makeGeneralesForm() {
    let { setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, formData } = this.props

    formData = formData.toJS()

    let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField } = formData

    return (
      <div className='generales-form'>
        <div className='header'>
          Generales
        </div>
        <InputRowUnitless header="Descubrimiento" name='descubrimientoField' value={descubrimientoField} onChange={setDescubrimientoField} onBlur={this.updateErrors} errors={this.state.errors}/>
        <InputDate header="Fecha de explotación" name='fechaDeExplotacionField' value={fechaDeExplotacionField} onChange={setFechaDeExplotacionField} onBlur={this.updateErrors} errors={this.state.errors}/>
        <InputRowUnitless header="No. de pozos operando" name='numeroDePozosOperandoField' value={numeroDePozosOperandoField} onChange={setNumeroDePozosOperandoField} onBlur={this.updateErrors} errors={this.state.errors}/>
      </div>
    )
  }

  makeExplotacionForm() {
    let { setPInicialAnoField, setPActualFechaField, setPInicialField, setPActualField, setDpPerAnoField, setTyacField, setPrField, formData } = this.props

    formData = formData.toJS()

    let { pInicialField, pActualField, pInicialAnoField, pActualFechaField, dpPerAnoField, tyacField, prField } = formData

    return (
      <div className='explotacion-form' >
        <div className='header'>
          Explotación
        </div>
        <InputRow header="P. inicial" name='pInicialField' value={pInicialField} onChange={setPInicialField} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRowUnitless header="P. inicial (año)" name='pInicialAnoField' value={pInicialAnoField} onChange={setPInicialAnoField} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P. actual" name='pActualField' value={pActualField} onChange={setPActualField} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputDate header="P. actual (fecha)" name='pActualFechaField' value={pActualFechaField} onChange={setPActualFechaField} unit='' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="DP/año" name='dpPerAnoField' value={dpPerAnoField} onChange={setDpPerAnoField} unit={<div>Kg/cm<sup>2</sup>/año</div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="T yac" name='tyacField' value={tyacField} onChange={setTyacField} unit='°C' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P.R." name='prField' value={prField} onChange={setPrField} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />

      </div>
    )
  }

  makeFluidoForm() {
    let { setTipoDeFluidoField, setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, formData } = this.props

    formData = formData.toJS()

    let { tipoDeFluidoField, densidadDelAceiteField, pSatField, rgaFluidoField, salinidadField, pvtRepresentativoField } = formData

    return (
      <div className='fluido-form' >
        <div className='header'>
          Fluido
        </div>
        <InputRowSelectUnitless header='Tipo de Fluido' name='tipoDeFluidoField' value={tipoDeFluidoField} callback={(e) => setTipoDeFluidoField(e.value)} options={fluidoOptions} onBlur={this.updateErrors} errors={this.state.errors}/>
        <InputRow header="Densidad del aceite" name='densidadDelAceiteField' value={densidadDelAceiteField} onChange={setDensidadDelAceiteField} unit='°API' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="P sat" name='pSatField' value={pSatField} onChange={setPSatField} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RGA" name='rgaFluidoField' value={rgaFluidoField} onChange={setRgaFluidoField} unit={<div>m<sup>3</sup>/m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Salinidad" name='salinidadField' value={salinidadField} onChange={setSalinidadField} unit='ppm' onBlur={this.validate} errors={this.state.errors} />
        <InputRowUnitless header="PVT representativo" name='pvtRepresentativoField' value={pvtRepresentativoField} onChange={setPvtRepresentativoField} onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makeFormacionForm() {
    let { setLitologiaField, setEspesorNetoField, setPorosidadField, setSwField, setKPromedioField, setCaaField, setCgaField, formData } = this.props
    formData = formData.toJS()
    let { litologiaField, espesorNetoField, porosidadField, swField, kPromedioField, caaField, cgaField } = formData


    return (
      <div className='formacion-form' >
        <div className='header'>
          Formación
        </div>
        <InputRowSelectUnitless header='Litología' name='litologiaField' value={litologiaField} callback={(e) => setLitologiaField(e.value)} options={litologiaOptions} onBlur={this.validate} errors={this.state.errors}/>
        <InputRow header="Espesor neto" name='espesorNetoField'value={espesorNetoField} onChange={setEspesorNetoField} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Porosidad" name='porosidadField' value={porosidadField} onChange={setPorosidadField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Sw" name='swField' value={swField} onChange={setSwField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="K promedio" name='kPromedioField' value={kPromedioField} onChange={setKPromedioField} unit='mD' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CAA" name='caaField' value={caaField} onChange={setCaaField} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CGA" name='cgaField' value={cgaField} onChange={setCgaField} unit='m' onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makeProduccionForm() {
    let { setQoField, setQgField, setRgaField, setFwField, setNpField, setGpField, setWpField, setRraField, setRrgField, setRrpceField, setH2sField, setCo2Field, setN2Field, formData } = this.props
    formData = formData.toJS()
    let { qoField, qgField, rgaField, fwField, npField, gpField, wpField, rraField, rrgField, rrpceField, h2sField, co2Field, n2Field } = formData


    return (
      <div className='produccion-form' >
        <div className='header'>
          Producción @ Formación
        </div>
        <InputRow header="Qo" name='qoField' value={qoField} onChange={setQoField} unit='bpd' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Qg" name='qgField' value={qgField} onChange={setQgField} unit='MMpcd' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RGA" name='rgaField' value={rgaField} onChange={setRgaField} unit={<div>m<sup>3</sup>/m<sup>3</sup></div>} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Fw" name='fwField' value={fwField} onChange={setFwField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Np" name='npField' value={npField} onChange={setNpField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Gp" name='gpField' value={gpField} onChange={setGpField} unit='MMMpc' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Wp" name='wpField' value={wpField} onChange={setWpField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRA" name='rraField' value={rraField} onChange={setRraField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRG" name='rrgField' value={rrgField} onChange={setRrgField} unit='MMMpc' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="RRPCE" name='rrpceField' value={rrpceField} onChange={setRrpceField} unit='MMb' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header={<div>H<sub>2</sub>S</div>} name='h2sField' value={h2sField} onChange={setH2sField} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header={<div>CO<sub>2</sub></div>} name='co2Field' value={co2Field} onChange={setCo2Field} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header={<div>N<sub>2</sub></div>} name='n2Field' value={n2Field} onChange={setN2Field} unit='%' onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  render() {
    let { errors } = this.state

    console.log(errors.fechaDeExplotacionField)

    return (
      <div className="form tecnica-del-campo">
        <div className="image"/>
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

const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelCampo'),
})

const mapDispatchToProps = dispatch => ({
  setDescubrimientoField: val => dispatch(setDescubrimientoField(val)),
  setFechaDeExplotacionField: val => dispatch(setFechaDeExplotacionField(val)),
  setNumeroDePozosOperandoField: val => dispatch(setNumeroDePozosOperandoField(val)),
  setPInicialAnoField: val => dispatch(setPInicialAnoField(val)),
  setPActualFechaField: val => dispatch(setPActualFechaField(val)),
  setPInicialField: val => dispatch(setPInicialField(val)),
  setPActualField: val => dispatch(setPActualField(val)),
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
  setChecked: val => dispatch(setChecked(val, 'fichaTecnicaDelCampo'))
})

export default connect(mapStateToProps, mapDispatchToProps)(TecnicaDelCampo)

