import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class CedulaTable extends PureComponent {

  render() {
    let { data, type } = this.props

    let columns = []


    if (type === 'Estimulation') {
      columns =     
        [{
          Header: 'Etapa',
          accessor: 'etapa',
        }, 
        {
          Header: 'Sistema',
          accessor: 'sistema',
        },
        {
          Header: 'Nombre Comercial',
          accessor: 'nombreComercial',
        },
        {
          Header: <div>Vol. Liq.<br/>(m<sup>3</sup>)</div>,
          accessor: 'volLiquid',
        },
        { 
          Header: <div>Gasto Líquido<br/>(bpm)</div>,
          accessor: 'gastoLiqudo',
        },
        {
          Header: <div>Rel. N<sub>2</sub>/Liq<br/>(m<sup>3</sup>std/m<sup>3)</sup></div>,
          accessor: 'relN2Liq',
        },
        {
          Header: <div>Calidad<br/>(%)</div>,
          accessor: 'calidad',
        },
        { 
          Header: <div>Gasto en fondo<br/>(bpm)</div>,
          accessor: 'gastoEnFondo',
        },
        { 
          Header: <div>Gasto N<sub>2</sub><br/>(m<sup>3</sup>/min)</div>,
          accessor: 'gastoN2',
        }, 
        { 
          Header: <div>Vol. N<sub>2</sub><br/>(m<sup>3</sup> std)</div>,
          accessor: 'volN2',
        },
        { 
          Header: <div>Vol. Liq. Acum.<br/>(m<sup>3</sup>)</div>,
          accessor: 'volLiquidoAcum',
        },
        { 
          Header: <div>Vol. N<sub>2</sub> Acum.<br/>(m<sup>3</sup> std)</div>,
          accessor: 'volN2Acum',
        },     
        { 
          Header: <div>Tiempo<br/>(min)</div>,
          accessor: 'tiempo',
        },
      ]
    }
    else if (type === 'acido') {

    }
    else if (type === 'apuntalado') {

    }
    else {

    }



 
    console.log(data, type)

    return (
      <div className="cedula-table">
        <div className='test'>
          <ReactTable 
            columns={columns}
            showPagination={false}
            data={data}
            pageSize={data ? data.length : 5}
          />
        </div>
      </div>
    )
  }
}



export default CedulaTable
