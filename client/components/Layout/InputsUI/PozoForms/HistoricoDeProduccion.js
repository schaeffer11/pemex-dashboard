import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { setFecha, setTiempo, setEstrangulado, setPtp, setTtp, setPbaj, setTbaj, setPsep, setTsep, setQl, setQo, setQg, setQw, setRga, setSalinidad, setPh, setProduccionData, setChecked } from '../../../../redux/actions/pozo'
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
    Header: 'Dias',
    accessor: 'dias',
    cell: 'renderNumber',
  }, { 
    Header: 'Qo (bbl/d)',
    accessor: 'qo',
    cell: 'renderNumber',
  }, { 
    Header: 'Qw (bbl/d)',
    accessor: 'qw',
    cell: 'renderNumber',
  }, { 
    Header: 'Qg_Cal (MMpc/d)',
    accessor: 'qg',
    cell: 'renderNumber',
  }, { 
    Header: 'Qgl (MMpc/d)',
    accessor: 'qgl',
    cell: 'renderNumber',
  }, { 
    Header: 'Np (MMbbl)',
    accessor: 'np',
    cell: 'renderNumber',
  }, { 
    Header: 'Wp (MMbbl)',
    accessor: 'wp',
    cell: 'renderNumber',
  }, { 
    Header: 'Gp (MMMpc)',
    accessor: 'gp',
    cell: 'renderNumber',
  }, { 
    Header: 'Gi (MMMpc)',
    accessor: 'gi',
    cell: 'renderNumber',
  }, { 
    Header: 'RGA (m3/m3)',
    accessor: 'rga',
    cell: 'renderNumber',
  }, { 
    Header: 'Fw Fraction',
    accessor: 'fw',
    cell: 'renderNumber',
  }, { 
    Header: 'Pozos Prod Activos',
    accessor: 'pozosProdActivos',
    cell: 'renderNumber',
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

  makeAforoForm() {
    let { setFecha, setTiempo, setEstrangulado, setPtp, setTtp, setPbaj, setTbaj, setPsep, setTsep, setQl, setQo, setQg, setQw, setRga, setSalinidad, setPh, setProduccionData, formData } = this.props
    formData = formData.toJS()
    let { fecha, tiempo, estrangulado, ptp, ttp, pbaj, tbaj, psep, tsep, ql, qo, qg, qw, rga, salinidad, ph, produccionData } = formData 

    return (
      <div className='aforo-form' >
        <div className='header'>
          Aforo
        </div>
        <InputDate header="Fecha" name='fecha' unit='dd/mmm/aa' value={fecha} onChange={setFecha} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Tiempo" name='tiempo' unit='hrs' value={tiempo} onChange={setTiempo} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Estrangulador" name='estrangulado' unit='pg' value={estrangulado} onChange={setEstrangulado} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="PTP" name='ptp' unit='Kg/cm2' value={ptp} onChange={setPtp} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="TTP" name='ttp' unit='°C' value={ttp} onChange={setTtp} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="PBAJ" name='pbaj' unit='Kg/cm2' value={pbaj} onChange={setPbaj} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="TBAJ" name='tbaj' unit='°C' value={tbaj} onChange={setTbaj} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Psep" name='psep' unit='Kg/cm2' value={psep} onChange={setPsep} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Tsep" name='tsep' unit='°C' value={tsep} onChange={setTsep} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Ql" name='ql' unit='bpd' value={ql} onChange={setQl} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Qo" name='qo' unit='bpd' value={qo} onChange={setQo} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Qg" name='qg' unit='MMpcd' value={qg} onChange={setQg} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Qw" name='qw' unit='bpd' value={qw} onChange={setQw} onBlur={this.validate} errors={this.state.errors} />  
        <InputRow header="RGA" name='rga' unit='m3/m3' value={rga} onChange={setRga} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Salinidad" name='salinidad' unit='ppm' value={salinidad} onChange={setSalinidad} onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="pH" name='ph' unit='Adim.' value={ph} onChange={setPh} onBlur={this.validate} errors={this.state.errors} />
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

    setProduccionData([...produccionData, {index: produccionData.length, fecha: '', dias: '', qo: '', qo: '', qw: '', qg: '', qgl: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: '', pozosProdActivos: '', length: produccionData.length + 1, 'edited': false}])
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

    const objectTemplate = {fecha: '', dias: '', qo: '', qo: '', qw: '', qg: '', qgl: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: '', pozosProdActivos:''}
/*
    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })
*/
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
        { this.makeAforoForm() }
        { this.makeHistoricoDeProduccionInput() }
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.fecha ){
       errors.fecha = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tiempo ){
       errors.tiempo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estrangulado ){
       errors.estrangulado = {message: "Este campo no puede estar vacio"}
    }

    if(!values.ptp ){
       errors.ptp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.ttp ){
       errors.ttp = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pbaj ){
       errors.pbaj = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tbaj ){
       errors.tbaj = {message: "Este campo no puede estar vacio"}
    }

    if(!values.psep ){
       errors.psep = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tsep ){
       errors.tsep = {message: "Este campo no puede estar vacio"}
    }

    if(!values.ql ){
       errors.ql = {message: "Este campo no puede estar vacio"}
    }

    if(!values.qo ){
       errors.qo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.qg ){
       errors.qg = {message: "Este campo no puede estar vacio"}
    }

    if(!values.qw ){
       errors.qw = {message: "Este campo no puede estar vacio"}
    }

    if(!values.rga ){
       errors.rga = {message: "Este campo no puede estar vacio"}
    }

    if(!values.salinidad ){
       errors.salinidad = {message: "Este campo no puede estar vacio"}
    }


    if(!values.ph ){
       errors.ph = {message: "Este campo no puede estar vacio"}
    }

    if(!values.produccionData){
      errors.produccionData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.produccionData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value.toString().trim() == '' })
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
    setChecked: val => dispatch(setChecked(val))    
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDeProduccion)
)
