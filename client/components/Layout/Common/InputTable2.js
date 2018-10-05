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
  }

  renderEditable(cellInfo) {
    let {data, setData} = this.props

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
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
      />
    )
  }

  renderNumber(cellInfo){
    let {data, setData, errors} = this.props
    const name = cellInfo.column.id
    const value = data[cellInfo.index][cellInfo.column.id]
    // errors = errors[cellInfo.index]
    // console.log('errorororor', errors, cellInfo.index)
    const rowError = errors ? errors[cellInfo.index] : null
    // function onBlur() {
    //   console.log('i checked this', name)
    // }
    console.log('about to set', data.length)

    return (
      <Cleave
        style={{ backgroundColor: "#fafafa", fontSize: 12, width: 'inherit' }}
        options={{
          numeral: true,
          numeralThousandsGroupStyle: 'thousand'
        }}
        value={value}
        onChange={e => {
          data[cellInfo.index][cellInfo.column.id] = e.target.value;
          setData([cellInfo.index, cellInfo.column.id], e.target.value)
        }}
        onBlur={(e) => checkEmpty(value, name, rowError, onBlur)}
        name={name}
      />
    )
    {/* return (
      <input
        type="number"
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        value={data[cellInfo.index][cellInfo.column.id]}
        onChange={e => {
          data[cellInfo.index][cellInfo.column.id] = e.target.value;
          setData(data)
        }}
      />
    ); */}
  }

  renderSelect() {
    let {data, setData} = this.props
    return (
      <div>welcome to the machine</div>
    )
  }

  renderDate(cellInfo){
    let {data, setData} = this.props

    const date = data[cellInfo.index][cellInfo.column.id]
    const val = date ? moment(date) : null;
    return (
      <DatePicker 
        customInput={
              <MaskedTextInput
                  type="text"
                  mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
              />
        }
        isClearable={true}
        locale="es-mx"
        dateFormat="L"
        onChange={ e => {
          if(e){
            data[cellInfo.index][cellInfo.column.id] = e.format('YYYY-MM-DD');
            setData(data)
          }
        }}
        selected={val} />
    )
  }

  // addNewRow() {
  //   let {data, setData, newRow} = this.props

  //   data[0].length = 2

  //   let newRowObj = Object.assign({}, newRow , { index: data.length, length: data.length + 1 , 'edited': false });
  //   setData([...data, newRowObj])
  // }

  addNewRow() {
    let { rowObj, setData, data } = this.props
    // const { errors } = this.state
    // formData = formData.toJS()
    // let { produccionData } = formData
    // const newErrorRow = {}
    // Object.keys(errors)[0].forEach(key => {
    //   newError[key] = { value: null, type: errors[0][key].type }
    // })

    data[0].length = 2
    rowObj.index = data.length
    rowObj.length = data.length + 1
    rowObj.edited = false
    // this.setState({ errors: [...errors, newErrorRow]})
    setData([...data, rowObj])

    // setProduccionData([...produccionData, {index: produccionData.length, fecha: null, dias: '', qo: '', qw: '', qg: '', qgi: '', qo_vol: '', qw_vol: '', qg_vol: '', qgi_vol: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: '', length: produccionData.length + 1, 'edited': false}])
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
        {/* <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button> */}
      </div>
    )
  }
  
}

export default InputTable
