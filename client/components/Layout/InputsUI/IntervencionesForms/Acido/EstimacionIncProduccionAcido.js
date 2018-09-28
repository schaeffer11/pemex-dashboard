import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstIncProdAcidoImgURL, setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, setObervacionesEstIncAcido, setChecked } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class EstimacionIncProduccionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: [],
      checked: []
    }
  }

  componentDidMount() {
    this.validate()
    this.containsErrors()
  }

  componentDidUpdate(prevProps) {
    this.containsErrors()
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
      setChecked( checked)

      this.setState({
        checked: checked
      })
    }
  }

  makeModeladoForm() {
    let { setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, formData } = this.props
    formData = formData.toJS()
    let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP } = formData

    return (
      <div className='modelado-form' >
        <div className='header'>
          Modelado
        </div>
        <InputRow header="Estrangulador" name='estIncEstrangulador' unit="pg" value={estIncEstrangulador} onChange={setEstIncEstrangulador} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="PTP" name='estIncPtp' unit="Kg/cm2" value={estIncPtp} onChange={setEstIncPtp} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="TTP" name='estIncTtp' unit="C" value={estIncTtp} onChange={setEstIncTtp} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="PBAJ" name='estIncPbaj' unit="Kg/cm2" value={estIncPbaj} onChange={setEstIncPbaj} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="TBAJ" name='estIncTbaj' unit="C" value={estIncTbaj} onChange={setEstIncTbaj} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="PTR" name='estIncPtr' unit="Kg/cm2" value={estIncPtr} onChange={setEstIncPtr} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Ql" name='estIncQl' unit="bpd" value={estIncQl} onChange={setEstIncQl} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Qo" name='estIncQo' unit="bpd" value={estIncQo} onChange={setEstIncQo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Qg" name='estIncQg' unit="MMpcd" value={estIncQg} onChange={setEstIncQg} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Qw" name='estIncQw' unit="bpd" value={estIncQw} onChange={setEstIncQw} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="RGA" name='estIncRGA' unit="m3/m3" value={estIncRGA} onChange={setEstIncRGA} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Salinidad" name='estIncSalinidad' unit="ppm" value={estIncSalinidad} onChange={setEstIncSalinidad} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="IP estimado" name='estIncIP' unit="bpd/psi" value={estIncIP} onChange={setEstIncIP} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="ΔP" name='estIncDeltaP' unit="Kg/cm2" value={estIncDeltaP} onChange={setEstIncDeltaP} errors={this.state.errors} onBlur={this.validate}/>

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
        <InputRow header="QO" name='estIncGastoCompromisoQo' unit="bpd" value={estIncGastoCompromisoQo} onChange={setEstIncGastoCompromisoQo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="QG" name='estIncGastoCompromisoQg' unit="MMpcd" value={estIncGastoCompromisoQg} onChange={setEstIncGastoCompromisoQg} errors={this.state.errors} onBlur={this.validate}/>
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
        <TextAreaUnitless header="Observaciones" name='obervacionesEstIncAcido' className={'obervaciones'} value={obervacionesEstIncAcido} onChange={setObervacionesEstIncAcido} errors={this.state.errors} onBlur={this.validate}/>
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
    let { formData, setEstIncProdAcidoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Est Inc Prod Acido (spanish)
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdAcidoImgURL)}></input>
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

const validate = values => {
    const errors = {}

    if(!values.estIncEstrangulador){
      errors.estIncEstrangulador = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncPtp){
      errors.estIncPtp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncTtp){
      errors.estIncTtp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncPbaj){
      errors.estIncPbaj = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncTbaj){
      errors.estIncTbaj = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncPtr){
      errors.estIncPtr = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncQl){
      errors.estIncQl = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncQo){
      errors.estIncQo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncQg){
      errors.estIncQg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncQw){
      errors.estIncQw = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncGastoCompromisoQo){
      errors.estIncGastoCompromisoQo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncGastoCompromisoQg){
      errors.estIncGastoCompromisoQg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncRGA){
      errors.estIncRGA = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncSalinidad){
      errors.estIncSalinidad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncIP){
      errors.estIncIP = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncDeltaP){
      errors.estIncDeltaP = {message: "Este campo no puede estar vacio"}
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('estIncProduccionAcido'),
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
  setEstIncProdAcidoImgURL: val => dispatch(setEstIncProdAcidoImgURL(val)),
  setChecked: val => dispatch(setChecked(val, 'estIncProduccionAcido'))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(EstimacionIncProduccionAcido)
)
