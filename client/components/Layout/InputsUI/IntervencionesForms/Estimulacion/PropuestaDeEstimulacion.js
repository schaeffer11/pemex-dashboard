import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import Select from 'react-select'
import { connect } from 'react-redux'

import InputTable from '../../../Common/InputTable'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, CalculatedValue } from '../../../Common/InputRow'
import { setCedulaData, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoN2, setVolumenTotalDeLiquido, setChecked, setPropuestaCompany, setTipoDeEstimulacion, setTipoDeColocacion, setTiempoDeContacto } from '../../../../../redux/actions/intervencionesEstimulacion'
import { setEspesorBruto } from '../../../../../redux/actions/pozo'
import { round, calculateVolumes, getSistemaOptions } from '../helpers'

@autobind class PropuestaDeEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 

    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  handleSelectTipoDeEstimulacion(val) {
    let { setTipoDeEstimulacion, setTipoDeColocacion, setTiempoDeContacto, } = this.props



    setTipoDeEstimulacion(val)
    setTipoDeColocacion(null)
    setTiempoDeContacto(null)

  }




  makeGeneralForm() {
    let { formData, setPropuestaCompany, setTipoDeEstimulacion, intervalos } = this.props
    formData = formData.toJS()
    intervalos = intervalos.toJS()
    let { propuestaCompany, tipoDeEstimulacion } = formData
    const companyOptions = [
      { label: 'Halliburton', value: 'Halliburton' },
      { label: 'Schlumberger', value: 'Schlumberger' },
      { label: 'PFM', value: 'PFM' },
      { label: 'Chemiservices', value: 'Chemiservices' },
      { label: 'BJ', value: 'BJ' },
      { label: 'Weatherford',
      value: 'Weatherford' }
    ]

    const estimulacionOptions = [
      { label: 'Limpieza', value: 'limpieza'},
      { label: 'Matricial', value: 'matricial'}
    ]

    const intervals = intervalos.map(elem => <div key={`intervalo_${elem.cimaMD}-${elem.baseMD}`}>{`${elem.cimaMD}-${elem.baseMD}`}</div>)


    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowSelectUnitless
          header="Compañía Seleccionada para el Tratamiento"
          name="company"
          options={companyOptions}
          onBlur={this.validate}
          value={propuestaCompany}
          callback={e => setPropuestaCompany(e.value)}
          onBlur={this.validate}
          errors={this.state.errors}
        />
        <InputRowSelectUnitless
          header="Tipo de estimulación"
          name="tipoDeEstimulacion"
          options={estimulacionOptions}
          onBlur={this.validate}
          value={tipoDeEstimulacion}
          callback={e => this.handleSelectTipoDeEstimulacion(e.value)}
          onBlur={this.validate}
          errors={this.state.errors}
        />
        <CalculatedValue
          header={<div>Intervalos</div>}
          value={intervals}
        />
      </div>
    )
  }

  makeLimpiezaForm() {
    let { setTipoDeColocacion, setTiempoDeContacto, formData } = this.props
    formData = formData.toJS()
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
        <InputRowSelectUnitless 
          header="Tipo de colocación" 
          name='tipoDeColocacion' 
          options={colocacionOptions}
          onBlur={this.validate} 
          value={tipoDeColocacion} 
          callback={(e) => setTipoDeColocacion(e.value)}
          onBlur={this.validate}
          errors={this.state.errors}
        />
        <InputRow header="Tiempo de contacto" name='tiempoDeContacto' unit="min" value={tiempoDeContacto} onChange={setTiempoDeContacto} errors={this.state.errors} onBlur={this.validate} />
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
    console.log('adding new Row')
    let { formData, setCedulaData } = this.props
    formData = formData.toJS()
    let { cedulaData } = formData

    cedulaData[0].length = 2

    setCedulaData([...cedulaData, {index: cedulaData.length, etapa: '', intervalo: '', nombreComercial: '', sistema: '', volLiquid: '', gastoN2: '', gastoLiqudo: '', gastoEnFondo: '', calidad: '', volN2: '', volLiquidoAcum: '', volN2Acum: '', relN2Liq: '', tiempo: '', length: cedulaData.length + 1, 'edited': false}])
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
    intervalos = intervalos.toJS()
    let { cedulaData } = formData

    const intervaloOptions = intervalos.map(elem =>({
      value: `${elem.cimaMD}-${elem.baseMD}`,
      label: `${elem.cimaMD}-${elem.baseMD}`,
    }))

    const sistemaOptions = getSistemaOptions()

    const objectTemplate = {etapa: '', intervalo: '', sistema: '', volLiquid: '', gastoN2: '', gastoLiqudo: '', gastoEnFondo: '', calidad: '', volN2: '', volLiquidoAcum: '', volN2Acum: '', relN2Liq: '', tiempo: '' }
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
        Header: 'Etapa',
        accessor: 'etapa',
      }, 
      // {
      //   Header: 'Intervalo',
      //   accessor: 'intervalo',
      //   width: 200,
      //   resizable: false,
      //   style: {overflow: 'visible'},
      //   Cell: row => {
      //     return (
      //       <div>
      //         <Select
      //           className='input'
      //           placeholder='intervalo'
      //           simpleValue={true}
      //           options={intervaloOptions}
      //           value={intervaloOptions.find(i=>i.value === row.original.intervalo) || null}
      //           onChange={(e) => this.handleSelect(row, e.value)} 
      //         />
      //       </div>
      //     )
      //   }
      // },
      {
        Header: 'Sistema',
        accessor: 'sistema',
        width: 200,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
          return (
            <div>
              <Select
                placeholder='sistema'
                className='input'
                simpleValue={true}
                options={sistemaOptions}
                value={sistemaOptions.find(i=>i.value === row.original.sistema) || null}
                onChange={(e) => this.handleSelect(row, e.value)} 
              />
            </div>
          )
        }
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
            newRow={objectTemplate}
            setData={this.setAllData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={cedulaData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }


  render() {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeEstimulacion } = formData

    return (
      <div className="form propuesta-de-estimulacion">
        <div className='top'>
          <div className="left">
            { this.makeGeneralForm() }
            { tipoDeEstimulacion === 'limpieza' ? this.makeLimpiezaForm() : null}
            { this.makeDetallesForm() }
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
  formData: state.get('propuestaEstimulacion'),
  intervalos: state.getIn(['evaluacionPetrofisica', 'layerData']),
})

const mapDispatchToProps = dispatch => ({
  setIntervalo: val => dispatch(setIntervalo(val)),
  setLongitudDeIntervalo: val => dispatch(setLongitudDeIntervalo(val)),
  setVolAparejo: val => dispatch(setVolAparejo(val)),
  setCapacidadTotalDelPozo: val => dispatch(setCapacidadTotalDelPozo(val)),
  setVolumenPrecolchonN2: val => dispatch(setVolumenPrecolchonN2(val)),
  setVolumenSistemaNoReativo: val => dispatch(setVolumenSistemaNoReativo(val)),
  setVolumenSistemaReactivo: val => dispatch(setVolumenSistemaReactivo(val)),
  setVolumenSistemaDivergente: val => dispatch(setVolumenSistemaDivergente(val)),
  setVolumenDesplazamientoLiquido: val => dispatch(setVolumenDesplazamientoLiquido(val)),
  setVolumenDesplazamientoN2: val => dispatch(setVolumenDesplazamientoN2(val)),
  setVolumenTotalDeLiquido: val => dispatch(setVolumenTotalDeLiquido(val)),
  setCedulaData: (cedula, volumes = null) => dispatch(setCedulaData(cedula, volumes)),
  setPropuestaCompany: val => dispatch(setPropuestaCompany(val)),
  setTipoDeEstimulacion: val => dispatch(setTipoDeEstimulacion(val)),
  setTipoDeColocacion: val => dispatch(setTipoDeColocacion(val)), 
  setTiempoDeContacto: val => dispatch(setTiempoDeContacto(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaDeEstimulacion) 
