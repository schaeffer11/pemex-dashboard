import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import InputTable from '../../Common/InputTable'
import { InputRow, InputRowSelectUnitless, CalculatedValue } from '../../Common/InputRow'
import { setMergeTratamientoTermico, setCedulaTratamientoTermico } from '../../../../redux/actions/results'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { calculateValuesTermicaCedula } from '../../../../lib/formatters'

@autobind class TratamientoTermico extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        tratamientoCompany: {
          type: 'text',
          value: '',
        },
        volumenVapor: {
          type: 'text',
          value: '',
        },
        calidad: {
          type: 'text',
          value: '',
        },
        gastoInyeccion: {
          type: 'text',
          value: '',
        },
        presionMaximaSalidaGenerador: {
          type: 'text',
          value: '',
        },
        temperaturaMaximaGenerador: {
          type: 'text',
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
    let { setMergeTratamientoTermico, hasSubmitted } = this.props
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setMergeTratamientoTermico({ hasErrors })
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
    let { hasErrors, setMergeTratamientoTermico } = this.props

    let hasErrorNew = false
    let items = Object.keys(errors)
    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    if (hasErrorNew != hasErrors) {
      setMergeTratamientoTermico({ hasErrors: hasErrorNew })
    }
    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setMergeTratamientoTermico } = this.props
      const hasErrors = this.checkAllInputs()
      setMergeTratamientoTermico({ hasErrors })
    })
  }

  makeGeneralForm() {
    let { formData, setMergeTratamientoTermico, intervals, companyOptions } = this.props
    let { tratamientoCompany, volumenVapor, calidad, gastoInyeccion, presionMaximaSalidaGenerador, temperaturaMaximaGenerador } = formData

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
            callback={e => setMergeTratamientoTermico({ tratamientoCompany: e.value })}
            errors={this.state.errors}
          />
          <CalculatedValue
            header={<div>Intervalos</div>}
            value={intervalsDiv}
          />
          <InputRow
            header="Volumen de vapor a inyectar"
            name='volumenVapor'
            unit="ton"
            value={volumenVapor}
            onChange={(e) => setMergeTratamientoTermico({ volumenVapor: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Calidad"
            name='calidad'
            unit="%"
            value={calidad}
            onChange={(e) => setMergeTratamientoTermico({ calidad: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Gasto de inyección"
            name='gastoInyeccion'
            unit="GPM"
            value={gastoInyeccion}
            onChange={(e) => setMergeTratamientoTermico({ gastoInyeccion: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Presión máxima de salida del generador"
            name='presionMaximaSalidaGenerador'
            unit="psi"
            value={presionMaximaSalidaGenerador}
            onChange={(e) => setMergeTratamientoTermico({ presionMaximaSalidaGenerador: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Temperatura máxima del generador"
            name='temperaturaMaximaGenerador'
            unit="°C"
            value={temperaturaMaximaGenerador}
            onChange={(e) => setMergeTratamientoTermico({ temperaturaMaximaGenerador: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
        </div>
      </div>
    )
  }
  
  setAllData(data) {
    const { setCedulaTratamientoTermico } = this.props
    const cedulaData = calculateValuesTermicaCedula(data)
    setCedulaTratamientoTermico(cedulaData)
  }

  makeCedulaTable() {
    let { formData } = this.props
    let { cedulaData } = formData
    const rowObj = {
      error: true,
      actividad: '',
      descripcion: '',
      justificacion: '',
    }

    const errors = [
      { name: 'actividad', type: 'text' },
      { name: 'descripcion', type: 'text' },
      { name: 'justificacion', type: 'text' },
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
        Header: 'Actividad',
        accessor: 'actividad',
        cell: 'renderEditable',
      },
      {
        Header: 'Descripción',
        accessor: 'descripcion',
        cell: 'renderTextarea',
      },
      {
        Header: 'Justificación',
        accessor: 'justificacion',
        cell: 'renderTextarea',
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
      <div className="form propuesta-de-estimulacion">
        <div className='top'>
          { this.makeCedulaTable() }
        </div>
        <div className='bot'>
          <div className="left">
            { this.makeGeneralForm() }
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
  formData: state.get('tratamientoTermico').toJS(),
  hasErrors: state.getIn(['tratamientoTermico', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  intervals: state.getIn(['resultsMeta', 'intervals']).toJS(),
  companyOptions: state.getIn(['global', 'companyOptions'])
})

const mapDispatchToProps = dispatch => ({
  setMergeTratamientoTermico: (value) => {
    dispatch(setMergeTratamientoTermico(value))
  },
  setCedulaTratamientoTermico: (cedula, volumes) => {
    dispatch(setCedulaTratamientoTermico(cedula, volumes))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TratamientoTermico) 
