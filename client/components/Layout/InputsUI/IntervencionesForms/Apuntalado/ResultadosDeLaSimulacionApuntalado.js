import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEvidenceSimulationApuntaladoImgURL, setLongitudApuntalada, setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, setChecked } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionApuntalado extends Component {
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

  makeResultForm() {
    let { setLongitudApuntalada, setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData

    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud apuntalada" name='longitudApuntalada' unit="m" value={longitudApuntalada} onChange={setLongitudApuntalada}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Altura total de fractura" name='alturaTotalDeFractura' unit="m" value={alturaTotalDeFractura} onChange={setAlturaTotalDeFractura}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Ancho promedio" name='anchoPromedio' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Concentración areal" name='concentractionAreal' unit={<div>lb/pg<sup>2</sup></div>} value={concentractionAreal} onChange={setConcentractionAreal}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Conductividad" name='conductividad' unit="mD*ft" value={conductividad} onChange={setConductividad}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="FCD" name='fcd' unit="adim." value={fcd} onChange={setFcd}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Presión neta" name='presionNeta' unit="psi" value={presionNeta} onChange={setPresionNeta}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Eficiencia de fluido  de fractura" name='eficienciaDeFluidoDeFractura' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura}  errors={this.state.errors} onBlur={this.validate}/>
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
          { this.state.errors.imgURL && this.state.errors.imgURL.checked &&
          <div className="error">{this.state.errors.imgURL.message}</div>
          }
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

const validate = values => {
    const errors = {}

    if(!values.longitudApuntalada){
      errors.longitudApuntalada = {message: "Este campo no puede estar vacio"}
    }

    if(!values.alturaTotalDeFractura){
      errors.alturaTotalDeFractura = {message: "Este campo no puede estar vacio"}
    }

    if(!values.anchoPromedio){
      errors.anchoPromedio = {message: "Este campo no puede estar vacio"}
    }

    if(!values.concentractionAreal){
      errors.concentractionAreal = {message: "Este campo no puede estar vacio"}
    }

    if(!values.conductividad){
      errors.conductividad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.fcd){
      errors.fcd = {message: "Este campo no puede estar vacio"}
    }

    if(!values.presionNeta){
      errors.presionNeta = {message: "Este campo no puede estar vacio"}
    }

    if(!values.eficienciaDeFluidoDeFractura){
      errors.eficienciaDeFluidoDeFractura = {message: "Este campo no puede estar vacio"}
    }

    if(!values.imgURL){
        errors.imgURL = {message: "Este campo no puede estar vacio"}
    }

    return errors
}

const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionApuntalado'),
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
  setChecked: val => dispatch(setChecked(val, 'resultadosSimulacionApuntalado'))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ResultadosDeLaSimulacionApuntalado)
)
