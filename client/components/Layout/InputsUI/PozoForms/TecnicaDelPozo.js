import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import {withValidate} from '../../Common/Validate'
import InputTable from '../../Common/InputTable'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import { setTipoDeSistemo, setHistorialIntervencionesData, setEspesorBruto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, setTipoDePozo, setPws, setPwf, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSap, formData, setChecked } from '../../../../redux/actions/pozo'


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
      checked: [],
      fieldWellOptions: []
    }
  }

  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)

     fetch('/api/getFieldWellMapping')
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })
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
    let { setEspesorBruto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, formData } = this.props 
    formData = formData.toJS()
    let { espesorBruto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga } = formData
    const errors = []

    return (
      <div className='formacion-form' >
        <div className='header'>
          Datos de Formación
        </div>
        <InputRow header="Caliza" name='caliza' value={caliza} onChange={setCaliza} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Dolomia" name='dolomia' value={dolomia} onChange={setDolomia} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Arcilla" name='arcilla' value={arcilla} onChange={setArcilla} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Porosidad" name='porosidad' value={porosidad} onChange={setPorosidad} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Permeabilidad" name='permeabilidad' value={permeabilidad} onChange={setPermeabilidad} unit='mD' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="Sw" name='sw' value={sw} onChange={setSw} unit='%' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CAA" title="Contacto agua-aceite" name='caa' value={caa} onChange={setCaa} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />
        <InputRow header="CGA" title="Contacto gas-aceite" name='cga' value={cga} onChange={setCga} unit='mvbnm' onBlur={this.validate} errors={this.state.errors} />
      </div>
    )
  }

  makePozoForm() {
    let { fieldWellOptions } = this.state
    let { tipoDeSistemo, setTipoDePozo, setPws, setPwf, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSistemo, formData, generalData } = this.props 
    formData = formData.toJS()
    generalData = generalData.toJS()
    let { campo } = generalData
    let { tipoDePozo, pwsFecha, pwfFecha, pws, pwf, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT } = formData

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

    let pvtOptions = []

    if (campo && fieldWellOptions.length > 0) {
      let wellSubset = fieldWellOptions.filter(i => i.FIELD_FORMACION_ID === parseInt(campo))
      let usedWells = []
      wellSubset.forEach(i => {
        if (!usedWells.includes(i.WELL_FORMACION_ID)) {
          usedWells.push(i.WELL_FORMACION_ID)
          pvtOptions.push({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})
        }
      })
    }

    return (
      <div className='pozo-form' >
        <div className='header'>
          Datos de Pozo
        </div>
          <InputRowSelectUnitless header="Tipo de pozo" value={tipoDePozo} callback={(e) => setTipoDePozo(e.value)}  name='tipoDePozo' options={wellOptions} onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Pws" name='pws' value={pws} onChange={setPws} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.validate} errors={this.state.errors} />
          <InputDate header="Pws (fecha)" name='pwsFecha' value={pwsFecha} onChange={setPwsFecha} onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Pwf" name='pwf' value={pwf} onChange={setPwf} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.validate} errors={this.state.errors} />
          <InputDate header="Pwf (fecha)" name='pwfFecha' value={pwfFecha} onChange={setPwfFecha} onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Δp/mes" name='deltaPPerMes' value={deltaPPerMes} onChange={setDeltaPPerMes} unit={<div>Kg/cm<sup>2</sup>/mes</div>} onBlur={this.validate} errors={this.state.errors} />
          <InputRow header={<span>T<sub>yac</sub></span>} name='tyac' value={tyac} onChange={setTyac} unit='°C' onBlur={this.validate} errors={this.state.errors} />
          <InputRowSelectUnitless header="PVT" name='pvt' value={pvt} callback={(e) => setPvt(e.value)} options={pvtOptions} onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Aparejo de producción" value={aparejoDeProduccion} onChange={setAparejoDeProduccion} name='aparejoDeProduccion' unit='pg' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Prof. empacador" name='profEmpacador' value={profEmpacador} onChange={setProfEmpacador} unit='md' onBlur={this.validate} errors={this.state.errors} />
          <InputRow header="Prof. sensor P y T" name='profSensorPYT' value={profSensorPYT} onChange={setProfSensorPYT} unit='md' onBlur={this.validate} errors={this.state.errors} />
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
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    // if(!values.espesorBruto ){
    //    errors.espesorBruto = {message: "Este campo no puede estar vacio"}
    // }

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

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('fichaTecnicaDelPozo'),
  generalData: state.get('fichaTecnicaDelPozoHighLevel'),
  checked: state.get('fichaTecnicaDelPozo').get('checked'),
  tipoDeSistemo: state.getIn(['sistemasArtificialesDeProduccion', 'tipoDeSistemo'])
})

const mapDispatchToProps = dispatch => ({
  setEspesorBruto: val => dispatch(setEspesorBruto(val)),
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
  setPws: val => dispatch(setPws(val)),
  setPwf: val => dispatch(setPwf(val)),
  setDeltaPPerMes: val => dispatch(setDeltaPPerMes(val)),
  setTyac: val => dispatch(setTyac(val)),
  setPvt: val => dispatch(setPvt(val)),
  setAparejoDeProduccion: val => dispatch(setAparejoDeProduccion(val)),
  setProfEmpacador: val => dispatch(setProfEmpacador(val)),
  setProfSensorPYT: val => dispatch(setProfSensorPYT(val)),
  setTipoDeSistemo: val => dispatch(setTipoDeSistemo(val)),
  setHistorialIntervencionesData: val => dispatch(setHistorialIntervencionesData(val)),
  setChecked: val => dispatch(setChecked(val, 'fichaTecnicaDelPozo')),
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(TechnicaDelPozo)
)
