import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
// import { setContenidoDeAceite, setContenidoDeAgua, setContenidoDeEmulsion, setContenidoDeSolidos, setTipoDeSolidos, setDensidadDelAceite, setDensidadDelAgua, setDensidadDeLaEmulsion, setContenidoDeAsfaltenos, setContenidoDeParafinas, setContenidoDeResinas, setIndiceDeEstabilidadDelColoidal, setIndiceDeEstabilidadDelAgua, setPH, setSalinidad, setViscosidadDelAceite, setTipoDeGelLineal, setViscosidadDelGelLineal, setTiempoDeReticulacion, setPHGelLineal, setTiempoDeRompedorDelGel, setTamanoDelApuntalante, setGravedadEspecifica, setEsfericidad, setRedondeo, setTurbidez, setResistencia, setPruebaDeSolubilidadConAcida, setObervacionesPruebasLabApuntalado } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import Select from 'react-select'

const interfaseOptions = [
  { label: 'Definida', value: 'definida' },
  { label: 'Difusa', value: 'difusa' },
  { label: 'Obscura', value: 'obscura' }
]

const solidosFiltrarOptions = [
  { label: '0', value: 'none'},
  { label: 'Trazas', value: 'trazas'},
  { label: 'Moderada Sedimentacion', value: 'moderadaSedimentacion'},
  { label: 'Alta Sedimentacion', value: 'altaSedientacion'},
]

const resultadoOptions = [
  { label: 'Compatible', value: 'compatible'},
  { label: 'No Compatible', value: 'noCompatible'},
]

@autobind class PruebasDeLaboratorioEstimulacionExtra extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      data: [{
        sistem: '',
        tiempoRompimiento: '',
        interfase: '',
        solidosFiltrar: '',
        resultado: '',
      }]
    }
  }



  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  renderEditable(cellInfo) {
    let { data } = this.state
    // let { setLayerData, formData } = this.props
    // formData = formData.toJS()
    // let { layerData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let copy = JSON.parse(JSON.stringify(data))
          copy[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          // layerData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

          this.setState({
            data: copy
          })
          // setLayerData(layerData)

        }}>
{/*        {layerData[cellInfo.index][cellInfo.column.id]}*/}
        </div>
    );
  }

  addNewRow() {
    let { data } = this.state
    // let { setLayerData, formData } = this.props
    // formData = formData.toJS()
    // let { layerData } = formData

    let copy = JSON.parse(JSON.stringify(data))
    copy[0].length = 2
    // layerData[0].length = 2

    this.setState({
      data: ([...copy, {index: copy.length, interval: '', cimaMD: '', baseMD: '', cimaMV: '', baseMV: '', vArc: '', porosity: '', sw: '', dens: '', resis: '', perm: '', length: copy.length + 1}])
    })
    // setLayerData([...layerData, {index: layerData.length, interval: '', cimaMD: '', baseMD: '', cimaMV: '', baseMV: '', vArc: '', porosity: '', sw: '', dens: '', resis: '', perm: '', length: layerData.length + 1}])
  }

  deleteRow(state, rowInfo, column, instance) {
    let { data } = this.state
    let copy = JSON.parse(JSON.stringify(data))
    // let { setLayerData, formData } = this.props
    // formData = formData.toJS()
    // let { layerData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && copy.length > 1) {
        // if (column.id === 'delete' && layerData.length > 1) {
          copy.splice(rowInfo.original.index, 1)
          // layerData.splice(rowInfo.original.index, 1)

          // layerData.forEach((i, index) => {
          //   i.index = index
          //   i.length = layerData.length
          // }) 
          copy.forEach((i, index) => {
            i.index = index
            i.length = copy.length
          }) 

          // setLayerData(layerData)
          this.setState({
            data: copy
          })
        }
      }
    }
  }

  makeSistemaTable() {
    // let { formData } = this.props
    // formData = formData.toJS()
    // let { } = formData
    let { data } = this.state

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
        Header: 'Sistema',
        accessor: 'sistem',
        cell: 'renderEditable',
      }, { 
        Header: 'Tiempo de rompimiento (Min)',
        accessor: 'tiempoRompimiento',
        cell: 'renderEditable',
      }, { 
        Header: 'Interfase',
        accessor: 'interfase',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={interfaseOptions} 
            name={name} 
          />
          </div>)
        }
      }, { 
        Header: 'Solidos despues de filtrar',
        accessor: 'solidosFiltrar',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={solidosFiltrarOptions} 
            name={name} 
          />
          </div>)
        }
      }, { 
        Header: 'Resultado',
        accessor: 'resultado',
        style: {overflow: 'visible'},
        Cell: row => {
           return (<div>
            <Select 
            className='input' 
            simpleValue={true} 
            options={resultadoOptions}  
            name={name} 
          />
          </div>)
        }
      }
    ]


    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })


    return (
      <div style={{marginBot: '20px'}}> 
        <div className='header'>
          Lab Test Results (spanish)
        </div>
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
        <button className='new-row-button' onClick={this.addNewRow}> + </button>
      </div>
    )
  }




  render() {
    // let { setObervacionesPruebasLabApuntalado, formData } = this.props
    // formData = formData.toJS()
    // let { obervacionesPruebasLabApuntalado } = formData

    return (
      <div className="form pruebas-de-laboratorio-estimulacion-extra">
          { this.makeSistemaTable() }
          <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'}/> 
             {/*<TextAreaUnitless header="Observaciones" name='' className={'obervaciones'}  value={obervacionesPruebasLabApuntalado} {onChange={setObervacionesPruebasLabApuntalado}} /> */}
          <div style={{color: 'red'}}>TODO: add upload evidence of lab </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  // formData: state.get('pruebasDeLaboratorioApuntalado'),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioEstimulacionExtra)

