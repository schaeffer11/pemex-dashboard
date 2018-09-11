import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import Select from 'react-select'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import { setPruebasDeLaboratorioData } from '../../../../redux/actions/intervencionesEstimulacion'

const options = [
  { label: 'Caracterización de Agua', value: 'caracterizacinAgua' },
  { label: 'Caracterización Físico-Química de Solubilidad', value: 'caracterizacinSolubilidad' },
  { label: 'Compatibilidad por Emulsión', value: 'emulsion' }
]

@autobind class PruebasDeLaboratorioEstimulacion extends Component {
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

    pruebasDeLaboratorioData[0].length = 2

    setPruebasDeLaboratorioData([...pruebasDeLaboratorioData, {index: pruebasDeLaboratorioData.length, type: '', fechaMuestreo: '', fechaPrueba: '', compania: '', superviso: '', length: pruebasDeLaboratorioData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && pruebasDeLaboratorioData.length > 1) {
          pruebasDeLaboratorioData.splice(rowInfo.original.index, 1)

          pruebasDeLaboratorioData.forEach((i, index) => {
            i.index = index
            i.length = pruebasDeLaboratorioData.length
          }) 

          setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
        }
      }
    }
  }

  handleSelect(row, e) {
    let { formData, setPruebasDeLaboratorioData } = this.props
    formData = formData.toJS()
    let { pruebasDeLaboratorioData } = formData

    pruebasDeLaboratorioData[row.index].type = e

    setPruebasDeLaboratorioData(pruebasDeLaboratorioData)
  }



  makeGeneralesForm() {
    let { setPruebasDeLaboratorioData, formData } = this.props
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
                className='input' 
                simpleValue={true} 
                options={options} 
                value={options.find(i=>i.value === row.original.type)}
                onChange={(e) => this.handleSelect(row, e.value)} 
                name={name} 
              />
              </div>)
            }
          }, { 
            Header: 'Fecha de Muestreo',
            accessor: 'fechaMuestreo',
            cell: 'renderEditable',
            maxWidth: 180,
            resizable: false
          }, { 
            Header: 'Fecha de prueba',
            accessor: 'fechaPrueba',
            cell: 'renderEditable',
            maxWidth: 180,
            resizable: false
          }, { 
            Header: 'Compania',
            accessor: 'compania',
            cell: 'renderEditable'
          }, { 
            Header: 'Personal de Pemex que superviso',
            accessor: 'superviso',
            cell: 'renderEditable'
          // }, { 
          //   Header: 'test to show type',
          //   accessor: 'type',
          },
        ]
/*                value={options.find(i=>i.value === testSelect)} */

    columns.forEach(column => {
      column.cell === 'renderEditable' ? column.Cell = this.renderEditable : null
    })

    return (
      <div className='generales-form' >
        <div className='table-select'>
          <ReactTable
            className="-striped"
            data={pruebasDeLaboratorioData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={pruebasDeLaboratorioData.length}
            sortable={false}
            getTdProps={this.deleteRow}
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
          <button className='new-row-button' onClick={this.addNewRow}> + </button>

           {pruebasDeLaboratorioData.length}
          
{/*These both need to be moved to estimulation extra form */}
{/*          <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} value={obervacionesLab} onChange={setObervacionesLab}/>
          <div style={{color: 'red'}}>TODO: agregar opcion para subir evidencia de prueba de laboratorio. (add upload evidence of lab test)</div>
*/}
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorio'),
})

const mapDispatchToProps = dispatch => ({
  setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioEstimulacion)
