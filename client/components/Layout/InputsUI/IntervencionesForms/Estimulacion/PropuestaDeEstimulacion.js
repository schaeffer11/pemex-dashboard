import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setCedulaData, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoN2, setVolumenTotalDeLiquido, setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'

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
    Header: 'Etapa',
    accessor: 'etapa',
    cell: 'renderEditable',
  }, { 
    Header: 'Sistema (NR-R-D)',
    accessor: 'sistema',
    cell: 'renderEditable',
  }, { 
    Header: 'Vol. Liq. (m3)',
    accessor: 'volLiquid',
    cell: 'renderEditable',
  }, { 
    Header: 'Gasto N2 (m3/min)',
    accessor: 'gastoN2',
    cell: 'renderEditable',
  }, { 
    Header: 'Gasto Liquido (bpm)',
    accessor: 'gastoLiqudo',
    cell: 'renderEditable',
  }, { 
    Header: 'Gasto en fondo (bpm)',
    accessor: 'gastoEnFondo',
    cell: 'renderEditable',
  }, { 
    Header: 'Calidad (%)',
    accessor: 'calidad',
    cell: 'renderEditable',
  }, { 
    Header: 'Vol. N2 (m3 std)',
    accessor: 'volN2',
    cell: 'renderEditable',
  }, { 
    Header: 'Vol. Liq. Acum. (m3)',
    accessor: 'volLiquidoAcum',
    cell: 'renderEditable',
  }, { 
    Header: 'Vol. N2 Acum. (m3 std)',
    accessor: 'volN2Acum',
    cell: 'renderEditable',
  }, { 
    Header: 'Rel. N2/Liq (m3 std/m3)',
    accessor: 'relN2Liq',
    cell: 'renderEditable',
  }, { 
    Header: 'Tiempo (min)',
    accessor: 'tiempo',
    cell: 'renderEditable',
  }
]

@autobind class PropuestaDeEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: [],
      checked: []
    }
  }

  componentDidMount() {
    this.validate()
    this.containsErrors()
    //this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(prevProps) {
    this.containsErrors()
    //this.props.containsErrors(this, this.state.containsErrors)
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

      this.setState({
        checked: checked
      })
    }
  }

  setCheck(field){
    let {setChecked, formData} = this.props
    formData = formData.toJS()
    const checked = [ ...formData.checked, field ]

    checked.forEach(field => {
      if(errors[field])
        errors[field].checked = true
    })

    this.setState({
      checked: checked
    })

    setChecked(checked)
  }

  makeGeneralForm() {
    let { setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo,formData } = this.props
    formData = formData.toJS()
    let { intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo } = formData

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowUnitless header="Intervalo(s)" name='intervalo' value={intervalo} onChange={setIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Longitud de intervalo a tratar" name='longitudDeIntervalo' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Vol. aparejo (VAP)" name='' unit='m3' name='volAparejo' value={volAparejo} onChange={setVolAparejo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Capacidad total del pozo (cima/base)" name='capacidadTotalDelPozo' unit='m3/m3' value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo} errors={this.state.errors} onBlur={this.validate}/>
      </div>
    )
  }

  makeDetallesForm() {
    let { setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoN2, setVolumenTotalDeLiquido, formData } = this.props
    formData = formData.toJS()
    let { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = formData
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <InputRow header="Volumen precolchón N2" name='volumenPrecolchonN2' unit='m3' value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema no reactivo" name='volumenSistemaNoReativo' unit='m3' value={volumenSistemaNoReativo} onChange={setVolumenSistemaNoReativo}errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema reactivo" name='volumenSistemaReactivo' unit='m3' value={volumenSistemaReactivo} onChange={setVolumenSistemaReactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema divergente" name='volumenSistemaDivergente' unit='m3' value={volumenSistemaDivergente} onChange={setVolumenSistemaDivergente} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento líquido" name='volumenDesplazamientoLiquido' unit='m3' value={volumenDesplazamientoLiquido} onChange={setVolumenDesplazamientoLiquido} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento N2" name='volumenDesplazamientoN2' unit='m3' value={volumenDesplazamientoN2} onChange={setVolumenDesplazamientoN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen total de líquido" name='volumenTotalDeLiquido' unit='m3' value={volumenTotalDeLiquido} onChange={setVolumenTotalDeLiquido} errors={this.state.errors} onBlur={this.validate}/>
      </div>
    )
  }

  renderEditable(cellInfo) {
    let { setCedulaData, formData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          cedulaData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setCedulaData(cedulaData)
        }}
      >{cedulaData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    cedulaData[0].length = 2

    setCedulaData([...cedulaData, {index: cedulaData.length, type: '', fechaMuestreo: '', fechaPrueba: '', compania: '', superviso: '', length: cedulaData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && cedulaData.length > 1) {
          cedulaData.splice(rowInfo.original.index, 1)

          cedulaData.forEach((i, index) => {
            i.index = index
            i.length = cedulaData.length
          }) 

          setCedulaData(cedulaData)
        }
      }
    }
  }


  makeCedulaTable() {
    let { formData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div className='generales-form' >
        <div className='header'>
          Cedula De Tratamiento
        </div>
        <div className='table'>
          <ReactTable
            className="-striped"
            data={cedulaData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={cedulaData.length}
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
      <div className="form propuesta-de-estimulacion">
        <div className='top'>
          <div className="left">
            { this.makeGeneralForm() }
          </div>
          <div className="right">
 
            { this.makeDetallesForm() }
          </div>
        </div>
        <div className='bot'>
          { this.makeCedulaTable() }       
        </div>
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.intervalo ){
       errors.intervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.longitudDeIntervalo ){
       errors.longitudDeIntervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volAparejo ){
       errors.volAparejo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.capacidadTotalDelPozo ){
       errors.capacidadTotalDelPozo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenPrecolchonN2 ){
       errors.volumenPrecolchonN2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenSistemaNoReativo ){
       errors.volumenSistemaNoReativo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenSistemaReactivo ){
       errors.volumenSistemaReactivo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenSistemaDivergente ){
       errors.volumenSistemaDivergente = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDesplazamientoLiquido ){
       errors.volumenDesplazamientoLiquido = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenDesplazamientoN2 ){
       errors.volumenDesplazamientoN2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volumenTotalDeLiquido ){
       errors.volumenTotalDeLiquido = {message: "Este campo no puede estar vacio"}
    }

    return errors
}

const mapStateToProps = state => ({
  formData: state.get('propuestaEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setIntervalo: val => dispatch(setIntervalo(val)),
  setLongitudDeIntervalo: val => dispatch(setLongitudDeIntervalo(val)),
  setVolAparejo: val => dispatch(setVolAparejo(val)),
  setCapacidadTotalDelPozo: val => dispatch(setCapacidadTotalDelPozo(val)),
  setVolumenPrecolchonN2: val => dispatch(setVolumenPrecolchonN2(val)),
  setVolumenSistemaNoReativo: val => dispatch(setVolumenSistemaNoReativo(val)),
  setVolumenSistemaReactivo: val => dispatch(setVolumenSistemaReactivo(val)),
  setVolumenSistemaDivergente: val => dispatch(setVolumenSistemaDivergente(val)),
  setVolumenDesplazamientoLiquido: val => dispatch(setVolumenDesplazamientoLiquido(val)),
  setVolumenDesplazamientoN2: val => dispatch(setVolumenDesplazamientoN2(val)),
  setVolumenTotalDeLiquido: val => dispatch(setVolumenTotalDeLiquido(val)),
  setCedulaData: val => dispatch(setCedulaData(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(PropuestaDeEstimulacion)
)
