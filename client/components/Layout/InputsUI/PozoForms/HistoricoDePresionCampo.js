import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import { setFromSaveHistoricoDePressionCampo, setHasErrorsHistoricoDePressionCampo, setPresionDataCampo, setPressureDepthCampo, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ExcelUpload from '../../Common/ExcelUpload'
import { InputRow } from '../../Common/InputRow'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'

let columns = [
  {
    Header: '',
    accessor: 'delete',
    width: 35,
    resizable: false,
    Cell: row => {
      if (row.original.length > 1) {
        return (<div style={{color: 'white', background: 'red', borderRadius: '4px', textAlign: 'center', cursor: 'pointer'}}>X</div>)
      }
    }
  }, {
    Header: 'Fecha',
    accessor: 'fecha',
    cell: 'renderDate',
  }, { 
    Header: <div>P<sub>ws</sub><br></br>(Kg/cm<sup>2</sup>)</div>,
    accessor: 'Pws',
    cell: 'renderNumber',
  }
]

@autobind class HistoricoDePresionCampo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: {
        pressureDepthCampo: {
          type: 'number',
          value: '',
        },
        table: {
          value: '',
          type: 'table',
        },
      }
    }
  }

  componentDidMount(){
    let { setHasErrorsHistoricoDePressionCampo, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsHistoricoDePressionCampo(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveHistoricoDePressionCampo, setHasErrorsHistoricoDePressionCampo } = this.props
    formData = formData.toJS()
    let { fromSaveCampo } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSaveCampo) {
      let err = this.checkAllInputs(true)
      setHasErrorsHistoricoDePressionCampo(err)
      if (fromSaveCampo === true) {
        setFromSaveHistoricoDePressionCampo(false)
      }
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
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

  checkForErrors(value) {
    const errorsCopy = {...this.state.errors}
    errorsCopy.table.value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsHistoricoDePressionCampo } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsHistoricoDePressionCampo(hasErrors)
    })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsHistoricoDePressionCampo } = this.props
    let hasErrorNew = false
    
    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsHistoricoDePressionCampo(hasErrorNew)
    }

    this.setState({ errors })
  }

  makeHistoricoDePresionTable() {
    let { formData, setPresionDataCampo, hasSubmitted } = this.props
    formData = formData.toJS()
    let { presionDataCampo, fromSaveCampo } = formData
    const rowObj = {
      fecha: null,
      Pws: '',
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'Pws', type: 'number' },
    ]

    return(
     <div className='presion-table'>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={presionDataCampo}
            setData={setPresionDataCampo}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={this.checkForErrors}
            hasSubmitted={hasSubmitted}
            fromSave={fromSaveCampo}
          />
        </div>
      </div>
    )
  }

  render() {
    let { formData, setPresionDataCampo, setPressureDepthCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo, pressureDepthCampo } = formData

    const objectTemplate = {fecha: null, Pws: ''}
    
    return (
      <div className='form historico-presion' >
        <div className="inputs">
          <ExcelUpload
          template="HistoricoPresionCampo"
          headers={[
                { name: 'fecha', type: 'date' },
                { name: 'Pws', type: 'number' },
              ]}
              setData={this.props.setPresionDataCampo}
            />
          <div className='depth input-table' style={{width: '50%'}}>
            <InputRow header="Plano de Referencia" name='pressureDepthCampo' value={pressureDepthCampo} onChange={setPressureDepthCampo} unit={'md'} onBlur={this.updateErrors} errors={this.state.errors} />
          </div>
          {this.makeHistoricoDePresionTable()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historicoDePresion'),
  hasErrors: state.getIn(['historicoDePresion', 'hasErrorsCampo']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataCampo: val => dispatch(setPresionDataCampo(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDePresion')),
    setPressureDepthCampo: val => dispatch(setPressureDepthCampo(val)),
    setHasErrorsHistoricoDePressionCampo: val => dispatch(setHasErrorsHistoricoDePressionCampo(val)),
    setFromSaveHistoricoDePressionCampo: val => dispatch(setFromSaveHistoricoDePressionCampo(val)),
})


export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionCampo)
