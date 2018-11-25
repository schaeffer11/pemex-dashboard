import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setHasErrorsResultadosSimulacionEstimulacion, setPenetracionRadial, 
  setLongitudDeAgujeroDeGusano, setEvidenceSimulationImgURL } from '../../../../../redux/actions/intervencionesEstimulacion'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers';

@autobind class ResultadosDeLaSimulacionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        penetracionRadial: {
          type: 'number',
          value: ''
        },
        longitudDeAgujeroDeGusano: {
          type: 'number',
          value: ''
        },
      }
    }
  }

  componentDidMount(){
    let { setHasErrorsResultadosSimulacionEstimulacion, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsResultadosSimulacionEstimulacion(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData, propuestaData } = this.props
    formData = formData.toJS()
    propuestaData = propuestaData.toJS()
    let { tipoDeEstimulacion } = propuestaData
    const { errors } = this.state
    let hasErrors = false
    let error 

    let items = Object.keys(errors)

    if (tipoDeEstimulacion === 'limpieza') {
      items = []
    }

    items.forEach(elem => {
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
    let { hasErrors, setHasErrorsResultadosSimulacionEstimulacion, propuestaData } = this.props
    propuestaData = propuestaData.toJS()
    let { tipoDeEstimulacion } = propuestaData
    let hasErrorNew = false

    let items = Object.keys(errors)

    if (tipoDeEstimulacion === 'limpieza') {
      items = []
    }

    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsResultadosSimulacionEstimulacion(hasErrorNew)
    }

    this.setState({ errors })
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
        <InputRow header="Penetración radial" name='penetracionRadial' unit="pg" value={penetracionRadial} onChange={setPenetracionRadial} errors={this.state.errors} onBlur={this.updateErrors} />
        <InputRow header="Longitud de agujero de gusano" name='longitudDeAgujeroDeGusano' unit="pg" value={longitudDeAgujeroDeGusano} onChange={setLongitudDeAgujeroDeGusano} errors={this.state.errors} onBlur={this.updateErrors} />
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    let { files } = e.target

    console.log(files)

    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl, 'resultadosSimulacionEstimulacion')
  }

  makeEvidenceSimulationInput() {
    let { formData, setEvidenceSimulationImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar evidencia de simulacion
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }


  render() {
    let { propuestaData } = this.props
    propuestaData = propuestaData.toJS()
    let { tipoDeEstimulacion } = propuestaData

    return (
      <div className="form resultados-de-simulacion">
        <div className='image' />
        <div className='left'>
          { tipoDeEstimulacion === 'matricial' ? this.makeMatricialForm() : <div>Simulación no es requerida para limpiezas</div> }
        </div>
        <div className='right'>
          { tipoDeEstimulacion === 'matricial' ? this.makeEvidenceSimulationInput() : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionEstimulacion'),
  propuestaData: state.get('propuestaEstimulacion'),
  hasErrors: state.getIn(['resultados-de-simulacion', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setPenetracionRadial: val => dispatch(setPenetracionRadial(val)),
  setLongitudDeAgujeroDeGusano: val => dispatch(setLongitudDeAgujeroDeGusano(val)),
  setEvidenceSimulationImgURL: (url, name) => dispatch(setEvidenceSimulationImgURL(url, name)),
  setHasErrorsResultadosSimulacionEstimulacion: val => dispatch(setHasErrorsResultadosSimulacionEstimulacion(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionEstimulacion)
