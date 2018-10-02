import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import {withValidate} from '../../Common/Validate'
import { setImgURL, setLayerData, setMudLossData, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ReactTable from 'react-table'
import { freemem } from 'os';

let layerColumns = [
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
    Header: 'Intervalo',
    accessor: 'interval',
  }, { 
    Header: <div>Cima<br></br>(md)</div>,
    accessor: 'cimaMD',
    cell: 'renderNumber',
  }, {
    Header: <div>Base<br></br>(md)</div>,
    accessor: 'baseMD',
    cell: 'renderNumber',
  },
  {
    Header: <div>Espesor Bruto<br></br>(md)</div>,
    accessor: 'espesorBruto',
  },{
    Header: <div>Espesor Neto<br></br>(md)</div>,
    accessor: 'espesorNeto',
    cell: 'renderNumber',
  }, { 
    Header: <div>V arc.<br></br>(%)</div>,
    accessor: 'vArc',
    cell: 'renderNumber',
  }, { 
    Header: <div>Porosidad<br></br>(%)</div>,
    accessor: 'porosity',
    cell: 'renderNumber',
  }, { 
    Header: <div>Sw.<br></br>(%)</div>,
    accessor: 'sw',
    cell: 'renderNumber',
  }, { 
    Header: <div>Dens.<br></br>(gr/cc)</div>,
    accessor: 'dens',
    cell: 'renderNumber',
  }, { 
    Header: <div>Resis.<br></br>(ohm)</div>,
    accessor: 'resis',
    cell: 'renderNumber',
  }, { 
    Header: <div>Perm<br></br>(md)</div>,
    accessor: 'perm',
    cell: 'renderNumber',
  }
]

let mudLossColumns = [
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
    Header: <div>Cima<br></br>(md)</div>,
    accessor: 'cimaMD',
    cell: 'renderNumber',
  }, { 
    Header: <div>Base<br></br>(md)</div>,
    accessor: 'baseMD',
    cell: 'renderNumber',
  }, { 
    Header: <div>Lodo perdido<br></br>(m<sup>3</sup>)</div>,
    accessor: 'lodoPerdido',
    cell: 'renderNumber',
  }, { 
    Header: <div>Densidad<br></br>(gr/cc)</div>,
    accessor: 'densidad',
    cell: 'renderNumber',
  }
]

@autobind class EvaluacionPetrofisica extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

  }

  componentDidMount(){

  }


//Duplicating these 3 functions for the sake of time, rather than making nice
  renderEditable(cellInfo) {
    let { setLayerData, formData } = this.props
    formData = formData.toJS()
    let { layerData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          layerData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setLayerData(layerData)
        }}
      >{layerData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  renderEditableMudLoss(cellInfo) {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          mudLossData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setMudLossData(mudLossData)
        }}
      >{mudLossData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { setLayerData, formData } = this.props
    formData = formData.toJS()
    let { layerData } = formData

    layerData[0].length = 2

    setLayerData([...layerData, {index: layerData.length, interval: '', cimaMD: '', baseMD: '', espesorBruto: '', espesorNeto: '', vArc: '', porosity: '', sw: '', dens: '', resis: '', perm: '', length: layerData.length + 1}])
  }

  addNewRowMudLoss() {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    mudLossData[0].length = 2

    setMudLossData([...mudLossData, {index: mudLossData.length, cimaMD: '', baseMD: '', lodoPerdido: '', densidad: '', length: mudLossData.length + 1}])
  }

  deleteRow(state, rowInfo, column, instance) {
    let { setLayerData, formData } = this.props
    formData = formData.toJS()
    let { layerData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && layerData.length > 1) {
          layerData.splice(rowInfo.original.index, 1)

          layerData.forEach((i, index) => {
            i.index = index
            i.length = layerData.length
          }) 

          setLayerData(layerData)
        }
      }
    }
  }

  deleteRowMudLoss(state, rowInfo, column, instance) {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && mudLossData.length > 1) {
          mudLossData.splice(rowInfo.original.index, 1)

          mudLossData.forEach((i, index) => {
            i.index = index
            i.length = mudLossData.length
          }) 

          setMudLossData(mudLossData)
        }
      }
    }
  }


  makeLayerTable() {
    let { setLayerData, formData } = this.props
    formData = formData.toJS()
    let { layerData } = formData
    let objectTemplate = {cimaMD: '', baseMD: '', lodoPerdido: '', densidad: ''}

    return (
      <div className='layer-table' style={{marginBot: '20px'}}> 
        <div className='header'>
          PROPIEDADES PROMEDIO
        </div>
        <div className='table'>

          <InputTable
            className="-striped"
            data={layerData}
            newRow={objectTemplate}
            setData={setLayerData}
            columns={layerColumns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={layerData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />

        </div>
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }



  makeMudLossTable() {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    let objectTemplate = {cimaMD: '', baseMD: '', lodoPerdido: '', densidad: ''}

    return (
      <div className="mud-loss-table" style={{marginBot: '20px'}}> 
        <div className='header'>
          ZONA DE PÉRDIDA
        </div>
        <div className='table'>

          <InputTable
            location="EvaluacionPetrofisica"
            className="-striped"
            data={mudLossData}
            newRow={objectTemplate}
            setData={setMudLossData}
            columns={mudLossColumns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={mudLossData.length}
            sortable={false}
            getTdProps={this.deleteRowMudLoss}
          />

        </div>

        <button className='new-row-button' onClick={this.addNewRowMudLoss}>Añadir un renglón</button>
      </div>
    )
  }

  handleFileUpload(e) {
    let { setImgURL } = this.props
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setImgURL(localImgUrl)
  }

  makeImgInput() {
    let { formData } = this.props
    formData = formData.toJS()
    let { imgURL } = formData

    return (
      <div className='img-input' style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar el Archivo de Registro del Pozo
          {/*Upload Well Log File (spanish)*/}
        </div>
        <input type='file' accept="image/*" onChange={this.handleFileUpload}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }

      </div>
    )
  }


  render() {
    console.log('render petrofisica')
    return (
      <div className="form evaluacionPetrofisica">
        <div className="image"/>
        {this.makeLayerTable()}
        {this.makeMudLossTable()}
        {this.makeImgInput()}
      </div>
    )
  }
}



const mapStateToProps = state => ({
  formData: state.get('evaluacionPetrofisica'),
})

const mapDispatchToProps = dispatch => ({
  setImgURL: val => dispatch(setImgURL(val)),
  setLayerData: val => dispatch(setLayerData(val)),
  setMudLossData: val => dispatch(setMudLossData(val)),
})



export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionPetrofisica)