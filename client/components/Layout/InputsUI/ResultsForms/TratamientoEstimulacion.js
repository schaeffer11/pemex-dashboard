import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import InputTable from '../../Common/InputTable'
import { InputRow, InputRowSelectUnitless, CalculatedValue } from '../../Common/InputRow'
import { setMergeTratamientoEstimulacion, setCedulaTratamientoEstimulacion } from '../../../../redux/actions/results'
import { round, calculateVolumes, getSistemaOptions, getDisabledColumnForGeneralCedula } from '../../../../lib/helpers'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { calculateValuesGeneralCedula } from '../../../../lib/formatters';

@autobind class TratamientoEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        tratamientoCompany: {
          type: 'text',
          value: '',
        },
        tipoDeColocacion: {
          type: 'text',
          value: '',
        },
        tiempoDeContacto: {
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


  async componentDidMount(){
    let { setMergeTratamientoEstimulacion, hasSubmitted } = this.props
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setMergeTratamientoEstimulacion({ hasErrors })
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(hasSubmitted) {
    let { formData, stimulationType } = this.props


    const { errors } = this.state
    let hasErrors = false
    let error 

    let items = Object.keys(errors)
    
    if (stimulationType === 'matricial') {
      items = items.filter(i => i !== 'tiempoDeContacto' && i !== 'tipoDeColocacion')
    }

    items.forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, hasSubmitted)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, hasSubmitted)
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
    let { hasErrors, setMergeTratamientoEstimulacion, formData, stimulationType } = this.props

    let hasErrorNew = false
    let items = Object.keys(errors)
    if (stimulationType === 'matricial') {
      items = items.filter(i => i !== 'tiempoDeContacto' && i !== 'tipoDeColocacion')
    }
    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    if (hasErrorNew != hasErrors) {
      setMergeTratamientoEstimulacion({ hasErrors: hasErrorNew })
    }
    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setMergeTratamientoEstimulacion } = this.props
      const hasErrors = this.checkAllInputs()
      setMergeTratamientoEstimulacion({ hasErrors })
    })
  }

  makeGeneralForm() {
    let { formData, setMergeTratamientoEstimulacion, intervals, stimulationType, companyOptions } = this.props
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
            value={tratamientoCompany}
            callback={e => setMergeTratamientoEstimulacion({ tratamientoCompany: e.value })}
            errors={this.state.errors}
          />
          <CalculatedValue
            header={<div>Intervalos</div>}
            value={intervalsDiv}
          />
          <CalculatedValue
            header={<div>Tipo de estimulación</div>}
            value={stimulationType}
          />
        </div>
      </div>
    )
  }

  makeLimpiezaForm() {
    let { setMergeTratamientoEstimulacion, formData } = this.props
    let { tipoDeColocacion, tiempoDeContacto } = formData
    const colocacionOptions = [
      { label: 'Directo', value: 'Directo'},
      { label: 'Tubería Flexible', value: 'Tuberia Flexible'}
    ]
    return (
      <div className='limpieza-form' >
        <div className='header'>
          Limpieza de Aparejo
        </div>
        <div className="input-table">
          <InputRowSelectUnitless
            header="Tipo de colocación"
            name='tipoDeColocacion'
            options={colocacionOptions}
            onBlur={this.updateErrors}
            value={tipoDeColocacion}
            callback={(e) => setMergeTratamientoEstimulacion({ tipoDeColocacion: e.value })}
            errors={this.state.errors}
          />
          <InputRow
            header="Tiempo de contacto"
            name='tiempoDeContacto'
            unit="min"
            value={tiempoDeContacto}
            onChange={(e) => setMergeTratamientoEstimulacion({ tiempoDeContacto: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors} />
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
      volumenTotalDeLiquido,
      volumenGelFractura,
      volumenGelLineal,
      volumenModificadorPermeabilidad,
      volumenEspaciador } = formData

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
            header={<div>Gel Fractura</div>}
            value={volumenGelFractura}
            unit={<div>m<sup>3</sup></div>}
          />
          <CalculatedValue
            header={<div>Gel Lineal</div>}
            value={volumenGelLineal}
            unit={<div>m<sup>3</sup></div>}
          />
          <CalculatedValue
            header={<div>Modificador de Permeabilidad</div>}
            value={volumenModificadorPermeabilidad}
            unit={<div>m<sup>3</sup></div>}
          />
          <CalculatedValue
            header={<div>Espaciador</div>}
            value={volumenEspaciador}
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

  setAllData(data) {
    const { setCedulaTratamientoEstimulacion } = this.props
    const cedulaData = calculateValuesGeneralCedula(data)
    const volumes = {
      volumenSistemaReactivo: calculateVolumes(cedulaData, 'volLiquid', 'reactivo'),
      volumenSistemaNoReativo: calculateVolumes(cedulaData, 'volLiquid', ['no-reactivo']),
      volumenSistemaDivergente: calculateVolumes(cedulaData, 'volLiquid', ['divergente']),
      volumenDesplazamientoLiquido: calculateVolumes(cedulaData, 'volLiquid', ['desplazamiento']),
      volumenDesplazamientoN2: calculateVolumes(cedulaData, 'volN2', ['desplazamientoN2']),
      volumenPrecolchonN2: calculateVolumes(cedulaData, 'volN2', ['pre-colchon']),
      volumenGelFractura: calculateVolumes(cedulaData, 'volLiquid', ['gelFractura']),
      volumenGelLineal: calculateVolumes(cedulaData, 'volLiquid', ['gelLineal']),
      volumenModificadorPermeabilidad: calculateVolumes(cedulaData, 'volLiquid', ['modificadorPermeabilidad']),
      volumenEspaciador: calculateVolumes(cedulaData, 'volLiquid', ['espaciador']),
      volumenTotalDeLiquido: calculateVolumes(cedulaData, 'volLiquid'),
    }
    setCedulaTratamientoEstimulacion(cedulaData, volumes)
  }

  makeCedulaTable() {
    let { formData } = this.props
    let { cedulaData } = formData
    const sistemaOptions = getSistemaOptions()
    const rowObj = {
      error: true,
      nombreComercial: '',
      sistema: '',
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
      { name: 'nombreComercial', type: 'text' },
      { name: 'sistema', type: 'text' },
      { name: 'volLiquid', type: 'number' },
      { name: 'gastoN2', type: 'number' },
      { name: 'gastoLiqudo', type: 'number' },
      { name: 'gastoEnFondo', type: 'number' },
      { name: 'calidad', type: 'number' },
      { name: 'volN2', type: 'number' },
      { name: 'relN2Liq', type: 'number' },
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
      },
      {
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
    let { formData, stimulationType } = this.props

    return (
      <div className="form propuesta-de-estimulacion">
        <div className='top'>
          { this.makeCedulaTable() }
        </div>
        <div className='bot'>
          <div className="left">
            { this.makeGeneralForm() }
            { this.makeDetallesForm() }
            { stimulationType === 'limpieza' ? this.makeLimpiezaForm() : null}
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
  formData: state.get('tratamientoEstimulacion').toJS(),
  hasErrors: state.getIn(['tratamientoEstimulacion', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  intervals: state.getIn(['resultsMeta', 'intervals']).toJS(),
  stimulationType: state.getIn(['resultsMeta', 'stimulationType']),
  companyOptions: state.getIn(['global', 'companyOptions'])
})

const mapDispatchToProps = dispatch => ({
  setMergeTratamientoEstimulacion: (value) => {
    dispatch(setMergeTratamientoEstimulacion(value))
  },
  setCedulaTratamientoEstimulacion: (cedula, volumes) => {
    dispatch(setCedulaTratamientoEstimulacion(cedula, volumes))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TratamientoEstimulacion) 
