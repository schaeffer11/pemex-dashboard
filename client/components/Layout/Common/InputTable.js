import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import autobind from 'autobind-decorator'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";

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
          setData(data)
        }}
      />
    )
  }

  renderNumber(cellInfo){
    let {data, setData} = this.props

    return (
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

  addNewRow() {
    let {data, setData, newRow} = this.props

    data[0].length = 2

    let newRowObj = Object.assign({}, newRow , { index: data.length, length: data.length + 1 , 'edited': false });
    setData([...data, newRowObj])
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
    })

    return (
      <ReactTable { ...this.props } 
        columns={columns}
        getTdProps={this.deleteRow} 
        pageSize={!data ? 1 : data.length}
      />

    )
  }
  
}

export default InputTable
