import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import autobind from 'autobind-decorator'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask"
import Cleave from 'cleave.js/react'
import { InputRow } from './InputRow'
import { checkDate, checkEmpty } from '../../../lib/errorCheckers'

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
    const { errorArray, data } = this.props
    let errorState = {}
    if (errorArray) {
      errorArray.forEach(({ name, type }) => {
        errorState[name] = { value: '', type }
      })
    }
    let errors = [errorState]
    if (data.length > 1) {
      errors = data.map(elem => errorState)
    }
    this.setState({ errors })
  }

  renderEditable(cellInfo) {
    let {data, setData} = this.props
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
         ={e => {
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setData(data)
        }}
      >{data[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  renderNumberDisable(cellInfo) {
    let {data, setData} = this.props
    let disabled = false
    const { id } = cellInfo.column
    const { sistema } = cellInfo.row

    if (sistema === 'desplazamientoN2' || sistema === 'pre-colchon') {
      disabled = id === 'gastoLiqudo' || id === 'volLiquid' || id === 'relN2Liq'
    } else {
      disabled = id === 'gastoN2' || id === 'volN2'
    }

    const style = {
      backgroundColor: '#fafafa',
      border: disabled ? 'none' : null
    }

    
    return (
      <input
        type="number"
        disabled={disabled}
        style={style}
        contentEditable
        suppressContentEditableWarning
        value={data[cellInfo.index][cellInfo.column.id]}
        onChange={e => {
          data[cellInfo.index][cellInfo.column.id] = e.target.value;
          console.log('about to set', data.length)
          setData(data)
        }}
        onBlur={(e) => checkEmpty(e.target.value, name, errors, onBlur)}
      />
    )
  }

  // updateErrors(e) {
  //   console.log('about to update', e, this.state.errors)
  // }

  renderNumber(cellInfo){
    let {data, setData } = this.props
    let errors = []
    if (this.state.errors) {
      errors = JSON.parse(JSON.stringify(this.state.errors))
    }
    const name = cellInfo.column.id
    const value = data[cellInfo.index][cellInfo.column.id]
    const rowError = errors.length > 0 ? errors[cellInfo.index] : null

    const updateErrors = (e) => {
      console.log('e', e)
      errors[cellInfo.index] = e
      const hasErrors = Object.keys(e).filter(e => {
        if (e !== null) {
          return true
        }
        return false
      })
      data[cellInfo.index].error = hasErrors.length > 0
      setData(data)
      this.setState({ errors })
    }
    return (
      <input
        type="number"
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        value={value}
        onChange={e => {
          data[cellInfo.index][cellInfo.column.id] = e.target.value;
          console.log('about to set', data, this.state.errors)
          setData(data)
        }}
        onBlur={(e) => checkEmpty(e.target.value, name, rowError, updateErrors)}
      />
    ); 
  }

  renderSelect() {
    let {data, setData} = this.props
    return (
      <div>welcome to the machine</div>
    )
  }

  renderDate(cellInfo){
    let {data, setData} = this.props
    let errors = []
    if (this.state.errors) {
      errors = JSON.parse(JSON.stringify(this.state.errors))
    }
    const rowError = errors.length > 0 ? errors[cellInfo.index] : null
    const name = cellInfo.column.id

    const updateErrors = (e) => {
      console.log('e', e)
      errors[cellInfo.index] = e
      const hasErrors = Object.keys(e).filter(e => {
        if (e !== null) {
          return true
        }
        return false
      })
      data[cellInfo.index].error = hasErrors.length > 0
      setData(data)
      this.setState({ errors })
    }

    let handleSelect = (date) => {
      if (date.isValid()) {
        console.log('selected something', name, rowError)
        checkDate(date, name, rowError, updateErrors)
        // onChange(date.format('YYYY-MM-DD'))
        data[cellInfo.index][cellInfo.column.id] = date.format('YYYY-MM-DD')
        setData(data)
      }
    }
  
    function handleBlur(e) {
      const date = moment(e.target.value, 'DD/MM/YYYY')
      

  
      if (!date.isValid() || e.target.value.includes('_')) {
        checkDate(e.target.value, name, rowError, updateErrors)
        // onChange(null)
      }
    }
    

    const date = data[cellInfo.index][cellInfo.column.id]
    const objValue = date ? moment(date) : null 
    return (
      <DatePicker
        customInput={
          <MaskedTextInput
            type="text"
            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
          />
        }
        isClearable={true}
        dateFormat="L"
        name={name}
        onChange={handleSelect}
        onBlur={handleBlur}
        selected={objValue}
        locale="es-mx"
      />
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
    rowObj.edited = false
    console.log('adding new row', data, rowObj)
    this.setState({ errors: [...errors, newErrorRow]})
    setData([...data, rowObj])
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
          setData(data)
        }
      }
    }
  }

  render(){
    let {columns, data} = this.props;
    columns.forEach(column => {
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
          else if(subColumn.cell)
            subColumn.Cell = null
        })
      }
    })
    let pageSize = !data ? 1 : (data.length < 50 ? data.length : 50)
    let showPagination = data.length > 50

    return (
      <div>
        <ReactTable { ...this.props } 
          columns={columns}
          getTdProps={this.deleteRow} 
          pageSize={pageSize}
          showPagination={showPagination}
        />
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }
  
}

export default InputTable
