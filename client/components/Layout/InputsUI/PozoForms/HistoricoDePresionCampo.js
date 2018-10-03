import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import {withValidate} from '../../Common/Validate'
import { setPresionDataCampo, setPressureDepthCampo, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ExcelUpload from '../../Common/ExcelUpload'
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
  }
]

@autobind class HistoricoDePresionCampo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: []
    }
  }

  componentDidMount(){

  }

  componentDidUpdate(){

  }


  addNewRow() {
    let { formData, setPresionDataCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    presionDataCampo[0].length = 2

    setPresionDataCampo([...presionDataCampo, {index: presionDataCampo.length, fecha: null, Pws: '', length: presionDataCampo.length + 1, 'edited': false}])
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
    let { formData, setPresionDataCampo, setPressureDepthCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo, pressureDepthCampo } = formData

    const objectTemplate = {fecha: null, Pws: ''}

    console.log('render presion campo')

    return (
      <div className='historico-presion' >
        <div className='image'/>
        <div className="inputs">
          <ExcelUpload
          template="HistoricoPresionCampo"
          headers={[
                { name: 'fecha', type: 'date' },
                { name: 'Pws', type: 'number' },
              ]}
              setData={this.props.setPresionDataCampo}
            />
          <div className='depth'>
            <InputRow header="Plano de Referencia" name='pressureDepthCampo' value={pressureDepthCampo} onChange={setPressureDepthCampo} unit={'md'} onBlur={this.validate} errors={this.state.errors} />
          </div>
          <div className='presion-table'>
            <div className='table-select'>
              <InputTable
                className="-striped"
                data={presionDataCampo}
                newRow={objectTemplate}
                setData={setPresionDataCampo}
                columns={columns}
                showPagination={false}
                showPageSizeOptions={false}
                pageSize={presionDataCampo.length}
                sortable={false}
                getTdProps={this.deleteRow}
              />        
            </div>
            <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataCampo: val => dispatch(setPresionDataCampo(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDePresion')),
    setPressureDepthCampo: val => dispatch(setPressureDepthCampo(val)),
})


export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionCampo)
