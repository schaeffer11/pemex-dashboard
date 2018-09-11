import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { setPresionDataCampo } from '../../../../redux/actions/pozo'
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

@autobind class HistoricoDePresionCampo extends Component {
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

  renderEditable(cellInfo) {
    let { setPresionDataCampo, formData } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          presionDataCampo[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPresionDataCampo(presionDataCampo)
        }}
      >{presionDataCampo[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setPresionDataCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    presionDataCampo[0].length = 2

    setPresionDataCampo([...presionDataCampo, {index: presionDataCampo.length, type: '', fechaMuestreo: '', fechaPrueba: '', compania: '', superviso: '', length: presionDataCampo.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setPresionDataCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && presionDataCampo.length > 1) {
          presionDataCampo.splice(rowInfo.original.index, 1)

          presionDataCampo.forEach((i, index) => {
            i.index = index
            i.length = presionDataCampo.length
          }) 

          setPresionDataCampo(presionDataCampo)
        }
      }
    }
  }

  render() {
    let { formData } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div className='generales-form' >
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={presionDataCampo}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={presionDataCampo.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        <button className='new-row-button' onClick={this.addNewRow}> + </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataCampo: val => dispatch(setPresionDataCampo(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionCampo)
