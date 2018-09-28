import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEvidenceSimulationAcidoImgURL, setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, setChecked } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionAcido extends Component {
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
    let { setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud total" name='longitudTotal' unit="m" value={longitudTotal} onChange={setLongitudTotal} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Longitud efectiva grabada" name='longitudEfectivaGrabada' unit="m" value={longitudEfectivaGrabada} onChange={setLongitudEfectivaGrabada} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Altura grabada" name='alturaGrabada' unit="m" value={alturaGrabada} onChange={setAlturaGrabada} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Ancho promedio" name='anchoPromedio' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Concentración del ácido" name='concentracionDelAcido' unit="lb/pg2" value={concentracionDelAcido} onChange={setConcentracionDelAcido} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Conductividad" name='conductividad' unit="mD*ft" value={conductividad} onChange={setConductividad} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="FCD" name='fcd' unit="adim." value={fcd} onChange={setFcd} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Presión neta" name='presionNeta' unit="psi" value={presionNeta} onChange={setPresionNeta} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Eficiencia de fluido de fractura" name='eficienciaDeFluidoDeFractura' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura} errors={this.state.errors} onBlur={this.validate}/>
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
          Upload Evidence of Simulation (sim results) (spanish)
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationAcidoImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
          { this.state.errors.evidenceSimulationAcidoImgURL && this.state.errors.evidenceSimulationAcidoImgURL.checked &&
          <div className="error">{this.state.errors.e.message}</div>
          }
      </div>
    )
  }



  render() {

    return (
      <div className="form resultados-de-simulacion-acido">
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

    if(!values.longitudTotal ){
       errors.longitudTotal = {message: "Este campo no puede estar vacio"}
    }

    if(!values.longitudEfectivaGrabada ){
       errors.longitudEfectivaGrabada = {message: "Este campo no puede estar vacio"}
    }

    if(!values.alturaGrabada ){
       errors.alturaGrabada = {message: "Este campo no puede estar vacio"}
    }

    if(!values.anchoPromedio ){
       errors.anchoPromedio = {message: "Este campo no puede estar vacio"}
    }

    if(!values.concentracionDelAcido ){
       errors.concentracionDelAcido = {message: "Este campo no puede estar vacio"}
    }

    if(!values.conductividad ){
       errors.conductividad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.fcd ){
       errors.fcd = {message: "Este campo no puede estar vacio"}
    }

    if(!values.presionNeta ){
       errors.presionNeta = {message: "Este campo no puede estar vacio"}
    }

    if(!values.eficienciaDeFluidoDeFractura ){
       errors.eficienciaDeFluidoDeFractura = {message: "Este campo no puede estar vacio"}
    }

    return errors
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
  setChecked: val => dispatch(setChecked(val, 'resultadosSimulacionAcido'))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ResultadosDeLaSimulacionAcido)
)

