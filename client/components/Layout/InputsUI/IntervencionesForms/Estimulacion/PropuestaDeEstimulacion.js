import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputTable from '../../../Common/InputTable'
import ReactTable from 'react-table'
import Select from 'react-select'
import { connect } from 'react-redux'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, CalculatedValue } from '../../../Common/InputRow'
import { setCedulaData, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoN2, setVolumenTotalDeLiquido, setChecked, setPropuestaCompany } from '../../../../../redux/actions/intervencionesEstimulacion'


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
    let { formData, setPropuestaCompany } = this.props
    formData = formData.toJS()
    let { propuestaCompany } = formData
    const companyOptions = [
      { label: 'Halliburton', value: 'Halliburton' },
      { label: 'Schlumberger', value: 'Schlumberger' },
      { label: 'PFM', value: 'PFM' },
      { label: 'Chemiservices', value: 'Chemiservices' },
      { label: 'BJ', value: 'BJ' },
      { label: 'Weatherford',
      value: 'Weatherford' }
    ]

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowSelectUnitless
          header="Compañía"
          name="company"
          options={companyOptions}
          onBlur={this.validate}
          value={propuestaCompany}
          callback={e => setPropuestaCompany(e.value)}
        />
      </div>
    )
  }

  // makeGeneralForm() {
  //   let { setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo,formData } = this.props
  //   formData = formData.toJS()
  //   let { intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo } = formData

  //   return (
  //     <div className='general-form' >
  //       <div className='header'>
  //         General
  //       </div>
  //       <InputRowUnitless header="Intervalo(s)" name='intervalo' value={intervalo} onChange={setIntervalo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Longitud de intervalo a tratar" name='longitudDeIntervalo' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Vol. aparejo (VAP)" name='' unit='m3' name='volAparejo' value={volAparejo} onChange={setVolAparejo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Capacidad total del pozo (cima/base)" name='capacidadTotalDelPozo' unit='m3/m3' value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo} errors={this.state.errors} onBlur={this.validate}/>
  //     </div>
  //   )
  // }
  makeDetallesForm() {
    let { formData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    const calculateVolumes = (data, fluid, sistema = null) => {
      return data.filter(elem => elem.sistema === sistema || sistema === null)
        .reduce((accumulator, currentValue) => {
          if (currentValue[fluid]) {
            return accumulator + currentValue[fluid]
          }
          return accumulator
        }, 0)
    }

    const reactivoVolume = calculateVolumes(cedulaData, 'volLiquid', 'reactivo')
    const noReactivoVolume = calculateVolumes(cedulaData, 'volLiquid', 'no-reactivo')
    const divergenteVolume = calculateVolumes(cedulaData, 'volLiquid', 'divergente')
    const desplazamientoLiquidVolume = calculateVolumes(cedulaData, 'volLiquid', 'desplazamiento')
    const desplazamientoGasVolume = calculateVolumes(cedulaData, 'volN2', 'desplazamiento')
    const precolchonGasVolume = calculateVolumes(cedulaData, 'volN2', 'pre-colchon')
    const totalLiquidVolume = calculateVolumes(cedulaData, 'volLiquid')

    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <CalculatedValue
          header={<div>Volumen precolchón N<sub>2</sub></div>}
          value={precolchonGasVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Volumen sistema no reactivo</div>}
          value={noReactivoVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Sistema no reactivo</div>}
          value={reactivoVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Volumen sistema divergente</div>}
          value={divergenteVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Volumen desplazamiento líquido</div>}
          value={desplazamientoLiquidVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Volumen desplazamiento N<sub>2</sub></div>}
          value={desplazamientoGasVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>"Volumen total de líquido</div>}
          value={totalLiquidVolume}
          unit={<div>m<sup>3</sup></div>} 
        />
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

    setCedulaData([...cedulaData, {index: cedulaData.length, etapa: '', intervalo: '', nombreComercial: '', sistema: '', volLiquid: '', gastoN2: '', gastoLiqudo: '', gastoEnFondo: '', calidad: '', volN2: '', volLiquidoAcum: '', volN2Acum: '', relN2Liq: '', tiempo: '', length: cedulaData.length + 1, 'edited': false}])
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

  handleSelect(row, e) {
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    cedulaData[row.index][row.column.id] = e

    setCedulaData(cedulaData)
  }

  makeCedulaTable() {
    let { formData, setCedulaData, intervalos } = this.props
    formData = formData.toJS()
    intervalos = intervalos.toJS()
    let { cedulaData } = formData

    const intervaloOptions = intervalos.map(elem =>({
      value: `${elem.cimaMD}-${elem.baseMD}`,
      label: `${elem.cimaMD}-${elem.baseMD}`,
    }))

    const sistemaOptions = [
      { value: 'reactivo', label: 'Reactivo' },
      { value: 'no-reactivo', label: 'No Reactivo' },
      { value: 'pre-colchon', label: 'Pre-colchón' },
      { value: 'divergente', label: 'Divergente' },
      { value: 'desplazamiento', label: 'desplazamiento' },
    ]

    const objectTemplate = {etapa: '', intervalo: '', sistema: '', volLiquid: '', gastoN2: '', gastoLiqudo: '', gastoEnFondo: '', calidad: '', volN2: '', volLiquidoAcum: '', volN2Acum: '', relN2Liq: '', tiempo: '' }
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
      }, {
        Header: 'Etapa',
        accessor: 'etapa',
      }, 
      {
        Header: 'Intervalo',
        accessor: 'intervalo',
        width: 200,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
          return (
            <div>
              <Select
                className='input'
                simpleValue={true}
                options={intervaloOptions}
                value={intervaloOptions.find(i=>i.value === row.original.intervalo) || null}
                onChange={(e) => this.handleSelect(row, e.value)} 
              />
            </div>
          )
        }
      },
      {
        Header: 'Sistema',
        accessor: 'sistema',
        width: 200,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
          return (
            <div>
              <Select
                className='input'
                simpleValue={true}
                options={sistemaOptions}
                value={sistemaOptions.find(i=>i.value === row.original.sistema) || null}
                onChange={(e) => this.handleSelect(row, e.value)} 
              />
            </div>
          )
        }
      },
      {
        Header: 'Nombre Comercial',
        accessor: 'nombreComercial',
        cell: 'renderEditable',
      },
      { 
        Header: <div>Tiempo<br/>(min)</div>,
        accessor: 'tiempo',
        cell: 'renderNumber',
      },
      { 
        Header: <div>Gasto Liquido<br/>(bpm)</div>,
        accessor: 'gastoLiqudo',
        cell: 'renderNumber',
      },
      { 
        Header: <div>Gasto en fondo<br/>(bpm)</div>,
        accessor: 'gastoEnFondo',
        cell: 'renderNumber',
      },
      { 
        Header: <div>Gasto N2<br/>(m<sup>3</sup>/min)</div>,
        accessor: 'gastoN2',
        cell: 'renderNumber',
      }, 
      {
        Header: <div>Vol. Liq.<br/>(m<sup>3</sup>)</div>,
        accessor: 'volLiquid',
      },
      { 
        Header: <div>Vol. N2<br/>(m<sup>3</sup> std)</div>,
        accessor: 'volN2',
      },
      { 
        Header: <div>Vol. Liq. Acum.<br/>(m<sup>3</sup>)</div>,
        accessor: 'volLiquidoAcum',
      },
      { 
        Header: <div>Vol. N2 Acum.<br/>(m<sup>3</sup> std)</div>,
        accessor: 'volN2Acum',
      },
      {
        Header: <div>Calidad<br/>(%)</div>,
        accessor: 'calidad',
        cell: 'renderNumber',
      },
       {
        Header: <div>Rel. N2/Liq<br/>(m<sup>3</sup> std/m<sup>3</sup>)</div>,
        accessor: 'relN2Liq',
        cell: 'renderNumber',
      },
    ]

    return (
      <div className='generales-form' >
        <div className='header'>
          Cedula De Tratamiento
        </div>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={cedulaData}
            newRow={objectTemplate}
            setData={setCedulaData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={cedulaData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        { this.state.errors.cedulaData && this.state.errors.cedulaData.checked &&
          <div className="error">{this.state.errors.cedulaData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
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

    if(!values.cedulaData){
      errors.cedulaData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.cedulaData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => {  return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.cedulaData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  formData: state.get('propuestaEstimulacion'),
  intervalos: state.getIn(['evaluacionPetrofisica', 'layerData']),
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
  setPropuestaCompany: val => dispatch(setPropuestaCompany(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(PropuestaDeEstimulacion)
)
