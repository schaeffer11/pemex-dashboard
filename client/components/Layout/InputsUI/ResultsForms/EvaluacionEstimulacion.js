import React, { Component } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { InputRow } from '../../Common/InputRow'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { setGeneralEvaluacionEstimulacion, setMergeEvaluacionEstimulacion } from '../../../../redux/actions/results'

@autobind class EvaluacionApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        penetracionRadial: {
          type: 'number',
          value: '',
        },
        longitudDeAgujeroDeGusano: {
          type: 'number',
          value: '',
        },
      }
    }
  }

  componentDidMount(){
    let { hasSubmitted, intervals, setMergeEvaluacionEstimulacion } = this.props
    // Notice we add an immutable map to allow for setIn in handleFileUpload
    const geometria = intervals.map(intervalo => Map({
      intervalo,
      imgURL: ''
    }))
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setMergeEvaluacionEstimulacion({ hasErrors, geometria })
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
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
    let { hasErrors, setGeneralEvaluacionEstimulacion } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      }
    })
    setGeneralEvaluacionEstimulacion(['hasErrors'], hasErrorNew)
    this.setState({ errors })
  }

  makeResultForm() {
    let { formData, setGeneralEvaluacionEstimulacion } = this.props
    let { penetracionRadial, longitudDeAgujeroDeGusano } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow
          header="Longitud apuntalada"
          name='penetracionRadial'
          unit="m"
          value={penetracionRadial}
          onChange={e => setGeneralEvaluacionEstimulacion(['penetracionRadial'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Altura total fractura"
          name='longitudDeAgujeroDeGusano'
          unit="m"
          value={longitudDeAgujeroDeGusano}
          onChange={e => setGeneralEvaluacionEstimulacion(['longitudDeAgujeroDeGusano'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
      </div>
    )
  }

  handleFileUpload(e, index) {
    const { setGeneralEvaluacionEstimulacion } = this.props
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])
    // setURL(localImgUrl)
    setGeneralEvaluacionEstimulacion(['geometria', index, 'imgURL'], localImgUrl)
  }

  makeGeometryInput() {
    const { formData } = this.props
    const { geometria } = formData
    return geometria.map((geo, index) => {
      const { imgURL, intervalo } = geo
      return (
        <div key={`apuntaladoEvidence_${intervalo}`} style={{marginBot: '20px'}}>
          <div className='header'>
            Cargar geometría de intervalo {intervalo}
          </div>
          <input
            type='file'
            accept="image/*"
            onChange={(e) => this.handleFileUpload(e, index)}
          />
          {imgURL ? <img className='img-preview' src={imgURL} /> : null }
        </div>
      )
    })
  }

  render() {
    const { stimulationType } = this.props
    return (
      <div className="form resultados-de-simulacion-apuntalado">
        <div className='image' />
        <div className='left'>
          { stimulationType === 'matricial' ? this.makeResultForm() : <div>Evaluacion no es requerida para limpiezas</div> }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('evaluacionApuntalado').toJS(),
  hasErrors: state.getIn(['evaluacionApuntalado', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  intervals: state.getIn(['resultsMeta', 'intervals']),
  stimulationType: state.getIn(['resultsMeta', 'stimulationType']),
})

const mapDispatchToProps = dispatch => ({
  setGeneralEvaluacionEstimulacion: (location, value) => dispatch(setGeneralEvaluacionEstimulacion(location, value)),
  setMergeEvaluacionEstimulacion: (value) => dispatch(setMergeEvaluacionEstimulacion(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionApuntalado)


