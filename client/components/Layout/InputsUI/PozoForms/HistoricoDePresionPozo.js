import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import { setFromSaveHistoricoDePressionPozo, setHasErrorsHistoricoDePressionPozo, setPresionDataPozo, setPressureDepthPozo, setChecked } from '../../../../redux/actions/pozo'
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
   }, { 
    Header: <div>P<sub>wf</sub><br></br>(Kg/cm<sup>2</sup>)</div>,
    accessor: 'Pwf',
    cell: 'renderNumber',
  }
]

@autobind class HistoricoDePresionPozo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
        pressureDepthPozo: {
          type: 'number',
          value: '',
        },
        table: {
          value: '',
          type: 'table',
        }
      }
    }
  }


  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveHistoricoDePressionPozo, setHasErrorsHistoricoDePressionPozo } = this.props
    formData = formData.toJS()
    let { fromSavePozo } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSavePozo) {
      let err = this.checkAllInputs(true)
      setHasErrorsHistoricoDePressionPozo(err)
      if (fromSavePozo === true) {
        setFromSaveHistoricoDePressionPozo(false)
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

  updateErrors(errors) {
    let { hasErrors, setHasErrorsHistoricoDePressionPozo } = this.props
    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsHistoricoDePressionPozo(hasErrorNew)
    }

    this.setState({ errors })
  }

  checkForErrors(value) {
    const errorsCopy = {...this.state.errors}
    errorsCopy.table.value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsHistoricoDePressionPozo } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsHistoricoDePressionPozo(hasErrors)
    })
  }

  addNewRow() {
    let { formData, setPresionDataPozo } = this.props
    formData = formData.toJS()
    let { presionDataPozo } = formData

    presionDataPozo[0].length = 2

    setPresionDataPozo([...presionDataPozo, {index: presionDataPozo.length, fecha: null, Pwf: '', Pws: '', length: presionDataPozo.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setPresionDataPozo } = this.props
    formData = formData.toJS()
    let { presionDataPozo } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && presionDataPozo.length > 1) {
          presionDataPozo.splice(rowInfo.original.index, 1)

          presionDataPozo.forEach((i, index) => {
            i.index = index
            i.length = presionDataPozo.length
          }) 

          setPresionDataPozo(presionDataPozo)
        }
      }
    }
  }

  makeHistoricoDePresionTable() {
    let { formData, setPresionDataPozo, hasSubmitted } = this.props
    formData = formData.toJS()
    let { presionDataPozo, fromSavePozo } = formData
    console.log('hola', presionDataPozo)
    const rowObj = {
      fecha: null,
      Pws: '',
      Pwf: '',
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'Pws', type: 'number' },
      { name: 'Pwf', type: 'number' },
    ]
    return(
     <div className='presion-table'>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={presionDataPozo}
            setData={setPresionDataPozo}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={this.checkForErrors}
            hasSubmitted={hasSubmitted}
            fromSave={fromSavePozo}
          />
        </div>
      </div>
    )
  }

  render() {
    let { formData, setPressureDepthPozo } = this.props
    formData = formData.toJS()
    let { pressureDepthPozo } = formData
    return (
      <div className='historico-presion' >
        <div className="inputs">
          <ExcelUpload
            template="HistoricoPresionPozo"
            headers={[
              { name: 'fecha', type: 'date' },
              { name: 'Pws', type: 'number' },
              { name: 'Pwf', type: 'number' },
            ]}
            setData={this.props.setPresionDataPozo}
          />
          <div className='depth'>
            <InputRow header="Plano de Referencia" name='pressureDepthPozo' value={pressureDepthPozo} onChange={setPressureDepthPozo} unit={'md'} onBlur={this.updateErrors} errors={this.state.errors}  />
          </div>
          {this.makeHistoricoDePresionTable()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historicoDePresion'),
  hasErrors: state.getIn(['historicoDePresion', 'hasErrorsPozo']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataPozo: val => dispatch(setPresionDataPozo(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDePresion')),
    setPressureDepthPozo: val => dispatch(setPressureDepthPozo(val)),
    setHasErrorsHistoricoDePressionPozo: val => dispatch(setHasErrorsHistoricoDePressionPozo(val)),
    setFromSaveHistoricoDePressionPozo: val => dispatch(setFromSaveHistoricoDePressionPozo(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionPozo)
