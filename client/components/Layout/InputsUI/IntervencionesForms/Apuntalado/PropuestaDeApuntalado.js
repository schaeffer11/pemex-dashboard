import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputTable from '../../../Common/InputTable'
import ReactTable from 'react-table'
import Select from 'react-select'
import { connect } from 'react-redux'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setCedulaData, setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, setChecked, setPropuestaCompany } from '../../../../../redux/actions/intervencionesApuntalado'


@autobind class PropuestaDeApuntalado extends Component {
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
        <InputRowSelectUnitless
          header="Compañía"
          name="company"
          options={companyOptions}
          onBlur={this.validate}
          value={propuestaCompany}
          callback={e => setPropuestaCompany(e.value)}
        />

        {/* <InputRowUnitless header="Intervalo(s)" name='intervalo' value={intervalo} onChange={setIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Longitud de intervalo a tratar" name='longitudDeIntervalo' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Vol. Aparejo (VAP)" name='longitudDeIntervalo' unit={<div>m<sup>3</sup></div>} value={volAparejo} onChange={setVolAparejo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Capacidad total del pozo (cima/base)" name='capacidadTotalDelPozo' unit={<div>m<sup>3</sup>/m<sup>3</sup></div>} value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo} errors={this.state.errors} onBlur={this.validate}/> */}

      </div>
    )
  }

  // makeGeneralForm() {
  //   let { setIntervalo, intervalos, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, formData } = this.props
  //   formData = formData.toJS()
  //   let { intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo } = formData

  //   return (
  //     <div className='general-form' >
  //       <div className='header'>
  //         General
  //       </div>
  //       <InputRowUnitless header="Intervalo(s)" name='intervalo' value={intervalo} onChange={setIntervalo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Longitud de intervalo a tratar" name='longitudDeIntervalo' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Vol. Aparejo (VAP)" name='longitudDeIntervalo' unit='m3' value={volAparejo} onChange={setVolAparejo} errors={this.state.errors} onBlur={this.validate}/>
  //       <InputRow header="Capacidad total del pozo (cima/base)" name='capacidadTotalDelPozo' unit='m3/m3' value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo} errors={this.state.errors} onBlur={this.validate}/>
  //     </div>
  //   )
  // }

  makeDetallesForm() {
    let { setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, formData } = this.props
    formData = formData.toJS()
    let { volumenPrecolchonN2, volumenDeApuntalante, volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido } = formData
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        {/* <InputRow header={<div>Volumen precolchón N<sub>2</sub></div>} name='volumenPrecolchonN2' unit={<div>m<sup>3</sup></div>} value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen de apuntalante" name='volumenDeApuntalante' unit={<div>m<sup>3</sup></div>} value={volumenDeApuntalante} onChange={setVolumenDeApuntalante} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen de gel de fractura" name='volumenDeGelDeFractura' unit={<div>m<sup>3</sup></div>} value={volumenDeGelDeFractura} onChange={setVolumenDeGelDeFractura} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen desplazamiento" name='volumenDesplazamiento' unit={<div>m<sup>3</sup></div>} value={volumenDesplazamiento} onChange={setVolumenDesplazamiento} errors={this.state.errors} onBlur={this.validate}/>
        <InputRow header="Volumen total de líquido" name='volumenTotalDeLiquido' unit={<div>m<sup>3</sup></div>} value={volumenTotalDeLiquido} onChange={setVolumenTotalDeLiquido} errors={this.state.errors} onBlur={this.validate}/> */}

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
    intervalos = intervalos.toJS()
    let { cedulaData } = formData

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
    const objectTemplate = {}
    let length = 1
    if (cedulaData) {
      length = cedulaData.length
    }
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
            pageSize={length}
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
      <div className="form propuesta-de-apuntalado">
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

    if(!values.moduloYoungArena){
      errors.moduloYoungArena = {message: "Este campo no puede estar vacio"}
    }

    if(!values.moduloYoungLutitas){
      errors.moduloYoungLutitas = {message: "Este campo no puede estar vacio"}
    }

    if(!values.relacPoissonArena){
      errors.relacPoissonArena = {message: "Este campo no puede estar vacio"}
    }

    if(!values.relacPoissonLutatas){
      errors.relacPoissonLutatas = {message: "Este campo no puede estar vacio"}
    }

    if(!values.gradienteDeFractura){
      errors.gradienteDeFractura = {message: "Este campo no puede estar vacio"}
    }

    if(!values.densidadDeDisparos){
      errors.densidadDeDisparos = {message: "Este campo no puede estar vacio"}
    }

    if(!values.diametroDeDisparos){
      errors.diametroDeDisparos = {message: "Este campo no puede estar vacio"}
    }

    if(!values.cedulaData){
      errors.cedulaData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.cedulaData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.cedulaData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  formData: state.get('propuestaApuntalado'),
  intervalos: state.getIn(['evaluacionPetrofisica', 'layerData']),
})

const mapDispatchToProps = dispatch => ({
  setIntervalo: val => dispatch(setIntervalo(val)),
  setLongitudDeIntervalo: val => dispatch(setLongitudDeIntervalo(val)),
  setVolAparejo: val => dispatch(setVolAparejo(val)),
  setCapacidadTotalDelPozo: val => dispatch(setCapacidadTotalDelPozo(val)),
  setVolumenPrecolchonN2: val => dispatch(setVolumenPrecolchonN2(val)),
  setVolumenDeApuntalante: val => dispatch(setVolumenDeApuntalante(val)),
  setVolumenDeGelDeFractura: val => dispatch(setVolumenDeGelDeFractura(val)),
  setVolumenDesplazamiento: val => dispatch(setVolumenDesplazamiento(val)),
  setVolumenTotalDeLiquido: val => dispatch(setVolumenTotalDeLiquido(val)),
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
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(PropuestaDeApuntalado)
)
