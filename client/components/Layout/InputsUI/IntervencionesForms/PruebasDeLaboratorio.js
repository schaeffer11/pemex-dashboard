import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import Select from 'react-select'

import InputTable from '../../Common/InputTable'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import { setPruebasDeLaboratorioData } from '../../../../redux/actions/intervencionesEstimulacion'
import { getCompanyOptions } from '../../../../lib/helpers'

export const options = [
  { label: 'Caracterización fisico-química de fluidos', value: 'caracterizacionFisico' },
  { label: 'Pruebas de solubilidad', value: 'pruebasDeSolubilidad' },
  { label: 'Pruebas de compatiblidad por emulsión', value: 'pruebasDeCompatibilidad' },
  { label: 'Pruebas para apuntalante', value: 'pruebasParaApuntalante' },
  { label: 'Pruebas gel de fractura', value: 'pruebasGelDeFractura' },
  { label: 'Pruebas de grabado', value: 'pruebasDeGrabado' },
  { label: 'Cromatografía del gas', value: 'cromatografiaDelGas' },
  { label: 'Prueba de dureza', value: 'pruebaDeDureza' },
  { label: 'Determinación de la calidad método de los cloruros', value: 'determinacionDeLaCalidad' },
  { label: 'Curva de Viscosidad', value: 'curvaDeViscosidad' },
]

@autobind class PruebasDeLaboratorio extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }


  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  renderEditable(cellInfo) {
    let { setPruebasDeLaboratorioData, formData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          pruebasDeLaboratorioData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
        }}
      >{pruebasDeLaboratorioData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    let copy = pruebasDeLaboratorioData
    copy[0].length = 2

    setPruebasDeLaboratorioData([...copy, {index: pruebasDeLaboratorioData.length, type: '', fechaMuestreo: null, fechaPrueba: null, compania: '', superviso: '', length: pruebasDeLaboratorioData.length + 1}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && pruebasDeLaboratorioData.length > 1) {
          let copy = pruebasDeLaboratorioData
          copy.splice(rowInfo.original.index, 1)

          copy.forEach((i, index) => {
            i.index = index
            i.length = pruebasDeLaboratorioData.length
          }) 

          setPruebasDeLaboratorioData(copy)
        }
      }
    }
  }

  handleSelectTipo(row, e) {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    pruebasDeLaboratorioData[row.index].type = e

    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }

  handleSelectCompany(row, e) {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    pruebasDeLaboratorioData[row.index].compania = e

    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }



  makeGeneralesForm() {
    let { setPruebasDeLaboratorioData, formData, companyOptions } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

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
        Header: 'Tipo de Analisis',
        accessor: 'type',
        width: 420,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
                 return (<div>
                  <Select 
                  placeholder='Seleccionar...'
                  className='input' 
                  simpleValue={true} 
                  options={options} 
                  value={options.find(i=>i.value === row.original.type) || null}
                  onChange={(e) => this.handleSelectTipo(row, e.value)} 
                  name={name} 
                />
                </div>)
              }
      }, { 
        Header: 'Fecha de Muestreo',
        accessor: 'fechaMuestreo',
        cell: 'renderDate',
        maxWidth: 180,
        resizable: false
      }, { 
        Header: 'Fecha de prueba',
        accessor: 'fechaPrueba',
        cell: 'renderDate',
        maxWidth: 180,
        resizable: false
      }, { 
        Header: 'Compañía',
        accessor: 'compania',
        width: 200,
        resizable: false,
        style: {overflow: 'visible'},
        Cell: row => {
                 return (<div>
                  <Select 
                  placeholder='Seleccionar...'
                  className='input' 
                  simpleValue={true} 
                  options={companyOptions} 
                  value={companyOptions.find(i=>i.value === row.original.compania) || null}
                  onChange={(e) => this.handleSelectCompany(row, e.value)} 
                  name={name} 
                />
                </div>)
              }
      }, { 
        Header: 'Personal de Pemex que supervisó',
        accessor: 'superviso',
        width: 420,
        cell: 'renderEditable'
      },
    ]

    const objectTemplate = {type: '', fechaMuestreo: null, fechaPrueba: null, compania: '', superviso: ''}



    return (
      <div className='generales-form' >
        <div className='table-select'>
          <InputTable
            className="-striped"
            data={pruebasDeLaboratorioData}
            newRow={objectTemplate}
            setData={setPruebasDeLaboratorioData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={pruebasDeLaboratorioData.length}
            sortable={false}
            getTdProps={this.deleteRow}
            ignoreAddRow
          />
        </div>
      </div>
    )
  }

  render() {
    let { setObervacionesLab, formData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData, obervacionesLab } = formData

    return (
      <div className="form pruebas-de-laboratorio-estimulacion">
          { this.makeGeneralesForm() }
          <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorio'),
  companyOptions: state.getIn(['global', 'companyOptions'])
})

const mapDispatchToProps = dispatch => ({
  setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val)),
  setChecked: values => {dispatch(setChecked(values, 'pruebasDeLaboratorio'))}
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorio)
