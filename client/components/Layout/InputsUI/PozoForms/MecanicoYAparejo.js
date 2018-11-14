import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { List, Map, is } from 'immutable' 
import { connect } from 'react-redux'
import InputTable from '../../Common/InputTable'
import ExcelUpload from '../../Common/ExcelUpload'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setFromSaveMecanicoYAparejoDeProduccion, setHasErrorsMecanicoYAparejoDeProduccion, setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, 
  setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, 
  setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, setTratamientoPor, setVolumenAparejoDeProduccion, 
  setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, setImgBoreDiagramURL, 
  setImgAparejoDeProduccionURL, setDesviacion } from '../../../../redux/actions/pozo'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'


let tipoDeTerminacionOptions = [
  { label: 'Agujero Descubierto (AD)', value: 'Agujero Descubierto (AD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Cola extendida', value: 'Cola extendida' },
  { label: 'Simple', value: 'Simple' },
  { label: 'Tuberia Cementada y Disparada (TCD)', value: 'Tuberia Cementada y Disparada (TCD)'}
]

let tipoDeLinerOptions = [
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Liner Disparado (LD)', value: 'Liner Disparado (LD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Cola extendida', value: 'Cola extendida' },
  { label: 'Liner mas complemento', value: 'Liner mas complemento' },
  { label: 'Tie back', value: 'Tie back' },
  { label: 'Sencillo', value: 'Sencillo' },
  { label: 'No aplica', value: 'No aplica' },
]

let tratamientoPorOptions = [
  { label: 'Tubería de Producción (TP)', value: 'Tubería de Producción (TP)' },
  { label: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)', value: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)' },
  { label: 'Espacio Anular (EA)', value: 'Espacio Anular (EA)' },
  { label: 'Espacio Anular-Tuberia de Producción (EA-TP)', value: 'Espacio Anular-Tuberia de Producción (EA-TP)' },
  { label: 'Tubería Flexible (TF)', value: 'Tubería Flexible (TF)' }
]
@autobind class MecanicoYAparejo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        tipoDeTerminacion: {
          type: 'text',
          value: '',
        },
        hIntervaloProductor: {
          type: 'number',
          value: '',
        },
        empacador: {
          type: 'number',
          value: '',
        },
        presionDifEmpacador: {
          type: 'number',
          value: '',
        },
        sensorPyt: {
          type: 'number',
          value: '',
        },
        tipoDeLiner: {
          type: 'text',
          value: '',
        },
        diametroDeLiner: {
          type: 'number',
          value: '',
        },
        tipoDePistolas: {
          type: 'text',
          value: '',
        },
        densidadDeDisparosMecanico: {
          type: 'number',
          value: '',
        },
        fase: {
          type: 'number',
          value: '',
        },
        diametroDeOrificio: {
          type: 'number',
          value: '',
        },
        penetracion: {
          type: 'number',
          value: '',
        },
        tratamientoPor: {
          type: 'text',
          value: '',
        },
        volumenAparejoDeProduccion: {
          type: 'number',
          value: '',
        },
        volumenCimaDeIntervalo: {
          type: 'number',
          value: '',
        },
        volumenBaseDeIntervalo: {
          type: 'number',
          value: '',
        },
        volumenDeEspacioAnular: {
          type: 'number',
          value: '',
        },
        desviacion: {
          type: 'table',
          value: '',
        }
      }

    }
  }

  
  componentDidMount(){
    let { setHasErrorsMecanicoYAparejoDeProduccion, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsMecanicoYAparejoDeProduccion(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveMecanicoYAparejoDeProduccion, setHasErrorsMecanicoYAparejoDeProduccion } = this.props
    formData = formData.toJS()
    let { fromSave } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true)
      setHasErrorsMecanicoYAparejoDeProduccion(err)
      if (fromSave === true) {
        setFromSaveMecanicoYAparejoDeProduccion(false)
      }
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion } = formData
    const { errors } = this.state
    let hasErrors = false
    let error 
    let items = Object.keys(errors)

    if (tipoDeTerminacion === 'Agujero Descubierto (AD)') {
      items = items.filter(i => i !== 'tipoDePistolas' && i !== 'densidadDeDisparosMecanico' && i !== 'fase' && i !== 'diametroDeOrificio' && i !== 'penetracion')
    }

    items.forEach(elem => {
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
    let { hasErrors, setHasErrorsMecanicoYAparejoDeProduccion, formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion } = formData
    let hasErrorNew = false
    let items = Object.keys(errors)

    if (tipoDeTerminacion === 'Agujero Descubierto (AD)') {
      items = items.filter(i => i !== 'tipoDePistolas' && i !== 'densidadDeDisparosMecanico' && i !== 'fase' && i !== 'diametroDeOrificio' && i !== 'penetracion')
    }

    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsMecanicoYAparejoDeProduccion(hasErrorNew)
    }

    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsMecanicoYAparejoDeProduccion, hasSubmitted } = this.props
      const hasErrors = this.checkAllInputs(hasSubmitted)
      console.log('checking for errors', hasErrors, this.state.errors)
      setHasErrorsMecanicoYAparejoDeProduccion(hasErrors)
    })
  }


  handleSelectTerminacion(val) {
    let { tipoDeTerminacion, setTipoDeTerminacion } = this.props

    if (tipoDeTerminacion !== val.value) {
      setTipoDeTerminacion(val.value) 
    }
  }

  handleSelectTipoDeTerminacion(val) {
    let { setTipoDeTerminacion, setTipoDePistolas, setDensidadDeDisparosMecanico, 
      setFase, setDiametroDeOrificio, setPenetracion } = this.props

    if (val.value === 'Agujero Descubierto (AD)') {
      setTipoDePistolas(null) 
      setDensidadDeDisparosMecanico(null)
      setFase(null) 
      setDiametroDeOrificio(null) 
      setPenetracion(null)  
    }

    setTipoDeTerminacion(val.value)
  }

  makeTerminacionForm() {
    let { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase, diametroDeOrificio, penetracion, tipoDeSAP } = formData
    
    return (
      <div className='terminacion-form' >
        <div className='header'>
          Terminación
        </div>
        TIPO
        <div className="input-table">
          <InputRowSelectUnitless header="Tipo de terminación" value={tipoDeTerminacion} callback={this.handleSelectTipoDeTerminacion} options={tipoDeTerminacionOptions} name='tipoDeTerminacion' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="h (intervalo productor)" value={hIntervaloProductor} onChange={setHIntervaloProductor} name='hIntervaloProductor' unit='md' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Profunidad del Empacador" name='empacador' value={empacador} onChange={setEmpacador} unit='md' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Presión dif. empacador" name='presionDifEmpacador' value={presionDifEmpacador} onChange={setPresionDifEmpacador} unit='psi' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Profundidad Sensor de P y T" name='sensorPyt' value={sensorPyt} onChange={setSensorPyt} unit='md' onBlur={this.updateErrors} errors={this.state.errors} />
        </div>
        LINER
        <div className="input-table">
          <InputRowSelectUnitless header="Tipo de liner" name='tipoDeLiner' value={tipoDeLiner} options={tipoDeLinerOptions} callback={(e) => setTipoDeLiner(e.value)} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Diámetro de liner" name='diametroDeLiner' value={diametroDeLiner} onChange={setDiametroDeLiner} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
          {
            tipoDeTerminacion === 'Agujero Descubierto (AD)' ? null :
            <div>
              DISPAROS
              <InputRowUnitless header="Tipo de pistolas" name='tipoDePistolas' value={tipoDePistolas} onChange={setTipoDePistolas}  onBlur={this.updateErrors} errors={this.state.errors} />
              <InputRow header="Densidad de disparos" name='densidadDeDisparosMecanico' value={densidadDeDisparosMecanico} onChange={setDensidadDeDisparosMecanico} unit='c/m' onBlur={this.updateErrors} errors={this.state.errors} />
              <InputRow header="Fase" name='fase' value={fase} onChange={setFase} unit='Grados' onBlur={this.updateErrors} errors={this.state.errors} />
              <InputRow header="Diámetro de orificio" name='diametroDeOrificio' value={diametroDeOrificio} onChange={setDiametroDeOrificio} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
              <InputRow header="Penetración" name='penetracion' value={penetracion} onChange={setPenetracion} unit='pg' onBlur={this.updateErrors} errors={this.state.errors} />
            </div>
          }
        </div>
      </div>
    )
  }
  
  makeCapacidadForm() {
    let { setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, formData } = this.props
    formData = formData.toJS()
    let { tratamientoPor, volumenAparejoDeProduccion, volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular} = formData
 
    return (
      <div className='capacidad-form' >
        <div className='header'>
          Capacidad
        </div>
        VOLUMEN
        <div className="input-table">
          <InputRowSelectUnitless header="Tratamiento por" name='tratamientoPor' value={tratamientoPor} callback={(e) => setTratamientoPor(e.value)} options={tratamientoPorOptions} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Volumen aparejo de producción" name='volumenAparejoDeProduccion' value={volumenAparejoDeProduccion} onChange={setVolumenAparejoDeProduccion} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Volumen a la cima de intervalo" name='volumenCimaDeIntervalo' value={volumenCimaDeIntervalo} onChange={setVolumenCimaDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Volumen a la base de intervalo" name='volumenBaseDeIntervalo' value={volumenBaseDeIntervalo} onChange={setVolumenBaseDeIntervalo} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Volumen de espacio anular (EA)" name='volumenDeEspacioAnular' value={volumenDeEspacioAnular} onChange={setVolumenDeEspacioAnular} unit={<div>m<sup>3</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
        </div>
      </div>
    )
  }
  
  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])
    setURL(localImgUrl, 'mecanicoYAparejoDeProduccion')
  }

  makeBoreDiagramInput() {
    let { formData, setImgBoreDiagramURL} = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar diagrama del aparejo de producción
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setImgBoreDiagramURL)}></input>
       
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  makeDesviacionesTable() {
    let { formData , setDesviacion, hasSubmitted } = this.props
    formData = formData.toJS()
    let { desviacion, fromSave } = formData
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
        Header: <div>Measured Depth<br></br>(m)</div>,
        accessor: 'measuredDepth',
        cell: 'renderNumber',
      },
      {
        Header: <div>Inclination<br></br>(deg)</div>,
        accessor: 'inclination',
        cell: 'renderNumber',
      },
      {
        Header: <div>Azimuth<br></br>(deg)</div>,
        accessor: 'azimuth',
        cell: 'renderNumber',
      },
      {
        Header: <div>TVD<br></br>(m)</div>,
        accessor: 'trueVerticalDepth',
        cell: 'renderNumber',
      },
      {
        Header: <div>Vertical Section<br></br>(m)</div>,
        accessor: 'verticalSection',
        cell: 'renderNumber',
      },
      {
        Header: <div>NS<br></br>(m)</div>,
        accessor: 'ns',
        cell: 'renderNumber',
      },
      {
        Header: <div>EW<br></br>(m)</div>,
        accessor: 'ew',
        cell: 'renderNumber',
      },
      {
        Header: <div>DLS<br></br>(deg/30m)</div>,
        accessor: 'dls',
        cell: 'renderNumber',
      },
      {
        Header: <div>Northing<br></br>(m)</div>,
        accessor: 'northing',
        cell: 'renderNumber',
      },
      {
        Header: <div>Easting<br></br>(m)</div>,
        accessor: 'easting',
        cell: 'renderNumber',
      },
      {
        Header: <div>Latitude</div>,
        accessor: 'latitude',
        cell: 'renderNumber',
      },
      {
        Header: <div>Longitude</div>,
        accessor: 'longitude',
        cell: 'renderNumber',
      },
      {
        Header: <div>Comments</div>,
        accessor: 'comments',
        cell: 'renderTextarea',
      },
    ]
    const rowObj = {
      measuredDepth: '',
      inclination: '',
      azimuth: '',
      trueVerticalDepth: '',
      verticalSection: '',
      ns: '',
      ew: '',
      dls: '',
      northing: '',
      easting: '',
      latitude: '',
      longitude: '',
      comments: '',
      error: true,
    }

    const errors = [
      { name: 'measuredDepth', type: 'number' },
      { name: 'inclination', type: 'number' },
      { name: 'azimuth', type: 'number' },
      { name: 'trueVerticalDepth', type: 'number' },
      { name: 'verticalSection', type: 'number' },
      { name: 'ns', type: 'number' },
      { name: 'ew', type: 'number' },
      { name: 'dls', type: 'number' },
      { name: 'northing', type: 'number' },
      { name: 'easting', type: 'number' },
      { name: 'latitude', type: 'number' },
      { name: 'longitude', type: 'number' },
    ]
    return (
      <div>
        <div className='header'>
          Desviación
        </div>
        <ExcelUpload
          template="Survey"
          headers={errors}
          setData={this.props.setDesviacion}
        />
        <div className='historico-produccion' >
          <div className='table'>
            <InputTable
              className="-striped"
              data={desviacion}
              setData={setDesviacion}
              columns={columns}
              showPagination={false}
              showPageSizeOptions={false}
              sortable={false}
              errorArray={errors}
              rowObj={rowObj}
              checkForErrors={e => this.checkForErrors(e, 'desviacion')}
              hasSubmitted={hasSubmitted}
              fromSave={fromSave}
            />
          </div>
        </div>
      </div>
    )
  }

  makeAparejoDeProduccionInput() {
    let { formData, setImgAparejoDeProduccionURL } = this.props
    formData = formData.toJS()
    let { imgAparejoDeProduccionURL } = formData

    return (
      <div style={{marginBot: '20px'}}>
        <div style={{color: 'red'}}> TODO: figure out Aparejo De Produccion (can we treat it as reg table?)</div>
      </div>
    )
  }

  render() {
    return (
      <div className="form mecanico-y-aparejo">
        <div className='left'>
          { this.makeTerminacionForm() }
        </div>
        <div className='right'>
          { this.makeCapacidadForm() }
          { this.makeBoreDiagramInput() }
        </div>
        {this.makeDesviacionesTable()}
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('mecanicoYAparejoDeProduccion'),
  hasErrors: state.getIn(['mecanicoYAparejoDeProduccion', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setTipoDeTerminacion: val => dispatch(setTipoDeTerminacion(val)),
  setHIntervaloProductor: val => dispatch(setHIntervaloProductor(val)),
  setEmpacador: val => dispatch(setEmpacador(val)),
  setPresionDifEmpacador: val => dispatch(setPresionDifEmpacador(val)),
  setSensorPyt: val => dispatch(setSensorPyt(val)),
  setTipoDeLiner: val => dispatch(setTipoDeLiner(val)),
  setDiametroDeLiner: val => dispatch(setDiametroDeLiner(val)),
  setTipoDePistolas: val => dispatch(setTipoDePistolas(val)),
  setDensidadDeDisparosMecanico: val => dispatch(setDensidadDeDisparosMecanico(val)),
  setFase: val => dispatch(setFase(val)),
  setDiametroDeOrificio: val => dispatch(setDiametroDeOrificio(val)),
  setPenetracion: val => dispatch(setPenetracion(val)),
  setTipoDeSAP: val => dispatch(setTipoDeSAP(val)),
  setTratamientoPor: val => dispatch(setTratamientoPor(val)),
  setVolumenAparejoDeProduccion: val => dispatch(setVolumenAparejoDeProduccion(val)),
  setVolumenCimaDeIntervalo: val => dispatch(setVolumenCimaDeIntervalo(val)),
  setVolumenBaseDeIntervalo: val => dispatch(setVolumenBaseDeIntervalo(val)),
  setVolumenDeEspacioAnular: val => dispatch(setVolumenDeEspacioAnular(val)),
  setImgBoreDiagramURL: (url, name) => dispatch(setImgBoreDiagramURL(url, name)),
  setImgAparejoDeProduccionURL: val => dispatch(setImgAparejoDeProduccionURL(val)),
  setHasErrorsMecanicoYAparejoDeProduccion: val => dispatch(setHasErrorsMecanicoYAparejoDeProduccion(val)),
  setFromSaveMecanicoYAparejoDeProduccion: val => dispatch(setFromSaveMecanicoYAparejoDeProduccion(val)),
  setDesviacion: val => dispatch(setDesviacion(val)),
})


export default connect(mapStateToProps, mapDispatchToProps)(MecanicoYAparejo)
