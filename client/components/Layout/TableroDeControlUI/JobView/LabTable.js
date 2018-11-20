import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class LabTable extends PureComponent {

  render() {
    let { data, handleChange } = this.props

    let columns = [{
        Header: 'Tipo de Analisis',
        accessor: 'type',
        style: {
          cursor: 'pointer'
        },
        width: 420,
      }, { 
        Header: 'Fecha de Muestreo',
        accessor: 'fechaMuestreo',
      }, { 
        Header: 'Fecha de prueba',
        accessor: 'fechaPrueba',
      }, { 
        Header: 'Compañía',
        accessor: 'compania',
        width: 200,
      }, { 
        Header: 'Personal de Pemex que supervisó',
        accessor: 'superviso',
      },
    ] 

    return (
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={data ? data.length : 5}
          getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if (rowInfo) {
                    handleChange(rowInfo.original.id, rowInfo.original.type)
                  }
                
                }
              }
            }}
        />
    )
  }
}

export default LabTable
