import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setPruebasDeLaboratorioData } from '../../../../../redux/actions/intervencionesEstimulacion'
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

@autobind class PruebasDeLaboratorioApuntaladoExtra extends Component {
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

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let pruebas = []

    pruebasDeLaboratorioData.map((prueba, i) => {
      if(!prueba.hasOwnProperty('edited')){
        pruebas.push({ ...prueba,
          edited: true,
          contenidoDeAceite:'',
          contenidoDeAgua:'',
          contenidoDeEmulsion:'',
          contenidoDeSolidos:'',
          tipoDeSolidos:'',
          densidadDelAceite:'',
          densidadDelAgua:'',
          densidadDeLaEmulsion:'',
          contenidoDeAsfaltenos:'',
          contenidoDeParafinas:'',
          contenidoDeResinas:'',
          indiceDeEstabilidadDelColoidal:'',
          indiceDeEstabilidadDelAgua:'',
          pH:'',
          salinidad:'',
          viscosidadDelAceite:'',
          tipoDeGelLineal:'',
          viscosidadDelGelLineal:'',
          tiempoDeReticulacion:'',
          pHGelLineal:'',
          tiempoDeRompedorDelGel:'',
          tamanoDelApuntalante: '',
          gravedadEspecifica: '',
          esfericidad: '',
          redondeo: '',
          turbidez: '',
          psi: '',
          pruebaDeSolubilidadConAcida: '',
          sistemasTable: [{
            sistem: '',
            tiempoRompimiento: '',
            interfase: '',
            solidosFiltrar: '',
            resultado: '',
          }]
        })
      }else {
        pruebas.push(prueba)
      }
    })

    setPruebasDeLaboratorioData(pruebas)
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  updateValue(value, event){
    if(event === undefined)
      return

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()

    let index = event.target.getAttribute('index')
    let pruebas = {...pruebasDeLaboratorio}
    pruebas.pruebasDeLaboratorioData[index][event.target.name] = event.target.value

    setPruebasDeLaboratorioData(pruebas.pruebasDeLaboratorioData)
  }

  makeCaracterizacionForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='caracterizacion-form' >
        <div className='header'>
          Caracterización de los Fluidos Producidos
        </div>
        <InputRow header="Contenido de aceite" name='contenidoDeAceite' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAceite} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de agua" name='contenidoDeAgua' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAgua} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de emulsión" name='contenidoDeEmulsion' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeEmulsion} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de solidos" name='contenidoDeSolidos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeSolidos} onChange={this.updateValue} index={index} />
        <InputRow header="Tipo de solidos" name='tipoDeSolidos' value={pruebasDeLaboratorioData[index].tipoDeSolidos} onChange={this.updateValue} index={index} />
        <InputRow header="Densidad del aceite" name='densidadDelAceite' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAceite} onChange={this.updateValue} index={index} />
        <InputRow header="Densidad del agua" name='densidadDelAgua' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAgua} onChange={this.updateValue} index={index} />
        <InputRow header="Densidad de la emulsion" name='densidadDeLaEmulsion' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDeLaEmulsion} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de asfaltenos" name='contenidoDeAsfaltenos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAsfaltenos} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de parafinas" name='contenidoDeParafinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeParafinas} onChange={this.updateValue} index={index} />
        <InputRow header="Contenido de resinas" name='contenidoDeResinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeResinas} onChange={this.updateValue} index={index} />
        <InputRow header="Índice de estabilidad coloidal" name='indiceDeEstabilidadDelColoidal' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelColoidal} onChange={this.updateValue} index={index} />
        <InputRow header="Índice de estabilidad del agua" name='indiceDeEstabilidadDelAgua' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelAgua} onChange={this.updateValue} index={index} />
        <InputRow header="pH" name='pH' unit="adim" value={pruebasDeLaboratorioData[index].pH} onChange={this.updateValue} index={index} />
        <InputRow header="Salinidad" name='salinidad' unit="ppm" value={pruebasDeLaboratorioData[index].salinidad} onChange={this.updateValue} index={index} />
        <InputRow header="Viscosidad del aceite" name='viscosidadDelAceite' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelAceite} onChange={this.updateValue} index={index} />
      </div>
    )
  }


  makeGelLinealForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='gel-lineal-form' >
        <div className='header'>
          Prueba Para Gel Lineal
        </div>
        <InputRowUnitless header="Tipo de gel lineal" name='tipoDeGelLineal' value={pruebasDeLaboratorioData[index].tipoDeGelLineal} onChange={this.updateValue} index={index} />
        <InputRow header="Viscosidad del gel lineal" name='viscosidadDelGelLineal' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelGelLineal} onChange={this.updateValue} index={index} />
        <InputRow header="Tiempo de reticulación" name='tiempoDeReticulacion' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeReticulacion} onChange={this.updateValue} index={index} />
        <InputRow header="pH gel lineal" name='pHGelLineal' unit="adim" value={pruebasDeLaboratorioData[index].pHGelLineal} onChange={this.updateValue} index={index} />
        <InputRow header="Tiempo de rompedor del gel" name='tiempoDeRompedorDelGel' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeRompedorDelGel} onChange={this.updateValue} index={index} />
      </div>
    )
  }


  makeApuntalanteForm(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba Para Apuntalante
        </div>
        <InputRow header="Tamaño del apuntalante" name='tamanoDelApuntalante' unit="malla" value={pruebasDeLaboratorioData[index].tamanoDelApuntalante} onChange={this.updateValue} index={index} />
        <InputRow header="Gravedad específica" name='gravedadEspecifica' unit="adim" value={pruebasDeLaboratorioData[index].gravedadEspecifica} onChange={this.updateValue} index={index} />
        <InputRow header="Esfericidad" name='esfericidad' unit="adim" value={pruebasDeLaboratorioData[index].esfericidad} onChange={this.updateValue} index={index} />
        <InputRow header="Redondeo" name='redondeo' unit="adim" value={pruebasDeLaboratorioData[index].redondeo} onChange={this.updateValue} index={index} />
        <InputRow header="Turbidez" name='turbidez' unit="FTU" value={pruebasDeLaboratorioData[index].turbidez} onChange={this.updateValue} index={index} />
        <InputRow header="Resistencia" name='psi' unit="psi" value={pruebasDeLaboratorioData[index].resistencia} onChange={this.updateValue} index={index} />
        <InputRow header="Prueba de solubilidad con ácido" name='pruebaDeSolubilidadConAcida' unit="%" value={pruebasDeLaboratorioData[index].pruebaDeSolubilidadConAcida} onChange={this.updateValue} index={index} />
      </div>
    )
  }


  renderEditable(cellInfo) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let copy = JSON.parse(JSON.stringify(pruebasDeLaboratorioData))
          copy[cellInfo.column.tableIndex]["sistemasTable"][cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPruebasDeLaboratorioData(copy)
        }}>{pruebasDeLaboratorioData[cellInfo.column.tableIndex]["sistemasTable"][cellInfo.index][cellInfo.column.id]}
        </div>
    );
  }

  addNewRow(event) {
    let { pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
 
    let index = event.target.getAttribute('index')   
    let data = pruebasDeLaboratorioData[index].sistemasTable
    let copy = JSON.parse(JSON.stringify(data))

    copy[0].length = 2
    
    let val =  ([...copy, {index: copy.length, sistem: '', tiempoRompimiento: '', interfase: '', solidosFiltrar: '', resultado: '' , length: copy.length + 1}])
    pruebasDeLaboratorioData[index].sistemasTable = val
    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }

  deleteRow(state, rowInfo, column, instance) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let data = pruebasDeLaboratorioData[0].sistemasTable 
    let copy = JSON.parse(JSON.stringify(data))

    return {
      onClick: e => {
        if (column.id === 'delete' && copy.length > 1) {
          copy.splice(rowInfo.original.index, 1)

          copy.forEach((i, index) => {
            i.index = index
            i.length = copy.length
          }) 

          this.setState({
            data: copy
          })
        }
      }
    }
  }



  makeSistemaTable(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let data = pruebasDeLaboratorioData[index].sistemasTable

    if(data == undefined)
      return null

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
      column.tableIndex = index	
    })

    return (
      <div style={{marginBot: '20px'}}> 
        <div className='header'>
          Lab Test Results (spanish)
        </div>
        <div className='table-select'>
          <ReactTable
            name="sistemasTable"
            className="-striped"
            data={data}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={data.length}
            sortable={false}
            index={index}
            getTdProps={this.deleteRow}
          />
        </div>
        <button className='new-row-button' index={index} onClick={this.addNewRow}> + </button>
      </div>
    )
  }
  
  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl, e)
  }

  makeImageInput(index) {
    let { pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let imageURL = pruebasDeLaboratorioData[index].imageURL

    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Lab Evidence (spanish)
        </div>
        <input type='file' name='imageURL' accept="image/*" onChange={(e) => this.handleFileUpload(e, this.updateValue)} index={index}></input>
        {imageURL ? <img className='img-preview' src={imageURL}></img> : null }
      </div>
    )
  }
  
  render() {
    let { setObervacionesPruebasLabApuntalado, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return pruebasDeLaboratorioData.map((form, i) => 
      <div key={Math.random()} className="form pruebas-de-laboratorio-apuntalado-extra">
        <div className='top'>
            <div className='left'>
              { this.makeCaracterizacionForm(i) }
            </div>
            <div className='right'>
              { this.makeGelLinealForm(i) }
              { this.makeApuntalanteForm(i) }
            </div>
        </div>
        <div className='bot'>
          { this.makeSistemaTable(i) }
          <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'}/>
          { this.makeImageInput(i) }
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio')
})

const mapDispatchToProps = dispatch => ({
  setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioApuntaladoExtra)

