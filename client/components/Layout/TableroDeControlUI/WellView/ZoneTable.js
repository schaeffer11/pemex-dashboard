import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class ZoneTable extends PureComponent {

  render() {
    let { data } = this.props

    let mudLossColumns = [
      {
        Header: <div>Cima<br></br>(md)</div>,
        accessor: 'CIMA_MD'
      }, { 
        Header: <div>Base<br></br>(md)</div>,
        accessor: 'BASE_MD'
      }, { 
        Header: <div>Lodo perdido<br></br>(m<sup>3</sup>)</div>,
        accessor: 'LODO_PERDIDO'
      }, { 
        Header: <div>Dens.<br></br>(gr/cm<sup>3</sup>)</div>,
        accessor: 'DENSIDAD'
      }
    ]

    return (
      <div className="layer-table">
        <ReactTable 
          columns={mudLossColumns}
          showPagination={true}
          data={data}
          pageSize={10}
        />
      </div>
    )
  }
}



export default ZoneTable
