import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setTipoDeAnalisis, setFechaDeMuestreo, setFechaDePrueba, setCompania, setPersonalDePemexQueSuperViso, setObervacionesLab } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class PruebasDeLaboratorioEstimulacion extends Component {
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
    let { setTipoDeAnalisis, setFechaDeMuestreo, setFechaDePrueba, setCompania, setPersonalDePemexQueSuperViso, formData } = this.props
    formData = formData.toJS()
    let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso } = formData

    return (
      <div className='generales-form' >
        <div className='header'>
          Datos Generales
        </div>
        <InputRowUnitless header="Tipo de Analisis" name='' value={tipoDeAnalisis} onChange={setTipoDeAnalisis}/>
        <InputRow header="Fecha de Muestreo" name='' unit="dd/mm/aa" value={fechaDeMuestreo} onChange={setFechaDeMuestreo}/>
        <InputRow header="Fecha de prueba" name='' unit="dd/mm/aa" value={fechaDePrueba} onChange={setFechaDePrueba}/>
        <InputRowUnitless header="Compania" name='' value={compania} onChange={setCompania}/>
        <InputRowUnitless header="Personal de Pemex que superviso" name='' value={personalDePemexQueSuperViso} onChange={setPersonalDePemexQueSuperViso}/>
      </div>
    )
  }


  render() {
    let { setObervacionesLab, formData } = this.props
    formData = formData.toJS()
    let { obervacionesLab } = formData

    return (
      <div className="form pruebas-de-laboratorio-estimulacion">
          { this.makeGeneralesForm() }
          <div style={{color: 'red'}}>TODO add table to add differant lab tests?</div>
          <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} value={obervacionesLab} onChange={setObervacionesLab}/>
          <div style={{color: 'red'}}>TODO add upload evidence of lab test</div>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorio'),
})

const mapDispatchToProps = dispatch => ({
  setTipoDeAnalisis: val => dispatch(setTipoDeAnalisis(val)),
  setFechaDeMuestreo: val => dispatch(setFechaDeMuestreo(val)),
  setFechaDePrueba: val => dispatch(setFechaDePrueba(val)),
  setCompania: val => dispatch(setCompania(val)),
  setPersonalDePemexQueSuperViso: val => dispatch(setPersonalDePemexQueSuperViso(val)),
  setObervacionesLab: val => dispatch(setObervacionesLab(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioEstimulacion)
