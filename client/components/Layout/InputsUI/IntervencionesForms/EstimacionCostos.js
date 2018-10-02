import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import Select from 'react-select'
import InputTable from '../../Common/InputTable'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import {setEstimacionCostosData, setMNXtoDLS} from '../../../../redux/actions/intervencionesEstimulacion'

export const itemOptions = [
  { label: 'Costo de Servicios', value: 'Costo de Servicios' },
  { label: 'Costo de renta de barco', value: 'Costo de renta de barco' },
  { label: 'Costo de sistema reactivo', value: 'Costo de sistema reactivo' },
  { label: 'Costo de sistema no reactivo', value: 'Costo de sistema no reactivo' },
  { label: 'Costo de divergentes', value: 'Costo de divergentes' },
  { label: <div>Costo de N<sub>2</sub></div>, value: 'Costo de N2' },
  { label: 'Costo de HCl', value: 'Costo de HCl' },
  { label: 'Costo Unidades de alta presión', value: 'Costo Unidades de alta presión' },
  { label: 'Costo del gel de fractura', value: 'Costo del gel de fractura' },
  { label: 'Costo de sistemas acidos retardados', value: 'Costo de sistemas acidos retardados' },
  { label: 'Costo equipo de fracturamiento de pozos', value: 'Costo equipo de fracturamiento de pozos' },
  { label: 'Costo gel lineal', value: 'Costo gel lineal' },
  { label: 'Costo de trabajos de bombeo diversos', value: 'Costo de trabajos de bombeo diversos' },
  { label: 'Costos de llenado de pozo y prueba de admisión', value: 'Costos de llenado de pozo y prueba de admisión' },
  { label: 'Costo del Minifrac', value: 'Costo del Minifrac' },
  { label: 'Costo de Bache neutralizador', value: 'Costo de Bache neutralizador' },
  { label: 'Protector de árbol', value: 'Protector de árbol' },
  { label: 'Costo del apuntalante', value: 'Costo del apuntalante' }
]

const companyOptions = [
  { label: 'Halliburton', value: 'Halliburton' },
  { label: 'Schlumberger', value: 'Schlumberger' },
  { label: 'PFM', value: 'PFM' },
  { label: 'Chemiservices', value: 'Chemiservices' },
  { label: 'BJ', value: 'BJ' },
  { label: 'Weatherford', value: 'Weatherford' },
]

@autobind class EstimacionCostos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: [],
      checked: []
    }
  }


  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

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

  addNewRow() {
    let { formData, setEstimacionCostosData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    let copy = estimacionCostosData
    copy[0].length = 2

    setEstimacionCostosData([...copy, {index: estimacionCostosData.length, item: '', cost: '', compania: '', costDLS: '', fecha: null, MNXtoDLS: '', length: estimacionCostosData.length + 1}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setEstimacionCostosData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && estimacionCostosData.length > 1) {
          let copy = estimacionCostosData
          copy.splice(rowInfo.original.index, 1)

          copy.forEach((i, index) => {
            i.index = index
            i.length = estimacionCostosData.length
          }) 

          setEstimacionCostosData(copy)
        }
      }
    }
  }

  handleSelectItem(row, e) {
    let { formData, setEstimacionCostosData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    estimacionCostosData[row.index].item = e

    setEstimacionCostosData(estimacionCostosData)
  }

  handleSelectCompany(row, e) {
    let { formData, setEstimacionCostosData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData } = formData

    estimacionCostosData[row.index].compania = e

    setEstimacionCostosData(estimacionCostosData)
  }



  makeCostsForm() {
    let { setEstimacionCostosData, setMNXtoDLS, formData } = this.props
    formData = formData.toJS()
    let { estimacionCostosData, MNXtoDLS } = formData

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
      }, {
        Header: 'Concepto',
        accessor: 'item',
        width: 500,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
                 return (<div>
                  <Select 
                  placeholder='Seleccionar...'
                  className='input' 
                  simpleValue={true} 
                  options={itemOptions} 
                  value={itemOptions.find(i=>i.value === row.original.item) || null}
                  onChange={(e) => this.handleSelectItem(row, e.value)} 
                  name={name} 
                />
                </div>)
              }
      }, { 
        Header: <div>Fecha</div>,
        accessor: 'fecha',
        cell: 'renderDate',
        maxWidth: 180,
        resizable: false
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
      }, { 
        Header: 'Compañia',
        accessor: 'compania',
        width: 300,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
                 return (<div>
                  <Select 
                  placeholder="Seleccionar..."
                  className='input' 
                  simpleValue={true} 
                  options={companyOptions} 
                  value={companyOptions.find(i=>i.value === row.original.compania) || null}
                  onChange={(e) => this.handleSelectCompany(row, e.value)} 
                  name={name} 
                />
                </div>)
              }
      }
    ]

    const objectTemplate = {}

    return (
      <div className='costs-form' >
        <div className='header'>
          Tabla de Costos
        </div>
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={estimacionCostosData}
            newRow={objectTemplate}
            setData={setEstimacionCostosData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={estimacionCostosData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
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
        mnxSum += parseFloat(i.cost)
      }
      if (i.costDLS) {
        dlsSum += parseFloat(i.costDLS)
        convertedDLSSum += parseFloat(i.costDLS) * parseFloat(i.MNXtoDLS)
      }
    })

    return (
      <div className="form estimated-costs">
          <div className='image'/>
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
})

const mapDispatchToProps = dispatch => ({
  setEstimacionCostosData: val => dispatch(setEstimacionCostosData(val)),
  setMNXtoDLS: val => dispatch(setMNXtoDLS(val)),
    setChecked: values => {dispatch(setChecked(values, 'estCost'))}
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionCostos)

