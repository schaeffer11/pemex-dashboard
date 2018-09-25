import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setVolumenDelSistemaAcidoLimpieza, setVolumenDelSistemaNoAcidoLimpieza, setTipoDeColocacion, setTiempoDeContacto, setNumeroDeEtapas, setVolumenDelSistemAcido, setVolumenDelSistemNoAcido, setVolumenDeDivergente, setVolumenDeN2, setCalidadDeEspuma, setVolumenDePrecolchonN2, setVolumenDeDesplazamiento, setPenetracionRadial, setLongitudDeAgujeroDeGusano, setEvidenceSimulationImgURL, setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionEstimulacion extends Component {
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
      setChecked(checked)

      this.setState({
        checked: checked
      })
    }
  }

  setCheck(field){
    let {setChecked, formData} = this.props
    formData = formData.toJS()
    const checked = [ ...formData.checked, field ]

    checked.forEach(field => {
      if(errors[field])
        errors[field].checked = true
    })

    this.setState({
      checked: checked
    })

    setChecked(checked)
  }

  makeLimpiezaForm() {
    let { setVolumenDelSistemaAcidoLimpieza, setVolumenDelSistemaNoAcidoLimpieza, setTipoDeColocacion, setTiempoDeContacto, formData } = this.props
    formData = formData.toJS()
    let { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto } = formData
    return (
      <div className='limpieza-form' >
        <div className='header'>
          Limpieza
        </div>
        <InputRow header="Volumen del sistema ácido" name='volumenDelSistemaAcidoLimpieza' unit="m3" value={volumenDelSistemaAcidoLimpieza} onChange={setVolumenDelSistemaAcidoLimpieza} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen del sistema no ácido" name='volumenDelSistemaNoAcidoLimpieza' unit="m3" value={volumenDelSistemaNoAcidoLimpieza} onChange={setVolumenDelSistemaNoAcidoLimpieza} errors={this.state.errors} onBlur={this.validate} />
        <InputRowUnitless header="Tipo de colocación" name='tipoDeColocacion' value={tipoDeColocacion} onChange={setTipoDeColocacion} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Tiempo de contacto" name='tiempoDeContacto' unit="min" value={tiempoDeContacto} onChange={setTiempoDeContacto} errors={this.state.errors} onBlur={this.validate} />
      </div>
    )
  }

  makeMatricialForm() {
    let { setNumeroDeEtapas, setVolumenDelSistemAcido, setVolumenDelSistemNoAcido, setVolumenDeDivergente, setVolumenDeN2, setCalidadDeEspuma, setVolumenDePrecolchonN2, setVolumenDeDesplazamiento, setPenetracionRadial, setLongitudDeAgujeroDeGusano, formData } = this.props
    formData = formData.toJS()
    let { numeroDeEtapas, volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano } = formData
    return (
      <div className='matricail-form' >
        <div className='header'>
          Matricial
        </div>
        <InputRow header="Número de etapas" name='numeroDeEtapas' unit="Numero" value={numeroDeEtapas} onChange={setNumeroDeEtapas} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen del sistema ácido" name='volumenDelSistemAcido' unit="m3" value={volumenDelSistemAcido} onChange={setVolumenDelSistemAcido} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen del sistema no ácido" name='volumenDelSistemNoAcido' unit="m3" value={volumenDelSistemNoAcido} onChange={setVolumenDelSistemNoAcido} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen de divergente" name='volumenDeDivergente' unit="m3" value={volumenDeDivergente} onChange={setVolumenDeDivergente} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen de N2" name='volumenDeN2' unit="m3" value={volumenDeN2} onChange={setVolumenDeN2} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Calidad de espuma" name='calidadDeEspuma' unit="%" value={calidadDeEspuma} onChange={setCalidadDeEspuma} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen de precolchón N2" name='volumenDePrecolchonN2' unit="m3" value={volumenDePrecolchonN2} onChange={setVolumenDePrecolchonN2} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Volumen de desplazamiento (N2 o líquido)" name='volumenDeDesplazamiento' unit="m3" value={volumenDeDesplazamiento} onChange={setVolumenDeDesplazamiento} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Penetración radial" name='penetracionRadial' unit="pg" value={penetracionRadial} onChange={setPenetracionRadial} errors={this.state.errors} onBlur={this.validate} />
        <InputRow header="Longitud de agujero de gusano" name='longitudDeAgujeroDeGusano' unit="pg" value={longitudDeAgujeroDeGusano} onChange={setLongitudDeAgujeroDeGusano} errors={this.state.errors} onBlur={this.validate} />
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
    let { formData, setEvidenceSimulationImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Evidence of Simulation (sim results) (spanish)
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }



  render() {

    return (
      <div className="form resultados-de-simulacion">
        <div className='left'>
          { this.makeLimpiezaForm() }
          { this.makeEvidenceSimulationInput() }
        </div>
        <div className='right'>
          { this.makeMatricialForm() }
        </div>
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.volumenDelSistemaAcidoLimpieza ){
       errors.volumenDelSistemaAcidoLimpieza = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDelSistemaNoAcidoLimpieza ){
       errors.volumenDelSistemaNoAcidoLimpieza = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tipoDeColocacion ){
       errors.tipoDeColocacion = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tiempoDeContacto ){
       errors.tiempoDeContacto = {message: "Este campo no puede estar vacio"}
    }

    if(!values.numeroDeEtapas ){
       errors.numeroDeEtapas = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDelSistemAcido ){
       errors.volumenDelSistemAcido = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDelSistemNoAcido ){
       errors.volumenDelSistemNoAcido = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDeDivergente ){
       errors.volumenDeDivergente = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDeN2 ){
       errors.volumenDeN2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.calidadDeEspuma ){
       errors.calidadDeEspuma = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDePrecolchonN2 ){
       errors.volumenDePrecolchonN2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDeDesplazamiento ){
       errors.volumenDeDesplazamiento = {message: "Este campo no puede estar vacio"}
    }

    if(!values.penetracionRadial ){
       errors.penetracionRadial = {message: "Este campo no puede estar vacio"}
    }

    if(!values.longitudDeAgujeroDeGusano ){
       errors.longitudDeAgujeroDeGusano = {message: "Este campo no puede estar vacio"}
    }

    return errors
}


const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setVolumenDelSistemaAcidoLimpieza: val => dispatch(setVolumenDelSistemaAcidoLimpieza(val)),
  setVolumenDelSistemaNoAcidoLimpieza: val => dispatch(setVolumenDelSistemaNoAcidoLimpieza(val)),
  setTipoDeColocacion: val => dispatch(setTipoDeColocacion(val)),
  setTiempoDeContacto: val => dispatch(setTiempoDeContacto(val)),
  setNumeroDeEtapas: val => dispatch(setNumeroDeEtapas(val)),
  setVolumenDelSistemAcido: val => dispatch(setVolumenDelSistemAcido(val)),
  setVolumenDelSistemNoAcido: val => dispatch(setVolumenDelSistemNoAcido(val)),
  setVolumenDeDivergente: val => dispatch(setVolumenDeDivergente(val)),
  setVolumenDeN2: val => dispatch(setVolumenDeN2(val)),
  setCalidadDeEspuma: val => dispatch(setCalidadDeEspuma(val)),
  setVolumenDePrecolchonN2: val => dispatch(setVolumenDePrecolchonN2(val)),
  setVolumenDeDesplazamiento: val => dispatch(setVolumenDeDesplazamiento(val)),
  setPenetracionRadial: val => dispatch(setPenetracionRadial(val)),
  setLongitudDeAgujeroDeGusano: val => dispatch(setLongitudDeAgujeroDeGusano(val)),
  setEvidenceSimulationImgURL: val => dispatch(setEvidenceSimulationImgURL(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(ResultadosDeLaSimulacionEstimulacion)
)
