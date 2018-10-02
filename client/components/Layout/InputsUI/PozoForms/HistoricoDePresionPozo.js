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

    }
  }

  componentDidMount(){

  }

  componentDidUpdate(){

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

  render() {
    let { formData, setPresionDataPozo, setPressureDepthPozo } = this.props
    formData = formData.toJS()
    let { presionDataPozo, pressureDepthPozo } = formData

     const objectTemplate = {fecha: null, Pws: '', Pwf: ''}

    console.log('render ppzoo')

    return (

      <div className='historico-presion-pozo' >
        <div className='image'/>
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
          <InputRow header="Profundidad" name='pressureDepthPozo' value={pressureDepthPozo} onChange={setPressureDepthPozo} unit={'md'} onBlur={this.validate} errors={this.state.errors}  />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataPozo: val => dispatch(setPresionDataPozo(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDePresion')),
    setPressureDepthPozo: val => dispatch(setPressureDepthPozo(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionPozo)
