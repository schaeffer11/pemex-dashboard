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
    Header: 'Interval',
    accessor: 'interval',
    cell: 'renderNumber',
  }, { 
    Header: 'Cima (md)',
    accessor: 'cimaMD',
    cell: 'renderNumber',

  }, { 
    Header: 'Base (md)',
    accessor: 'baseMD',
    cell: 'renderNumber',
  }, { 
    Header: 'Cima (mv)',
    accessor: 'cimaMV',
    cell: 'renderNumber',
  }, { 
    Header: 'Base (mv)',
    accessor: 'baseMV',
    cell: 'renderNumber',
  }, { 
    Header: 'V arc.(%)',
    accessor: 'vArc',
    cell: 'renderNumber',
  }, { 
    Header: 'Porosity (%',
    accessor: 'porosity',
    cell: 'renderNumber',
  }, { 
    Header: 'Sw. (%)',
    accessor: 'sw',
    cell: 'renderNumber',
  }, { 
    Header: 'Dens. (gr/cc)',
    accessor: 'dens',
    cell: 'renderNumber',
  }, { 
    Header: 'Resis. (ohm)',
    accessor: 'resis',
    cell: 'renderNumber',
  }, { 
    Header: 'Perm. (mD)',
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
    Header: 'Cima (md)',
    accessor: 'cimaMD',
    cell: 'renderNumber',
  }, { 
    Header: 'Base (md)',
    accessor: 'baseMD',
    cell: 'renderNumber',
  }, { 
    Header: 'Lodo perdido (m3)',
    accessor: 'lodoPerdido',
    cell: 'renderNumber',
  }, { 
    Header: 'Densidad (gr/cc)',
    accessor: 'densidad',
    cell: 'renderNumber',
  }
]

@autobind class EvaluacionPetrofisica extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: [],
      checked: []
    }

  }

  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    }

  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)
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
    let objectTemplate = {cimaMD: '', baseMD: '', lodoPerdido: '', densidad: ''}
/*
    layerColumns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })
*/
    return (
      <div style={{marginBot: '20px'}}> 
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
        { this.state.errors.layerData && this.state.errors.layerData.checked &&
          <div className="error">{this.state.errors.layerData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }



  makeMudLossTable() {
    let { setMudLossData, formData } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData

    let objectTemplate = {cimaMD: '', baseMD: '', lodoPerdido: '', densidad: ''}
/*
    mudLossColumns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditableMudLoss : null
    })
*/

    return (
      <div style={{marginBot: '20px'}}> 
        <div className='header'>
          ZONA DE PERDIDA
        </div>
        <div className='table'>

          <InputTable
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
        { this.state.errors.mudLossData && this.state.errors.mudLossData.checked &&
          <div className="error">{this.state.errors.mudLossData.message}</div>
        }
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
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar el Archivo de Registro del Pozo
          {/*Upload Well Log File (spanish)*/}
        </div>
        <input type='file' accept="image/*" onChange={this.handleFileUpload}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
        { this.state.errors.imgURL && this.state.errors.imgURL.checked &&
          <div className="error">{this.state.errors.imgURL.message}</div>
        }
      </div>
    )
  }


  render() {

    return (
      <div className="form evaluacionPetrofisica">
        {this.makeLayerTable()}
        {this.makeMudLossTable()}
        {this.makeImgInput()}
      </div>
    )
  }
}

const validate = values => {
    let errors = {}

    if(!values.layerData){
      errors.layerData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.layerData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.layerData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    if(!values.mudLossData){
      errors.mudLossData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.mudLossData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.mudLossData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    if(!values.imgURL){
      errors.imgURL = {message: "Ningun campo puede estar vacio."}
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('evaluacionPetrofisica'),
})

const mapDispatchToProps = dispatch => ({
  setImgURL: val => dispatch(setImgURL(val)),
  setLayerData: val => dispatch(setLayerData(val)),
  setMudLossData: val => dispatch(setMudLossData(val)),
  setChecked: val => dispatch(setChecked(val))
})



export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(EvaluacionPetrofisica)
)
