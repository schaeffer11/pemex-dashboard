import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setHasErrorsEstIncProduccionAcido, setEstIncProdAcidoImgURL, setEstIncEstrangulador, 
  setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, 
  setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, 
  setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, setObervacionesEstIncAcido } from '../../../../../redux/actions/intervencionesAcido'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'

@autobind class EstimacionIncProduccionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
          estIncEstrangulador: {
            type: 'number',
            values: '',
          },
          estIncPtp: {
            type: 'number',
            values: '',
          },
          estIncTtp: {
            type: 'number',
            values: '',
          },
          estIncPbaj: {
            type: 'number',
            values: '',
          },
          estIncTbaj: {
            type: 'number',
            values: '',
          },
          estIncPtr: {
            type: 'number',
            values: '',
          },
          estIncQl: {
            type: 'number',
            values: '',
          },
          estIncQo: {
            type: 'number',
            values: '',
          },
          estIncQg: {
            type: 'number',
            values: '',
          },
          estIncQw: {
            type: 'number',
            values: '',
          },
          estIncRGA: {
            type: 'number',
            values: '',
          },
          estIncSalinidad: {
            type: 'number',
            values: '',
          },
          estIncIP: {
            type: 'number',
            values: '',
          },
          estIncDeltaP: {
            type: 'number',
            values: '',
          },
          estIncGastoCompromisoQo: {
            type: 'number',
            values: '',
          },
          estIncGastoCompromisoQg: {
            type: 'number',
            values: '',
          },
          obervacionesEstIncAcido: {
            type: 'text',
            values: '',
          },
        }
    }
  }

  componentDidMount(){
    let { setHasErrorsEstIncProduccionAcido, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsEstIncProduccionAcido(hasErrors)

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
    let { hasErrors, setHasErrorsEstIncProduccionAcido } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsEstIncProduccionAcido(hasErrorNew)
    }

    this.setState({ errors })
  }


  makeModeladoForm() {
    let { setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, formData } = this.props
    formData = formData.toJS()
    let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP } = formData

    return (
      <div className='modelado-form' >
        <div className='header'>
          Modelado (análisis nodal)
        </div>
        <div className="input-table">
            <InputRow header="Estrangulador" name='estIncEstrangulador' unit="pg" value={estIncEstrangulador} onChange={setEstIncEstrangulador} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>P<sub>TP</sub></div>} name='estIncPtp' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPtp} onChange={setEstIncPtp} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>T<sub>TP</sub></div>} name='estIncTtp' unit="°C" value={estIncTtp} onChange={setEstIncTtp} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>P<sub>baj</sub></div>} name='estIncPbaj' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPbaj} onChange={setEstIncPbaj} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>T<sub>baj</sub></div>} name='estIncTbaj' unit="°C" value={estIncTbaj} onChange={setEstIncTbaj} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>P<sub>TR</sub></div>} name='estIncPtr' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPtr} onChange={setEstIncPtr} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>Q<sub>gi</sub></div>} name='estIncQl' unit="bpd" value={estIncQl} onChange={setEstIncQl} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>Q<sub>o</sub></div>} name='estIncQo' unit="bpd" value={estIncQo} onChange={setEstIncQo} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>Q<sub>g</sub></div>} name='estIncQg' unit="MMpcd" value={estIncQg} onChange={setEstIncQg} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header={<div>Q<sub>w</sub></div>} name='estIncQw' unit="bpd" value={estIncQw} onChange={setEstIncQw} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header="RGA" name='estIncRGA' unit={<div>m<sup>3</sup>/m<sup>3</sup></div>} value={estIncRGA} onChange={setEstIncRGA} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header="Salinidad" name='estIncSalinidad' unit="ppm" value={estIncSalinidad} onChange={setEstIncSalinidad} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header="IP estimado" name='estIncIP' unit="bpd/psi" value={estIncIP} onChange={setEstIncIP} errors={this.state.errors} onBlur={this.updateErrors}/>
            <InputRow header="ΔP" name='estIncDeltaP' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncDeltaP} onChange={setEstIncDeltaP} errors={this.state.errors} onBlur={this.updateErrors}/>
        </div>
      </div>
    )
  }

  makeGastoCompromisoForm() {
    let { setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, formData } = this.props
    formData = formData.toJS()
    let { estIncGastoCompromisoQo, estIncGastoCompromisoQg } = formData
    
    return (
      <div className='gasto-compromiso-form' >
        <div className='header'>
          Gasto Compromiso
        </div>
        <InputRow header={<div>Q<sub>o</sub></div>} name='estIncGastoCompromisoQo' unit="bpd" value={estIncGastoCompromisoQo} onChange={setEstIncGastoCompromisoQo} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header={<div>Q<sub>g</sub></div>} name='estIncGastoCompromisoQg' unit="MMpcd" value={estIncGastoCompromisoQg} onChange={setEstIncGastoCompromisoQg} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  makeObservacionesForm() {
    let { setObervacionesEstIncAcido, formData } = this.props
    formData = formData.toJS()
    let { obervacionesEstIncAcido} = formData
    
    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <TextAreaUnitless header="Observaciones" name='obervacionesEstIncAcido' className={'obervaciones'} value={obervacionesEstIncAcido} onChange={setObervacionesEstIncAcido} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl, 'estIncProduccionAcido')
  }

  makeImageInput() {
    let { formData, setEstIncProdAcidoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar estimación del incremento de producción
        </div>
        <input className="filestyle" data-classButton="btn btn-primary" type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdAcidoImgURL)}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  render() {

    return (
      <div className="form estimacion-inc-produccion-estimulacion-acido">
          <div className='left'>
            { this.makeModeladoForm() }
          </div>
          <div className='right'>
            { this.makeGastoCompromisoForm() }
            { this.makeObservacionesForm() }
            { this.makeImageInput() }
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('estIncProduccionAcido'),
  hasErrors: state.getIn(['estIncProduccionAcido', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setEstIncEstrangulador: val => dispatch(setEstIncEstrangulador(val)),
  setEstIncPtp: val => dispatch(setEstIncPtp(val)),
  setEstIncTtp: val => dispatch(setEstIncTtp(val)),
  setEstIncPbaj: val => dispatch(setEstIncPbaj(val)),
  setEstIncTbaj: val => dispatch(setEstIncTbaj(val)),
  setEstIncPtr: val => dispatch(setEstIncPtr(val)),
  setEstIncQl: val => dispatch(setEstIncQl(val)),
  setEstIncQo: val => dispatch(setEstIncQo(val)),
  setEstIncQg: val => dispatch(setEstIncQg(val)),
  setEstIncQw: val => dispatch(setEstIncQw(val)),
  setEstIncRGA: val => dispatch(setEstIncRGA(val)),
  setEstIncSalinidad: val => dispatch(setEstIncSalinidad(val)),
  setEstIncIP: val => dispatch(setEstIncIP(val)),
  setEstIncDeltaP: val => dispatch(setEstIncDeltaP(val)),
  setEstIncGastoCompromisoQo: val => dispatch(setEstIncGastoCompromisoQo(val)),
  setEstIncGastoCompromisoQg: val => dispatch(setEstIncGastoCompromisoQg(val)),
  setObervacionesEstIncAcido: val => dispatch(setObervacionesEstIncAcido(val)),
  setEstIncProdAcidoImgURL: (url, name) => dispatch(setEstIncProdAcidoImgURL(url, name)),
  setHasErrorsEstIncProduccionAcido: val => dispatch(setHasErrorsEstIncProduccionAcido(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionIncProduccionAcido)
