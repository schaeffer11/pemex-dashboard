import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import InputTable from '../../../Common/InputTable'
import ReactTable from 'react-table'
import {withValidate} from '../../../Common/Validate'
import Select from 'react-select'
import { InputRowUnitless, InputRow, InputRowSelectUnitless, InputRowSelectMulti } from '../../../Common/InputRow'
import { setCedulaData, setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoGelLineal, setChecked, setPropuestaCompany } from '../../../../../redux/actions/intervencionesAcido'



@autobind class PropuestaDeAcido extends Component {
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
  }

  componentDidUpdate(prevProps) {
    this.containsErrors()
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
      setChecked( checked)

      this.setState({
        checked: checked
      })
    }
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
        {/* <InputRowSelectMulti header="Intervalo(s)" callback={handleIntervalosChange} name="intervalo_t" options={intervaloOptions} />
        <InputRowUnitless header="Intervalo(s)" name='intervalo' value={intervalo} onChange={setIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Longitud de intervalo a tratar" name='longitudDeIntervalo' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Vol. Aparejo (VAP)" name='volAparejo' unit='m3' value={volAparejo} onChange={setVolAparejo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Capacidad total del pozo (cima/base)" name='capacidadTotalDelPozo' unit='m3/m3' value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo} errors={this.state.errors} onBlur={this.validate}/> */}
        {/* InputRowSelectUnitless header='Tipo de Fluido' name='tipoDeFluidoField' value={tipoDeFluidoField} callback={(e) => setTipoDeFluidoField(e.value)} options={fluidoOptions} onBlur={this.validate} errors={this.state.errors} */}
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

  makeDetallesForm() {
    let { formData } = this.props
    formData = formData.toJS()
    const { cedulaData } = formData

    // const getVolumes = (system, vol, data) => {
    //   return data.filter(elem => elem.sistema === system)
    //     .reduce((accum, curr) => parseFloat(accum) + parseFloat(curr[vol]), 0)
    // }

    // const divergenteVolume = getVolumes('divergente', 'volumenPrecolchonN2', cedulaData)
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
          volumenes totales de sistemas en cedula
        {/* <InputRow header="Volumen precolchón (gel lineal o N2)" name='volumenPrecolchonN2' unit='m3' value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema no reactivo" name='volumenSistemaNoReativo' unit='m3' value={volumenSistemaNoReativo} onChange={setVolumenSistemaNoReativo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema reactivo" name='volumenSistemaReactivo' unit='m3' value={volumenSistemaReactivo} onChange={setVolumenSistemaReactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema divergente" name='volumenSistemaDivergente' unit='m3' value={volumenSistemaDivergente} onChange={setVolumenSistemaDivergente} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento líquido" name='volumenDesplazamientoLiquido' unit='m3' value={volumenDesplazamientoLiquido} onChange={setVolumenDesplazamientoLiquido} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento gel lineal" name='volumenDesplazamientoGelLineal' unit='m3' value={volumenDesplazamientoGelLineal} onChange={setVolumenDesplazamientoGelLineal} errors={this.state.errors} onBlur={this.validate}/> */}
        {/* <InputRow header={<div>Volumen precolchón (gel lineal o N<sub>2</sub>)</div>} name='volumenPrecolchonN2' unit={<div>m<sup>3</sup></div>} value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema no reactivo" name='volumenSistemaNoReativo' unit={<div>m<sup>3</sup></div>} value={volumenSistemaNoReativo} onChange={setVolumenSistemaNoReativo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema reactivo" name='volumenSistemaReactivo' unit={<div>m<sup>3</sup></div>} value={volumenSistemaReactivo} onChange={setVolumenSistemaReactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen sistema divergente" name='volumenSistemaDivergente' unit={<div>m<sup>3</sup></div>} value={volumenSistemaDivergente} onChange={setVolumenSistemaDivergente} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento líquido" name='volumenDesplazamientoLiquido' unit={<div>m<sup>3</sup></div>} value={volumenDesplazamientoLiquido} onChange={setVolumenDesplazamientoLiquido} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento gel lineal" name='volumenDesplazamientoGelLineal' unit={<div>m<sup>3</sup></div>} value={volumenDesplazamientoGelLineal} onChange={setVolumenDesplazamientoGelLineal} errors={this.state.errors} onBlur={this.validate}/> */}

      </div>
    )
  }

  makeGeomecanicaForm() {
    let { setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, formData } = this.props
    formData = formData.toJS()
    let { moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = formData
    
    return (
      <div className='geomecanica-form' >
        <div className='header'>
          Informacion de Geomecánica
        </div>
        <InputRow header="Modulo young arena" name='moduloYoungArena' value={moduloYoungArena} onChange={setModuloYoungArena} unit='psi'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Modulo young lutitas" name='moduloYoungLutitas' value={moduloYoungLutitas} onChange={setModuloYoungLutitas} unit='psi'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Relac. poisson arena" name='relacPoissonArena' value={relacPoissonArena} onChange={setRelacPoissonArena} unit='adim'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Relac. poisson lutatas" name='relacPoissonLutatas' value={relacPoissonLutatas} onChange={setRelacPoissonLutatas} unit='adim'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Gradiente de fractura" name='gradienteDeFractura' value={gradienteDeFractura} onChange={setGradienteDeFractura} unit='psi/ft'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Densidad de disparos" name='densidadDeDisparos' value={densidadDeDisparos} onChange={setDensidadDeDisparos} unit='c/m'  errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Diámetro de disparos" name='diametroDeDisparos' value={diametroDeDisparos} onChange={setDiametroDeDisparos} unit='pg'  errors={this.state.errors} onBlur={this.validate}/>
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

    setCedulaData([...cedulaData, {
      index: cedulaData.length,
      type: '',
      fechaMuestreo: '',
      fechaPrueba: '',
      compania: '',
      superviso: '',
      length: cedulaData.length + 1,
      'edited': false
    }])
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
    console.log('row', row)
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    cedulaData[row.index][row.column.id] = e

    setCedulaData(cedulaData)
  }
  makeCedulaTable() {
    let { formData, setCedulaData, intervalos } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData
    intervalos = intervalos.toJS()

    const intervaloOptions = intervalos.map(elem =>({
      value: `${elem.baseMD}-${elem.cimaMD}`,
      label: `${elem.baseMD}-${elem.cimaMD}`,
    }))
    
    const sistemaOptions = [
      { value: 'reactivo', label: 'Reactivo' },
      { value: 'no-reactivo', label: 'No Reactivo' },
      { value: 'pre-colchon', label: 'Pre-colchón' },
      { value: 'divergente', label: 'Divergente' },
      { value: 'desplasamiento', label: 'Desplasamiento' },
    ]

    const objectTemplate = {}

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
        Header: 'Tipo de Apuntalante',
        accessor: 'tipoDeApuntalante',
        cell: 'renderEditable',
      }, { 
        Header: 'Concentracion de Apuntalante (lbm/gal)',
        accessor: 'concentraciDeApuntalante',
        cell: 'renderNumber',
      }, { 
        Header: 'Vol. Liq. (m3)',
        accessor: 'volLiquid',
        cell: 'renderNumber',
      }, { 
        Header: 'Gasto N2 (m3/min)',
        accessor: 'gastoN2',
        cell: 'renderNumber',
      }, { 
        Header: 'Gasto Liquido (bpm)',
        accessor: 'gastoLiqudo',
        cell: 'renderNumber',
      }, { 
        Header: 'Gasto en fondo (bpm)',
        accessor: 'gastoEnFondo',
        cell: 'renderNumber',
      }, { 
        Header: 'Calidad (%)',
        accessor: 'calidad',
        cell: 'renderNumber',
      }, { 
        Header: 'Vol. N2 (m3 std)',
        accessor: 'volN2',
        cell: 'renderNumber',
      }, { 
        Header: 'Vol. Liq. Acum. (m3)',
        accessor: 'volLiquidoAcum',
        cell: 'renderNumber',
      }, { 
        Header: 'Vol. N2 Acum. (m3 std)',
        accessor: 'volN2Acum',
        cell: 'renderNumber',
      }, { 
        Header: 'Rel. N2/Liq (m3 std/m3)',
        accessor: 'relN2Liq',
        cell: 'renderNumber',
      }, { 
        Header: 'Tiempo (min)',
        accessor: 'tiempo',
        cell: 'renderNumber',
      }
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
        { this.state.errors.cedulaData && this.state.errors.cedulaData.checked &&
          <div className="error">{this.state.errors.cedulaData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
        </div>
      </div>
    )
  }


  render() {

    return (
      <div className="form propuesta-de-acido">
        <div className='top'>
          <div className="left">
            { this.makeGeneralForm() }
            { this.makeDetallesForm() }
          </div>
          <div className="right">
            { this.makeGeomecanicaForm() }
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

    if(!values.intervalo){
      errors.intervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.longitudDeIntervalo){ 
      errors.longitudDeIntervalo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.volAparejo){ 
      errors.volAparejo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.capacidadTotalDelPozo){ 
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

    if(!values.volumenDesplazamientoGelLineal ){
       errors.volumenDesplazamientoGelLineal = {message: "Este campo no puede estar vacio"}
    }

    if(!values.moduloYoungArena ){
       errors.moduloYoungArena = {message: "Este campo no puede estar vacio"}
    }

    if(!values.moduloYoungLutitas ){
       errors.moduloYoungLutitas = {message: "Este campo no puede estar vacio"}
    }

    if(!values.relacPoissonArena ){
       errors.relacPoissonArena = {message: "Este campo no puede estar vacio"}
    }

    if(!values.relacPoissonLutatas ){
       errors.relacPoissonLutatas = {message: "Este campo no puede estar vacio"}
    }

    if(!values.gradienteDeFractura ){
       errors.gradienteDeFractura = {message: "Este campo no puede estar vacio"}
    }

    if(!values.densidadDeDisparos ){
       errors.densidadDeDisparos = {message: "Este campo no puede estar vacio"}
    }

    if(!values.diametroDeDisparos ){
       errors.diametroDeDisparos = {message: "Este campo no puede estar vacio"}
    }

    // if(!values.cedulaData){
    //   errors.cedulaData = {message: "Esta forma no puede estar vacia"}
    // }else {
    //   values.cedulaData.forEach((row, index) => {
    //     let hasEmpty = Object.values(row).find((value) => { return value.toString().trim() == '' })
    //     if(hasEmpty !== undefined){
    //         errors.cedulaData = {message: "Ningun campo puede estar vacio."}
    //     }
    //   })
    // }

    return errors
}

const mapStateToProps = state => ({
  formData: state.get('propuestaAcido'),
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
  setVolumenDesplazamientoGelLineal: val => dispatch(setVolumenDesplazamientoGelLineal(val)),
  setCedulaData: val => dispatch(setCedulaData(val)),
  setModuloYoungArena: val => dispatch(setModuloYoungArena(val)),
  setModuloYoungLutitas: val => dispatch(setModuloYoungLutitas(val)),
  setRelacPoissonArena: val => dispatch(setRelacPoissonArena(val)),
  setRelacPoissonLutatas: val => dispatch(setRelacPoissonLutatas(val)),
  setGradienteDeFractura: val => dispatch(setGradienteDeFractura(val)),
  setDensidadDeDisparos: val => dispatch(setDensidadDeDisparos(val)),
  setDiametroDeDisparos: val => dispatch(setDiametroDeDisparos(val)),
  setPropuestaCompany: val => dispatch(setPropuestaCompany(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(PropuestaDeAcido)
)
