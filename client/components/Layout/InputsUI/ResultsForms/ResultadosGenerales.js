import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import moment from 'moment'
import { setGeneralResultadosGenerales } from '../../../../redux/actions/results'
import { CalculatedValue, InputRow, InputRowSelectUnitless, InputDate, TextAreaUnitless } from '../../Common/InputRow'
import { checkDate, checkEmpty } from '../../../../lib/errorCheckers';
import { getJustificacionesOptions } from '../../../../lib/helpers';


@autobind class ResultadosGenerales extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        fechaIntervencion: {
          type: 'date',
          value: '',
        },
        justificacionIntervencion: {
          type: 'text',
          value: '',
        },
      }
    }
  }

  componentDidMount(){
    let { setGeneralResultadosGenerales, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setGeneralResultadosGenerales(['hasErrors'], hasErrors)
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
      else if (errObj.type === 'table') {
        error = errObj.value === '' ? true : errObj.value
      }
      error === true ? hasErrors = true : null
    })
    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setGeneralResultadosGenerales } = this.props
    let hasErrorNew = false
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    if (hasErrorNew != hasErrors) {
      setGeneralResultadosGenerales(['hasErrors'], hasErrorNew)
    }
    this.setState({ errors })
  }

  render() {
    const { formData, setGeneralResultadosGenerales } = this.props
    const { fechaIntervencion, comentariosIntervencion, justificacionIntervencion } = formData
    const justificacionesOptions = getJustificacionesOptions()
    return (
      <div className='results-form' >
        <div className='header'>
        </div>
        <InputDate
          header="Fecha de Intervención"
          name='fechaIntervencion'
          value={fechaIntervencion}
          onChange={(e) => setGeneralResultadosGenerales(['fechaIntervencion'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRowSelectUnitless
          header="Justificación"
          value={justificacionIntervencion}
          callback={(e) => setGeneralResultadosGenerales(['justificacionIntervencion'], e.value)}
          name='tipoDePozo'
          options={justificacionesOptions}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <TextAreaUnitless
          header='Comentarios'
          name='comentariosIntervencion'
          className={'objetivo'}
          value={comentariosIntervencion}
          onChange={e => setGeneralResultadosGenerales(['comentariosIntervencion'], e)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('resultadosGenerales').toJS(),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setGeneralResultadosGenerales: (location, value) => dispatch(setGeneralResultadosGenerales(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosGenerales)

