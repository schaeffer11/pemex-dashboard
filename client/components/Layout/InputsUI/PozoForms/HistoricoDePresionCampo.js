import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import {withValidate} from '../../Common/Validate'
import { setPresionDataCampo, setPressureDepthCampo, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import { InputRow } from '../../Common/InputRow'

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
    Header: 'Fecha',
    accessor: 'fecha',
    cell: 'renderDate',
  }, { 
    Header: <div>P<sub>ws</sub><br></br>(Kg/cm<sup>2</sup>)</div>,
    accessor: 'Pws',
    cell: 'renderNumber',
  }
]

@autobind class HistoricoDePresionCampo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: []
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
    let errors = Object.assign({}, this.state.errors);
    let {formData} = this.props
    formData = formData.toJS()

    const checked = formData.checked  || []
    checked.forEach((checked) => {
        if(errors[checked]){
           errors[checked].checked = true
           foundErrors = true
        }
    })

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        errors: errors,
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

  renderEditable(cellInfo) {
    let { setPresionDataCampo, formData } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          presionDataCampo[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPresionDataCampo(presionDataCampo)
        }}
      >{presionDataCampo[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setPresionDataCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    presionDataCampo[0].length = 2

    setPresionDataCampo([...presionDataCampo, {index: presionDataCampo.length, fecha: null, Pws: '', length: presionDataCampo.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setPresionDataCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && presionDataCampo.length > 1) {
          presionDataCampo.splice(rowInfo.original.index, 1)

          presionDataCampo.forEach((i, index) => {
            i.index = index
            i.length = presionDataCampo.length
          }) 

          setPresionDataCampo(presionDataCampo)
        }
      }
    }
  }

  render() {
    let { formData, setPresionDataCampo, setPressureDepthCampo } = this.props
    formData = formData.toJS()
    let { presionDataCampo, pressureDepthCampo } = formData

    const objectTemplate = {fecha: null, Pws: ''}

/*
    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })
*/
    return (
      <div className='historico-presion-campo' >
        <div className='image'/>
        <div className='presion-table'>
          <div className='table-select'>
            <InputTable
              className="-striped"
              data={presionDataCampo}
              newRow={objectTemplate}
              setData={setPresionDataCampo}
              columns={columns}
              showPagination={false}
              showPageSizeOptions={false}
              pageSize={presionDataCampo.length}
              sortable={false}
              getTdProps={this.deleteRow}
            />        
          </div>
          { this.state.errors.presionDataCampo && this.state.errors.presionDataCampo.checked &&
            <div className="error">{this.state.errors.presionDataCampo.message}</div>
          }
          <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
        </div>
        <div className='depth'>
          <InputRow header="Plano de Referencia" name='pressureDepthCampo' value={pressureDepthCampo} onChange={setPressureDepthCampo} unit={'md'} onBlur={this.validate} errors={this.state.errors} />
        </div>
      </div>
    )
  }
}

const validate = values => {
    let errors = {}

    if(!values.presionDataCampo){
      errors.presionDataCampo = {message: "Esta forma no puede estar vacia"}
    }else {
      values.presionDataCampo.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.presionDataCampo = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    if(values.pressureDepthCampo == ''){
       errors.pressureDepthCampo = {message: "Ningun campo puede estar vacio."}
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
    setPresionDataCampo: val => dispatch(setPresionDataCampo(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDePresion')),
    setPressureDepthCampo: val => dispatch(setPressureDepthCampo(val)),
})


export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresionCampo)
)

