import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class LayerTable extends PureComponent {

  render() {
    let { data } = this.props
    
    let layerColumns = [
  {
    Header: 'Intervalo',
    accessor: 'INTERVALO'
  }, { 
    Header: <div>Cima<br></br>(md)</div>,
    accessor: 'CIMA_MD'
  }, {
    Header: <div>Base<br></br>(md)</div>,
    accessor: 'BASE_MD'
  }, {
    Header: <div>Espesor Bruto<br></br>(md)</div>,
    accessor: 'ESPESOR_BRUTO'
  }, {
    Header: <div>Espesor Neto<br></br>(md)</div>,
    accessor: 'ESPESOR_NETO'
  }, { 
    Header: <div>V arc.<br></br>(%)</div>,
    accessor: 'V_ARC'
  }, { 
    Header: <div>V Cal.<br></br>(%)</div>,
    accessor: 'V_CAL'
  }, { 
    Header: <div>V Dol.<br></br>(%)</div>,
    accessor: 'V_DOL'
  }, { 
    Header: <div>Porosidad<br></br>(%)</div>,
    accessor: 'PROSITY'
  }, { 
    Header: <div>Sw.<br></br>(%)</div>,
    accessor: 'SW'
  }, { 
    Header: <div>Dens.<br></br>(gr/cm<sup>3</sup>)</div>,
    accessor: 'DENS'
  }, { 
    Header: <div>Resis.<br></br>(ohm)</div>,
    accessor: 'RESIS'
  }, { 
    Header: <div>Perm<br></br>(md)</div>,
    accessor: 'PERMEABILIDAD'
  }
]

data = data.sort((a,b) => {
  return a.INTERVALO - b.INTERVALO
})

    return (
      <div className="layer-table">
        <ReactTable 
          columns={layerColumns}
          showPagination={true}
          data={data}
          pageSize={10}
        />
      </div>
    )
  }
}



export default LayerTable
