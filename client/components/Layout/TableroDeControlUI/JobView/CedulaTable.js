import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class CedulaTable extends PureComponent {

  render() {
    let { data, type } = this.props

    let columns = []


    if (type === 'Estimulacion') {
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
    else if (type === 'Acido') {
      columns = [
        {
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
          Header: 'Tipo de Apuntalante',
          accessor: 'tipoDeApuntalante',
        }, { 
          Header: <div>Concentración de Apuntalante<br/>(lbm/gal)</div>,
          accessor: 'concentraciDeApuntalante',
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
    else if (type === 'Apuntalado') {
      columns = [
        {
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
          Header: 'Tipo de Fluido',
          accessor: 'tipoDeFluido',
        },
        {
          Header: 'Tipo de Apuntalante',
          accessor: 'tipoDeApuntalante',
        },
        {
          Header: <div>Vol. Liq.<br/>(U.S. Gal)</div>,
          accessor: 'volLiquido',
        },
        {
          Header: <div>Vol. de la Lechada.<br/>(bbl)</div>,
          accessor: 'volLechada',
        },
        {
          Header: <div>Gasto en Superficie<br/>(bpm)</div>,
          accessor: 'gastoSuperficie',
        },
        {
          Header: <div>Gasto N<sub>2</sub> Superficie<br/>(m<sup>3</sup>/min)</div>,
          accessor: 'gastoN2Superficie',
        },
        {
          Header: <div>Gasto Total Fondo<br/>(bpm)</div>,
          accessor: 'gastoEnFondo',
        },
        {
          Header: <div>Calidad N<sub>2</sub><br/>(%)</div>,
          accessor: 'calidadN2Fondo',
        },
        {
          Header: <div>Vol. Espuma Fondo.<br/>(U.S. Gal)</div>,
          accessor: 'volEspumaFondo',
        },
        {
          Header: <div>Concentración de Apuntalante Superficie<br/>(lbm/gal)</div>,
          accessor: 'concentracionApuntalanteSuperficie',
        },
        {
          Header: <div>Concentración de Apuntalante Fondo<br/>(lbm/gal)</div>,
          accessor: 'concentracionApuntalanteFondo',
        },
        {
          Header: <div>Apuntalante Acumulado<br/>(lbm)</div>,
          accessor: 'apuntalanteAcumulado',
        },
        { 
          Header: <div>Tiempo<br/>(min)</div>,
          accessor: 'tiempo',
        },
      ]
    }
    else {
      columns = [
        {
          Header: 'Etapa',
          accessor: 'etapa',
        }, 
        {
          Header: 'Actividad',
          accessor: 'actividad',
        },
        {
          Header: 'Descripción',
          accessor: 'descripcion',
        },
        {
          Header: 'Justificación',
          accessor: 'justificacion',
        },
      ]
    }


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
