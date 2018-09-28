import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import {withValidate} from '../../Common/Validate'
import InputTable from '../../Common/InputTable'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import { setTipoDeSistemo, setHistorialIntervencionesData, setIntervaloProductor, setEspesorBruto, setEspesorNeto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, setTipoDePozo, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSap, formData, setChecked, setIntervalos } from '../../../../redux/actions/pozo'

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
    width: 150,
    cell: 'renderDate'
  }, { 
    Header: 'Historial de Intervenciones',
    accessor: 'intervenciones',
    cell: 'renderEditable',
  }
]

@autobind class TechnicaDelPozo extends Component {
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
      let { intervalos } = formData

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)
    }

  }

  makeFormacionForm() {
    let { setIntervaloProductor, setEspesorBruto, setEspesorNeto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, formData } = this.props 
    formData = formData.toJS()
    let { intervaloProductor, espesorBruto, espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga } = formData
    const errors = []

    return (
      <div className='formacion-form' >
        <div className='header'>
          Los Datos de Formación
        </div>
        <InputRow header="Intervalos(s) productor(es)" type='number' name='intervaloProductor' value={intervaloProductor}  onChange={setIntervaloProductor} unit='md/mv' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Espesor bruto" name='espesorBruto' value={espesorBruto} onChange={setEspesorBruto} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Espesor neto" name='espesorNeto' value={espesorNeto} onChange={setEspesorNeto} unit='m' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Caliza" name='caliza' value={caliza} onChange={setCaliza} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Dolomia" name='dolomia' value={dolomia} onChange={setDolomia} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Arcilla" name='arcilla' value={arcilla} onChange={setArcilla} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Porosidad" name='porosidad' value={porosidad} onChange={setPorosidad} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Permeabilidad" name='permeabilidad' value={permeabilidad} onChange={setPermeabilidad} unit='mD' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Sw" name='sw' value={sw} onChange={setSw} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CAA" name='caa' value={caa} onChange={setCaa} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CGA" name='cga' value={cga} onChange={setCga} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makePozoForm() {
    let { tipoDeSistemo, setTipoDePozo, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSistemo, formData } = this.props 
    formData = formData.toJS()
    let { tipoDePozo, pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT } = formData

    let wellOptions = [
      { label: 'Productor', value: 'Productor' },
      { label: 'Inyector', value: 'Inyector' },
      { label: 'Cerrado', value: 'Cerrado' }
    ]

    let options = [
      { label: 'Ninguna', value: 'none' },
      { label: 'Embolo viajero', value: 'emboloViajero' },
      { label: 'Bombeo neumatico', value: 'bombeoNeumatico' },
      { label: 'Bombeo hidráulico', value: 'bombeoHidraulico' },
      { label: 'Bombeo cavidades progresivas', value: 'bombeoCavidadesProgresivas' },
      { label: 'Bombeo electrocentrífugo', value: 'bombeoElectrocentrifugo' },
      { label: 'Bombeo mecánico', value: 'bombeoMecanico' },
    ]

    return (
      <div className='pozo-form' >
        <div className='header'>
          Los Datos de Pozo
        </div>
          <InputRowSelectUnitless header="Tipo de pozo" value={tipoDePozo} callback={(e) => setTipoDePozo(e.value)}  name='tipoDePozo' options={wellOptions} onBlur={this.validate} errors={this.state.errors} />
          <InputDate header="Pws (fecha)" name='pwsFecha' value={pwsFecha} onChange={setPwsFecha} unit='Kg/cm2' onBlur={this.validate} errors={this.state.errors} />
          <InputDate header="Pwf (fecha)" name='pwfFecha' value={pwfFecha} onChange={setPwfFecha} unit='Kg/cm2' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Δp/mes" name='deltaPPerMes' value={deltaPPerMes} onChange={setDeltaPPerMes} unit='Kg/cm2/mes' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Tyac" name='tyac' value={tyac} onChange={setTyac} unit='°C' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="PVT" name='pvt' value={pvt} onChange={setPvt} unit='Pozo' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Aparejo de producción" value={aparejoDeProduccion} onChange={setAparejoDeProduccion} name='aparejoDeProduccion' unit='pg' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Prof. empacador" name='profEmpacador' value={profEmpacador} onChange={setProfEmpacador} unit='md' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Prof. sensor P y T" name='profSensorPYT' value={profSensorPYT} onChange={setProfSensorPYT} unit='md' onBlur={this.validate} errors={this.state.errors} />
          {/*<InputRowUnitless header="Tipo de SAP" name='TipoDeSap' value={tipoDeSistemo !== '' ? options.find(i => i.value === tipoDeSistemo).label: null} onChange={setTipoDeSistemo} onBlur={this.validate} errors={this.state.errors} />*/}
      </div>
    )
  }

  renderEditable(cellInfo) {
    let { setHistorialIntervencionesData, formData } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          historialIntervencionesData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setHistorialIntervencionesData(historialIntervencionesData)
        }}
      >{historialIntervencionesData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  renderDate(cellInfo){
    let { setHistorialIntervencionesData, formData } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData } = formData

    const date = historialIntervencionesData[cellInfo.index][cellInfo.column.id]
    const val = date ? moment(date) : null;
    return (
      <DatePicker 
        isClearable={true}
        locale="es-mx"
        dateFormat="L"
        onKeyDown={(e) => {e.preventDefault(); return false; }} //Disable input from user
        onChange={ e => {
          if(e){
            historialIntervencionesData[cellInfo.index][cellInfo.column.id] = e.format('YYYY-MM-DD');
            setHistorialIntervencionesData(historialIntervencionesData)
          }
        }} 
        selected={val} />
    )
  }

  addNewRow() {
    let { formData, setHistorialIntervencionesData } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData } = formData

    historialIntervencionesData[0].length = 2

    setHistorialIntervencionesData([...historialIntervencionesData, {index: historialIntervencionesData.length, fecha: '', intervenciones: '', length: historialIntervencionesData.length + 1, 'edited': false}])
  }

  addNewIntervalosRow() {
    let { formData, setIntervalos } = this.props
    formData = formData.toJS()
    let { intervalos } = formData

    intervalos[0].length = 2

    setIntervalos([...intervalos, {
      base: '',
      cima: '',
      espesor: '',
      length: intervalos.length + 1,
      index: intervalos.length,
    }])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setHistorialIntervencionesData } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && historialIntervencionesData.length > 1) {
          historialIntervencionesData.splice(rowInfo.original.index, 1)

          historialIntervencionesData.forEach((i, index) => {
            i.index = index
            i.length = historialIntervencionesData.length
          }) 

          setHistorialIntervencionesData(historialIntervencionesData)
        }
      }
    }
  }


  makeIntervalosTable() {
    let { formData, setIntervalos } = this.props
    formData = formData.toJS()
    const { intervalos } = formData
    const objectTemplate = {}
    const columns = [
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
      },
      {
        Header: 'Cima',
        accessor: 'cima',
        cell: 'renderEditable',
      },
      {
        Header: 'Base',
        accessor: 'base',
        cell: 'renderEditable',
      },
      {
        Header: 'Espesor',
        accessor: 'espesor',
      }
    ]

    //TODO: handle new intervals in redux/database
    return (
      <div className='intervalos-form' >
        <div className='header'>
          Cedula De Tratamiento
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={intervalos}
            newRow={objectTemplate}
            setData={setIntervalos}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={!intervalos ? 1 : intervalos.length}
            sortable={false}
          />
        { this.state.errors.intervalos && this.state.errors.intervalos.checked &&
          <div className="error">{this.state.errors.intervalos.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewIntervalosRow}>Añadir un renglón</button>
        </div>
      </div>
    )
  }


  makeHistoricalInterventionsInput() {
    let { setHistorialIntervencionesData, formData } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData } = formData

    columns.forEach(column => {
      if(column.cell === 'renderEditable')
        column.Cell = this.renderEditable
      else if(column.cell === 'renderDate')
        column.Cell = this.renderDate
      else 
        column.Cell = null
    })

    return (
      <div className='intervenciones-form' >
        <div className='header'>
          Historial De Intervenciones
        </div>
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={historialIntervencionesData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={historialIntervencionesData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        { this.state.errors.historialIntervencionesData &&
          <div className="error">{this.state.errors.historialIntervencionesData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }
  render() {

    return (
      <div className="form tecnica-del-pozo">
        { this.makePozoForm() }
        { this.makeFormacionForm() }
        { this.makeHistoricalInterventionsInput() }
        {this.makeIntervalosTable()}
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.intervaloProductor ){
       errors.intervaloProductor = {message: "Este campo no puede estar vacio"}
    }

    if(!values.espesorBruto ){
       errors.espesorBruto = {message: "Este campo no puede estar vacio"}
    }

    if(!values.espesorNeto ){
       errors.espesorNeto = {message: "Este campo no puede estar vacio"}
    }

    if(!values.caliza ){
       errors.caliza = {message: "Este campo no puede estar vacio"}
    }

    if(!values.dolomia ){
       errors.dolomia = {message: "Este campo no puede estar vacio"}
    }

    if(!values.arcilla ){
       errors.arcilla = {message: "Este campo no puede estar vacio"}
    }

    if(!values.porosidad ){
       errors.porosidad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.permeabilidad ){
       errors.permeabilidad = {message: "Este campo no puede estar vacio"}
    }

    if(!values.sw ){
       errors.sw = {message: "Este campo no puede estar vacio"}
    }

    if(!values.caa ){
       errors.caa = {message: "Este campo no puede estar vacio"}
    }

    if(!values.cga ){
       errors.cga = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tipoDePozo ){
       errors.tipoDePozo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pwsFecha ){
       errors.pwsFecha = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pwfFecha ){
       errors.pwfFecha = {message: "Este campo no puede estar vacio"}
    }

    if(!values.deltaPPerMes ){
       errors.deltaPPerMes = {message: "Este campo no puede estar vacio"}
    }

    if(!values.tyac ){
       errors.tyac = {message: "Este campo no puede estar vacio"}
    }

    if(!values.pvt ){
       errors.pvt = {message: "Este campo no puede estar vacio"}
    }

    if(!values.aparejoDeProduccion ){
       errors.aparejoDeProduccion = {message: "Este campo no puede estar vacio"}
    }

    if(!values.profEmpacador ){
       errors.profEmpacador = {message: "Este campo no puede estar vacio"}
    }

    if(!values.profSensorPYT ){
       errors.profSensorPYT = {message: "Este campo no puede estar vacio"}
    }

    if(!values.historialIntervencionesData){
      errors.historialIntervencionesData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.historialIntervencionesData.forEach((row, index) => {
        if(!row.fecha || row.intervenciones.trim() == ''){
            errors.historialIntervencionesData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    if(!values.intervalos){
            errors.intervalos = {message: "Esta forma no puede estar vacia"}
        }else {
            values.intervalos.forEach((row, index) => {
            if(row.espesor.toString().trim() == '' || row.cima.trim() == '' || row.base.trim() == ''){
              errors.intervalos = {message: "Ningun campo puede estar vacio."}
            }
        })
    }
    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('fichaTecnicaDelPozo'),
  checked: state.get('fichaTecnicaDelPozo').get('checked'),
  tipoDeSistemo: state.getIn(['sistemasArtificialesDeProduccion', 'tipoDeSistemo'])
})

const mapDispatchToProps = dispatch => ({
  setIntervaloProductor: val => dispatch(setIntervaloProductor(val)),
  setEspesorBruto: val => dispatch(setEspesorBruto(val)),
  setEspesorNeto: val => dispatch(setEspesorNeto(val)),
  setCaliza: val => dispatch(setCaliza(val)),
  setDolomia: val => dispatch(setDolomia(val)),
  setArcilla: val => dispatch(setArcilla(val)),
  setPorosidad: val => dispatch(setPorosidad(val)),
  setPermeabilidad: val => dispatch(setPermeabilidad(val)),
  setSw: val => dispatch(setSw(val)),
  setCaa: val => dispatch(setCaa(val)),
  setCga: val => dispatch(setCga(val)),
  setTipoDePozo: val => dispatch(setTipoDePozo(val)),
  setPwsFecha: val => dispatch(setPwsFecha(val)),
  setPwfFecha: val => dispatch(setPwfFecha(val)),
  setDeltaPPerMes: val => dispatch(setDeltaPPerMes(val)),
  setTyac: val => dispatch(setTyac(val)),
  setPvt: val => dispatch(setPvt(val)),
  setAparejoDeProduccion: val => dispatch(setAparejoDeProduccion(val)),
  setProfEmpacador: val => dispatch(setProfEmpacador(val)),
  setProfSensorPYT: val => dispatch(setProfSensorPYT(val)),
  setTipoDeSistemo: val => dispatch(setTipoDeSistemo(val)),
  setHistorialIntervencionesData: val => dispatch(setHistorialIntervencionesData(val)),
  setChecked: val => dispatch(setChecked(val, 'fichaTecnicaDelPozo')),
  setIntervalos: val => dispatch(setIntervalos(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(TechnicaDelPozo)
)
