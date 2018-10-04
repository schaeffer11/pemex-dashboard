import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEvidenceSimulationAcidoImgURL, setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, setChecked } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'
@autobind class ResultadosDeLaSimulacionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        longitudTotal: {
          type: 'number',
          value: null,
        },
        longitudEfectivaGrabada: {
          type: 'number',
          value: null,
        },
        alturaGrabada: {
          type: 'number',
          value: null,
        },
        anchoPromedio: {
          type: 'number',
          value: null,
        },
        concentracionDelAcido: {
          type: 'number',
          value: null,
        },
        conductividad: {
          type: 'number',
          value: null,
        },
        fcd: {
          type: 'number',
          value: null,
        },
        presionNeta: {
          type: 'number',
          value: null,
        },
        eficienciaDeFluidoDeFractura: {
          type: 'number',
          value: null,
        },
      }
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

  makeResultForm() {
    let { setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud total" name='longitudTotal' unit="m" value={longitudTotal} onChange={setLongitudTotal} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Longitud efectiva grabada" name='longitudEfectivaGrabada' unit="m" value={longitudEfectivaGrabada} onChange={setLongitudEfectivaGrabada} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Altura grabada" name='alturaGrabada' unit="m" value={alturaGrabada} onChange={setAlturaGrabada} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Ancho promedio" name='anchoPromedio' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Concentración del ácido" name='concentracionDelAcido' unit={<div>lb/pg<sup>2</sup></div>} value={concentracionDelAcido} onChange={setConcentracionDelAcido} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Conductividad" name='conductividad' unit="mD*ft" value={conductividad} onChange={setConductividad} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="FCD" name='fcd' unit="adim." value={fcd} onChange={setFcd} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión neta" name='presionNeta' unit="psi" value={presionNeta} onChange={setPresionNeta} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Eficiencia de fluido de fractura" name='eficienciaDeFluidoDeFractura' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    let { files } = e.target

    console.log(files)

    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeEvidenceSimulationInput() {
    let { formData, setEvidenceSimulationAcidoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar evidencia de simulacion
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationAcidoImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }



  render() {

    return (
      <div className="form resultados-de-simulacion-acido">
        <div className='image' />
        <div className='left'>
          { this.makeResultForm() }
        </div>
        <div className='right'>
          { this.makeEvidenceSimulationInput() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('resultadosSimulacionAcido'),
})

const mapDispatchToProps = dispatch => ({
  setLongitudTotal: val => dispatch(setLongitudTotal(val)),
  setLongitudEfectivaGrabada: val => dispatch(setLongitudEfectivaGrabada(val)),
  setAlturaGrabada: val => dispatch(setAlturaGrabada(val)),
  setAnchoPromedio: val => dispatch(setAnchoPromedio(val)),
  setConcentracionDelAcido: val => dispatch(setConcentracionDelAcido(val)),
  setConductividad: val => dispatch(setConductividad(val)),
  setFcd: val => dispatch(setFcd(val)),
  setPresionNeta: val => dispatch(setPresionNeta(val)),
  setEficienciaDeFluidoDeFractura: val => dispatch(setEficienciaDeFluidoDeFractura(val)),
  setEvidenceSimulationAcidoImgURL: val => dispatch(setEvidenceSimulationAcidoImgURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionAcido)


