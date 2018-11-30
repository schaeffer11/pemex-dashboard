import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import { InputRow, TextAreaUnitless } from '../../../Common/InputRow'
import { setGeneralEstProduccionTermico, setEstIncProdTermicoImgURL } from './../../../../../redux/actions/intervencionesTermica'
import { connect } from 'react-redux'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'

@autobind class EstimacionIncProduccionTermico extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
          estIncEstrangulador: {
            type: 'number',
            value: '',
          },
          estIncPtp: {
            type: 'number',
            value: '',
          },
          estIncTtp: {
            type: 'number',
            value: '',
          },
          estIncPbaj: {
            type: 'number',
            value: '',
          },
          estIncTbaj: {
            type: 'number',
            value: '',
          },
          estIncPtr: {
            type: 'number',
            value: '',
          },
          estIncQl: {
            type: 'number',
            value: '',
          },
          estIncQo: {
            type: 'number',
            value: '',
          },
          estIncQg: {
            type: 'number',
            value: '',
          },
          estIncQw: {
            type: 'number',
            value: '',
          },
          estIncRGA: {
            type: 'number',
            value: '',
          },
          estIncSalinidad: {
            type: 'number',
            value: '',
          },
          estIncIP: {
            type: 'number',
            value: '',
          },
          estIncDeltaP: {
            type: 'number',
            value: '',
          },
          estIncGastoCompromisoQo: {
            type: 'number',
            value: '',
          },
          estIncGastoCompromisoQg: {
            type: 'number',
            value: '',
          },
          observacionesEstIncTermico: {
            type: 'text',
            value: '',
          },
        }
    }
  }

 componentDidMount(){
    let { setGeneral, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setGeneral('hasErrors', hasErrors)
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
    let { hasErrors, setGeneral } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      }
    })
    if (hasErrorNew != hasErrors) {
      setGeneral('hasErrors', hasErrorNew)
    }
    this.setState({ errors })
  }



  makeModeladoForm() {
    let { setGeneral, formData } = this.props
    formData = formData.toJS()
    let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP } = formData
  
    return (
      <div className='modelado-form' >
        <div className='header'>
          Modelado (análisis nodal)
        </div>
        <div className='input-table'>
            <InputRow 
              header="Estrangulador" 
              name='estIncEstrangulador'
              unit="pg"
              value={estIncEstrangulador}
              onChange={e => setGeneral('estIncEstrangulador', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>P<sub>TP</sub></div>}
              name='estIncPtp'
              unit={<div>Kg/cm<sup>2</sup></div>}
              value={estIncPtp}
              onChange={e => setGeneral('estIncPtp', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>T<sub>TP</sub></div>}
              name='estIncTtp'
              unit="°C"
              value={estIncTtp}
              onChange={e => setGeneral('estIncTtp', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>P<sub>baj</sub></div>}
              name='estIncPbaj'
              unit={<div>Kg/cm<sup>2</sup></div>}
              value={estIncPbaj}
              onChange={e => setGeneral('estIncPbaj', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>T<sub>baj</sub></div>}
              name='estIncTbaj'
              unit="°C"
              value={estIncTbaj}
              onChange={e => setGeneral('estIncTbaj', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>P<sub>TR</sub></div>}
              name='estIncPtr'
              unit={<div>Kg/cm<sup>2</sup></div>}
              value={estIncPtr}
              onChange={e => setGeneral('estIncPtr', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>Q<sub>l</sub></div>}
              name='estIncQl'
              unit="bpd"
              value={estIncQl}
              onChange={e => setGeneral('estIncQl', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>Q<sub>o</sub></div>}
              name='estIncQo'
              unit="bpd"
              value={estIncQo}
              onChange={e => setGeneral('estIncQo', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>Q<sub>g</sub></div>}
              name='estIncQg'
              unit="MMpcd"
              value={estIncQg}
              onChange={e => setGeneral('estIncQg', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>Q<sub>w</sub></div>}
              name='estIncQw'
              unit="bpd"
              value={estIncQw}
              onChange={e => setGeneral('estIncQw', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header="RGA"
              name='estIncRGA'
              unit={<div>m<sup>3</sup>/m<sup>3</sup></div>}
              value={estIncRGA}
              onChange={e => setGeneral('estIncRGA', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header="Salinidad"
              name='estIncSalinidad'
              unit="ppm"
              value={estIncSalinidad}
              onChange={e => setGeneral('estIncSalinidad', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header="IP estimado"
              name='estIncIP'
              unit="bpd/psi"
              value={estIncIP}
              onChange={e => setGeneral('estIncIP', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header="ΔP"
              name='estIncDeltaP'
              unit={<div>Kg/cm<sup>2</sup></div>}
              value={estIncDeltaP}
              onChange={e => setGeneral('estIncDeltaP', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
        </div>
      </div>
    )
  }

  makeGastoCompromisoForm() {
    let { setGeneral, formData } = this.props
    formData = formData.toJS()
    let { estIncGastoCompromisoQo, estIncGastoCompromisoQg } = formData

    return (
      <div className='gasto-compromiso-form' >
        <div className='header'>
          Gasto Compromiso
        </div>
        <div className='input-table'>
            <InputRow
              header={<div>Q<sub>o</sub></div>}
              name='estIncGastoCompromisoQo'
              unit="bpd"
              value={estIncGastoCompromisoQo}
              onChange={e => setGeneral('estIncGastoCompromisoQo', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
            <InputRow
              header={<div>Q<sub>g</sub></div>}
              name='estIncGastoCompromisoQg'
              unit="MMpcd"
              value={estIncGastoCompromisoQg}
              onChange={e => setGeneral('estIncGastoCompromisoQg', e)}
              errors={this.state.errors}
              onBlur={this.updateErrors}
            />
        </div>
      </div>
    )
  }

  makeObservacionesForm() {
    let { setGeneral, formData } = this.props
    formData = formData.toJS()
    let { observacionesEstIncTermico } = formData 

    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <div className='input-table'>
         <TextAreaUnitless header="Observaciones" name='observacionesEstIncTermico' className={'obervaciones'} value={observacionesEstIncTermico} onChange={e => setGeneral('observacionesEstIncTermico', e)} errors={this.state.errors} onBlur={this.updateErrors}/>
        </div>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl, 'estIncProduccionTermico')
  }

  makeImageInput() {
    let { formData, setEstIncProdTermicoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar estimación del incremento de producción
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdTermicoImgURL)}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }
  
  render() {

    return (
      <div className="form estimacion-inc-produccion-estimulacion">
          <div className='left'>
            { this.makeModeladoForm() }
          </div>
          <div className='right'>
            <div className='image'/>
            { this.makeGastoCompromisoForm() }
            { this.makeObservacionesForm() }
            { this.makeImageInput() }
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('estIncProduccionTermico'),
  hasErrors: state.getIn(['estIncProduccionTermico', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (loc, val) => dispatch(setGeneralEstProduccionTermico(loc, val)),
  setEstIncProdTermicoImgURL: (url, name) => dispatch(setEstIncProdTermicoImgURL(url, name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionIncProduccionTermico)
