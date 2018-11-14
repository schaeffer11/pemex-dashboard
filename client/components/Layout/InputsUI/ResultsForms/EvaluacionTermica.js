import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { InputRow } from '../../Common/InputRow'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { setGeneralEvaluacionTermica } from '../../../../redux/actions/results'

@autobind class EvaluacionTermica extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        qo: {
          type: 'number',
          value: '',
        },
        qw: {
          type: 'number',
          value: '',
        },
        qg: {
          type: 'number',
          value: '',
        },
      }
    }
  }

  componentDidMount() {
    let { hasSubmitted, setMergeEvaluacionTermica } = this.props
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setGeneralEvaluacionTermica(['hasErrors'], hasErrors)
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
    let { hasErrors, setGeneralEvaluacionTermica } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    setGeneralEvaluacionTermica(['hasErrors'], hasErrorNew)
    this.setState({ errors })
  }

  makeProductionResults() {
    let { formData, setGeneralEvaluacionTermica } = this.props
    let { qo, qg, qw } = formData
    return (
      <div className='result-form' >
        <div className='header'>
          Producción post-intervención
        </div>
        <InputRow
          header={<div>Q<sub>o</sub></div>}
          name='qo'
          unit="bpd"
          value={qo}
          onChange={e => setGeneralEvaluacionTermica(['qo'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header={<div>Q<sub>g</sub></div>}
          name='qg'
          unit="MMpcd"
          value={qg}
          onChange={e => setGeneralEvaluacionTermica(['qg'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
        <InputRow
          header={<div>Q<sub>w</sub></div>}
          name='qw'
          unit="bbl"
          value={qw}
          onChange={e => setGeneralEvaluacionTermica(['qw'], e)}
          errors={this.state.errors}
          onBlur={this.updateErrors}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="form resultados-de-simulacion-acido">
        <div className='image' />
        <div className='left'>
          { this.makeProductionResults() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('evaluacionTermica').toJS(),
  hasErrors: state.getIn(['evaluacionTermica', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setGeneralEvaluacionTermica: (location, value) => dispatch(setGeneralEvaluacionTermica(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionTermica)


