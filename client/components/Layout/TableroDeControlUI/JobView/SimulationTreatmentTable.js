import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class SimulationTreatmentTable extends PureComponent {

  render() {
    let { data, hide } = this.props

    let columns = [{
        Header: 'Concepto',
        accessor: 'item', 
        width: 250,
      },{
        Header: 'Unidad',
        accessor: 'unit',
        width: 70,
      },{
        Header: 'Simulación',
        accessor: 'sim', 
        width: 150
      },{
        Header: 'Real',
        accessor: 'actual', 
        width: 150
      }]

    return hide === true ? 
      (
        <div>
          No simulation/results needed
        </div>
      ) :
      (  
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={8}
        />
      )
  }
}



export default SimulationTreatmentTable
