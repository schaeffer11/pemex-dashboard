import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { connect } from 'react-redux'
import { setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, setPInicialAnoField, setPActualFechaField, setDpPerAnoField, setTyacField, setPrField, setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, setLitologiaField, setEspesorNetoField, setPorosidadField, setSwField, setKPromedioField, setCaaField, setCgaField, setQoField, setQgField, setRgaField, setFwField, setNpField, setGpField, setWpField, setRraField, setRrgField, setRrpceField, setH2sField, setCo2Field, setN2Field } from '../../../../redux/actions/fichaTecnicaDelCampo'
@autobind class TecnicaDelCampo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeGeneralesForm() {
    let { setDescubrimientoField, setFechaDeExplotacionField, setNumeroDePozosOperandoField, formData } = this.props
    formData = formData.toJS()
    let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField } = formData
    

    return (
      <div className='generales-form' >
        <div className='header'>
          Generales
        </div>
        <InputRowUnitless header="Descubrimiento" name='descubrimiento' value={descubrimientoField} onChange={setDescubrimientoField}/>
        <InputRowUnitless header="Fecha de Explotacion" name='fechaDeExplotacion' value={fechaDeExplotacionField} onChange={setFechaDeExplotacionField}/>
        <InputRowUnitless header="No. de Pozo Operando" name='noDePozoOperando' value={numeroDePozosOperandoField} onChange={setNumeroDePozosOperandoField}/>
      </div>
    )
  }

  makeExplotacionForm() {
    let { setPInicialAnoField, setPActualFechaField,setDpPerAnoField, setTyacField, setPrField, formData } = this.props
    formData = formData.toJS()
    let { pInicialAnoField, pActualFechaField,dpPerAnoField, tyacField, prField } = formData

    return (
      <div className='explotacion-form' >
        <div className='header'>
          Explotacion
        </div>
        <InputRow header="P. Inicial (ANO)" name='pInicialAno' value={pInicialAnoField} onChange={setPInicialAnoField} unit='Kg/cm2' />
        <InputRow header="P. Actual (FECHA)" name='pActualFecha' value={pActualFechaField} onChange={setPActualFechaField} unit='Kg/cm2' />
        <InputRow header="DP/ano" name='dpPerAno' value={dpPerAnoField} onChange={setDpPerAnoField} unit='Kg/cm2/ano' />
        <InputRow header="T yac" name='tyac' value={tyacField} onChange={setTyacField} unit='°C' />
        <InputRow header="P.R." name='pr' value={prField} onChange={setPrField} unit='mvbnm' />

      </div>
    )
  }

  makeFluidoForm() {
    let { setDensidadDelAceiteField, setPSatField, setRgaFluidoField, setSalinidadField, setPvtRepresentativoField, formData } = this.props
    formData = formData.toJS()
    let { densidadDelAceiteField, pSatField, rgaFluidoField, salinidadField, pvtRepresentativoField } = formData

    return (
      <div className='fluido-form' >
        <div className='header'>
          Fluido
        </div>
        <InputRow header="Densidad del aceite" name='densidadDelAceite' value={densidadDelAceiteField} onChange={setDensidadDelAceiteField} unit='°API' />
        <InputRow header="P sat" name='pSat' value={pSatField} onChange={setPSatField} unit='Kg/cm2' />
        <InputRow header="RGA" name='rga' value={rgaFluidoField} onChange={setRgaFluidoField} unit='m3/m3' />
        <InputRow header="Salinidad" name='salinidad' value={salinidadField} onChange={setSalinidadField} unit='ppm' />
        <InputRowUnitless header="PVT representativo" name='pvtRepresentativo' value={pvtRepresentativoField} onChange={setPvtRepresentativoField}  />
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
          Formacion
        </div>
        <InputRowUnitless header="Litologia" name='litologia' value={litologiaField} onChange={setLitologiaField} />
        <InputRow header="Espesor Neto" name='espesorNeto'value={espesorNetoField} onChange={setEspesorNetoField} unit='m' />
        <InputRow header="Porosidad" name='porosidad' value={porosidadField} onChange={setPorosidadField} unit='m' />
        <InputRow header="Sw" name='Sw' value={swField} onChange={setSwField} unit='%' />
        <InputRow header="K promedio" name='kPromedio' value={kPromedioField} onChange={setKPromedioField} unit='mD' />
        <InputRow header="CAA" name='caa' value={caaField} onChange={setCaaField} unit='m' />
        <InputRow header="CGA" name='cga' value={cgaField} onChange={setCgaField} unit='m' />
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
          Produccion @ Formacion
        </div>
        <InputRow header="Qo" name='qo' value={qoField} onChange={setQoField} unit='bpd' />
        <InputRow header="Qg" name='qg' value={qgField} onChange={setQgField} unit='bpd' />
        <InputRow header="RGA" name='rgaProd' value={rgaField} onChange={setRgaField} unit='m3/m3' />
        <InputRow header="Fw" name='fw' value={fwField} onChange={setFwField} unit='%' />
        <InputRow header="Np" name='np' value={npField} onChange={setNpField} unit='MMb' />
        <InputRow header="Gp" name='gp' value={gpField} onChange={setGpField} unit='MMMpc' />
        <InputRow header="Wp" name='wp' value={wpField} onChange={setWpField} unit='MMb' />
        <InputRow header="RRA" name='rra' value={rraField} onChange={setRraField} unit='MMb' />
        <InputRow header="RRG" name='rrg' value={rrgField} onChange={setRrgField} unit='MMMpc' />
        <InputRow header="RRPCE" name='rrpce' value={rrpceField} onChange={setRrpceField} unit='MMb' />
        <InputRow header="H2S" name='h2s' value={h2sField} onChange={setH2sField} unit='%' />
        <InputRow header="CO2" name='co2' value={co2Field} onChange={setCo2Field} unit='%' />
        <InputRow header="N2" name='n2' value={n2Field} onChange={setN2Field} unit='%' />
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

const mapStateToProps = state => ({
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
})

export default connect(mapStateToProps, mapDispatchToProps)(TecnicaDelCampo)
