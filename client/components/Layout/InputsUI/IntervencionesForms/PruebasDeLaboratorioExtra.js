import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import { options as typeOptions } from './PruebasDeLaboratorio'
import { setPruebasDeLaboratorioData, setPruebasDeLaboratorioImg } from '../../../../redux/actions/intervencionesEstimulacion'
import { setLabEvidenceImgURL } from '../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import Select from 'react-select'


const tipoDeMuestraOptions = [
 { label: 'Núcleo', value: 'nucleo' },
 { label: 'Recortes de canal', value: 'recortesDeCanal' },
 { label: 'Incrustación orgánica', value: 'incrustacionOrganica' },
 { label: 'Incrustación inorgánica', value: 'incrustacionInorganica' }, 
]

const tipoDeSistemaEmpleadoOptions = [
 { label: 'Ácido', value: 'Ácido' },
 { label: 'Solvente Aromático', value: 'Solvente Aromático' },
 { label: 'Agua', value: 'Agua' },
]

const solidosOptions = [
  { label: 'A - 0', value: 'none'},
  { label: 'B - Trazas de Sedimentos', value: 'trazasSedimentos'},
  { label: 'C - Moderada presencia de sedimentos', value: 'moderadaSedimentos'},
  { label: 'D - Abundante presencia de sedimentos', value: 'AbundanteSedimentos'},
]

const separacionDeFasesOptions = [
  { label: 'Definida', value: 'definida' }, 
  { label: 'Obscura', value: 'obscura' }, 
]

const condicionOptions = [
  { label: 'Compatible', value: 'compatible'},
  { label: 'No Compatible', value: 'noCompatible'},
]

const hidratacionDelFluidoOptions = [
  { label: 'Buena', value: 'Buena' },
  { label: 'Regular', value: 'Regular' },
  { label: 'Mala', value: 'Mala' },
]

const grabadoOptions = [
  { label: 'Heterogeneo-Profundo', value: 'Heterogeneo-Profundo' },
  { label: 'Heterogeneo-Somero', value: 'Heterogeneo-Somero' },
  { label: 'Homogeneo', value: 'Homogeneo' },
]

@autobind class PruebasDeLaboratorioExtra extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let pruebas = []

    pruebasDeLaboratorioData.map((prueba, i) => {
      if(!prueba.hasOwnProperty('edited')){
        pruebas.push({ ...prueba,
          edited: true,
          obervaciones: '',
          imgURL:'',
          compatabilidadTable: [{
            diseno: '',
            sistema: '',
            aceiteDelPozo: '',
            tiempoDeRompimiento: '',
            separacionDeFases: '',
            solidos: '',
            condicion: '',
          }],
          grabadoTable: [{
            sistemaAcido: '',
            tiempoDeContacto: '',
            grabado: '',
          }]
        })
      }else {
        pruebas.push(prueba)
      }

      setPruebasDeLaboratorioData(pruebas)
    })
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
  }

  validate() {
    
  }


  makeCaracterizacionFisico(index) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='fisico-form' >
          <InputRow header="Determinación del porcentaje de aceite" name='percentAceite' value={pruebasDeLaboratorioData[index].percentAceite} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de agua" name='percentAgua' value={pruebasDeLaboratorioData[index].percentAgua} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de emulsión" name='percentEmulsion' value={pruebasDeLaboratorioData[index].percentEmulsion} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de sólidos" name='percentSolidos' value={pruebasDeLaboratorioData[index].percentSolidos} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de asfaltenos" name='percentAsfaltenos' value={pruebasDeLaboratorioData[index].percentAsfaltenos} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de parafinas" name='percentParafinas' value={pruebasDeLaboratorioData[index].percentParafinas} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de resinas asfalticas" name='percentResinasAsfalticas' value={pruebasDeLaboratorioData[index].percentResinasAsfalticas} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Determinación del porcentaje de contenido de sólidos" name='percentContenidoDeSolidos' value={pruebasDeLaboratorioData[index].percentContenidoDeSolidos} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Densidad del aceite" name='densityAceite' value={pruebasDeLaboratorioData[index].densityAceite} onChange={this.updateValue} index={index} unit={<div>gr/cm<sup>3</sup></div>} errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Densidad del agua" name='densityAgua' value={pruebasDeLaboratorioData[index].densityAgua} onChange={this.updateValue} index={index} unit={<div>gr/cm<sup>3</sup></div>} errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Densidad de la emulsión" name='densityEmulsion' value={pruebasDeLaboratorioData[index].densityEmulsion} onChange={this.updateValue} index={index} unit={<div>gr/cm<sup>3</sup></div>} errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Viscosidad del aceite" name='viscosityAceite' value={pruebasDeLaboratorioData[index].viscosityAceite} onChange={this.updateValue} index={index} unit='cp' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Viscosidad de la emulsión" name='viscosityEmulsion' value={pruebasDeLaboratorioData[index].viscosityEmulsion} onChange={this.updateValue} index={index} unit='cp' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="pH del agua" name='phDelAgua' value={pruebasDeLaboratorioData[index].phDelAgua} onChange={this.updateValue} index={index} unit='adim' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Salinidad del agua" name='salinidadDelAgua' value={pruebasDeLaboratorioData[index].salinidadDelAgua} onChange={this.updateValue} index={index} unit='ppm' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Salinidad del aceite" name='salinidadDelAceite' value={pruebasDeLaboratorioData[index].salinidadDelAceite} onChange={this.updateValue} index={index} unit='ppm' errors={this.state.errors} onBlur={this.validate} />
          {this.makeImageInput(index, 'caracterizacionFisicoQuimica')}
        </div>
    )
  }

  makeSolubilidad(index) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='solubilidad-form' >
          <InputRowSelectUnitless header="Tipo de muestra" name='tipoDeMuestra' value={pruebasDeLaboratorioData[index].tipoDeMuestra} options={tipoDeMuestraOptions} callback={(e) => this.handleSelectNonTable(e.value, 'tipoDeMuestra', index)} index={index} errors={this.state.errors} onBlur={this.validate} / >
          <InputRow header="Peso de la muestra" name='pesoDeLaMuestra' value={pruebasDeLaboratorioData[index].pesoDeLaMuestra} onChange={this.updateValue} index={index} unit='gr' errors={this.state.errors} onBlur={this.validate}  />
          <InputRowSelectUnitless header="Tipo de sistema químico empleado" name='tipoDeSistemaEmpleado' value={pruebasDeLaboratorioData[index].tipoDeSistemaEmpleado} options={tipoDeSistemaEmpleadoOptions} callback={(e) => this.handleSelectNonTable(e.value, 'tipoDeSistemaEmpleado', index)} index={index} errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Peso final de la muestra" name='pesoDeLaMuestraFinal' value={pruebasDeLaboratorioData[index].pesoDeLaMuestraFinal} onChange={this.updateValue} index={index} unit='gr' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Solubilidad" name='solubilidad' value={pruebasDeLaboratorioData[index].solubilidad} onChange={this.updateValue} index={index} unit='%' errors={this.state.errors} onBlur={this.validate} />
          {this.makeImageInput(index, 'solubilidad')}
        </div>
    )
  }

  makePruebasApuntalante(index) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='apuntalante-form' >
          <InputRow header="Esfericidad" name='esfericidad' value={pruebasDeLaboratorioData[index].esfericidad} onChange={this.updateValue} index={index} unit='adim' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Redondez" name='redondez' value={pruebasDeLaboratorioData[index].redondez} onChange={this.updateValue} index={index} unit='adim' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Resistencia a la compresión" name='resistenciaCompresion' value={pruebasDeLaboratorioData[index].resistenciaCompresion} onChange={this.updateValue} index={index} unit='psi' errors={this.state.errors} onBlur={this.validate} />
          <InputRowUnitless header="Malla" name='malla' value={pruebasDeLaboratorioData[index].malla} onChange={this.updateValue} index={index} errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Aglutinamiento" name='aglutinamiento' value={pruebasDeLaboratorioData[index].aglutinamiento} onChange={this.updateValue} index={index} unit='adim' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Turbidez" name='turbidez' value={pruebasDeLaboratorioData[index].turbidez} onChange={this.updateValue} index={index} unit='adim' errors={this.state.errors} onBlur={this.validate} />
          <InputRow header="Solubilidad" name='solubilidad' value={pruebasDeLaboratorioData[index].solubilidad} onChange={this.updateValue} index={index} unit='%' />
          {this.makeImageInput(index, 'apuntalante')}
        </div>
    )
  }

    makePruebasFractura(index) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='apuntalante-form' >
          <InputRowSelectUnitless header="Hidratación del fluido " name='hidratacionDelFluido' value={pruebasDeLaboratorioData[index].hidratacionDelFluido} options={hidratacionDelFluidoOptions} callback={(e) => this.handleSelectNonTable(e.value, 'hidratacionDelFluido', index)} index={index}/>
          <InputRow header="Tiempo de activación del gel" name='tiempoDeActivacion' value={pruebasDeLaboratorioData[index].tiempoDeActivacion} onChange={this.updateValue} index={index} unit='adim' />
          <InputRow header="Determinación de pH" name='determinacionDePh' value={pruebasDeLaboratorioData[index].determinacionDePh} onChange={this.updateValue} index={index} unit='psi' />
          <InputRow header="Tiempo de rompimiento" name='tiempoDeRompimiento' value={pruebasDeLaboratorioData[index].tiempoDeRompimiento} onChange={this.updateValue} index={index} />
          <InputRow header="Dosificación de quebradores" name='dosificacionDeQuebradors' value={pruebasDeLaboratorioData[index].dosificacionDeQuebradors} onChange={this.updateValue} index={index} unit='adim' />
          <InputRow header="Viscosidad del gel de fractura" name='viscosidadDelGelDeFractura' value={pruebasDeLaboratorioData[index].viscosidadDelGelDeFractura} onChange={this.updateValue} index={index} unit='adim' />
          {this.makeImageInput(index, 'gelFractura')}
        </div>
    )
  }



  updateValue(value, event, isImageName = false){
    if(event === undefined)
      return
    if (typeof event.preventDefault === 'function') {
      event.preventDefault()
    }

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()

    let index = event.target.getAttribute('index')
    let pruebas = {...pruebasDeLaboratorio}
    if (isImageName) {
      pruebas.pruebasDeLaboratorioData[index].imgName = value
    } else {
      pruebas.pruebasDeLaboratorioData[index][event.target.name] = value
    }

    setPruebasDeLaboratorioData(pruebas.pruebasDeLaboratorioData)
  }

  renderEditable(cellInfo) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let val = ''

    if (pruebasDeLaboratorioData && pruebasDeLaboratorioData[cellInfo.column.tableIndex] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["compatabilidadTable"] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["compatabilidadTable"][cellInfo.index] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["compatabilidadTable"][cellInfo.index][cellInfo.column.id]) {
      val = pruebasDeLaboratorioData[cellInfo.column.tableIndex]["compatabilidadTable"][cellInfo.index][cellInfo.column.id]
    }

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let copy = JSON.parse(JSON.stringify(pruebasDeLaboratorioData))
          copy[cellInfo.column.tableIndex]["compatabilidadTable"][cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPruebasDeLaboratorioData(copy)
        }}>{val}
        </div>
    );
  }
    renderEditableGrabado(cellInfo) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    
    let val = ''

    if (pruebasDeLaboratorioData && pruebasDeLaboratorioData[cellInfo.column.tableIndex] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["grabadoTable"] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["grabadoTable"][cellInfo.index] && pruebasDeLaboratorioData[cellInfo.column.tableIndex]["grabadoTable"][cellInfo.index][cellInfo.column.id]) {
      val = pruebasDeLaboratorioData[cellInfo.column.tableIndex]["grabadoTable"][cellInfo.index][cellInfo.column.id]
    }

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let copy = JSON.parse(JSON.stringify(pruebasDeLaboratorioData))
          copy[cellInfo.column.tableIndex]["grabadoTable"][cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPruebasDeLaboratorioData(copy)
        }}>{val}
        </div>
    );
  }

  addNewRow(event, i) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData[i].compatabilidadTable

    copy[0].length = 2

    let val =  ([...copy, {index: copy.length, tipoDeMuestra: '', pesoDeLaMuestra: '', tipoDeSistemaEmpleado: '', pesoDeLaMuestra: '', solubilidad: '' , length: copy.length + 1}])
    pruebasDeLaboratorioData[i].compatabilidadTable = val
    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }

  addNewRowGrabado(event, i) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData[i].grabadoTable

    copy[0].length = 2

    let val =  ([...copy, {index: copy.length, sistemaAcido: '', tiempoDeContacto: '', grabado: '', length: copy.length + 1}])
    pruebasDeLaboratorioData[i].grabadoTable = val
    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }

  deleteRowGrabado(state, rowInfo, column, instance) {

    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData
    let i = column.tableIndex
    let data = copy[i].grabadoTable

    return {
      onClick: e => {
        if (column.id === 'delete' && data.length > 1) {
          data.splice(rowInfo.original.index, 1)

          data.forEach((i, index) => {
            i.index = index
            i.length = data.length
          })

          setPruebasDeLaboratorioData(copy)
        }
      }
    }
  }


  deleteRow(state, rowInfo, column, instance) {

    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData
    let i = column.tableIndex
    let data = copy[i].compatabilidadTable

    return {
      onClick: e => {
        if (column.id === 'delete' && data.length > 1) {
          data.splice(rowInfo.original.index, 1)

          data.forEach((i, index) => {
            i.index = index
            i.length = data.length
          })

          setPruebasDeLaboratorioData(copy)
        }
      }
    }
  }

  handleSelectNonTable(value, key, i) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData
 
    copy[i][key] = value
    setPruebasDeLaboratorioData(copy)
  }


  handleSelect(row, e, i, key) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData

    copy[i].compatabilidadTable[row.index][key] = e
    setPruebasDeLaboratorioData(copy)
  }


  handleSelectGrabado(row, e, i, key) {
    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let copy = pruebasDeLaboratorioData

    copy[i].grabadoTable[row.index][key] = e
    setPruebasDeLaboratorioData(copy)
  }

  makeCompatibilidadTable(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let data = pruebasDeLaboratorioData[index].compatabilidadTable

    if(data == undefined)
      data = [{
            diseno: '',
            sistema: '',
            aceiteDelPozo: '',
            tiempoDeRompimiento: '',
            separacionDeFases: '',
            solidos: '',
            condicion: '',
          }]

    data[0].index = 0


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
        Header: 'Diseño',
        accessor: 'diseno',
        cell: 'renderEditable',
      }, {
        Header: 'Sistema',
        accessor: 'sistema',
        cell: 'renderEditable',
      }, {
        Header: 'Aceite del pozo',
        accessor: 'aceiteDelPozo',
        cell: 'renderEditable',
      }, {
        Header: 'Tiempo de Rompimiento',
        accessor: 'tiempoDeRompimiento',
        cell: 'renderEditable',
      }, {
        
        Header: 'Separación de fases',
        accessor: 'separacionDeFases',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={separacionDeFasesOptions} 
            name={name}
            value={separacionDeFasesOptions.find(i=> i.value === row.original.separacionDeFases) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'separacionDeFases')} 
          />
          </div>)
        }
      }, { 
        Header: 'Solidos',
        accessor: 'solidos',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={solidosOptions} 
            name={name} 
            value={solidosOptions.find(i=> i.value === row.original.solidos) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'solidos')} 
          />
          </div>)
        }
      }, {
        Header: 'Condición',
        accessor: 'condicion',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={condicionOptions} 
            name={name} 
            value={condicionOptions.find(i=> i.value === row.original.condicion) || null}
            onChange={(e) => this.handleSelect(row, e.value, index, 'condicion')} 
          />
          </div>)
        }
      }
    ]

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
      column.tableIndex = index
    })


    return (
      <div className="lab-results" style={{marginBot: '20px'}}> 
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={data}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={data.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        <button className='new-row-button' index={index} onClick={(e) => this.addNewRow(e, index)}>Añadir un renglón</button>
        {this.makeImageInput(index, 'compatibilidadPorEmulsion')}
      </div>
    )
  }

    makeGrabadoTable(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let data = pruebasDeLaboratorioData[index].grabadoTable

    if(data == undefined)
      data = [{
            sistemaAcido: '',
            tiempoDeContacto: '',
            grabado: '',
          }]

    data[0].index = 0


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
        Header: 'Sistema Ácido',
        accessor: 'sistemaAcido',
        cell: 'renderEditable',
      }, {
        Header: <div>Tiempo de contacto<br></br>(min)</div>,
        accessor: 'tiempoDeContacto',
        cell: 'renderEditable',
      }, {
        Header: 'Grabado',
        accessor: 'grabado',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={grabadoOptions} 
            name={name}
            value={grabadoOptions.find(i=> i.value === row.original.grabado) || null}
            onChange={(e) => this.handleSelectGrabado(row, e.value, index, 'grabado')} 
          />
          </div>)
        }
      }
    ]

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditableGrabado : null
      column.tableIndex = index
    })


    return (
      <div className="lab-results" style={{marginBot: '20px'}}> 
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={data}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={data.length}
            sortable={false}
            getTdProps={this.deleteRowGrabado}
          />
        </div>
        <button className='new-row-button' index={index} onClick={(e) => this.addNewRowGrabado(e, index)}>Añadir un renglón</button>
        {this.makeImageInput(index, 'grabado')}
      </div>
    )
  }


  handleFileUpload(e, index, imgName) {
    e.preventDefault()
    const { setPruebasDeLaboratorioImg } = this.props
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])
    console.log('setting image', index)
    setPruebasDeLaboratorioImg(index, localImgUrl, `pruebasDeLaboratorio.${imgName}`)
    {/* setURL(`pruebasDeLaboratorio.${imgName}`, e, true) */}
  }

  makeImageInput(index, name) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let imgURL = pruebasDeLaboratorioData[index].imgURL
    const imgName = [name, index].join('.')

    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar evidencia del laboratorio
        </div>
        <input type='file' name='imgURL' accept="image/*" onChange={(e) => this.handleFileUpload(e, index, imgName)} index={index}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }
  
  makeEverything() {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

     return pruebasDeLaboratorioData.map((form, i) =>{

      let formList = {
        caracterizacionFisico: this.makeCaracterizacionFisico(i),
        pruebasDeSolubilidad: this.makeSolubilidad(i),
        pruebasDeCompatibilidad: this.makeCompatibilidadTable(i),
        pruebasParaApuntalante: this.makePruebasApuntalante(i),
        pruebasGelDeFractura: this.makePruebasFractura(i),
        pruebasDeGrabado: this.makeGrabadoTable(i)
      }

      return (
      <div className="form pruebas-de-laboratorio-estimulacion-extra" key={`pruebasDeEstimulacionExtra_${i}`}>
        <div className="collapsable-section is-open">
          <div className="collapsable-title">
            <span className="left">
              {typeOptions.find(o => o.value === form.type) ? typeOptions.find(o => o.value === form.type).label : 'Falta tipo de análisis'}</span>
              {form.fechaMuestreo &&
                <span className="right">Fecha: {form.fechaMuestreo}</span>}
          </div>
          <div className="collapsable-content">   
            { formList[form.type] }
            <TextAreaUnitless header="Observaciones" name='obervaciones' className={'obervaciones'} value={form.obervaciones} onChange={this.updateValue} index={i}/> 
            {/* { this.makeImageInput(i) } */}
          </div>
        </div>
      </div>
      )})

  }

  render() {
    return (<div className='pruebas-de-laboratorio-extra '>
      <div className='image'></div>
      { this.makeEverything() }
    </div>)

  }
}



const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorio'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio')
})

const mapDispatchToProps = dispatch => ({
    setLabEvidenceImgURL: val => dispatch(setLabEvidenceImgURL(val)),
    setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val)),
    setPruebasDeLaboratorioImg: (index, url, name) => {
      dispatch(setPruebasDeLaboratorioImg(index, url, name))
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioExtra)


