import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import {withValidate} from '../../Common/Validate'
import { setPresionDataPozo, setChecked } from '../../../../redux/actions/pozo'
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
    cell: 'renderEditable',
  }, { 
    Header: 'Qo (Mbpd)',
    accessor: 'Qo',
    cell: 'renderEditable',
  }, { 
    Header: 'Np (MMbls)',
    accessor: 'Np',
    cell: 'renderEditable',
  }, { 
    Header: 'Pws (Kg/cm2)',
    accessor: 'Pws',
    cell: 'renderEditable',
  }, { 
    Header: 'Pr (Kg/cm2)',
    accessor: 'Pr',
    cell: 'renderEditable',
  }
]

@autobind class HistoricoDePresionPozo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors === undefined
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
    let { presionDataPozo } = formData

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

    setPresionDataPozo([...presionDataPozo, {index: presionDataPozo.length, fecha: '', Qo: '', Np: '', Pws: '', Pr: '', length: presionDataPozo.length + 1, 'edited': false}])
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
    let { formData } = this.props
    formData = formData.toJS()
    let { presionDataPozo } = formData

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div className='generales-form' >
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={presionDataPozo}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={presionDataPozo.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        <button className='new-row-button' onClick={this.addNewRow}> + </button>
        </div>
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataPozo: val => dispatch(setPresionDataPozo(val)),
    setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionPozo)
)
