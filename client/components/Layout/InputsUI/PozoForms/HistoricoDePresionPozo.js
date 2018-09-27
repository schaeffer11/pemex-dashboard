import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import {withValidate} from '../../Common/Validate'
import { setPresionDataPozo, setPressureDepthPozo, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import { InputRow } from '../../Common/InputRow'

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
    Header: <div>Pr<br></br>(Kg/cm<sup>2</sup>)</div>,
    accessor: 'Pr',
    cell: 'renderNumber',
  }
]

@autobind class HistoricoDePresionPozo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: []
    }
  }

  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    }
  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)
    }
  } 

  renderEditable(cellInfo) {
    let { setPresionDataPozo, formData } = this.props
    formData = formData.toJS()
    let { presionDataPozo, pressureDepthPozo } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          presionDataPozo[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPresionDataPozo(presionDataPozo)
        }}
      >{presionDataPozo[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setPresionDataPozo } = this.props
    formData = formData.toJS()
    let { presionDataPozo } = formData

    presionDataPozo[0].length = 2

    setPresionDataPozo([...presionDataPozo, {index: presionDataPozo.length, fecha: null, Pr: '', length: presionDataPozo.length + 1, 'edited': false}])
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

  render() {
    let { formData, setPresionDataPozo, setPressureDepthPozo } = this.props
    formData = formData.toJS()
    let { presionDataPozo, pressureDepthPozo } = formData

     const objectTemplate = {fecha: null, Pr: ''}

    return (
      <div className='historico-presion-pozo' >
        <div className='presion-table'>
          <div className='table-select'>
            <InputTable
              className="-striped"
              data={presionDataPozo}
              newRow={objectTemplate}
              setData={setPresionDataPozo}
              columns={columns}
              showPagination={false}
              showPageSizeOptions={false}
              pageSize={presionDataPozo.length}
              sortable={false}
              getTdProps={this.deleteRow}
            />
          </div>
          <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
        </div>
        <div className='depth'>
          <InputRow header="Pressure Depth" name='pressureDepthPozo' value={pressureDepthPozo} onChange={setPressureDepthPozo} unit={'md'} />
        </div>
          { this.state.errors.presionDataPozo && this.state.errors.presionDataPozo.checked &&
            <div className="error">{this.state.errors.presionDataPozo.message}</div>
          }
      </div>
    )
  }
}

const validate = values => {
    let errors = {}

    if(!values.presionDataPozo){
      errors.presionDataPozo = {message: "Esta forma no puede estar vacia"}
    }else {
      values.presionDataPozo.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.presionDataPozo = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataPozo: val => dispatch(setPresionDataPozo(val)),
    setChecked: val => dispatch(setChecked(val)),
    setPressureDepthPozo: val => dispatch(setPressureDepthPozo(val)),
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionPozo)
)
