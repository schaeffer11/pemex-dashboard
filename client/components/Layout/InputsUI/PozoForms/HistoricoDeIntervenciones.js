import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table'

import {withValidate} from '../../Common/Validate'
import { setHistoricoEstimulacionData, setHistoricoAcidoData, setHistoricoApuntaladoData } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import { InputRow } from '../../Common/InputRow'

let columnsEstimulacion = [
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
    Header: 'General',
    columns: [{
      Header: 'Fecha',
      accessor: 'fecha',
      cell: 'renderDate',
    }, { 
      Header: 'Tipo de Tratamiento',
      accessor: 'tipoDeTratamiento',
      cell: 'renderEditable',
     }, { 
      Header: 'Objetivo',
      accessor: 'objetivo',
      cell: 'renderEditable',
    }, { 
      Header: 'Compania',
      accessor: 'compania',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Acido',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'acidoVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'acidoNombre',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Solvente',
      columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'solventeVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'solventeNombre',
      cell: 'renderEditable',
    }]
  }, { 
    Header: 'Divergente',
    columns: [{
      Header: <div>m<sup>3</sup></div>,
      accessor: 'divergenteVol',
      cell: 'renderNumber',
    }, { 
      Header: 'Nombre Comercial',
      accessor: 'divergenteNombre',
      cell: 'renderEditable',
    }]
  }, {
    Header: <div>Total N<sub>2</sub><br/>ST</div>,
    columns: [{ 
      Header: <div>m<sup>3</sup></div>,
      accessor: 'totalN2',
      cell: 'renderNumber',
    }]
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{ 
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber',
    }, { 
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber',
  }]
}
]

let columnsAcido = [
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
    Header: 'Tipo de Tratamiento',
    accessor: 'tipoDeTratamiento',
    cell: 'renderEditable',
   }, { 
    Header: 'Objetivo',
    accessor: 'objetivo',
    cell: 'renderEditable',
  }, {
    Header: 'Compania',
    accessor: 'compania',
    cell: 'renderEditable'
  }, {
    Header: <div>Base<br/>(SOME UNIT)</div>,
    accessor: 'base',
    cell: 'renderNumber'
  }, {
    Header: <div>Cima<br/>(SOME UNIT)</div>,
    accessor: 'cima',
    cell: 'renderNumber'
  }, {
    Header: <div>Longitud Gravada<br/>(m)</div>,
    accessor: 'longitudGravada',
    cell: 'renderNumber'
  }, {
    Header: <div>Altura Gravada<br/>(m)</div>,
    accessor: 'alturaGravada',
    cell: 'renderNumber'
  }, {
    Header: <div>Ancho Gravado<br/>(pg)</div>,
    accessor: 'anchoGravado',
    cell: 'renderNumber'
  }, {
    Header: <div>Conductividad<br/>(mD*ft)</div>,
    accessor: 'conductividad',
    cell: 'renderNumber'
  }, {
    Header: <div>FCD<br/>(adim)</div>,
    accessor: 'fcd',
    cell: 'renderNumber'
  }, {
    Header: <div>Presion Neta<br/>(psi)</div>,
    accessor: 'presionNeta',
    cell: 'renderNumber'
  }, {
    Header: <div>Eficiencia de Fluido de Fractura<br/>(%)</div>,
    accessor: 'fluidoFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber'
    }, {
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber'
    }]
  }
]




let columnsApuntalado = [
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
    Header: 'Tipo de Tratamiento',
    accessor: 'tipoDeTratamiento',
    cell: 'renderEditable',
   }, { 
    Header: 'Objetivo',
    accessor: 'objetivo',
    cell: 'renderEditable',
  }, {
    Header: 'Compania',
    accessor: 'compania',
    cell: 'renderEditable'
  }, {
    Header: <div>Base<br/>(SOME UNIT)</div>,
    accessor: 'base',
    cell: 'renderNumber'
  }, {
    Header: <div>Cima<br/>(SOME UNIT)</div>,
    accessor: 'cima',
    cell: 'renderNumber'
  }, {
    Header: <div>Longitud Apuntalada<br/>(m)</div>,
    accessor: 'longitudApuntalada',
    cell: 'renderNumber'
  }, {
    Header: <div>Altura Total de Fractura<br/>(m)</div>,
    accessor: 'alturaTotalDeFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Ancho Promedio<br/>(pg)</div>,
    accessor: 'anchoPromedio',
    cell: 'renderNumber'
  }, {
    Header: <div>Concentracion Areal<br/>(lb/pg<sup>2</sup>)</div>,
    accessor: 'concentracionAreal',
    cell: 'renderNumber'
  }, {
    Header: <div>Conductividad<br/>(mD*ft)</div>,
    accessor: 'conductividad',
    cell: 'renderNumber'
  }, {
    Header: <div>FCD<br/>(adim)</div>,
    accessor: 'fcd',
    cell: 'renderNumber'
  }, {
    Header: <div>Presion Neta<br/>(psi)</div>,
    accessor: 'presionNeta',
    cell: 'renderNumber'
  }, {
    Header: <div>Eficiencia de Fluido de Fractura<br/>(%)</div>,
    accessor: 'fluidoFractura',
    cell: 'renderNumber'
  }, {
    Header: <div>Beneficio<br/>(bpd)</div>,
    columns: [{
      Header: 'Programado',
      accessor: 'beneficioProgramado',
      cell: 'renderNumber'
    }, {
      Header: 'Oficial',
      accessor: 'beneficioOficial',
      cell: 'renderNumber'
    }]
  }
]

@autobind class HistorialDeIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 

    }
  }

  componentDidMount(){

  }



 addNewRowApuntalado() {
    let { formData, setHistoricoApuntaladoData } = this.props
    formData = formData.toJS()
    let { historicoApuntaladoData } = formData

    historicoApuntaladoData[0].length = 2

    setHistoricoApuntaladoData([...historicoApuntaladoData, {index: historicoApuntaladoData.length,  fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        cima: '',
        base: '',
        longitudApuntalada: '',
        alturaTotalDeFractura: '',
        anchoPromedio: '',
        concentracionAreal: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: '', length: historicoApuntaladoData.length + 1, 'edited': false}])
  }


  deleteRowApuntalado(state, rowInfo, column, instance) {
    let { formData, setHistoricoApuntaladoData } = this.props
    formData = formData.toJS()
    let { historicoApuntaladoData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && historicoApuntaladoData.length > 1) {
          historicoApuntaladoData.splice(rowInfo.original.index, 1)

          historicoApuntaladoData.forEach((i, index) => {
            i.index = index
            i.length = historicoApuntaladoData.length
          }) 

          setHistoricoApuntaladoData(historicoApuntaladoData)
        }
      }
    }
  }

  makeApuntaladoTable() {
    let { formData, setHistoricoApuntaladoData } = this.props
    formData = formData.toJS()
    let { historicoApuntaladoData } = formData

    const objectTemplate = { fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        cima: '',
        base: '',
        longitudApuntalada: '',
        alturaTotalDeFractura: '',
        anchoPromedio: '',
        concentracionAreal: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: ''}

    return (
      <div className='presion-table'>
        <div className='header'>
          HISTORICO DE FRACTURAMIENTOS APUNTALADOS REALIZADOS AL POZO
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoApuntaladoData}
            newRow={objectTemplate}
            setData={setHistoricoApuntaladoData}
            columns={columnsApuntalado}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={historicoApuntaladoData.length}
            sortable={false}
            getTdProps={this.deleteRowApuntalado}
          />
        </div>

        <button className='new-row-button' onClick={this.addNewRowApuntalado}>Añadir un renglón</button>
      </div>
      )
  }






 addNewRowAcido() {
    let { formData, setHistoricoAcidoData } = this.props
    formData = formData.toJS()
    let { historicoAcidoData } = formData

    historicoAcidoData[0].length = 2

    setHistoricoAcidoData([...historicoAcidoData, {index: historicoAcidoData.length, fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        base: '',
        cima: '',
        longitudGravada: '',
        alturaGravada: '',
        anchoGravado: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: '', length: historicoAcidoData.length + 1, 'edited': false}])
  }


  deleteRowAcido(state, rowInfo, column, instance) {
    let { formData, setHistoricoAcidoData } = this.props
    formData = formData.toJS()
    let { historicoAcidoData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && historicoAcidoData.length > 1) {
          historicoAcidoData.splice(rowInfo.original.index, 1)

          historicoAcidoData.forEach((i, index) => {
            i.index = index
            i.length = historicoAcidoData.length
          }) 

          setHistoricoAcidoData(historicoAcidoData)
        }
      }
    }
  }

  makeAcidoTable() {
    let { formData, setHistoricoAcidoData } = this.props
    formData = formData.toJS()
    let { historicoAcidoData } = formData

    const objectTemplate = {fecha: null, fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        base: '',
        cima: '',
        longitudGravada: '',
        alturaGravada: '',
        anchoGravado: '',
        conductividad: '',
        fcd: '',
        presionNeta: '',
        fluidoFractura: '',
        beneficioProgramado: '',
        beneficioOficial: ''}

    return (
      <div className='presion-table'>
        <div className='header'>
          HISTORICO DE FRACTURAMIENTOS ACIDOS REALIZADOS AL POZO
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoAcidoData}
            newRow={objectTemplate}
            setData={setHistoricoAcidoData}
            columns={columnsAcido}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={historicoAcidoData.length}
            sortable={false}
            getTdProps={this.deleteRowAcido}
          />
        </div>

        <button className='new-row-button' onClick={this.addNewRowAcido}>Añadir un renglón</button>
      </div>
      )
  }







  addNewRowEstimulacion() {
    let { formData, setHistoricoEstimulacionData } = this.props
    formData = formData.toJS()
    let { historicoEstimulacionData } = formData

    historicoEstimulacionData[0].length = 2

    setHistoricoEstimulacionData([...historicoEstimulacionData, {index: historicoEstimulacionData.length, fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        acidoVol: '',
        acidoNombre: '',
        solventeVol: '',
        solventeNombre: '',
        divergenteVol: '',
        divergenteNombre: '',
        totalN2: '',
        beneficioProgramado: '',
        beneficioOficial: '', length: historicoEstimulacionData.length + 1, 'edited': false}])
  }


  deleteRowEstimulacion(state, rowInfo, column, instance) {
    let { formData, setHistoricoEstimulacionData } = this.props
    formData = formData.toJS()
    let { historicoEstimulacionData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && historicoEstimulacionData.length > 1) {
          historicoEstimulacionData.splice(rowInfo.original.index, 1)

          historicoEstimulacionData.forEach((i, index) => {
            i.index = index
            i.length = historicoEstimulacionData.length
          }) 

          setHistoricoEstimulacionData(historicoEstimulacionData)
        }
      }
    }
  }

  makeEstimulacionTable() {
    let { formData, setHistoricoEstimulacionData } = this.props
    formData = formData.toJS()
    let { historicoEstimulacionData } = formData

    const objectTemplate = {fecha: null,  fecha: null,
        tipoDeTratamiento: '',
        objetivo: '',
        compania: '',
        acidoVol: '',
        acidoNombre: '',
        solventeVol: '',
        solventeNombre: '',
        divergenteVol: '',
        divergenteNombre: '',
        totalN2: '',
        beneficioProgramado: '',
        beneficioOficial: ''}

    return (
      <div className='presion-table'>
        <div className='header'>
          HISTORICO DE TRATAMIENTOS DE ESTIMULACION
        </div>
        <div className='table'>
          <InputTable
            className="-striped"
            data={historicoEstimulacionData}
            newRow={objectTemplate}
            setData={setHistoricoEstimulacionData}
            columns={columnsEstimulacion}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={historicoEstimulacionData.length}
            sortable={false}
            getTdProps={this.deleteRowEstimulacion}
          />
        </div>

        <button className='new-row-button' onClick={this.addNewRowEstimulacion}>Añadir un renglón</button>
      </div>
      )
  }


  render() {
    console.log('render intervenciones')

    return (
      <div className="form historicoDeIntervenciones">
        { this.makeEstimulacionTable() }
        { this.makeAcidoTable() }
        { this.makeApuntaladoTable() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historialDeIntervenciones'),
})

const mapDispatchToProps = dispatch => ({
    setHistoricoEstimulacionData: val => dispatch(setHistoricoEstimulacionData(val)),
    setHistoricoAcidoData: val => dispatch(setHistoricoAcidoData(val)),
    setHistoricoApuntaladoData: val => dispatch(setHistoricoApuntaladoData(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistorialDeIntervenciones)
