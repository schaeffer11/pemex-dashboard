import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { Currency, Percent, Integer } from '../../../../lib/formatters'

@autobind class ExecutiveTable extends PureComponent {
  render() {
    let { data } = this.props
      let columns = [{
        Header: <div>Tipo de<br/>Intervencion</div>,
        accessor: 'name', 
        minWidth: 150,
      },{
        Header: '# De Tratamientos',
        accessor: 'numProposals',
        Cell: Integer,
        minWidth: 150,
      },{
        Header: '% de Avance',
        accessor: 'percResults', 
        Cell: Percent,
        minWidth: 150
      },{
        Header: <div>Produccion Estimada<br/>(bbl/d)</div>,
        accessor: 'prodEstimated', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Produccion Real<br/>(bbl/d)</div>,
        accessor: 'prodReal', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: '% de Cumplimento',
        accessor: 'percEstimated', 
        Cell: Percent,
        minWidth: 150
      },{
        Header: <div>Costo total<br/>($MNX)</div>,
        accessor: 'cost', 
        Cell: Currency,
        minWidth: 150
      },{
        Header: <div>Desviacion Promedio<br/>(days)</div>,
        accessor: 'days', 
        minWidth: 150
      }]


    console.log(data)


    return (
      <div className='table'>
        <ReactTable 
          className='table'
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={8}
        />
      </div>
    )
  }
}


export default ExecutiveTable
