import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import InputTable from '../../Common/InputTable'
import { CalculatedValue, InputRow, InputRowSelectUnitless } from '../../Common/InputRow'
import { setMergeTratamientoAcido, setCedulaTratamientoAcido } from '../../../../redux/actions/results'
import { round, calculateVolumes, getSistemaOptions, getDisabledColumnForGeneralCedula, companyOptions } from '../../../../lib/helpers'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { calculateValuesGeneralCedula } from '../../../../lib/formatters';

@autobind class TratamientoAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
          tratamientoCompany: {
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
          }
      }
    }
  }

  componentDidMount(){
    let { setMergeTratamientoAcido, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setMergeTratamientoAcido({ hasErrors })
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props
    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
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
    let { hasErrors, setMergeTratamientoAcido } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setMergeTratamientoAcido({ hasErrors: hasErrorNew })
    }

    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setMergeTratamientoAcido } = this.props
      const hasErrors = this.checkAllInputs()
      setMergeTratamientoAcido({ hasErrors })
    })
  }


  makeGeneralForm() {
    let { formData, setMergeTratamientoAcido, intervals } = this.props
    let { tratamientoCompany } = formData

    const intervalsDiv = intervals.map(elem => <div key={`intervalo_${elem}`}>{elem}</div>)

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <div className="input-table">
          <InputRowSelectUnitless
            header="Compañía Seleccionada para el Tratamiento"
            name="tratamientoCompany"
            options={companyOptions}
            onBlur={this.updateErrors}
            errors={this.state.errors}
            value={tratamientoCompany}
            callback={e => setMergeTratamientoAcido({ tratamientoCompany: e.value })}
          />
          <CalculatedValue
            header={<div>Intervalos</div>}
            value={intervalsDiv}
          />
        </div>
      </div>
    )
  }

  makeDetallesForm() {
    let { formData } = this.props
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
        <div className="input-table">
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
      </div>
    )
  }

  makeGeomecanicaForm() {
    let { setMergeTratamientoAcido, formData } = this.props
    // formData = formData.toJS()
    let { moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = formData
    
    return (
      <div className='geomecanica-form' >
        <div className='header'>
          Información de Geomecánica
        </div>
        <div className="input-table">
          <InputRow header="Módulo young arena" name='moduloYoungArena' value={moduloYoungArena} onChange={e => setMergeTratamientoAcido({ moduloYoungArena: e })} unit='psi'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Módulo young lutitas" name='moduloYoungLutitas' value={moduloYoungLutitas} onChange={e => setMergeTratamientoAcido({ moduloYoungLutitas: e })} unit='psi'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Relac. poisson arena" name='relacPoissonArena' value={relacPoissonArena} onChange={e => setMergeTratamientoAcido({ relacPoissonArena: e })} unit='adim'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Relac. poisson lutitas" name='relacPoissonLutatas' value={relacPoissonLutatas} onChange={e => setMergeTratamientoAcido({ relacPoissonLutatas: e })} unit='adim'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Gradiente de fractura" name='gradienteDeFractura' value={gradienteDeFractura} onChange={e => setMergeTratamientoAcido({ gradienteDeFractura: e })} unit='psi/ft'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Densidad de disparos" name='densidadDeDisparos' value={densidadDeDisparos} onChange={e => setMergeTratamientoAcido({ densidadDeDisparos: e })} unit='c/m'  errors={this.state.errors} onBlur={this.updateErrors}/>
          <InputRow header="Diámetro de disparos" name='diametroDeDisparos' value={diametroDeDisparos} onChange={e => setMergeTratamientoAcido({ diametroDeDisparos: e })} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        </div>
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

  setAllData(data) {
    const { setCedulaTratamientoAcido } = this.props
    const cedulaData = calculateValuesGeneralCedula(data)
    const volumes = {
      volumenSistemaReactivo: calculateVolumes(cedulaData, 'volLiquid', 'reactivo'),
      volumenSistemaNoReativo: calculateVolumes(cedulaData, 'volLiquid', 'no-reactivo'),
      volumenSistemaDivergente: calculateVolumes(cedulaData, 'volLiquid', 'divergente'),
      volumenDesplazamientoLiquido: calculateVolumes(cedulaData, 'volLiquid', 'desplazamiento'),
      volumenDesplazamientoN2: calculateVolumes(cedulaData, 'volN2', 'desplazamiento'),
      volumenPrecolchonN2: calculateVolumes(cedulaData, 'volN2', 'pre-colchon'),
      volumenTotalDeLiquido: calculateVolumes(cedulaData, 'volLiquid'),
    }
    setCedulaTratamientoAcido(cedulaData, volumes)
  }

  makeCedulaTable() {
    let { formData } = this.props
    let { cedulaData } = formData
    const sistemaOptions = getSistemaOptions()
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
            disabledColumns={getDisabledColumnForGeneralCedula}
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

    return (
      <div className="form propuesta-de-acido">
        <div className='top'>
          { this.makeCedulaTable() }
        </div>
        <div className='bot'>
          <div className="left">
            { this.makeGeneralForm() }
            { this.makeDetallesForm() }
            { this.makeGeomecanicaForm() }
          </div>
          <div className="right">
            <div className='image'/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('tratamientoAcido').toJS(),
  intervals: state.getIn(['resultsMeta', 'intervals']),
  hasErrors: state.getIn(['tratamientoAcido', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setMergeTratamientoAcido: (value) => {
    dispatch(setMergeTratamientoAcido(value))
  },
  setCedulaTratamientoAcido: (cedula, volumes) => {
    dispatch(setCedulaTratamientoAcido(cedula, volumes))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TratamientoAcido)
