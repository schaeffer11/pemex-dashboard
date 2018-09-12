import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setFecha, setTiempo, setEstrangulado, setPtp, setTtp, setPbaj, setTbaj, setPsep, setTsep, setQl, setQo, setQg, setQw, setRga, setSalinidad, setPh, setProduccionData } from '../../../../redux/actions/pozo'
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
    Header: 'Dias',
    accessor: 'dias',
    cell: 'renderEditable',
  }, { 
    Header: 'Qo (bbl/d)',
    accessor: 'qo',
    cell: 'renderEditable',
  }, { 
    Header: 'Qw (bbl/d)',
    accessor: 'qw',
    cell: 'renderEditable',
  }, { 
    Header: 'Qg_Cal (MMpc/d)',
    accessor: 'qg',
    cell: 'renderEditable',
  }, { 
    Header: 'Qgl (MMpc/d)',
    accessor: 'qgl',
    cell: 'renderEditable',
  }, { 
    Header: 'Np (MMbbl)',
    accessor: 'np',
    cell: 'renderEditable',
  }, { 
    Header: 'Wp (MMbbl)',
    accessor: 'wp',
    cell: 'renderEditable',
  }, { 
    Header: 'Gp (MMMpc)',
    accessor: 'gp',
    cell: 'renderEditable',
  }, { 
    Header: 'Gi (MMMpc)',
    accessor: 'gi',
    cell: 'renderEditable',
  }, { 
    Header: 'RGA (m3/m3)',
    accessor: 'rga',
    cell: 'renderEditable',
  }, { 
    Header: 'Fw Fraction',
    accessor: 'fw',
    cell: 'renderEditable',
  }, { 
    Header: 'Pozos Prod Activos',
    accessor: 'pozosProdActivos',
    cell: 'renderEditable',
  }
]



@autobind class HistoricoDeProduccion extends Component {
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

  makeAforoForm() {
    let { setFecha, setTiempo, setEstrangulado, setPtp, setTtp, setPbaj, setTbaj, setPsep, setTsep, setQl, setQo, setQg, setQw, setRga, setSalinidad, setPh, setProduccionData, formData } = this.props
    formData = formData.toJS()
    let { fecha, tiempo, estrangulado, ptp, ttp, pbaj, tbaj, psep, tsep, ql, qo, qg, qw, rga, salinidad, ph, produccionData } = formData 

    return (
      <div className='aforo-form' >
        <div className='header'>
          Aforo
        </div>
        <InputRow header="Fecha" name='' unit='dd/mmm/aa' value={fecha} onChange={setFecha} />
        <InputRow header="Tiempo" name='' unit='hrs' value={tiempo} onChange={setTiempo} />
        <InputRow header="Estrangulador" name='' unit='pg' value={estrangulado} onChange={setEstrangulado} />
        <InputRow header="PTP" name='' unit='Kg/cm2' value={ptp} onChange={setPtp} />
        <InputRow header="TTP" name='' unit='°C' value={ttp} onChange={setTtp} />
        <InputRow header="PBAJ" name='' unit='Kg/cm2' value={pbaj} onChange={setPbaj} />
        <InputRow header="TBAJ" name='' unit='°C' value={tbaj} onChange={setTbaj} />
        <InputRow header="Psep" name='' unit='Kg/cm2' value={psep} onChange={setPsep} />
        <InputRow header="Tsep" name='' unit='°C' value={tsep} onChange={setTsep} />
        <InputRow header="Ql" name='' unit='bpd' value={ql} onChange={setQl} />
        <InputRow header="Qo" name='' unit='bpd' value={qo} onChange={setQo} />
        <InputRow header="Qg" name='' unit='MMpcd' value={qg} onChange={setQg} />
        <InputRow header="Qw" name='' unit='bpd' value={qw} onChange={setQw} />  
        <InputRow header="RGA" name='' unit='m3/m3' value={rga} onChange={setRga} />
        <InputRow header="Salinidad" name='' unit='ppm' value={salinidad} onChange={setSalinidad} />
        <InputRow header="pH" name='' unit='Adim.' value={ph} onChange={setPh} />
      </div>
    )
  }

  renderEditable(cellInfo) {
    let { setProduccionData, formData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          produccionData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setProduccionData(produccionData)
        }}
      >{produccionData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    produccionData[0].length = 2

    setProduccionData([...produccionData, {index: produccionData.length, type: '', fechaMuestreo: '', fechaPrueba: '', compania: '', superviso: '', length: produccionData.length + 1, 'edited': false}])
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
    let { formData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div className='historico-produccion' >
        <div className='table'>
          <ReactTable
            className="-striped"
            data={produccionData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={produccionData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        <button className='new-row-button' onClick={this.addNewRow}> + </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="form historico-de-produccion">
        { this.makeAforoForm() }
        { this.makeHistoricoDeProduccionInput() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
    setFecha: val => dispatch(setFecha(val)),
    setTiempo: val => dispatch(setTiempo(val)),
    setEstrangulado: val => dispatch(setEstrangulado(val)),
    setPtp: val => dispatch(setPtp(val)),
    setTtp: val => dispatch(setTtp(val)),
    setPbaj: val => dispatch(setPbaj(val)),
    setTbaj: val => dispatch(setTbaj(val)),
    setPsep: val => dispatch(setPsep(val)),
    setTsep: val => dispatch(setTsep(val)),
    setQl: val => dispatch(setQl(val)),
    setQo: val => dispatch(setQo(val)),
    setQg: val => dispatch(setQg(val)),
    setQw: val => dispatch(setQw(val)),
    setRga: val => dispatch(setRga(val)),
    setSalinidad: val => dispatch(setSalinidad(val)),
    setPh: val => dispatch(setPh(val)),
    setProduccionData: val => dispatch(setProduccionData(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDeProduccion)
