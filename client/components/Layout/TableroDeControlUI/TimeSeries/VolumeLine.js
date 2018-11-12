import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeLine extends PureComponent {

  render() {
    let { data } = this.props

    let sistemaNoReactivoData = []
    let sistemaReactivo = []
    let sistemaDivergente = []
    let desplazamientoLiquido = []
    let liquido = []
    let apuntalante = []
    let gelDeFractura = []
    let precolchonApuntalante = []

    let series = []

    if (data) {
      data.forEach(i => {
        let utc = new Date(i.FECHA_INTERVENCION)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth())

        i.TOTAL_SISTEMA_NO_REACTIVO ? sistemaNoReactivoData.push({ x: utc, y: i.TOTAL_SISTEMA_NO_REACTIVO}) : null
        i.TOTAL_SISTEMA_REACTIVO ? sistemaReactivo.push({ x: utc, y: i.TOTAL_SISTEMA_REACTIVO}) : null
        i.TOTAL_SISTEMA_DIVERGENTE ? sistemaDivergente.push({ x: utc, y: i.TOTAL_SISTEMA_DIVERGENTE}) : null
        i.TOTAL_DESPLAZAMIENTO_LIQUIDO ? desplazamientoLiquido.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_LIQUIDO}) : null
        i.TOTAL_LIQUIDO ? liquido.push({ x: utc, y: i.TOTAL_LIQUIDO}) : null
        i.TOTAL_APUNTALANTE ? apuntalante.push({ x: utc, y: i.TOTAL_APUNTALANTE}) : null
        i.TOTAL_GEL_DE_FRACTURA ? gelDeFractura.push({ x: utc, y: i.TOTAL_GEL_DE_FRACTURA}) : null
        i.TOTAL_PRECOLCHON_APUNTALANTE ? precolchonApuntalante.push({ x: utc, y: i.TOTAL_PRECOLCHON_APUNTALANTE}) : null

      })
      
      // let desplazamientoN2 = []
      // let totalPrecolchonN2 = []
      // let vaporInjected = [] 

      // i.TOTAL_DESPLAZAMIENTO_N2 ? desplazamientoN2.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_N2}) : null
      // i.TOTAL_PRECOLCHON_N2 ? totalPrecolchonN2.push({ x: utc, y: i.TOTAL_PRECOLCHON_N2}) : null
      // i.TOTAL_VAPOR_INJECTED ? vaporInjected.push({ x: utc, y: i.TOTAL_VAPOR_INJECTED}) : null

      // {
      //   title: {
      //     text: 'Volume Gasto (m3)'
      //   }
      // }

      // [{
      //   name: 'Desplazamiento N2',
      //   data: desplazamientoN2,

      // },{
      //   name: 'Precolchon N2',
      //   data: totalPrecolchonN2,

      // },{
      //   name: 'Vapor Injected',
      //   data: vaporInjected,

      // }]


      series = [{
        name: 'Sistema No Reactivo',
        data: sistemaNoReactivoData,
      },{
        name: 'Sistema Reactivo',
        data: sistemaReactivo,
      },{
        name: 'Sistema Divergente',
        data: sistemaDivergente,
      },{
        name: 'Desplazamiento Liquido',
        data: desplazamientoLiquido,
      },{
        name: 'Liquido',
        data: liquido,
      },{
        name: 'Apuntalante',
        data: apuntalante,
      },{
        name: 'Gel De Fractura',
        data: gelDeFractura,
      },{
        name: 'Precolchon Apuntalante',
        data: precolchonApuntalante,
      }]

    }
   
    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: ''
      },
      xAxis: {
        title: {
          text: 'Item'
        },
        tickInterval   : 24 * 3600 * 1000 * 30,
        type: 'datetime',

      },
      yAxis: {
        title: {
          text: 'Volume (m3)'
        }
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointRange: 24 * 3600 * 1000*30
        }
      },
      credits: {
        enabled: false
      },
      series: series
  }


    return (
      <div className="cost-bar test">
        <div className='chart'>
          <ReactHighcharts
            className='chart'
            config={config}
            ref={(ref) => { this.chart = ref }}
          />
        </div>
      </div>
    )
  }
}



export default VolumeLine
