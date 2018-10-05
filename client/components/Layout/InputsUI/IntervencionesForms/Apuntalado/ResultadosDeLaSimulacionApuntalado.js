import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setHasErrorsResultadosSimulacionApuntalado, setEvidenceSimulationApuntaladoImgURL, setLongitudApuntalada,
 setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta,
  setEficienciaDeFluidoDeFractura, setChecked } from '../../../../../redux/actions/intervencionesApuntalado'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'

@autobind class ResultadosDeLaSimulacionApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
        longitudApuntalada: {
          type: 'number',
          value: '',
        },
        alturaTotalDeFractura: {
          type: 'number',
          value: '',
        },
        anchoPromedio: {
          type: 'number',
          value: '',
        },
        concentractionAreal: {
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
    let { setHasErrorsResultadosSimulacionApuntalado, hasErrors, hasSubmitted } = this.props

    if (hasSubmitted) {
      let hasErrors = this.checkAllInputs()
      setHasErrorsResultadosSimulacionApuntalado(hasErrors)
    }
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs()
    }
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors)
      }

      error === true ? hasErrors = true : null
    })

    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsResultadosSimulacionApuntalado } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsResultadosSimulacionApuntalado(hasErrorNew)
    }

    this.setState({ errors })
  }


  makeResultForm() {
    let { setLongitudApuntalada, setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData

    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud apuntalada" name='longitudApuntalada' unit="m" value={longitudApuntalada} onChange={setLongitudApuntalada}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Altura total de fractura" name='alturaTotalDeFractura' unit="m" value={alturaTotalDeFractura} onChange={setAlturaTotalDeFractura}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Ancho promedio" name='anchoPromedio' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Concentración areal" name='concentractionAreal' unit={<div>lb/pg<sup>2</sup></div>} value={concentractionAreal} onChange={setConcentractionAreal}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Conductividad" name='conductividad' unit="mD*ft" value={conductividad} onChange={setConductividad}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="FCD" name='fcd' unit="adim." value={fcd} onChange={setFcd}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión neta" name='presionNeta' unit="psi" value={presionNeta} onChange={setPresionNeta}  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Eficiencia de fluido  de fractura" name='eficienciaDeFluidoDeFractura' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura}  errors={this.state.errors} onBlur={this.updateErrors}/>
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
    let { formData, setEvidenceSimulationApuntaladoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar evidencia de simulacion
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationApuntaladoImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  render() {

    return (
      <div className="form resultados-de-simulacion-apuntalado">
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
  formData: state.get('resultadosSimulacionApuntalado'),
  hasErrors: state.getIn(['resultadosSimulacionApuntalado', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setLongitudApuntalada: val => dispatch(setLongitudApuntalada(val)),
  setAlturaTotalDeFractura: val => dispatch(setAlturaTotalDeFractura(val)),
  setAnchoPromedio: val => dispatch(setAnchoPromedio(val)),
  setConcentractionAreal: val => dispatch(setConcentractionAreal(val)),
  setConductividad: val => dispatch(setConductividad(val)),
  setFcd: val => dispatch(setFcd(val)),
  setPresionNeta: val => dispatch(setPresionNeta(val)),
  setEficienciaDeFluidoDeFractura: val => dispatch(setEficienciaDeFluidoDeFractura(val)),
  setEvidenceSimulationApuntaladoImgURL: val => dispatch(setEvidenceSimulationApuntaladoImgURL(val)),
  setHasErrorsResultadosSimulacionApuntalado: val => dispatch(setHasErrorsResultadosSimulacionApuntalado(val)),

})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionApuntalado)