import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import InputTable from '../../../Common/InputTable'
import { InputRow, InputRowSelectUnitless, CalculatedValue } from '../../../Common/InputRow'
import { setMergePropuestaTermica, setCedulaPropuestaTermica } from '../../../../../redux/actions/intervencionesTermica'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers'
import { calculateValuesTermicaCedula } from '../../../../../lib/formatters';

@autobind class PropuestaTermica extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        propuestaCompany: {
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
    let { setMergePropuestaTermica, hasSubmitted } = this.props
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setMergePropuestaTermica({ hasErrors })
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
    console.log('errors', errors)
    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { hasErrors, setMergePropuestaTermica } = this.props

    let hasErrorNew = false
    let items = Object.keys(errors)
    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })
    if (hasErrorNew != hasErrors) {
      setMergePropuestaTermica({ hasErrors: hasErrorNew })
    }
    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setMergePropuestaTermica } = this.props
      const hasErrors = this.checkAllInputs()
      setMergePropuestaTermica({ hasErrors })
    })
  }

  makeGeneralForm() {
    let { formData, setMergePropuestaTermica, intervals } = this.props
    let { propuestaCompany, volumenVapor, calidad, gastoInyeccion, presionMaximaSalidaGenerador, temperaturaMaximaGenerador } = formData
    const companyOptions = [
      { label: 'Halliburton', value: 'Halliburton' },
      { label: 'Schlumberger', value: 'Schlumberger' },
      { label: 'PFM', value: 'PFM' },
      { label: 'Chemiservices', value: 'Chemiservices' },
      { label: 'BJ', value: 'BJ' },
      { label: 'Weatherford',
      value: 'Weatherford' }
    ]
    const intervalsDiv = intervals.map(elem => (
      <div key={`intervalo_${elem.cimaMD}-${elem.baseMD}`}>
        {`${elem.cimaMD}-${elem.baseMD}`}
      </div>
    ))

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <div className="input-table">
          <InputRowSelectUnitless
            header="Compañía Seleccionada para el Tratamiento"
            name="propuestaCompany"
            options={companyOptions}
            onBlur={this.updateErrors}
            value={propuestaCompany}
            callback={e => setMergePropuestaTermica({ propuestaCompany: e.value })}
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
            onChange={(e) => setMergePropuestaTermica({ volumenVapor: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Calidad"
            name='calidad'
            unit="%"
            value={calidad}
            onChange={(e) => setMergePropuestaTermica({ calidad: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Gasto de inyección"
            name='gastoInyeccion'
            unit="GPM"
            value={gastoInyeccion}
            onChange={(e) => setMergePropuestaTermica({ gastoInyeccion: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Presión máxima de salida del generador"
            name='presionMaximaSalidaGenerador'
            unit="psi"
            value={presionMaximaSalidaGenerador}
            onChange={(e) => setMergePropuestaTermica({ presionMaximaSalidaGenerador: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
          <InputRow
            header="Temperatura máxima del generador"
            name='temperaturaMaximaGenerador'
            unit="psi"
            value={temperaturaMaximaGenerador}
            onChange={(e) => setMergePropuestaTermica({ temperaturaMaximaGenerador: e })}
            errors={this.state.errors}
            onBlur={this.updateErrors}
          />
        </div>
      </div>
    )
  }
  
  setAllData(data) {
    const { setCedulaPropuestaTermica } = this.props
    const cedulaData = calculateValuesTermicaCedula(data)
    setCedulaPropuestaTermica(cedulaData)
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
      <div className="form propuesta-termica">
        <div className='top'>
          { this.makeCedulaTable() }
        </div>
        <div className='bot'>
          <div className="left">
            { this.makeGeneralForm() }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('propuestaTermica').toJS(),
  hasErrors: state.getIn(['propuestaTermica', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  intervals: state.getIn(['evaluacionPetrofisica', 'layerData']).toJS(),
})

const mapDispatchToProps = dispatch => ({
  setMergePropuestaTermica: (value) => {
    dispatch(setMergePropuestaTermica(value))
  },
  setCedulaPropuestaTermica: (cedula, volumes) => {
    dispatch(setCedulaPropuestaTermica(cedula, volumes))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaTermica) 
