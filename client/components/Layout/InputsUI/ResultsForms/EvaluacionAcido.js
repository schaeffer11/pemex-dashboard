import React, { Component } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { InputRow } from '../../Common/InputRow'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { setGeneralEvaluacionAcido, setMergeEvaluacionAcido } from '../../../../redux/actions/results'

@autobind class EvaluacionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        longitudTotal: {
          type: 'number',
          value: '',
        },
        longitudEfectivaGrabada: {
          type: 'number',
          value: '',
        },
        alturaGrabada: {
          type: 'number',
          value: '',
        },
        anchoPromedio: {
          type: 'number',
          value: '',
        },
        concentracionDelAcido: {
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
    let { hasSubmitted, intervals, setMergeEvaluacionAcido, formData } = this.props
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
    setMergeEvaluacionAcido(newState)
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
    let { hasErrors, setGeneralEvaluacionAcido } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    setGeneralEvaluacionAcido(['hasErrors'], hasErrorNew)
    this.setState({ errors })
  }

  makeResultForm() {
    let { formData, setGeneralEvaluacionAcido } = this.props
    let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <div className="input-table">
          <InputRow
            header="Longitud total"
            name='longitudTotal'
            unit="m"
            value={longitudTotal}
            onChange={e => setGeneralEvaluacionAcido(['longitudTotal'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Longitud efectiva grabada"
            name='longitudEfectivaGrabada'
            unit="m"
            value={longitudEfectivaGrabada}
            onChange={e => setGeneralEvaluacionAcido(['longitudEfectivaGrabada'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Altura grabada"
            name='alturaGrabada'
            unit="m"
            value={alturaGrabada}
            onChange={e => setGeneralEvaluacionAcido(['alturaGrabada'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Ancho promedio"
            name='anchoPromedio'
            unit="pg."
            value={anchoPromedio}
            onChange={e => setGeneralEvaluacionAcido(['anchoPromedio'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Concentración del ácido"
            name='concentracionDelAcido'
            unit={<div>lb/pg<sup>2</sup></div>}
            value={concentracionDelAcido}
            onChange={e => setGeneralEvaluacionAcido(['concentracionDelAcido'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Conductividad"
            name='conductividad'
            unit="mD*ft"
            value={conductividad}
            onChange={e => setGeneralEvaluacionAcido(['conductividad'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="FCD"
            name='fcd'
            unit="adim."
            value={fcd}
            onChange={e => setGeneralEvaluacionAcido(['fcd'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Presión neta"
            name='presionNeta'
            unit="psi"
            value={presionNeta}
            onChange={e => setGeneralEvaluacionAcido(['presionNeta'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Eficiencia de fluido de fractura"
            name='eficienciaDeFluidoDeFractura'
            unit="%"
            value={eficienciaDeFluidoDeFractura}
            onChange={e => setGeneralEvaluacionAcido(['eficienciaDeFluidoDeFractura'], e)}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
        </div>
      </div>
    )
  }

  handleFileUpload(e, index, intervalo) {
    console.log('da index', index)
    const { setGeneralEvaluacionAcido } = this.props
    let { files } = e.target
    console.log(files)
    let localImgUrl = window.URL.createObjectURL(files[0])
    setGeneralEvaluacionAcido(['geometria', index, 'imgURL'], localImgUrl)
    setGeneralEvaluacionAcido(['geometria', index, 'imgName'], ['evaluacionAcido', intervalo].join('.'))
  }

  makeGeometryInput() {
    const { formData } = this.props
    const { geometria } = formData
    console.log('da form data', formData)
    return geometria.map((geo, index) => {
      const { imgURL, intervalo } = geo
      return (
        <div key={`acidoEvidence_${intervalo}`} style={{marginBot: '20px'}}>
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
      <div className="form resultados-de-simulacion-acido">
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
  formData: state.get('evaluacionAcido').toJS(),
  hasErrors: state.getIn(['evaluacionAcido', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  intervals: state.getIn(['resultsMeta', 'intervals']),
})

const mapDispatchToProps = dispatch => ({
  setGeneralEvaluacionAcido: (location, value) => dispatch(setGeneralEvaluacionAcido(location, value)),
  setMergeEvaluacionAcido: (value) => dispatch(setMergeEvaluacionAcido(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionAcido)


