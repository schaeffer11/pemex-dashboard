import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { setAforosData, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ReactTable from 'react-table'

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
    Header: 'Tiempo',
    accessor: 'tiempo',
    cell: 'renderNumber',
  }, { 
    Header: 'Estrangulador',
    accessor: 'estrangulador',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>TP</sub></div>,
    accessor: 'ptp',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>TP</sub></div>,
    accessor: 'ttp',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>BAJ</sub></div>,
    accessor: 'pbaj',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>BAJ</sub></div>,
    accessor: 'tbaj',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>sep</sub></div>,
    accessor: 'psep',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>sep</sub></div>,
    accessor: 'tsep',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>i</sub></div>,
    accessor: 'ql',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>o</sub></div>,
    accessor: 'qo',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>g</sub></div>,
    accessor: 'qg',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>w</sub></div>,
    accessor: 'qw',
    cell: 'renderNumber',
  }, { 
    Header: 'RGA',
    accessor: 'rga',
    cell: 'renderNumber',
  }, { 
    Header: 'Salinidad',
    accessor: 'salinidad',
    cell: 'renderNumber',
  }, { 
    Header: 'pH',
    accessor: 'ph',
    cell: 'renderNumber',
  }
]


@autobind class HistoricoDeAforos extends Component {
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
    let { setAforosData, formData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          aforosData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setAforosData(aforosData)
        }}
      >{aforosData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    aforosData[0].length = 2

    setAforosData([...aforosData, {index: aforosData.length, fecha: null, tiempo: '', estrangulador: '', ptp: '', ttp: '', pbaj: '',tbaj: '',psep: '',tsep: '', ql: '',qo: '', qg: '', qw: '', rga: '', salinidad: '', ph: '', length: aforosData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && aforosData.length > 1) {
          aforosData.splice(rowInfo.original.index, 1)

          aforosData.forEach((i, index) => {
            i.index = index
            i.length = aforosData.length
          }) 

          setAforosData(aforosData)
        }
      }
    }
  }

  makeHistoricoDeAforosInput() {
    let { formData ,setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    const objectTemplate = {fecha: null, tiempo: '', estrangulador: '', ptp: '', ttp: '', pbaj: '',tbaj: '',psep: '',tsep: '', ql: '',qo: '', qg: '', qw: '', rga: '', salinidad: '', ph: ''}

    return (
      <div className='historico-produccion' >
        <div className='table'>
          <InputTable
            className="-striped"
            data={aforosData}
            newRow={objectTemplate}
            setData={setAforosData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={aforosData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        { this.state.errors.aforosData && this.state.errors.aforosData.checked &&
          <div className="error">{this.state.errors.aforosData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }

  render() {
    return (
      <div className="form historico-de-produccion">
        { this.makeHistoricoDeAforosInput() }
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.aforosData){
      errors.aforosData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.aforosData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.aforosData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDeAforos'),
})

const mapDispatchToProps = dispatch => ({
    setAforosData: val => dispatch(setAforosData(val)),
    setChecked: val => dispatch(setChecked(val))    
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDeAforos)
)
