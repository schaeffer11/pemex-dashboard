import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import Select from 'react-select'
import InputTable from '../../Common/InputTable'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import {setEstimacionCostosData, setMNXtoDLS, setHasErrorsEstCosts } from '../../../../redux/actions/intervencionesEstimulacion'
import { sortLabels } from '../../../../lib/formatters'
import { checkEmpty, checkDate } from '../../../../lib/errorCheckers';


@autobind class EstimacionCostos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: {
        costs: {
          type: 'table',
          value: '',
        },
      },
      costMap: [],
      itemOptions: [],
    }
  }


  componentDidMount(){
    let { setHasErrorsEstCosts, hasSubmitted } = this.props
    const token = this.props.user.get('token')
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsEstCosts(hasErrors)

    fetch(`api/getCostItems`, headers)
    .then(r => r.json())
    .then( r => {
      let itemOptions = r.map(i => ({
        label: i.ITEM,
        value: i.COST_ID,
      })).sort(sortLabels)

      this.setState({
        costMap: r,
        itemOptions: itemOptions
      })
    })

  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted } = this.props

    if (hasSubmitted !== prevProps.hasSubmitted) {
      this.checkAllInputs(true)
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error 

    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, showErrors)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, showErrors)
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

  updateErrors(errors) {
    let { hasErrors, setHasErrorsEstCosts } = this.props
    let hasErrorNew = false

    Object.keys(errors).forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsEstCosts(hasErrorNew)
    }

    this.setState({ errors })
  }

  checkForErrors(value, table) {
    const errorsCopy = {...this.state.errors}
    errorsCopy[table].value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsEstCosts } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsEstCosts(hasErrors)
    })
  }


  renderEditable(cellInfo) {
    let { setEstimacionCostosData, formData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          estimacionCostosData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setEstimacionCostosData(estimacionCostosData)
        }}
      >{estimacionCostosData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  handleSelectCompany(row, e) {
    let { formData, setEstimacionCostosData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    estimacionCostosData[row.index].compania = e

    setEstimacionCostosData(estimacionCostosData)
  }

  setEstimacionCostosData(data) {
    let { costMap } = this.state
    let { setEstimacionCostosData } = this.props

    data.forEach(row => {
      row.unit = costMap.find(i => i.COST_ID === row.item) ? costMap.find(i => i.COST_ID === row.item).UNIT : null
    })

    setEstimacionCostosData(data)
  }

  makeCostsForm() {
    let { setEstimacionCostosData, setMNXtoDLS, formData } = this.props
    let { itemOptions, costOpt } = this.state
    formData = formData.toJS()
    let { estimacionCostosData, MNXtoDLS } = formData
    
    const rowObj = {
      fecha: null,
      cost: '',
      costDLS: '',
      MNXtoDLS: '',
      compania: '',
      error: true,
    }

    const errors = [
      { name: 'item', type: 'text' },
      { name: 'cost', type: 'number' },
      { name: 'costDLS', type: 'number' },
      { name: 'MNXtoDLS', type: 'number' },
    ]
    let columns = [{
      Header: '',
      accessor: 'delete',
      width: 35,
      resizable: false,
      Cell: row => {
              if (row.original.length > 1) {
                return (<div style={{color: 'white', background: 'red', borderRadius: '4px', textAlign: 'center', cursor: 'pointer'}}>X</div>)
              }
            }
      }, 
      {
        Header: 'Concepto',
        accessor: 'item',
        cell: 'renderSelect',
        style: {overflow: 'visible'},
      },
      { 
        Header: 'Unidad',
        accessor: 'unit'
      }, {
        Header: <div>Costo<br></br>(MXN)</div>,
        accessor: 'cost',
        cell: 'renderNumber',
        maxWidth: 180,
        resizable: false
      }, { 
      Header: <div>Costo<br></br>(DLS)</div>,
        accessor: 'costDLS',
        cell: 'renderNumber',
        maxWidth: 180,
        resizable: false
      }, { 
      Header: <div>Paridad<br></br>(MXN a DLS)</div>,
        accessor: 'MNXtoDLS',
        cell: 'renderNumber',
        maxWidth: 180,
        resizable: false
      }
    ]

    return (
      <div className='costs-form' >
        <div className='header'>
          Tabla de Costos
        </div>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={estimacionCostosData}
            setData={this.setEstimacionCostosData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            selectOptions={itemOptions}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={val => this.checkForErrors(val, 'costs')}
          />
        </div>
      </div>
    )
  }

  render() {
    let { setEstimacionCostosData, formData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    let dlsSum = 0
    let mnxSum = 0
    let convertedDLSSum = 0

    estimacionCostosData.forEach(i => {
      if (i.cost) {
        let cost = i.cost === '-999' ? 0 : parseFloat(i.cost)
        mnxSum += cost
      }
      if (i.costDLS) {
        let costDLS = i.costDLS === '-999' ? 0 : parseFloat(i.costDLS)
        let MNXtoDLS = i.MNXtoDLS === '-999' ? 0 : parseFloat(i.MNXtoDLS)

        dlsSum +=costDLS
        convertedDLSSum +=costDLS * MNXtoDLS
      }
    })

    return (
      <div className="form estimated-costs">
          { this.makeCostsForm() }

          <div className='kpis'>
            <div className='mnx'><div className='values'>${mnxSum}</div><br/>Costo en MXN</div>
            <div className='usd'><div className='values'>${dlsSum} (${convertedDLSSum} MXN)</div><br/>Costo en USD</div>
            <div className='sum'><div className='values'>${mnxSum + (convertedDLSSum)} MXN</div><br/>Costo Total</div>
          </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('estCost'),
  user: state.get('user'),
})

const mapDispatchToProps = dispatch => ({
  setEstimacionCostosData: val => dispatch(setEstimacionCostosData(val)),
  setMNXtoDLS: val => dispatch(setMNXtoDLS(val)),
  setChecked: values => {dispatch(setChecked(values, 'estCost'))},
  setHasErrorsEstCosts: val => dispatch(setHasErrorsEstCosts(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionCostos)

