import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { setFromSaveHistorialDeIntervenciones, setHistoricoEstimulacionData, setHistoricoAcidoData, setHistoricoApuntaladoData, setHasErrorsHistorialDeIntervenciones } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import { checkDate, checkEmpty } from '../../../../lib/errorCheckers'

let columnsEstimulacion = [
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
    Header: 'General',
    columns: [{
      Header: 'Fecha',
      accessor: 'fecha',
      cell: 'renderDate',
    }, { 
      Header: 'Tipo de Tratamiento',
      accessor: 'tipoDeTratamiento',
      cell: 'renderEditable',
     }, { 
      Header: 'Objetivo',
      accessor: 'objetivo',
      cell: 'renderEditable',
    }, { 
      Header: 'Compañía',
      accessor: 'compania',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Ácido',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'acidoVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'acidoNombre',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Solvente',
      columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'solventeVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'solventeNombre',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Divergente',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'divergenteVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'divergenteNombre',
      cell: 'renderEditable',
    }]
  }, {
    Header: <div>Total N<sub>2</sub><br/>ST</div>,
    columns: [{ 
      Header: <div>m<sup>3</sup></div>,
      accessor: 'totalN2',
      cell: 'renderNumber',
    }]
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{ 
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber',
    }, { 
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber',
  }]
}
]

let columnsAcido = [
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
    Header: 'Fecha',
    accessor: 'fecha',
    cell: 'renderDate',
  }, { 
    Header: 'Tipo de Tratamiento',
    accessor: 'tipoDeTratamiento',
    cell: 'renderEditable',
   }, { 
    Header: 'Objetivo',
    accessor: 'objetivo',
    cell: 'renderEditable',
  }, {
    Header: 'Compañía',
    accessor: 'compania',
    cell: 'renderEditable'
  }, {
    Header: <div>Base<br/>(md)</div>,
    accessor: 'base',
    cell: 'renderNumber'
  }, {
    Header: <div>Cima<br/>(md)</div>,
    accessor: 'cima',
    cell: 'renderNumber'
  }, {
    Header: <div>Longitud Gravada<br/>(m)</div>,
    accessor: 'longitudGravada',
    cell: 'renderNumber'
  }, {
    Header: <div>Altura Gravada<br/>(m)</div>,
    accessor: 'alturaGravada',
    cell: 'renderNumber'
  }, {
    Header: <div>Ancho Gravado<br/>(pg)</div>,
    accessor: 'anchoGravado',
    cell: 'renderNumber'
  }, {
    Header: <div>Conductividad<br/>(mD*ft)</div>,
    accessor: 'conductividad',
    cell: 'renderNumber'
  }, {
    Header: <div>FCD<br/>(adim)</div>,
    accessor: 'fcd',
    cell: 'renderNumber'
  }, {
    Header: <div>Presión Neta<br/>(psi)</div>,
    accessor: 'presionNeta',
    cell: 'renderNumber'
  }, {
    Header: <div>Eficiencia de Fluido de Fractura<br/>(%)</div>,
    accessor: 'fluidoFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber'
    }, {
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber'
    }]
  }
]

let columnsApuntalado = [
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
    Header: 'Fecha',
    accessor: 'fecha',
    cell: 'renderDate',
  }, { 
    Header: 'Tipo de Tratamiento',
    accessor: 'tipoDeTratamiento',
    cell: 'renderEditable',
   }, { 
    Header: 'Objetivo',
    accessor: 'objetivo',
    cell: 'renderEditable',
  }, {
    Header: 'Compañía',
    accessor: 'compania',
    cell: 'renderEditable'
  }, {
    Header: <div>Base<br/>(md)</div>,
    accessor: 'base',
    cell: 'renderNumber'
  }, {
    Header: <div>Cima<br/>(md)</div>,
    accessor: 'cima',
    cell: 'renderNumber'
  }, {
    Header: <div>Longitud Apuntalada<br/>(m)</div>,
    accessor: 'longitudApuntalada',
    cell: 'renderNumber'
  }, {
    Header: <div>Altura Total de Fractura<br/>(m)</div>,
    accessor: 'alturaTotalDeFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Ancho Promedio<br/>(pg)</div>,
    accessor: 'anchoPromedio',
    cell: 'renderNumber'
  }, {
    Header: <div>Concentración Areal<br/>(lb/pg<sup>2</sup>)</div>,
    accessor: 'concentracionAreal',
    cell: 'renderNumber'
  }, {
    Header: <div>Conductividad<br/>(mD*ft)</div>,
    accessor: 'conductividad',
    cell: 'renderNumber'
  }, {
    Header: <div>FCD<br/>(adim)</div>,
    accessor: 'fcd',
    cell: 'renderNumber'
  }, {
    Header: <div>Presión Neta<br/>(psi)</div>,
    accessor: 'presionNeta',
    cell: 'renderNumber'
  }, {
    Header: <div>Eficiencia de Fluido de Fractura<br/>(%)</div>,
    accessor: 'fluidoFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber'
    }, {
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber'
    }]
  }
]

@autobind class HistorialDeIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
        apuntaladoTable: {
          value: '',
          type: 'table',
        },
        acidoTable: {
          value: '',
          type: 'table',
        },
        estimulacionTable: {
          value: '',
          type: 'table',
        },
      },
    }
  }

  componentDidMount(){
    let { setHasErrorsHistorialDeIntervencionesDispatch, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs()
    setHasErrorsHistorialDeIntervencionesDispatch(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveHistorialDeIntervenciones, setHasErrorsHistorialDeIntervenciones } = this.props
    formData = formData.toJS()
    let { fromSave } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true)
      setHasErrorsHistorialDeIntervenciones(err)
      if (fromSave === true) {
        setFromSaveHistorialDeIntervenciones(false)
      }
    }
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors)
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors)
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

  
  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    // const has
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsHistorialDeIntervencionesDispatch } = this.props
      const hasErrors = this.checkAllInputs()
      console.log('do i have errors?', hasErrors)
      setHasErrorsHistorialDeIntervencionesDispatch(hasErrors)
    })
  }

  makeApuntaladoTable() {
    let { formData, setHistoricoApuntaladoData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoApuntaladoData } = formData

    const rowObj = {
        fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        cima: '',
        base: '',
        longitudApuntalada: '',
        alturaTotalDeFractura: '',
        anchoPromedio: '',
        concentracionAreal: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: '',
        error: true,
      }

      const errors = [
        { name: 'fecha', type: 'date' },
        { name: 'tipoDeTratamiento', type: 'number' },
        { name: 'objetivo', type: 'number' },
        { name: 'compania', type: 'number' },
        { name: 'cima', type: 'number' },
        { name: 'base', type: 'number' },
        { name: 'longitudApuntalada', type: 'number' },
        { name: 'alturaTotalDeFractura', type: 'number' },
        { name: 'anchoPromedio', type: 'number' },
        { name: 'concentracionAreal', type: 'number' },
        { name: 'conductividad', type: 'number' },
        { name: 'fcd', type: 'number' },
        { name: 'presionNeta', type: 'number' },
        { name: 'fluidoFractura', type: 'number' },
        { name: 'beneficioProgramado', type: 'number' },
        { name: 'beneficioOficial', type: 'number' },
      ]

    return (
      <div className='presion-table'>
        <div className='header'>
          Histórico de fracturamientos apuntalados realizados al pozo
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoApuntaladoData}
            setData={setHistoricoApuntaladoData}
            columns={columnsApuntalado}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={val => this.checkForErrors(val, 'apuntaladoTable')}
            hasSubmitted={hasSubmitted}
          />
        </div>
      </div>
      )
  }

  makeAcidoTable() {
    let { formData, setHistoricoAcidoData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoAcidoData } = formData
    const rowObj = {
      fecha: null,
      tipoDeTratamiento: '',
      objetivo: '',
      compania: '',
      base: '',
      cima: '',
      longitudGravada: '',
      alturaGravada: '',
      anchoGravado: '',
      conductividad: '',
      fcd: '',
      presionNeta: '',
      fluidoFractura: '',
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'tipoDeTratamiento', type: 'number' },
      { name: 'objetivo', type: 'number' },
      { name: 'compania', type: 'number' },
      { name: 'base', type: 'number' },
      { name: 'cima', type: 'number' },
      { name: 'longitudGravada', type: 'number' },
      { name: 'alturaGravada', type: 'number' },
      { name: 'anchoGravado', type: 'number' },
      { name: 'conductividad', type: 'number' },
      { name: 'fcd', type: 'number' },
      { name: 'presionNeta', type: 'number' },
      { name: 'fluidoFractura', type: 'number' },
      { name: 'beneficioProgramado', type: 'number' },
      { name: 'beneficioOficial', type: 'number' },
    ]

    return (
      <div className='presion-table'>
        <div className='header'>
          Histórico de fracturamientos ácidos realizados al pozo
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoAcidoData}
            setData={setHistoricoAcidoData}
            columns={columnsAcido}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            errorArray={errors}
            rowObj={rowObj}
            checkForErrors={val => this.checkForErrors(val, 'acidoTable')}
            hasSubmitted={hasSubmitted}
          />
        </div>
      </div>
      )
  }

  makeEstimulacionTable() {
    let { formData, setHistoricoEstimulacionData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoEstimulacionData } = formData
    const rowObj = {
      fecha: null,
      tipoDeTratamiento: '',
      objetivo: '',
      compania: '',
      acidoVol: '',
      acidoNombre: '',
      solventeVol: '',
      solventeNombre: '',
      divergenteVol: '',
      divergenteNombre: '',
      totalN2: '',
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'tipoDeTratamiento', type: 'number' },
      { name: 'objetivo', type: 'number' },
      { name: 'compania', type: 'number' },
      { name: 'acidoVol', type: 'number' },
      { name: 'acidoNombre', type: 'number' },
      { name: 'solventeVol', type: 'number' },
      { name: 'solventeNombre', type: 'number' },
      { name: 'divergenteVol', type: 'number' },
      { name: 'divergenteNombre', type: 'number' },
      { name: 'totalN2', type: 'number' },
      { name: 'beneficioProgramado', type: 'number' },
      { name: 'beneficioOficial', type: 'number' },
    ]
    return (
      <div className='presion-table'>
        <div className='header'>
          Histórico de tratamientos de estimulación
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoEstimulacionData}
            setData={setHistoricoEstimulacionData}
            columns={columnsEstimulacion}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            errorArray={errors}
            rowObj={rowObj}
            checkForErrors={val => this.checkForErrors(val, 'estimulacionTable')}
            hasSubmitted={hasSubmitted}
          />
        </div>
      </div>
      )
  }


  render() {
    return (
      <div className="form historicoDeIntervenciones">
        { this.makeEstimulacionTable() }
        { this.makeAcidoTable() }
        { this.makeApuntaladoTable() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historialDeIntervenciones'),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
    setHistoricoEstimulacionData: val => dispatch(setHistoricoEstimulacionData(val)),
    setHistoricoAcidoData: val => dispatch(setHistoricoAcidoData(val)),
    setHasErrorsHistorialDeIntervencionesDispatch: val => dispatch(setHasErrorsHistorialDeIntervenciones(val)),
    setHistoricoApuntaladoData: val => dispatch(setHistoricoApuntaladoData(val)),
    setFromSaveHistorialDeIntervenciones: val => dispatch(setFromSaveHistorialDeIntervenciones(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistorialDeIntervenciones)
