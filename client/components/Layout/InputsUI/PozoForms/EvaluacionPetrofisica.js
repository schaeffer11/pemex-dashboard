import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { setImgURL, setLayerData, setMudLossData } from '../../../../redux/actions/evaluacionPetrofisica'
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
    Header: 'Interval',
    accessor: 'interval',
    cell: 'renderEditable',
  }, { 
    Header: 'Cima (md)',
    accessor: 'cimaMD',
    cell: 'renderEditable',

  }, { 
    Header: 'Base (md)',
    accessor: 'baseMD',
    cell: 'renderEditable',
  }, { 
    Header: 'Cima (mv)',
    accessor: 'cimaMV',
    cell: 'renderEditable',
  }, { 
    Header: 'Base (mv)',
    accessor: 'baseMV',
    cell: 'renderEditable',
  }, { 
    Header: 'V arc.(%)',
    accessor: 'vArc',
    cell: 'renderEditable',
  }, { 
    Header: 'Porosity (%',
    accessor: 'porosity',
    cell: 'renderEditable',
  }, { 
    Header: 'Sw. (%)',
    accessor: 'sw',
    cell: 'renderEditable',
  }, { 
    Header: 'Dens. (gr/cc)',
    accessor: 'dens',
    cell: 'renderEditable',
  }, { 
    Header: 'Resis. (ohm)',
    accessor: 'resis',
    cell: 'renderEditable',
  }, { 
    Header: 'Perm. (mD)',
    accessor: 'perm',
    cell: 'renderEditable',
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
    Header: 'Cima (md)',
    accessor: 'cimaMD',
    cell: 'renderEditable',
  }, { 
    Header: 'Base (md)',
    accessor: 'baseMD',
    cell: 'renderEditable',
  }, { 
    Header: 'Lodo perdido (m3)',
    accessor: 'lodoPerdido',
    cell: 'renderEditable',
  }, { 
    Header: 'Densidad (gr/cc)',
    accessor: 'densidad',
    cell: 'renderEditable',
  }
]

@autobind class EvaluacionPetrofisica extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors === undefined
      })
    }
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

    setLayerData([...layerData, {index: layerData.length, interval: '', cimaMD: '', baseMD: '', cimaMV: '', baseMV: '', vArc: '', porosity: '', sw: '', dens: '', resis: '', perm: '', length: layerData.length + 1}])
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

    layerColumns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div style={{marginBot: '20px'}}> 
        <div className='header'>
          PROPIEDADES PROMEDIO
        </div>
        <div className='table'>

          <ReactTable
            className="-striped"
            data={layerData}
            columns={layerColumns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={layerData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />

        </div>
        <button className='new-row-button' onClick={this.addNewRow}> + </button>
      </div>
    )
  }



  makeMudLossTable() {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    mudLossColumns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditableMudLoss : null
    })


    return (
      <div style={{marginBot: '20px'}}> 
        <div className='header'>
          ZONA DE PERDIDA
        </div>
        <div className='table'>

          <ReactTable
            className="-striped"
            data={mudLossData}
            columns={mudLossColumns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={mudLossData.length}
            sortable={false}
            getTdProps={this.deleteRowMudLoss}
          />

        </div>
        <button className='new-row-button' onClick={this.addNewRowMudLoss}> + </button>
      </div>
    )
  }

  handleFileUpload(e) {
    let { setImgURL } = this.props
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])
    console.log(localImgUrl)

    setImgURL(localImgUrl)
  }

  handleMyClick(e) {
    e.preventDefault()
    console.log('what?', this.props.formData.toJS())
    let data = this.props.formData.toJS()
    const { imgURL } = data

    function bufferToBase64(buf) {
      console.log('buffer to 64')
      var binstr = Array.prototype.map.call(buf, function (ch) {
          return String.fromCharCode(ch);
      }).join('');
      return btoa(binstr);
    }

  var xhr = new XMLHttpRequest()
  xhr.open('GET', imgURL, true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function(e) {
    if (this.status == 200) {
      var uInt8Array = new Uint8Array(this.response);
      var byte3 = uInt8Array[4]; 
      console.log('uint8', uInt8Array)
      const base64 = bufferToBase64(uInt8Array)
      console.log('fuck this up', uInt8Array)
      let formData = new FormData()
        formData.append('file', base64)
        formData.append('somename', 'aldini')
        fetch('/api/testing', {
          method: 'POST',
          body: formData,
        })
    }
  }
  xhr.send();
  }

  makeImgInput() {
    let { formData } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    console.log(imgURL)
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Well Log File (spanish)
        </div>
        <input type='file' accept="image/*" onChange={this.handleFileUpload}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }


  render() {

    return (
      <div className="form evaluacionPetrofisica">
        {this.makeLayerTable()}
        {this.makeMudLossTable()}
        {this.makeImgInput()}
        <button onClick={this.handleMyClick}>Do something</button>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('evaluacionPetrofisica'),
})

const mapDispatchToProps = dispatch => ({
  setImgURL: val => dispatch(setImgURL(val)),
  setLayerData: val => dispatch(setLayerData(val)),
  setMudLossData: val => dispatch(setMudLossData(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionPetrofisica)
