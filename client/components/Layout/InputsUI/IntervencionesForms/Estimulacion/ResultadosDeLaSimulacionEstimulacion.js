import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setPenetracionRadial, setLongitudDeAgujeroDeGusano, setEvidenceSimulationImgURL, setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
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

  makeMatricialForm() {
    let { setPenetracionRadial, setLongitudDeAgujeroDeGusano, formData } = this.props
    formData = formData.toJS()
    let { penetracionRadial, longitudDeAgujeroDeGusano } = formData
    return (
      <div className='matricail-form' >
        <div className='header'>
          Matricial
        </div>
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

          { this.state.errors.evidenceSimulationImgURL && this.state.errors.evidenceSimulationImgURL.checked &&
          <div className="error">{this.state.errors.imgBoreDiagramURL.message}</div>
          }

      </div>
    )
  }



  render() {
    let { propuestaData } = this.props
    propuestaData = propuestaData.toJS()
    let { tipoDeEstimulacion } = propuestaData

    return (
      <div className="form resultados-de-simulacion">
        <div className='left'>
          { tipoDeEstimulacion === 'matricial' ? this.makeMatricialForm() : <div>No simulation results needed, since limpieza</div> }
        </div>
        <div className='right'>
          { tipoDeEstimulacion === 'matricial' ? this.makeEvidenceSimulationInput() : null}
        </div>
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.penetracionRadial ){
       errors.penetracionRadial = {message: "Este campo no puede estar vacio"}
    }

    if(!values.longitudDeAgujeroDeGusano ){
       errors.longitudDeAgujeroDeGusano = {message: "Este campo no puede estar vacio"}
    }

    if(!values.evidenceSimulationImgURL){
        errors.longitudDeAgujeroDeGusano = {message: "Este campo no puede estar vacio"}
    }

    return errors
}


const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionEstimulacion'),
  propuestaData: state.get('propuestaEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setPenetracionRadial: val => dispatch(setPenetracionRadial(val)),
  setLongitudDeAgujeroDeGusano: val => dispatch(setLongitudDeAgujeroDeGusano(val)),
  setEvidenceSimulationImgURL: val => dispatch(setEvidenceSimulationImgURL(val)),
  setChecked: val => dispatch(setChecked(val, 'resultadosSimulacionEstimulacion'))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(ResultadosDeLaSimulacionEstimulacion)
)
