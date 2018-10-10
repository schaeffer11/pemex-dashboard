import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputTable from '../../../Common/InputTable'
import ReactTable from 'react-table'
import Select from 'react-select'
import { connect } from 'react-redux'

import { InputRow, CalculatedValue, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setHasErrorsPropuestaApuntalado, setCedulaData, setModuloYoungArena, setModuloYoungLutitas, 
  setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, 
  setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, 
  setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, 
  setPropuestaCompany } from '../../../../../redux/actions/intervencionesApuntalado'
import { round, calculateVolumes, getSistemaOptions } from '../helpers'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'

@autobind class PropuestaDeApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
          propuestaCompany: {
            type: 'text',
            value: '',
          },
          moduloYoungArena: {
            type: 'number',
            value: '',
          },
          moduloYoungLutitas: {
            type: 'number',
            value: '',
          },
          relacPoissonArena: {
            type: 'number',
            value: '',
          },
          relacPoissonLutatas: {
            type: 'number',
            value: '',
          },
          gradienteDeFractura: {
            type: 'number',
            value: '',
          },
          densidadDeDisparos: {
            type: 'number',
            value: '',
          },
          diametroDeDisparos: {
            type: 'number',
            value: '',
          },
          cedulaTable: {
            type: 'table',
            value: '',
          },
      }
    }
  }

  componentDidMount(){
    let { setHasErrorsPropuestaApuntalado, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsPropuestaApuntalado(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, showErrors)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, showErrors)
      }

      error === true ? hasErrors = true : null
    })

    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsPropuestaApuntalado } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsPropuestaApuntalado(hasErrorNew)
    }

    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsPropuestaApuntalado } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsPropuestaApuntalado(hasErrors)
    })
  }

  makeGeneralForm() {
    let { formData, setPropuestaCompany, intervalos } = this.props
    formData = formData.toJS()
    intervalos = intervalos.toJS()
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

    const intervals = intervalos.map(elem => <div key={`intervalo_${elem.cimaMD}-${elem.baseMD}`}>{`${elem.cimaMD}-${elem.baseMD}`}</div>)

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowSelectUnitless
          header="Compañía Seleccionada para el Tratamiento"
          name="propuestaCompany"
          options={companyOptions}
          onBlur={this.updateErrors}
          errors={this.state.errors}
          value={propuestaCompany}
          callback={e => setPropuestaCompany(e.value)}
        />
        <CalculatedValue
          header={<div>Intervalos</div>}
          value={intervals}
        />
      </div>
    )
  }

  makeDetallesForm() {
    let { formData } = this.props
    formData = formData.toJS()
    const { volumenSistemaReactivo,
      volumenSistemaNoReativo,
      volumenSistemaDivergente,
      volumenDesplazamientoLiquido,
      volumenDesplazamientoN2,
      volumenPrecolchonN2,
      volumenTotalDeLiquido } = formData

    return (
      <div className='detalles-form' >
        <div className='header'>
          Volúmenes
        </div>
        <CalculatedValue
          header={<div>Precolchón N<sub>2</sub></div>}
          value={volumenPrecolchonN2}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Sistema no reactivo</div>}
          value={volumenSistemaNoReativo}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Sistema reactivo</div>}
          value={volumenSistemaReactivo}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Sistema divergente</div>}
          value={volumenSistemaDivergente}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Desplazamiento líquido</div>}
          value={volumenDesplazamientoLiquido}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Desplazamiento N<sub>2</sub></div>}
          value={volumenDesplazamientoN2}
          unit={<div>m<sup>3</sup></div>} 
        />
        <CalculatedValue
          header={<div>Total de líquido</div>}
          value={volumenTotalDeLiquido}
          unit={<div>m<sup>3</sup></div>} 
        />
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
          Información de Geomecánica
        </div>
        <InputRow header="Módulo young arena" name='moduloYoungArena' value={moduloYoungArena} onChange={setModuloYoungArena} unit='psi'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Módulo young lutitas" name='moduloYoungLutitas' value={moduloYoungLutitas} onChange={setModuloYoungLutitas} unit='psi'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Relac. poisson arena" name='relacPoissonArena' value={relacPoissonArena} onChange={setRelacPoissonArena} unit='adim'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Relac. poisson lutatas" name='relacPoissonLutatas' value={relacPoissonLutatas} onChange={setRelacPoissonLutatas} unit='adim'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Gradiente de fractura" name='gradienteDeFractura' value={gradienteDeFractura} onChange={setGradienteDeFractura} unit='psi/ft'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Densidad de disparos" name='densidadDeDisparos' value={densidadDeDisparos} onChange={setDensidadDeDisparos} unit='c/m'  errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Diámetro de disparos" name='diametroDeDisparos' value={diametroDeDisparos} onChange={setDiametroDeDisparos} unit='pg'  errors={this.state.errors} onBlur={this.updateErrors}/>
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
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    cedulaData[row.index][row.column.id] = e

    setCedulaData(cedulaData)
  }

  setAllData(data) {
    const { setCedulaData } = this.props
    const cedulaData = data.map((row, i) => {
      let { sistema, relN2Liq, gastoLiqudo, volLiquid } = row
      if (sistema === 'desplazamientoN2' || sistema === 'pre-colchon') {
        row.volLiquid = 0
        row.gastoLiqudo = 0
        row.relN2Liq = 0
        row.tiempo = round(row.volN2 / row.gastoN2)
      } else {
        row.gastoN2 = round(relN2Liq / 6.291 * gastoLiqudo)
        row.volN2 = round((6.291 * volLiquid / gastoLiqudo) * row.gastoN2)
        row.tiempo = round((volLiquid * 6.291) / gastoLiqudo)
      }
      const prev = data[i - 1]
      row.volLiquidoAcum = prev ? round(parseFloat(prev.volLiquidoAcum) + parseFloat(row.volLiquid)) : row.volLiquid
      row.volN2Acum = prev ? round(parseFloat(prev.volN2Acum) + parseFloat(row.volN2)) : row.volN2
      return row
    })

    const volumes = {
      volumenSistemaReactivo: calculateVolumes(cedulaData, 'volLiquid', 'reactivo'),
      volumenSistemaNoReativo: calculateVolumes(cedulaData, 'volLiquid', 'no-reactivo'),
      volumenSistemaDivergente: calculateVolumes(cedulaData, 'volLiquid', 'divergente'),
      volumenDesplazamientoLiquido: calculateVolumes(cedulaData, 'volLiquid', 'desplazamiento'),
      volumenDesplazamientoN2: calculateVolumes(cedulaData, 'volN2', 'desplazamiento'),
      volumenPrecolchonN2: calculateVolumes(cedulaData, 'volN2', 'pre-colchon'),
      volumenTotalDeLiquido: calculateVolumes(cedulaData, 'volLiquid'),
    }
    setCedulaData(cedulaData, volumes)
  }

  makeCedulaTable() {
    let { formData, setCedulaData, intervalos } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData
    intervalos = intervalos.toJS()

    const intervaloOptions = intervalos.map(elem =>({
      value: `${elem.cimaMD}-${elem.baseMD}`,
      label: `${elem.cimaMD}-${elem.baseMD}`,
    }))
    
    const sistemaOptions = getSistemaOptions()

    // const objectTemplate = {}
    const rowObj = {
      error: true,
      sistema: '',
      nombreComercial: '',
      tipoDeApuntalante: '',
      concentraciDeApuntalante: '',
      volLiquid: '',
      gastoN2: '',
      gastoLiqudo: '',
      gastoEnFondo: '',
      calidad: '',
      volN2: '',
      volLiquidoAcum: '',
      volN2Acum: '',
      relN2Liq: '',
      tiempo: '',
    }

    const errors = [
      { name: 'sistema', type: 'text' },
      { name: 'nombreComercial', type: 'text' },
      { name: 'tipoDeApuntalante', type: 'text' },
      { name: 'concentraciDeApuntalante', type: 'number' },
      { name: 'volLiquid', type: 'number' },
      { name: 'gastoN2', type: 'number' },
      { name: 'gastoLiqudo', type: 'number' },
      { name: 'gastoEnFondo', type: 'number' },
      { name: 'calidad', type: 'number' },
      { name: 'volN2', type: 'number' },
      { name: 'relN2Liq', type: 'number' },
    ]

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
        Header: 'Sistema',
        accessor: 'sistema',
        cell: 'renderSelect',
        style: {overflow: 'visible'},
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
        Header: <div>Concentración de Apuntalante<br/>(lbm/gal)</div>,
        accessor: 'concentraciDeApuntalante',
        cell: 'renderNumber',
      },
      {
        Header: <div>Vol. Liq.<br/>(m<sup>3</sup>)</div>,
        accessor: 'volLiquid',
        cell: 'renderNumberDisable',
      },
      { 
        Header: <div>Gasto Líquido<br/>(bpm)</div>,
        accessor: 'gastoLiqudo',
        cell: 'renderNumberDisable',
      },
      {
        Header: <div>Rel. N<sub>2</sub>/Liq<br/>(m<sup>3</sup>std/m<sup>3)</sup></div>,
        accessor: 'relN2Liq',
        cell: 'renderNumberDisable',
      },
      {
        Header: <div>Calidad<br/>(%)</div>,
        accessor: 'calidad',
        cell: 'renderNumber',
      },
      { 
        Header: <div>Gasto en fondo<br/>(bpm)</div>,
        accessor: 'gastoEnFondo',
        cell: 'renderNumber',
      },
      { 
        Header: <div>Gasto N<sub>2</sub><br/>(m<sup>3</sup>/min)</div>,
        accessor: 'gastoN2',
        cell: 'renderNumberDisable',
      }, 
      { 
        Header: <div>Vol. N<sub>2</sub><br/>(m<sup>3</sup> std)</div>,
        accessor: 'volN2',
        cell: 'renderNumberDisable'
      },
      { 
        Header: <div>Vol. Liq. Acum.<br/>(m<sup>3</sup>)</div>,
        accessor: 'volLiquidoAcum',
      },
      { 
        Header: <div>Vol. N<sub>2</sub> Acum.<br/>(m<sup>3</sup> std)</div>,
        accessor: 'volN2Acum',
      },     
      { 
        Header: <div>Tiempo<br/>(min)</div>,
        accessor: 'tiempo',
      },
    ]
    return (
      <div className='generales-form' >
        <div className='header'>
          Cédula De Tratamiento
        </div>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={cedulaData}
            selectOptions={sistemaOptions}
            setData={this.setAllData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={val => this.checkForErrors(val, 'cedulaTable')}
            isCedula
          />
        </div>
      </div>
    )
  }


  render() {
    console.log('mounting propuesta')
    
    return (
      <div className="form propuesta-de-apuntalado">
        <div className='top'>
          <div className="left">
            { this.makeGeneralForm() }
            { this.makeDetallesForm() }
            { this.makeGeomecanicaForm() }
          </div>
          <div className="right">
            <div className='image'/>
          </div>
        </div>
        <div className='bot'>
          { this.makeCedulaTable() }       
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('propuestaApuntalado'),
  intervalos: state.getIn(['evaluacionPetrofisica', 'layerData']),
  hasErrors: state.getIn(['propuestaApuntalado', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
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
  setCedulaData: (cedula, volumes = null) => dispatch(setCedulaData(cedula, volumes)),
  setModuloYoungArena: val => dispatch(setModuloYoungArena(val)),
  setModuloYoungLutitas: val => dispatch(setModuloYoungLutitas(val)),
  setRelacPoissonArena: val => dispatch(setRelacPoissonArena(val)),
  setRelacPoissonLutatas: val => dispatch(setRelacPoissonLutatas(val)),
  setGradienteDeFractura: val => dispatch(setGradienteDeFractura(val)),
  setDensidadDeDisparos: val => dispatch(setDensidadDeDisparos(val)),
  setDiametroDeDisparos: val => dispatch(setDiametroDeDisparos(val)),
  setPropuestaCompany: val => dispatch(setPropuestaCompany(val)),
  setHasErrorsPropuestaApuntalado: val => dispatch(setHasErrorsPropuestaApuntalado(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaDeApuntalado)
