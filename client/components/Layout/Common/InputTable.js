import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import autobind from 'autobind-decorator'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask"
import Select from 'react-select'
import { checkDate, checkEmpty, checkEmptySingular, checkDateSingular } from '../../../lib/errorCheckers'

/*
 * Wrapper Component for ReactTable with reusable editable cells.
 * This element should fit well with out existing code, the only
 * two main changes will be supplying newRow and setData props.
 *
 * The current cell types are available:
 *   - renderEditable
 *   - renderNumber
 *   - renderDate
 *
 * Object newRow - Template object for creating new rows
 * Function setData - Function that is responsible for updating the state
 *
 */
@autobind class InputTable extends React.Component {
  constructor(props) {
   super(props)
   this.state={}
  }

  componentDidMount() {
    this.initializeErrors()
  }

  componentDidUpdate(prevProps) {
    const { data, fromSave } = this.props
    if (prevProps.data.length !== data.length || fromSave) {
      this.initializeErrors()
    }
  }

  initializeErrors() {
    const { errorArray, data } = this.props
    let errors = []
    let properRow = {}
    if (errorArray) {
      errorArray.forEach(({ name, type }) => {
        properRow[name] = { value: null, type }
      })

      data.forEach(row => {
        if (row.error === false) {
          errors.push(properRow)
        }
        else {
          let newRow = JSON.parse(JSON.stringify(properRow))
          errorArray.forEach(({ name, type }) => {
            let err
            if (type === 'number') {
              err = checkEmptySingular(row[name])
            } else if (type === 'date') {
              err = checkDateSingular(row[name])
            } else if (type === 'text') {
              err = checkEmptySingular(row[name])
            }
            newRow[name] = { value: err, type }
          })
          errors.push(newRow)
        }
      })
    }
    this.setState({ errors }, () => {
      this.setOuterStateError()
    })
  }

  getErrors(index) {
    let errors = []
    if (this.state.errors) {
      errors = JSON.parse(JSON.stringify(this.state.errors))
    }
    const rowError = errors.length > 0 ? errors[index] : null
    return { errors, rowError }
  }

  checkAllRow(index) {
    const { errors, rowError } = this.getErrors(index)
    const { data } = this.props
    const dataRow = data[index]
    Object.keys(rowError).forEach(key => {
      const value = dataRow[key]
      let error = null
      if (!value || value.length < 1) {
        error = 'Este campo no puede estar vacio'
      }
      if (typeof value === 'number' && value === 0) {
        error = null
      }
      rowError[key].value = error
    })
    this.updateErrors(rowError, index, errors)
  }

  renderEditable(cellInfo) {
    let {data, setData } = this.props
    const { errors, rowError } = this.getErrors(cellInfo.index)
    const name = cellInfo.column.id
    const value = data[cellInfo.index][cellInfo.column.id]
    let errorClasses = ""
    if(rowError && rowError[name] !== undefined && rowError[name].value !== null) {
        errorClasses = "error"
    }
    return (
      <div>
        <input
          className={errorClasses}
          contentEditable
          suppressContentEditableWarning
          value={value}
          onChange={e => {
            data[cellInfo.index][cellInfo.column.id] = e.target.value
            setData(data)
          }}
          onBlur={(e) => checkEmpty(e.target.value, name, rowError, (e) => this.updateErrors(e, cellInfo.index, errors))}
        />
      </div>
    )
  }

  renderTextarea(cellInfo) {
    let {data, setData } = this.props
    const { errors, rowError } = this.getErrors(cellInfo.index)
    const name = cellInfo.column.id
    const value = data[cellInfo.index][cellInfo.column.id]
    let errorClasses = ""
    if(rowError && rowError[name] !== undefined && rowError[name].value !== null) {
       errorClasses = "error"
    }
    return (
      <div>
        <textarea
          className={errorClasses}
          contentEditable
          suppressContentEditableWarning
          value={value}
          onChange={e => {
            data[cellInfo.index][cellInfo.column.id] = e.target.value
            setData(data)
          }}
          onBlur={(e) => checkEmpty(e.target.value, name, rowError, (e) => this.updateErrors(e, cellInfo.index, errors))}
        />
      </div>
    )
  }

  renderNumberDisable(cellInfo) {
    let {data, disabledColumns} = this.props
    const { id } = cellInfo.column
    const { sistema } = cellInfo.row
    const isDisabled = disabledColumns(sistema, id)
    const name = cellInfo.column.id
    const { rowError } = this.getErrors(cellInfo.index)
    let errorClasses = ""
    if (rowError && rowError[name] !== undefined && rowError[name].value !== null) {
        errorClasses = "error"
    }

    return (
      <div>
        <input
          className={errorClasses}
          type="number"
          disabled={isDisabled}
          contentEditable
          suppressContentEditableWarning
          value={data[cellInfo.index][cellInfo.column.id]}
          onChange={e => {
            data[cellInfo.index][cellInfo.column.id] = e.target.value
            this.setDataPromise(data).then(() => this.checkAllRow(cellInfo.index))
          }}
        />
      </div>
    )
  }

  setOuterStateError() {
    let { data, checkForErrors } = this.props
    let hasError = null
    data.forEach(row => {
      if (row.error === true) {
        hasError = true
      }
    })
    if (typeof checkForErrors === 'function') {
      checkForErrors(hasError)
    }
  }


  updateErrors(e, i, errors) {
    let { data, setData } = this.props
    errors[i] = e
    const hasErrors = Object.keys(e).filter(elem => {
      if (e[elem].value !== null) {
        return true
      }
      return false
    })
    const newErrorValue = hasErrors.length > 0
    const oldErrorValue = data[i].error
    if (oldErrorValue !== newErrorValue) {
      data[i].error = hasErrors.length > 0
      this.setOuterStateError()
      setData(data)
    }
    this.setState({ errors })
  }

  renderNumber(cellInfo) {
    let {data, setData } = this.props
    const { errors, rowError } = this.getErrors(cellInfo.index)
    const name = cellInfo.column.id
    const value = data[cellInfo.index][cellInfo.column.id]
    let errorClasses = ""
    if(rowError && rowError[name] !== undefined && rowError[name].value !== null) {
        errorClasses = "error"
    }
    return (
      <div>
        <input
          type="number"
          className={errorClasses}
          contentEditable
          suppressContentEditableWarning
          value={value}
          onChange={e => {
            data[cellInfo.index][cellInfo.column.id] = e.target.value
            this.setDataPromise(data).then(() => this.checkAllRow(cellInfo.index))
          }}
        />
      </div>
    )
  }

  renderSelect(cellInfo) {
    let {data, selectOptions } = this.props
    const name = cellInfo.column.id
    const { rowError } = this.getErrors(cellInfo.index)
    let errorClasses = ""
    if(rowError && rowError[name] !== undefined && rowError[name].value !== null) {
        errorClasses = "error"
    }
    return (
      <div>
        <Select
          simpleValue
          placeholder="Seleccionar"
          className='input ${errorClasses}'
          options={selectOptions}
          value={selectOptions.find(i=>i.value === cellInfo.row[name]) || null}
          onChange={e => {
            data[cellInfo.index][cellInfo.column.id] = e.value;
            this.setDataPromise(data).then(e => this.checkAllRow(cellInfo.index))
          }}
        />
      </div>
    )
  }

  renderDate(cellInfo){
    let {data, setData} = this.props
    const name = cellInfo.column.id
    const { errors, rowError } = this.getErrors(cellInfo.index)
    let handleSelect = (date) => {
      if (date.isValid()) {
        checkDate(date, name, rowError, (e) => this.updateErrors(e, cellInfo.index, errors))
        data[cellInfo.index][cellInfo.column.id] = date.format('YYYY-MM-DD')
        setData(data)
      }
    }
  
    let handleBlur = (e) => {
      const date = moment(e.target.value, 'DD/MM/YYYY')
      if (!date.isValid() || e.target.value.includes('_')) {
        checkDate(e.target.value, name, rowError, (e) => this.updateErrors(e, cellInfo.index, errors))
        data[cellInfo.index][cellInfo.column.id] = null
        setData(data)
      }
    }

    let errorClasses = ""
    if(rowError && rowError[name] !== undefined && rowError[name].value !== null) {
        errorClasses = "error"
    }
    const date = data[cellInfo.index][cellInfo.column.id]
    const objValue = date ? moment(date) : null 
    return (
      <div className='test'>
        <DatePicker
          customInput={
            <MaskedTextInput
              type="text"
              mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
            />
          }
          isClearable={false}
          dateFormat="L"
          name={name}
          onChange={handleSelect}
          onBlur={handleBlur}
          className={errorClasses}
          selected={objValue}
          locale="es-mx"
          showMonthDropdown
          showYearDropdown
        />
      </div>
    )
  }

  addNewRow() {
    let { rowObj, setData, data, errorArray } = this.props
    const { errors } = this.state
    const newErrorRow = {}
    errorArray.forEach(({ name, type }) => {
      newErrorRow[name] = { value: '', type }
    })

    data[0].length = 2
    rowObj.index = data.length
    rowObj.length = data.length + 1


    console.log(JSON.parse(JSON.stringify(this.state.errors)))
    this.setState({ errors: [...errors, newErrorRow] }, () => {
      console.log(this.state.errors)
      this.setOuterStateError()
    })




    setData([...data, rowObj])
  }

  setDataPromise(data) {
    const { setData } = this.props
    return new Promise((resolve) => {
      resolve(setData(data))
    })
  }

  deleteRow(state, rowInfo, column, instance) {
    let {data, setData} = this.props
    return {
      onClick: e => {
        if (column.id === 'delete' && data.length > 1) {
          data.splice(rowInfo.original.index, 1)
          data.forEach((i, index) => {
            i.index = index
            i.length = data.length
          })
          this.setDataPromise(data).then(e => this.setOuterStateError())
        }
      }
    }
  }

  render() {
    let {columns, data} = this.props;
    columns.forEach(column => {
      column.minWidth = 150
      if(column.cell === 'renderEditable')
        column.Cell = this.renderEditable
      else if(column.cell === 'renderDate')
        column.Cell = this.renderDate
      else if(column.cell === 'renderNumber')
        column.Cell = this.renderNumber
      else if(column.cell === 'renderNumberDisable')
        column.Cell = this.renderNumberDisable
      else if(column.cell === 'renderSelect')
        column.Cell = this.renderSelect
      else if(column.cell === 'renderTextarea')
        column.Cell = this.renderTextarea
      else if(column.cell)
        column.Cell = null

      if (column.columns) {
        column.columns.forEach(subColumn => {
          if(subColumn.cell === 'renderEditable')
            subColumn.Cell = this.renderEditable
          else if(subColumn.cell === 'renderDate')
            subColumn.Cell = this.renderDate
          else if(subColumn.cell === 'renderNumber')
            subColumn.Cell = this.renderNumber
          else if(subColumn.cell === 'renderNumberDisable')
            subColumn.Cell = this.renderNumberDisable
          else if(subColumn.cell === 'renderSelect')
            subColumn.Cell = this.renderSelect
          else if(subColumn.cell === 'renderTextarea')
            subColumn.Cell = this.renderTextarea
          else if(subColumn.cell)
            subColumn.Cell = null
        })
      }
    })
    let pageSize = !data ? 1 : (data.length < 20 ? data.length : 20)
    let showPagination = data.length > 20
    return (
      <div>
        <ReactTable { ...this.props } 
          columns={columns}
          getTdProps={this.deleteRow} 
          pageSize={pageSize}
          showPagination={showPagination}
        />
        {!this.props.ignoreAddRow && <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>}
      </div>
    )
  }
  
}

export default InputTable
