import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import InputTable from '../../Common/InputTable'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import { setHasErrorsFichaTecnicaDelPozo, setTipoDeSistemo, setHistorialIntervencionesData, setEspesorBruto, 
  setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, setTipoDePozo, 
  setPws, setPwf, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion,
  setProfEmpacador, setProfSensorPYT, setTipoDeSap, setFromSaveFichaTecnicaDelPozo, setGeneralFichaTecnicaPozo } from '../../../../redux/actions/pozo'

@autobind class TechnicaDelPozo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldWellOptions: [],
      errors: {
        caliza: {
          type: 'number',
          value: '',
        },
        dolomia: {
          type: 'number',
          value: '',
        },
        arcilla: {
          type: 'number',
          value: '',
        },
        porosidad: {
          type: 'number',
          value: '',
        },
        permeabilidad: {
          type: 'number',
          value: '',
        },
        sw: {
          type: 'number',
          value: '',
        },
        caa: {
          type: 'number',
          value: '',
        },
        cga: {
          type: 'number',
          value: '',
        },
        tipoDePozo: {
          type: 'text',
          value: '',
        },
        pws: {
          type: 'number',
          value: '',
        },
        pwsFecha: {
          type: 'date',
          value: '',
        },
        pwf: {
          type: 'number',
          value: '',
        },
        pwfFecha: {
          type: 'date',
          value: '',
        },
        deltaPPerMes: {
          type: 'number',
          value: '',
        },
        tyac: {
          type: 'number',
          value: '',
        },
        pvt: {
          type: 'text',
          value: '',
        },
        aparejoDeProduccion: {
          type: 'number',
          value: '',
        },
        profEmpacador: {
          type: 'number',
          value: '',
        },
        profSensorPYT: {
          type: 'number',
          value: '',
        },
        historialDeIntervenciones: {
          type: 'table',
          value: '',
        },
        densidadAceite: {
          type: 'number',
          value: '',
        },
        bo: {
          type: 'number',
          value: '',
        },
        viscosidadAceite: {
          type: 'number',
          value: '',
        },
        gravedadEspecificaGas: {
          type: 'number',
          value: '',
        },
        bg: {
          type: 'number',
          value: '',
        },
        rga: {
          type: 'number',
          value: '',
        },
        asfaltenos: {
          type: 'number',
          value: '',
        },
        parafinas: {
          type: 'number',
          value: '',
        },
        resinasAsfalticas: {
          type: 'number',
          value: '',
        },
        indiceEstColoidal: {
          type: 'number',
          value: '',
        },
        densidadAgua: {
          type: 'number',
          value: '',
        },
        contenidoAgua: {
          type: 'number',
          value: '',
        },
        salinidad: {
          type: 'number',
          value: '',
        },
        ph: {
          type: 'number',
          value: '',
        },
        indiceEstAgua: {
          type: 'number',
          value: '',
        },
        contenidoEmulsion: {
          type: 'number',
          value: '',
        },
        pruebaDePresion: {
          type: 'text',
          value: '',
        },
        modelo: {
          type: 'text',
          value: '',
        },
        kh: {
          type: 'number',
          value: '',
        },
        k: {
          type: 'number',
          value: '',
        },
        s: {
          type: 'number',
          value: '',
        },
        piEnNivelSonda: {
          type: 'number',
          value: '',
        },
      },
    }
  }

  componentDidMount(){
    let { setHasErrorsFichaTecnicaDelPozo, hasSubmitted } = this.props

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsFichaTecnicaDelPozo(hasErrors)
     fetch('/api/getFieldWellMapping', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({
          fieldWellOptions: r
        })
    })
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveFichaTecnicaDelPozo, setHasErrorsFichaTecnicaDelPozo } = this.props
    formData = formData.toJS()
    let { fromSave } = formData
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true, formData)
      setHasErrorsFichaTecnicaDelPozo(err)
      if (fromSave === true) {
        setFromSaveFichaTecnicaDelPozo(false)
      }
    }
  }

  checkAllInputs(showErrors, data=null) {
    let { formData } = this.props
    formData = formData.toJS()
    formData = data !== null ? data : formData
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

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsFichaTecnicaDelPozo, hasSubmitted } = this.props
      const hasErrors = this.checkAllInputs(hasSubmitted)
      setHasErrorsFichaTecnicaDelPozo(hasErrors)
    })
  }

  updateErrors(errors) {
    let { hasErrors, setHasErrorsFichaTecnicaDelPozo } = this.props

    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsFichaTecnicaDelPozo(hasErrorNew)
    }

    this.setState({ errors })
  }



  makeFormacionForm() {
    let { setEspesorBruto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, formData } = this.props
    formData = formData.toJS()
    let { espesorBruto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga } = formData
    const errors = []

    return (
      <div className='formacion-form' >
        <div className='header'>
          Datos de Formación
        </div>
        <InputRow header="Caliza" name='caliza' value={caliza} onChange={setCaliza} unit='%' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Dolomia" name='dolomia' value={dolomia} onChange={setDolomia} unit='%' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Arcilla" name='arcilla' value={arcilla} onChange={setArcilla} unit='%' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Porosidad" name='porosidad' value={porosidad} onChange={setPorosidad} unit='%' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Permeabilidad" name='permeabilidad' value={permeabilidad} onChange={setPermeabilidad} unit='mD' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="Sw" name='sw' value={sw} onChange={setSw} unit='%' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="CAA" title="Contacto agua-aceite" name='caa' value={caa} onChange={setCaa} unit='mvbnm' onBlur={this.updateErrors} errors={this.state.errors} />
        <InputRow header="CGA" title="Contacto gas-aceite" name='cga' value={cga} onChange={setCga} unit='mvbnm' onBlur={this.updateErrors} errors={this.state.errors} />
      </div>
    )
  }

  makeFluidosForm() {
    let { setGeneralFichaTecnicaPozo, formData } = this.props
    formData = formData.toJS()
    const { 
      densidadAceite,
      bo,
      viscosidadAceite,
      gravedadEspecificaGas,
      bg,
      rga,
      asfaltenos,
      parafinas,
      resinasAsfalticas,
      indiceEstColoidal,
      densidadAgua,
      contenidoAgua,
      salinidad,
      ph,
      indiceEstAgua,
      contenidoEmulsion, 
    } = formData

    return (
      <div className='fluido-form' >
        <div className='header'>
          Fluidos
        </div>
        <InputRow
          header="Densidad del aceite"
          name='densidadAceite'
          value={densidadAceite}
          unit='°API'
          onChange={e => setGeneralFichaTecnicaPozo(['densidadAceite'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Bo"
          name='bo'
          value={bo}
          unit={<div>m<sup>3</sup>/m<sup>3</sup></div>}
          onChange={e => setGeneralFichaTecnicaPozo(['bo'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Viscosidad del aceite"
          name='viscosidadAceite'
          value={viscosidadAceite}
          unit='cp'
          onChange={e => setGeneralFichaTecnicaPozo(['viscosidadAceite'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Gravedad específica del gas"
          name='gravedadEspecificaGas'
          value={gravedadEspecificaGas}
          unit='Adim.'
          onChange={e => setGeneralFichaTecnicaPozo(['gravedadEspecificaGas'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Bg"
          name='bg'
          value={bg}
          unit={<div>m<sup>3</sup>/m<sup>3</sup></div>}
          onChange={e => setGeneralFichaTecnicaPozo(['bg'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="RGA"
          name='rga'
          value={rga}
          unit={<div>m<sup>3</sup>/m<sup>3</sup></div>}
          onChange={e => setGeneralFichaTecnicaPozo(['rga'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="RGA"
          name='asfaltenos'
          value={asfaltenos}
          unit="%"
          onChange={e => setGeneralFichaTecnicaPozo(['asfaltenos'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Parafinas"
          name='parafinas'
          value={parafinas}
          unit="%"
          onChange={e => setGeneralFichaTecnicaPozo(['parafinas'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Resinas asfalticas"
          name='resinasAsfalticas'
          value={resinasAsfalticas}
          unit="%"
          onChange={e => setGeneralFichaTecnicaPozo(['resinasAsfalticas'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Índice de est. coloidal"
          name='indiceEstColoidal'
          value={indiceEstColoidal}
          unit="Adim."
          onChange={e => setGeneralFichaTecnicaPozo(['indiceEstColoidal'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Densidad del agua"
          name='densidadAgua'
          value={densidadAgua}
          unit={<div>gr/cm<sup>3</sup></div>}
          onChange={e => setGeneralFichaTecnicaPozo(['densidadAgua'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Contenido de agua"
          name='contenidoAgua'
          value={contenidoAgua}
          unit="%"
          onChange={e => setGeneralFichaTecnicaPozo(['contenidoAgua'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Salinidad"
          name='salinidad'
          value={salinidad}
          unit="ppm"
          onChange={e => setGeneralFichaTecnicaPozo(['salinidad'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="pH"
          name='ph'
          value={ph}
          unit=""
          onChange={e => setGeneralFichaTecnicaPozo(['ph'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Índice de est. del agua"
          name='indiceEstAgua'
          value={indiceEstAgua}
          unit="Adim."
          onChange={e => setGeneralFichaTecnicaPozo(['indiceEstAgua'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Contenido de emulsión"
          name='contenidoEmulsion'
          value={contenidoEmulsion}
          unit="%"
          onChange={e => setGeneralFichaTecnicaPozo(['contenidoEmulsion'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
      </div>
    )
  }

  makePresionForm() {
    let { setGeneralFichaTecnicaPozo, formData } = this.props
    formData = formData.toJS()
    const { 
      pruebaDePresion,
      modelo,
      kh,
      k,
      s,
      piEnNivelSonda, 
    } = formData

    return (
      <div className='presion-form' >
        <div className='header'>
          Pruebas de presión
        </div>
        <InputRowUnitless
          header="Prueba de presión"
          name='pruebaDePresion'
          value={pruebaDePresion}
          onChange={e => setGeneralFichaTecnicaPozo(['pruebaDePresion'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRowUnitless
          header="Modelo"
          name='modelo'
          value={modelo}
          onChange={e => setGeneralFichaTecnicaPozo(['modelo'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Kh"
          name='kh'
          value={kh}
          unit="mD*ft"
          onChange={e => setGeneralFichaTecnicaPozo(['kh'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="K"
          name='k'
          value={k}
          unit="mD"
          onChange={e => setGeneralFichaTecnicaPozo(['k'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="S"
          name='s'
          value={s}
          unit="unidades"
          onChange={e => setGeneralFichaTecnicaPozo(['s'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
        <InputRow
          header="Pi @ nivel sonda"
          name='piEnNivelSonda'
          value={piEnNivelSonda}
          unit={<div>Kg/cm<sup>2</sup></div>}
          onChange={e => setGeneralFichaTecnicaPozo(['piEnNivelSonda'], e)}
          onBlur={this.updateErrors}
          errors={this.state.errors}
        />
      </div>
    )
  }

  makePozoForm() {
    let { fieldWellOptions } = this.state
    let { tipoDeSistemo, setTipoDePozo, setPws, setPwf, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSistemo, formData, generalData } = this.props
    formData = formData.toJS()
    generalData = generalData.toJS()
    let { campo } = generalData
    let { tipoDePozo, pwsFecha, pwfFecha, pws, pwf, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT } = formData

    let wellOptions = [
      { label: 'Productor', value: 'Productor' },
      { label: 'Inyector', value: 'Inyector' },
      { label: 'Cerrado', value: 'Cerrado' }
    ]

    let options = [
      { label: 'Ninguna', value: 'none' },
      { label: 'Embolo viajero', value: 'emboloViajero' },
      { label: 'Bombeo neumatico', value: 'bombeoNeumatico' },
      { label: 'Bombeo hidráulico', value: 'bombeoHidraulico' },
      { label: 'Bombeo cavidades progresivas', value: 'bombeoCavidadesProgresivas' },
      { label: 'Bombeo electrocentrífugo', value: 'bombeoElectrocentrifugo' },
      { label: 'Bombeo mecánico', value: 'bombeoMecanico' },
    ]

    let pvtOptions = []

    if (campo && fieldWellOptions.length > 0) {
      let wellSubset = fieldWellOptions.filter(i => i.FIELD_FORMACION_ID === parseInt(campo))
      let usedWells = []
      wellSubset.forEach(i => {
        if (!usedWells.includes(i.WELL_FORMACION_ID)) {
          usedWells.push(i.WELL_FORMACION_ID)
          pvtOptions.push({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})
        }
      })
    }

    return (
      <div className='pozo-form' >
        <div className='header'>
          Datos de Pozo
        </div>
          <InputRowSelectUnitless header="Tipo de pozo" value={tipoDePozo} callback={(e) => setTipoDePozo(e.value)}  name='tipoDePozo' options={wellOptions} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Pws" name='pws' value={pws} onChange={setPws} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputDate header="Pws (fecha)" name='pwsFecha' value={pwsFecha} onChange={setPwsFecha} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Pwf" name='pwf' value={pwf} onChange={setPwf} unit={<div>Kg/cm<sup>2</sup></div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputDate header="Pwf (fecha)" name='pwfFecha' value={pwfFecha} onChange={setPwfFecha} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Δp/mes" name='deltaPPerMes' value={deltaPPerMes} onChange={setDeltaPPerMes} unit={<div>Kg/cm<sup>2</sup>/mes</div>} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header={<span>T<sub>yac</sub></span>} name='tyac' value={tyac} onChange={setTyac} unit='°C' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRowSelectUnitless header="PVT" name='pvt' value={pvt} callback={(e) => setPvt(e.value)} options={pvtOptions} onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRowUnitless header="Aparejo de producción" value={aparejoDeProduccion} onChange={setAparejoDeProduccion} name='aparejoDeProduccion' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Profundidad empacador" name='profEmpacador' value={profEmpacador} onChange={setProfEmpacador} unit='md' onBlur={this.updateErrors} errors={this.state.errors} />
          <InputRow header="Profundidad sensor P y T" name='profSensorPYT' value={profSensorPYT} onChange={setProfSensorPYT} unit='md' onBlur={this.updateErrors} errors={this.state.errors} />
      </div>
    )
  }

  makeHistoricalInterventionsInput() {
    let { setHistorialIntervencionesData, formData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { historialIntervencionesData, fromSave } = formData

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
        Header: 'Fecha',
        accessor: 'fecha',
        width: 150,
        cell: 'renderDate'
      }, {
        Header: 'Historial de Intervenciones',
        accessor: 'intervenciones',
        cell: 'renderTextarea',
      }
    ]
    const rowObj = {
      fecha: null,
      intervenciones: '',
      error: true,
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'intervenciones', type: 'number' },
    ]

    return (
      <div className='intervenciones-form' >
        <div className='header'>
          Historial De Intervenciones
        </div>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={historialIntervencionesData}
            setData={setHistorialIntervencionesData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={val => this.checkForErrors(val, 'historialDeIntervenciones')}
            hasSubmitted={hasSubmitted}
            fromSave={fromSave}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="form tecnica-del-pozo">
          <div className="image"/>
          { this.makePozoForm() }
          { this.makeFormacionForm() }
          { this.makeHistoricalInterventionsInput() }
          {this.makeFluidosForm()}
          {this.makePresionForm()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('fichaTecnicaDelPozo'),
  hasErrors: state.getIn(['fichaTecnicaDelPozo', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  generalData: state.get('fichaTecnicaDelPozoHighLevel'),
  tipoDeSistemo: state.getIn(['sistemasArtificialesDeProduccion', 'tipoDeSistemo']),
  token: state.getIn(['user', 'token'])
})

const mapDispatchToProps = dispatch => ({
  setEspesorBruto: val => dispatch(setEspesorBruto(val)),
  setCaliza: val => dispatch(setCaliza(val)),
  setDolomia: val => dispatch(setDolomia(val)),
  setArcilla: val => dispatch(setArcilla(val)),
  setPorosidad: val => dispatch(setPorosidad(val)),
  setPermeabilidad: val => dispatch(setPermeabilidad(val)),
  setSw: val => dispatch(setSw(val)),
  setCaa: val => dispatch(setCaa(val)),
  setCga: val => dispatch(setCga(val)),
  setTipoDePozo: val => dispatch(setTipoDePozo(val)),
  setPwsFecha: val => dispatch(setPwsFecha(val)),
  setPwfFecha: val => dispatch(setPwfFecha(val)),
  setPws: val => dispatch(setPws(val)),
  setPwf: val => dispatch(setPwf(val)),
  setDeltaPPerMes: val => dispatch(setDeltaPPerMes(val)),
  setTyac: val => dispatch(setTyac(val)),
  setPvt: val => dispatch(setPvt(val)),
  setAparejoDeProduccion: val => dispatch(setAparejoDeProduccion(val)),
  setProfEmpacador: val => dispatch(setProfEmpacador(val)),
  setProfSensorPYT: val => dispatch(setProfSensorPYT(val)),
  setTipoDeSistemo: val => dispatch(setTipoDeSistemo(val)),
  setHistorialIntervencionesData: val => dispatch(setHistorialIntervencionesData(val)),
  setHasErrorsFichaTecnicaDelPozo: val => dispatch(setHasErrorsFichaTecnicaDelPozo(val)),
  setFromSaveFichaTecnicaDelPozo: val => dispatch(setFromSaveFichaTecnicaDelPozo(val)),
  setGeneralFichaTecnicaPozo: (location, value) => {
    dispatch(setGeneralFichaTecnicaPozo(location, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TechnicaDelPozo)
