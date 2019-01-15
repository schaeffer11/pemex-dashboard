import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { setFromSaveHistorialDeIntervenciones, setHistoricoTermicoData, setHistoricoEstimulacionData, setHistoricoAcidoData, setHistoricoApuntaladoData, setHasErrorsHistorialDeIntervenciones, setShowEstim, setShowApuntalado, setShowAcido, setShowTermico } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ExcelUpload from '../../Common/ExcelUpload'
import { checkDate, checkEmpty } from '../../../../lib/errorCheckers'


const volumeColumns = [
  { 
    Header: 'Ácido',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'acidoVol',
      cell: 'renderTextarea',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'acidoNombre',
      cell: 'renderTextarea',
    }]
  }, { 
    Header: 'Solvente',
      columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'solventeVol',
      cell: 'renderTextarea',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'solventeNombre',
      cell: 'renderTextarea',
    }]
  }, { 
    Header: 'Divergente',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'divergenteVol',
      cell: 'renderTextarea',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'divergenteNombre',
      cell: 'renderTextarea',
    }]
  },
  {
    Header: 'Desplazamiento Líquido',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'desplazamientoLiquidoVol',
      cell: 'renderTextarea',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'desplazamientoLiquidoNombre',
      cell: 'renderTextarea',
    }]
  },
  {
    Header: <div>Total N<sub>2</sub><br/>ST</div>,
    columns: [{ 
      Header: <div>m<sup>3</sup></div>,
      accessor: 'totalN2',
      cell: 'renderTextarea',
    }]
  },
]

const benefitColumns = [{
  Header: <div>Beneficio<br/>(bpd)</div>,
  columns: [
    {
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber',
    },
    { 
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber',
    }
  ]
}]

const rowVolumes = {
  acidoVol: '',
  acidoNombre: '',
  solventeVol: '',
  solventeNombre: '',
  divergenteVol: '',
  divergenteNombre: '',
  desplazamientoLiquidoVol: '',
  desplazamientoLiquidoNombre: '',
  totalN2: '',
}

const errorsVolumes = [
  { name: 'acidoVol', type: 'text' },
  { name: 'acidoNombre', type: 'text' },
  { name: 'solventeVol', type: 'text' },
  { name: 'solventeNombre', type: 'text' },
  { name: 'divergenteVol', type: 'text' },
  { name: 'divergenteNombre', type: 'text' },
  { name: 'desplazamientoLiquidoVol', type: 'text' },
  { name: 'desplazamientoLiquidoNombre', type: 'text' },
  { name: 'totalN2', type: 'text' },
]

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
      cell: 'renderTextarea',
    }, { 
      Header: 'Compañía',
      accessor: 'compania',
      cell: 'renderEditable',
    }]
  },
  ...volumeColumns,
  ...benefitColumns,
]

let columnsTermico = [
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
    Header: 'Ciclo',
    accessor: 'ciclo',
    cell: 'renderNumber',
  }, 
  {
    Header: 'Fecha Inicio',
    accessor: 'fechaInicio',
    cell: 'renderDate',
   },
   { 
    Header: 'Fecha Fin',
    accessor: 'fechaFin',
    cell: 'renderDate',
  },
  { 
    Header: 'Objectivo',
    accessor: 'objetivo',
    cell: 'renderTextarea',
  },
  { 
    Header: <div>P<sub>iny</sub><br/>(kg/cm<sup>2</sup>)</div>,
    accessor: 'Piny',
    cell: 'renderNumber',
  },
  { 
    Header: <div>T<sub>iny</sub><br/>(°C)</div>,
    accessor: 'Tiny',
    cell: 'renderNumber',
  },
  { 
    Header: <div>Calidad<br/>(%)</div>,
    accessor: 'calidad',
    cell: 'renderNumber',
  },
  { 
    Header: <div>Q<sub>iny</sub><br/>(bpd)</div>,
    accessor: 'Qiny',
    cell: 'renderNumber',
  },
  { 
    Header: <div>Agua Acum<br/>(bbl)</div>,
    accessor: 'aguaAcum',
    cell: 'renderNumber',
  },
  ...benefitColumns,
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
    cell: 'renderTextarea',
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
  },
  ...volumeColumns,
  ...benefitColumns,
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
    cell: 'renderTextarea',
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
  },
  ...volumeColumns,
  ...benefitColumns,
]

@autobind class HistorialDeIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      errors: {
        apuntaladoTable: {
          value: false,
          type: 'table',
        },
        acidoTable: {
          value: false,
          type: 'table',
        },
        estimulacionTable: {
          value: false,
          type: 'table',
        },
        termicoTable: {
          value: false,
          type: 'table',
        },
      },
    }
  }

  componentDidMount(){
    let { setHasErrorsHistorialDeIntervenciones, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs()
    setHasErrorsHistorialDeIntervenciones(hasErrors)
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
      const { setHasErrorsHistorialDeIntervenciones } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsHistorialDeIntervenciones(hasErrors)
    })
  }

  handleApuntaladoCheck(e) {
    let { setShowApuntalado, setHistoricoApuntaladoData } = this.props

    let checked = e.target.checked
    if (checked === true) {
      setHistoricoApuntaladoData([{
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
        ...rowVolumes,
      }])
      this.checkForErrors('', 'apuntaladoTable')
    }
    else {
      setHistoricoApuntaladoData([])
      this.checkForErrors(false, 'apuntaladoTable')
    }



    setShowApuntalado(checked)
  }


  makeApuntaladoTable() {
    let { formData, setHistoricoApuntaladoData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoApuntaladoData, fromSave, showApuntalado } = formData

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
        ...rowVolumes,
      }

      const errors = [
        { name: 'fecha', type: 'date' },
        { name: 'tipoDeTratamiento', type: 'text' },
        { name: 'objetivo', type: 'text' },
        { name: 'compania', type: 'text' },
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
        ...errorsVolumes,
      ]

    return (
      <div className='presion-table'>
        <div className='header'>
          <input type='checkbox' value={showApuntalado} checked={showApuntalado} onChange={e => this.handleApuntaladoCheck(e)}/>
          <span> Histórico de fracturamientos apuntalados realizados al pozo </span>
        </div>
        {showApuntalado ?
        <div>
        <ExcelUpload
          template='HistorialIntervencionesFracApunt'
          headers={errors}
          setData={setHistoricoApuntaladoData}
        />
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
            fromSave={fromSave}
          />
        </div>
        </div> : null }
      </div>
      )
  }

  handleAcidoCheck(e) {
    let { setShowAcido, setHistoricoAcidoData } = this.props

    let checked = e.target.checked
    if (checked === true) {
      setHistoricoAcidoData([{
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
      ...rowVolumes,
      error: true,
    }])
      this.checkForErrors('', 'acidoTable')
    }
    else {
      setHistoricoAcidoData([])
      this.checkForErrors(false, 'acidoTable')
    }



    setShowAcido(checked)
  }


  makeAcidoTable() {
    let { formData, setHistoricoAcidoData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoAcidoData, fromSave, showAcido } = formData
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
      ...rowVolumes,
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'tipoDeTratamiento', type: 'text' },
      { name: 'objetivo', type: 'text' },
      { name: 'compania', type: 'text' },
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
      ...errorsVolumes,
    ]

    return (
      <div className='presion-table'>
        <div className='header'>
          <input type='checkbox' value={showAcido} checked={showAcido} onChange={e => this.handleAcidoCheck(e)}/>
          <span> Histórico de fracturamientos ácidos realizados al pozo </span>
        </div>
        {showAcido ?
        <div>
        <ExcelUpload
          template='HistorialIntervencionesFracAcido'
          headers={errors}
          setData={setHistoricoAcidoData}
        />
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
            fromSave={fromSave}
          />
        </div>
        </div> : null }
      </div>
      )
  }

  handleEstimCheck(e) {
    let { setShowEstim, setHistoricoEstimulacionData } = this.props

    let checked = e.target.checked
    if (checked === true) {
      setHistoricoEstimulacionData([{
      fecha: null,
      tipoDeTratamiento: '',
      objetivo: '',
      compania: '',
      ...rowVolumes,
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
    }])
      this.checkForErrors('', 'estimulacionTable')
    }
    else {
      setHistoricoEstimulacionData([])
      this.checkForErrors(false, 'estimulacionTable')
    }

    setShowEstim(checked)
  }


  makeEstimulacionTable() {
    let { formData, setHistoricoEstimulacionData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoEstimulacionData, fromSave, showEstim } = formData
    const rowObj = {
      fecha: null,
      tipoDeTratamiento: '',
      objetivo: '',
      compania: '',
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
      ...rowVolumes,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'tipoDeTratamiento', type: 'text' },
      { name: 'objetivo', type: 'text' },
      { name: 'compania', type: 'text' },
      { name: 'beneficioProgramado', type: 'number' },
      { name: 'beneficioOficial', type: 'number' },
      ...errorsVolumes,
    ]
    return (
      <div className='presion-table'>

        <div className='header'>
          <input type='checkbox' value={showEstim} checked={showEstim} onChange={e => this.handleEstimCheck(e)}/>
           <span> Histórico de tratamientos de estimulación </span>
        </div>
        { showEstim ?
        <div>
        <ExcelUpload
          template='HistorialIntervencionesEstimulacion'
          headers={errors}
          setData={setHistoricoEstimulacionData}
        />
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
            fromSave={fromSave}
          />
        </div>
        </div> : null }
      </div>
      )
  }

  handleTermicoCheck(e) {
    let { setShowTermico, setHistoricoTermicoData } = this.props

    let checked = e.target.checked
    if (checked === true) {
      setHistoricoTermicoData([{
      ciclo: '',
      fechaInicio: null,
      fechaFin: null,
      objetivo: '',
      Piny: '',
      Tiny: '',
      calidad: '',
      Qiny: '',
      aguaAcum: '',
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
    }
])
      this.checkForErrors('', 'termicoTable')
    }
    else {
      setHistoricoTermicoData([])
      this.checkForErrors(false, 'termicoTable')
    }

    setShowTermico(checked)
  }


  makeTermicoData() {
    let { formData, setHistoricoTermicoData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historicoTermicoData, fromSave, showTermico } = formData
    const rowObj = {
      ciclo: '',
      fechaInicio: null,
      fechaFin: null,
      objetivo: '',
      Piny: '',
      Tiny: '',
      calidad: '',
      Qiny: '',
      aguaAcum: '',
      beneficioProgramado: '',
      beneficioOficial: '',
      error: true,
    }

    const errors = [
      { name: 'ciclo', type: 'number' },
      { name: 'fechaInicio', type: 'date' },
      { name: 'fechaFin', type: 'date' },
      { name: 'objetivo', type: 'text' },
      { name: 'Piny', type: 'number' },
      { name: 'Tiny', type: 'number' },
      { name: 'calidad', type: 'number' },
      { name: 'Qiny', type: 'number' },
      { name: 'aguaAcum', type: 'number' },
      { name: 'beneficioProgramado', type: 'number' },
      { name: 'beneficioOficial', type: 'number' },
    ]

    return (
      <div className='presion-table'>
        <div className='header'>
          <input type='checkbox' value={showTermico} checked={showTermico} onChange={e => this.handleTermicoCheck(e)}/>
          <span> Histórico de tratamientos térmicos </span>
        </div>
        { showTermico ?
        <div>
        <ExcelUpload
          template='HistorialIntervencionesTermicas'
          headers={errors}
          setData={setHistoricoEstimulacionData}
        />
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoTermicoData}
            setData={setHistoricoTermicoData}
            columns={columnsTermico}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            errorArray={errors}
            rowObj={rowObj}
            checkForErrors={val => this.checkForErrors(val, 'termicoTable')}
            hasSubmitted={hasSubmitted}
            fromSave={fromSave}
          />
        </div>
        </div> : null}
      </div>
      )
  }


  render() {
    return (
      <div className="form historicoDeIntervenciones">
        { this.makeEstimulacionTable() }
        { this.makeAcidoTable() }
        { this.makeApuntaladoTable() }
        { this.makeTermicoData() }
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
    setHistoricoTermicoData: val => dispatch(setHistoricoTermicoData(val)),
    setHistoricoAcidoData: val => dispatch(setHistoricoAcidoData(val)),
    setHasErrorsHistorialDeIntervenciones: val => dispatch(setHasErrorsHistorialDeIntervenciones(val)),
    setHistoricoApuntaladoData: val => dispatch(setHistoricoApuntaladoData(val)),
    setFromSaveHistorialDeIntervenciones: val => dispatch(setFromSaveHistorialDeIntervenciones(val)),
    setShowEstim: val => dispatch(setShowEstim(val)),
    setShowApuntalado: val => dispatch(setShowApuntalado(val)),
    setShowAcido: val => dispatch(setShowAcido(val)),
    setShowTermico: val => dispatch(setShowTermico(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistorialDeIntervenciones)
