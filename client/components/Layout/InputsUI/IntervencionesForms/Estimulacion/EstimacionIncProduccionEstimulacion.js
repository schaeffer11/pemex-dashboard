import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstIncProdEstimulationImgURL, setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, setObervacionesEstIncEstim } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class EstimacionIncProduccionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 

    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

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
        <InputRow header="Estrangulador" name='estIncEstrangulador' unit="pg" value={estIncEstrangulador} onChange={setEstIncEstrangulador} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>P<sub>TP</sub></div>} name='estIncPtp' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPtp} onChange={setEstIncPtp} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>T<sub>TP</sub></div>} name='estIncTtp' unit="°C" value={estIncTtp} onChange={setEstIncTtp} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>P<sub>baj</sub></div>} name='estIncPbaj' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPbaj} onChange={setEstIncPbaj} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>T<sub>baj</sub></div>} name='estIncTbaj' unit="°C" value={estIncTbaj} onChange={setEstIncTbaj} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>P<sub>TR</sub></div>} name='estIncPtr' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncPtr} onChange={setEstIncPtr} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>Q<sub>l</sub></div>} name='estIncQl' unit="bpd" value={estIncQl} onChange={setEstIncQl} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>Q<sub>o</sub></div>} name='estIncQo' unit="bpd" value={estIncQo} onChange={setEstIncQo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>Q<sub>g</sub></div>} name='estIncQg' unit="MMpcd" value={estIncQg} onChange={setEstIncQg} errors={this.state.errors} onBlur={this.validate}/> 
        <InputRow header={<div>Q<sub>w</sub></div>} name='estIncQw' unit="bpd" value={estIncQw} onChange={setEstIncQw} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="RGA" name='estIncRGA' unit={<div>m<sup>3</sup>/m<sup>3</sup></div>} value={estIncRGA} onChange={setEstIncRGA} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Salinidad" name='estIncSalinidad' unit="ppm" value={estIncSalinidad} onChange={setEstIncSalinidad} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="IP estimado" name='estIncIP' unit="bpd/psi" value={estIncIP} onChange={setEstIncIP} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="ΔP" name='estIncDeltaP' unit={<div>Kg/cm<sup>2</sup></div>} value={estIncDeltaP} onChange={setEstIncDeltaP} errors={this.state.errors} onBlur={this.validate}/>

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
        <InputRow header={<div>Q<sub>o</sub></div>} name='estIncGastoCompromisoQo' unit="bpd" value={estIncGastoCompromisoQo} onChange={setEstIncGastoCompromisoQo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header={<div>Q<sub>g</sub></div>} name='estIncGastoCompromisoQg' unit="MMpcd" value={estIncGastoCompromisoQg} onChange={setEstIncGastoCompromisoQg} errors={this.state.errors} onBlur={this.validate}/>
      </div>
    )
  }

  makeObservacionesForm() {
    let { setObervacionesEstIncEstim, formData } = this.props
    formData = formData.toJS()
    let { obervacionesEstIncEstim } = formData 

    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <TextAreaUnitless header="Observaciones" name='obervacionesEstIncEstim' className={'obervaciones'} value={obervacionesEstIncEstim} onChange={setObervacionesEstIncEstim} errors={this.state.errors} onBlur={this.validate}/>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeImageInput() {
    let { formData, setEstIncProdEstimulationImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar estimación del incremento de producción
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdEstimulationImgURL)}></input>
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
  formData: state.get('estIncProduccionEstimulacion'),
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
  setObervacionesEstIncEstim: val => dispatch(setObervacionesEstIncEstim(val)),
  setEstIncProdEstimulationImgURL: val => dispatch(setEstIncProdEstimulationImgURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionIncProduccionEstimulacion)
