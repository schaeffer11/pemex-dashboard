import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setPruebasDeLaboratorioData } from '../../../../../redux/actions/intervencionesEstimulacion'
import { setLabEvidenceImgURL } from '../../../../../redux/actions/intervencionesEstimulacion'
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

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let pruebas = []

    pruebasDeLaboratorioData.map((prueba, i) => {
      if(!prueba.hasOwnProperty('edited')){
        pruebas.push({ ...prueba,
          edited: true,
          obervaciones: '',
          imageURL:'',
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

      setPruebasDeLaboratorioData(pruebas)
    })
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
    pruebas.pruebasDeLaboratorioData[index][event.target.name] = value

    setPruebasDeLaboratorioData(pruebas.pruebasDeLaboratorioData)
  }

  renderEditable(cellInfo) {
    let { formData, pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
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
    let { formData, pruebasDeLaboratorio, setPruebasDeLaboratorioData } = this.props
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

  makeSistemaTable(index) {
    let { formData, pruebasDeLaboratorio } = this.props
    formData = formData.toJS()
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
    let { setObervacionesPruebasLabApuntalado, formData, pruebasDeLaboratorio } = this.props
    formData = formData.toJS()
    let { obervacionesPruebasLabApuntalado } = formData
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return pruebasDeLaboratorioData.map((form, i) =>
      <div className="form pruebas-de-laboratorio-estimulacion-extra" key={Math.random()}>
          { this.makeSistemaTable(i) }
          <TextAreaUnitless header="Observaciones" name='obervaciones' className={'obervaciones'} value={form.obervaciones} onChange={this.updateValue} index={i}/> 
          { this.makeImageInput(i) }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorioEstimulacion'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio')
})

const mapDispatchToProps = dispatch => ({
    setLabEvidenceImgURL: val => dispatch(setLabEvidenceImgURL(val)),
    setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioEstimulacionExtra)

