import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstIncProdApuntaladoImgURL, setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, setObervacionesEstIncApuntalado, setChecked } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class EstimacionIncProduccionApuntalado extends Component {
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
    let errors = Object.assign({}, this.state.errors);
    let {formData} = this.props
    formData = formData.toJS()

    const checked = formData.checked  || []
    checked.forEach((checked) => {
        if(errors[checked]){
           errors[checked].checked = true
           foundErrors = true
        }
    })

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        errors: errors,
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
    let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj  , estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP } = formData

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
    let { setObervacionesEstIncApuntalado,formData } = this.props
    formData = formData.toJS()
    let { obervacionesEstIncApuntalado } = formData
    
    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <TextAreaUnitless header="Observaciones" name='obervaciones' className={'obervaciones'} value={obervacionesEstIncApuntalado} onChange={setObervacionesEstIncApuntalado} errors={this.state.errors} onBlur={this.validate}/>
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
    let { formData, setEstIncProdApuntaladoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar estimación del incremento de producción
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdApuntaladoImgURL)}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }


  render() {

    return (
      <div className="form estimacion-inc-produccion-estimulacion-apuntalado">
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

    if(!values.estIncGastoCompromisoQo){
      errors.estIncGastoCompromisoQo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estIncGastoCompromisoQg){
      errors.estIncGastoCompromisoQg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.obervaciones){
      errors.obervaciones = {message: "Este campo no puede estar vacio"}
    }

    return errors
}


const mapStateToProps = state => ({
  formData: state.get('estIncProduccionApuntalado'),
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
  setObervacionesEstIncApuntalado: val => dispatch(setObervacionesEstIncApuntalado(val)),
  setEstIncProdApuntaladoImgURL: val => dispatch(setEstIncProdApuntaladoImgURL(val)),
  setChecked: val => dispatch(setChecked(val, 'estIncProduccionApuntalado'))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(EstimacionIncProduccionApuntalado)
)

