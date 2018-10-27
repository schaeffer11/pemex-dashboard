import React, { Component } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { InputRow } from '../../Common/InputRow'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { setGeneralEvaluacionApuntalado, setMergeEvaluacionApuntalado } from '../../../../redux/actions/results'

@autobind class EvaluacionApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        longitudApuntalada: {
          type: 'number',
          value: '',
        },
        alturaTotalDeFractura: {
          type: 'number',
          value: '',
        },
        anchoPromedio: {
          type: 'number',
          value: '',
        },
        concentracionAreal: {
          type: 'number',
          value: '',
        },
        conductividad: {
          type: 'number',
          value: '',
        },
        fcd: {
          type: 'number',
          value: '',
        },
        presionNeta: {
          type: 'number',
          value: '',
        },
        eficienciaDeFluidoDeFractura: {
          type: 'number',
          value: '',
        },
      }
    }
  }
  
  componentDidMount() {
    let { hasSubmitted, intervals, setMergeEvaluacionApuntalado, formData } = this.props
    let hasErrors = this.checkAllInputs(hasSubmitted)
    const newState = { hasErrors }
    const { geometria } = formData
    // Notice we add an immutable map to allow for setIn in handleFileUpload
    if (geometria.length === 1 && geometria[0].imgURL === '') {
      const geometria = intervals.map(intervalo => Map({
        intervalo,
        imgURL: ''
      }))
      newState.geometria = geometria
    }
    setMergeEvaluacionApuntalado(newState)
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
    let { hasErrors, setGeneralEvaluacionApuntalado } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    setGeneralEvaluacionApuntalado(['hasErrors'], hasErrorNew)
    this.setState({ errors })
  }

  makeResultForm() {
    let { formData, setGeneralEvaluacionApuntalado } = this.props
    let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentracionAreal, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow
          header="Longitud apuntalada"
          name='longitudApuntalada'
          unit="m"
          value={longitudApuntalada}
          onChange={e => setGeneralEvaluacionApuntalado(['longitudApuntalada'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Altura total fractura"
          name='alturaTotalDeFractura'
          unit="m"
          value={alturaTotalDeFractura}
          onChange={e => setGeneralEvaluacionApuntalado(['alturaTotalDeFractura'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Ancho promedio"
          name='anchoPromedio'
          unit="pg."
          value={anchoPromedio}
          onChange={e => setGeneralEvaluacionApuntalado(['anchoPromedio'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Concentración areal"
          name='concentracionAreal'
          unit={<div>lb/pg<sup>2</sup></div>}
          value={concentracionAreal}
          onChange={e => setGeneralEvaluacionApuntalado(['concentracionAreal'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Conductividad"
          name='conductividad'
          unit="mD*ft"
          value={conductividad}
          onChange={e => setGeneralEvaluacionApuntalado(['conductividad'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="FCD"
          name='fcd'
          unit="adim."
          value={fcd}
          onChange={e => setGeneralEvaluacionApuntalado(['fcd'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Presión neta"
          name='presionNeta'
          unit="psi"
          value={presionNeta}
          onChange={e => setGeneralEvaluacionApuntalado(['presionNeta'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header="Eficiencia de fluido de fractura"
          name='eficienciaDeFluidoDeFractura'
          unit="%"
          value={eficienciaDeFluidoDeFractura}
          onChange={e => setGeneralEvaluacionApuntalado(['eficienciaDeFluidoDeFractura'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
      </div>
    )
  }

  handleFileUpload(e, index, intervalo) {
    console.log('da index', index)
    const { setGeneralEvaluacionApuntalado } = this.props
    let { files } = e.target
    console.log(files)
    let localImgUrl = window.URL.createObjectURL(files[0])
    setGeneralEvaluacionApuntalado(['geometria', index, 'imgURL'], localImgUrl)
    setGeneralEvaluacionApuntalado(['geometria', index, 'imgName'], ['evaluacionApuntalado', intervalo].join('.'))
  }

  makeGeometryInput() {
    const { formData } = this.props
    const { geometria } = formData
    console.log('da form data', formData)
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
            onChange={(e) => this.handleFileUpload(e, index, intervalo)}
          />
          {imgURL ? <img className='img-preview' src={imgURL} /> : null }
        </div>
      )
    })
  }

  render() {
    return (
      <div className="form resultados-de-simulacion-apuntalado">
        <div className='image' />
        <div className='left'>
          { this.makeResultForm() }
          { this.makeGeometryInput() }
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
})

const mapDispatchToProps = dispatch => ({
  setGeneralEvaluacionApuntalado: (location, value) => dispatch(setGeneralEvaluacionApuntalado(location, value)),
  setMergeEvaluacionApuntalado: (value) => dispatch(setMergeEvaluacionApuntalado(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionApuntalado)


