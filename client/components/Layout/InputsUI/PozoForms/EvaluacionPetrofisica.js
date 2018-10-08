import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import {withValidate} from '../../Common/Validate'
import { setImgURL, setLayerData, setMudLossData, setChecked, setHasErrorsEvaluacionPetrofisica } from '../../../../redux/actions/pozo'
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
      errors: {
        layerTable: {
          value: '',
          type: 'table',
        },
        mudTable: {
          value: '',
          type: 'table',
        },
      },
    }

  }

  componentDidMount(){
    let { setHasErrorsEvaluacionPetrofisica, hasSubmitted } = this.props

    if (hasSubmitted) {
      let hasErrors = this.checkAllInputs()
      setHasErrorsEvaluacionPetrofisica(hasErrors)
    }
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs()
    }
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors)
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors)
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
      const { setHasErrorsEvaluacionPetrofisica } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsEvaluacionPetrofisica(hasErrors)
    })
  }

  makeLayerTable() {
    let { setLayerData, formData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { layerData } = formData
    const rowObj = {
      cimaMD: '',
      baseMD: '',
      espesorNeto: '',
      vArc: '',
      porosity: '',
      sw: '',
      dens: '',
      resis: '',
      perm: '',
      error: true,
    }
    const errors = [
      { name: 'cimaMD', type: 'number'},
      { name: 'baseMD', type: 'number'},
      { name: 'espesorNeto', type: 'number'},
      { name: 'vArc', type: 'number'},
      { name: 'porosity', type: 'number'},
      { name: 'sw', type: 'number'},
      { name: 'dens', type: 'number'},
      { name: 'resis', type: 'number'},
      { name: 'perm', type: 'number'},
    ]
    return (
      <div className='layer-table' style={{marginBot: '20px'}}> 
        <div className='header'>
          Propiedades promedio
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={layerData}
            setData={setLayerData}
            columns={layerColumns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={val => this.checkForErrors(val, 'layerTable')}
            hasSubmitted={hasSubmitted}
          />
        </div>
      </div>
    )
  }

  makeMudLossTable() {
    let { setMudLossData, formData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { mudLossData } = formData
    const rowObj = {
      cimaMD: '',
      baseMD: '',
      lodoPerdido: '',
      densidad: '',
      error: true,
    }
    const errors = [
      { name: 'cimaMD', type: 'number' },
      { name: 'baseMD', type: 'number' },
      { name: 'lodoPerdido', type: 'number' },
      { name: 'densidad', type: 'number' },
    ]
    return (
      <div className="mud-loss-table" style={{marginBot: '20px'}}> 
        <div className='header'>
          Zona de pérdida
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={mudLossData}
            setData={setMudLossData}
            columns={mudLossColumns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            errorArray={errors}
            rowObj={rowObj}
            checkForErrors={val => this.checkForErrors(val, 'mudTable')}
            hasSubmitted={hasSubmitted}
          />
        </div>
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
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setImgURL: val => dispatch(setImgURL(val)),
  setLayerData: val => dispatch(setLayerData(val)),
  setMudLossData: val => dispatch(setMudLossData(val)),
  setHasErrorsEvaluacionPetrofisica: val => dispatch(setHasErrorsEvaluacionPetrofisica(val)),
})



export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionPetrofisica)