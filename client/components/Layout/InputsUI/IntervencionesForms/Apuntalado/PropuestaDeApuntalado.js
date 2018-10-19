import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputTable from '../../../Common/InputTable'
import { connect } from 'react-redux'

import { InputRow, CalculatedValue, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setHasErrorsPropuestaApuntalado, setCedulaData, setModuloYoungArena, setModuloYoungLutitas, 
  setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, 
  setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, 
  setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, 
  setPropuestaCompany } from '../../../../../redux/actions/intervencionesApuntalado'
import { round, calculateVolumes, getSistemaApuntaladoOptions, getDisabledColumnForApuntaladoCeluda } from '../../../../../lib/helpers'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'
import { calculateValuesApuntaladoCedula } from '../../../../../lib/formatters';

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
      else if (errObj.type === 'table') {
        error = errObj.value === '' ? true : errObj.value
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

    const {
      volumenPrecolchonN2,
      volumenGelFractura,
      volumenDesplazamientoLiquido,
      volumenTotalDeLiquido,
      volumenApuntalante
    } = formData

    return (
      <div className='detalles-form' >
        <div className='header'>
          Volúmenes
        </div>
        <CalculatedValue
          header={<div>Precolchón</div>}
          value={volumenPrecolchonN2}
          unit={<div>U.S. Gal</div>} 
        />
        <CalculatedValue
          header={<div>Apuntalante</div>}
          value={volumenApuntalante}
          unit={<div>sacos</div>} 
        />
        <CalculatedValue
          header={<div>Gel de fractura</div>}
          value={volumenGelFractura}
          unit={<div>U.S. Gal</div>} 
        />
        <CalculatedValue
          header={<div>Desplazamiento líquido</div>}
          value={volumenDesplazamientoLiquido}
          unit={<div>U.S. Gal</div>} 
        />
        <CalculatedValue
          header={<div>Total de líquido</div>}
          value={volumenTotalDeLiquido}
          unit={<div>U.S. Gal</div>} 
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
    const cedulaData = calculateValuesApuntaladoCedula(data)
    const volumes = {
      volumenPrecolchonN2: calculateVolumes(cedulaData, 'volLiquido', ['pre-pad']),
      volumenGelFractura: calculateVolumes(cedulaData, 'volLiquido', ['pad', 'pad-proppant']),
      volumenDesplazamientoLiquido: calculateVolumes(cedulaData, 'volLiquido', ['flush']),
      volumenTotalDeLiquido: calculateVolumes(cedulaData, 'volLiquido'),
      volumenApuntalante: cedulaData[cedulaData.length - 1].apuntalanteAcumulado / 100
    }
    setCedulaData(cedulaData, volumes)
  }

  makeCedulaTable() {
    let { formData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData
    const sistemaOptions = getSistemaApuntaladoOptions()
    const rowObj = {
      error: true,
      sistema: '',
      nombreComercial: '',
      tipoDeFluido: '',
      tipoDeApuntalante: '',
      volLiquido: '',
      volLechada: '',
      gastoSuperficie: '',
      gastoN2Superficie: '',
      gastoEnFondo: '',
      calidadN2Fondo: '',
      volEspumaFondo: '',
      concentracionApuntalanteSuperficie: '',
      concentracionApuntalanteFondo: '',
      apuntalanteAcumulado: '',
      tiempo: ''
    }

    const errors = [
      { name: 'sistema', type: 'text' },
      { name: 'nombreComercial', type: 'text' },
      { name: 'tipoDeFluido', type: 'text' },
      { name: 'tipoDeApuntalante', type: 'number' },
      { name: 'volLiquido', type: 'number' },
      { name: 'volLechada', type: 'number' },
      { name: 'gastoSuperficie', type: 'number' },
      { name: 'gastoN2Superficie', type: 'number' },
      { name: 'gastoEnFondo', type: 'number' },
      { name: 'calidadN2Fondo', type: 'number' },
      { name: 'volEspumaFondo', type: 'number' },
      { name: 'concentracionApuntalanteSuperficie', type: 'number' },
      { name: 'concentracionApuntalanteFondo', type: 'number' },
      { name: 'apuntalanteAcumulado', type: 'number' },
      { name: 'tiempo', type: 'number' },
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
        Header: 'Tipo de Fluido',
        accessor: 'tipoDeFluido',
        cell: 'renderEditable',
      },
      {
        Header: 'Tipo de Apuntalante',
        accessor: 'tipoDeApuntalante',
        cell: 'renderEditable',
      },
      {
        Header: <div>Vol. Liq.<br/>(U.S. Gal)</div>,
        accessor: 'volLiquido',
        cell: 'renderNumber',
      },
      {
        Header: <div>Vol. de la Lechada.<br/>(bbl)</div>,
        accessor: 'volLechada',
        cell: 'renderNumber',
      },
      {
        Header: <div>Gasto en Superficie<br/>(bbl)</div>,
        accessor: 'gastoSuperficie',
        cell: 'renderNumber',
      },
      {
        Header: <div>Gasto N<sub>2</sub> Superficie<br/>(m<sup>3</sup>/min)</div>,
        accessor: 'gastoN2Superficie',
        cell: 'renderNumber',
      },
      {
        Header: <div>Gasto Total Fondo<br/>(m<sup>3</sup>)</div>,
        accessor: 'gastoEnFondo',
        cell: 'renderNumber',
      },
      {
        Header: <div>Calidad N<sub>2</sub><br/>(%)</div>,
        accessor: 'calidadN2Fondo',
        cell: 'renderNumber',
      },
      {
        Header: <div>Vol. Espuma Fondo.<br/>(U.S. Gal)</div>,
        accessor: 'volEspumaFondo',
        cell: 'renderNumber',
      },
      {
        Header: <div>Concentración de Apuntalante Superficie<br/>(lbm/gal)</div>,
        accessor: 'concentracionApuntalanteSuperficie',
        cell: 'renderNumber',
      },
      {
        Header: <div>Concentración de Apuntalante Fondo<br/>(lbm/gal)</div>,
        accessor: 'concentracionApuntalanteFondo',
        cell: 'renderNumber',
      },
      {
        Header: <div>Apuntalante Acumulado<br/>(lbm/gal)</div>,
        accessor: 'apuntalanteAcumulado',
      },
      { 
        Header: <div>Tiempo<br/>(min)</div>,
        accessor: 'tiempo',
        cell: 'renderNumberDisable',
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
            disabledColumns={getDisabledColumnForApuntaladoCeluda}
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
