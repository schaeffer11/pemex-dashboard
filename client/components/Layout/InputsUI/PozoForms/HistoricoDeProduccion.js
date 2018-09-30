import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { setProduccionData, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'

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
    Header: 'Dias',
    accessor: 'dias',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>o</sub><br></br>(bbl)</div>,
    accessor: 'qo_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>w</sub><br></br>(bbl)</div>,
    accessor: 'qw_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>g</sub><br></br>(MMpc)</div>,
    accessor: 'qg_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>gi</sub><br></br>(MMpc)</div>,
    accessor: 'qgi_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>o</sub><br></br>(bbl/d)</div>,
    accessor: 'qo',
  }, { 
    Header: <div>Q<sub>w</sub><br></br>(bbl/d)</div>,
    accessor: 'qw',
  }, { 
    Header: <div>Q<sub>g</sub><br></br>(MMpc/d)</div>,
    accessor: 'qg',
  }, { 
    Header: <div>Q<sub>gi</sub><br></br>(MMpc/d)</div>,
    accessor: 'qgi',
  }, { 
    Header: <div>N<sub>p</sub><br></br>(MMbbl)</div>,
    accessor: 'np',
  }, { 
    Header: <div>W<sub>p</sub><br></br>(MMbbl)</div>,
    accessor: 'wp',
  }, { 
    Header: <div>G<sub>p</sub><br></br>(MMpc)</div>,
    accessor: 'gp',
  }, { 
    Header: <div>G<sub>i</sub><br></br>(MMpc)</div>,
    accessor: 'gi',
  }, { 
    Header: <div>RGA<br></br>(m<sup>3</sup>/m<sup>3</sup>)</div>,
    accessor: 'rga',
  }, { 
    Header: 'Fw Fraction',
    accessor: 'fw',
    Cell: row => <div>{(row.value * 100)}%</div>
  }
]







@autobind class HistoricoDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: [],
      checked: []
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
    let errors = Object.assign({}, this.state.errors);
    let {formData} = this.props
    formData = formData.toJS()

    const checked = formData.checked  || []
    checked.forEach((checked) => {
        if(errors[checked]){
           errors[checked].checked = true
           foundErrors = true
        }
    })

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        errors: errors,
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


  addNewRow() {
    let { formData, setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    produccionData[0].length = 2

    setProduccionData([...produccionData, {index: produccionData.length, fecha: null, dias: '', qo: '', qw: '', qg: '', qgi: '', qo_vol: '', qw_vol: '', qg_vol: '', qgi_vol: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: '', length: produccionData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && produccionData.length > 1) {
          produccionData.splice(rowInfo.original.index, 1)

          produccionData.forEach((i, index) => {
            i.index = index
            i.length = produccionData.length
          }) 

          setProduccionData(produccionData)
        }
      }
    }
  }

  makeHistoricoDeProduccionInput() {
    let { formData ,setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    const objectTemplate = {fecha: null, dias: '', qo: '', qw: '', qg: '', qgi: '', qo_vol: '', qw_vol: '', qg_vol: '', qgi_vol: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: ''}

    return (
      <div className='historico-produccion' >
        <div className='table'>
          <InputTable
            className="-striped"
            data={produccionData}
            newRow={objectTemplate}
            setData={setProduccionData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={produccionData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        { this.state.errors.produccionData && this.state.errors.produccionData.checked &&
          <div className="error">{this.state.errors.produccionData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }

  render() {

    return (
      <div className="form historico-de-produccion">
        { this.makeHistoricoDeProduccionInput() }
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.produccionData){
      errors.produccionData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.produccionData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.produccionData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
    setProduccionData: val => dispatch(setProduccionData(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDeProduccion'))    
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDeProduccion)
)
