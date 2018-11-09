import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setHasErrorsResultadosSimulacionAcido, setEvidenceSimulationAcidoImgURL, setLongitudTotal, 
  setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, 
  setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, setChecked } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'
@autobind class ResultadosDeLaSimulacionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        longitudTotal: {
          type: 'number',
          value: '',
        },
        longitudEfectivaGrabada: {
          type: 'number',
          value: '',
        },
        alturaGrabada: {
          type: 'number',
          value: '',
        },
        anchoPromedio: {
          type: 'number',
          value: '',
        },
        concentracionDelAcido: {
          type: 'number',
          value: '',
        },
        conductividad: {
          type: 'number',
          value: '',
        },
        fcd: {
          type: 'number',
          value: '',
        },
        presionNeta: {
          type: 'number',
          value: '',
        },
        eficienciaDeFluidoDeFractura: {
          type: 'number',
          value: '',
        },
      }
    }
  }

  componentDidMount(){
    let { setHasErrorsResultadosSimulacionAcido, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsResultadosSimulacionAcido(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, showErrors)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, showErrors)
      }

      error === true ? hasErrors = true : null
    })

    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsResultadosSimulacionAcido } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsResultadosSimulacionAcido(hasErrorNew)
    }

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

    setURL(localImgUrl, 'resultadosSimulacionAcido')
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
  formData: state.get('resultadosSimulacionAcido'),
  hasErrors: state.getIn(['resultadosSimulacionAcido', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
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
  setEvidenceSimulationAcidoImgURL: (url, name) => dispatch(setEvidenceSimulationAcidoImgURL(url, name)),
  setHasErrorsResultadosSimulacionAcido: val => dispatch(setHasErrorsResultadosSimulacionAcido(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionAcido)


