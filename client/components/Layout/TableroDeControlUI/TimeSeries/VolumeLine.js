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
    let desplazamientoN2 = []
    let totalPrecolchonN2 = []
    let liquido = []
    let apuntalante = []
    let gelDeFractura = []
    let precolchonApuntalante = []
    let vaporInjected = [] 
    let series = []

    if (data) {
      data.forEach(i => {
        let utc = new Date(i.FECHA_INTERVENCION)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate())

        i.TOTAL_SISTEMA_NO_REACTIVO ? sistemaNoReactivoData.push({ x: utc, y: i.TOTAL_SISTEMA_NO_REACTIVO}) : null
        i.TOTAL_SISTEMA_REACTIVO ? sistemaReactivo.push({ x: utc, y: i.TOTAL_SISTEMA_REACTIVO}) : null
        i.TOTAL_SISTEMA_DIVERGENTE ? sistemaDivergente.push({ x: utc, y: i.TOTAL_SISTEMA_DIVERGENTE}) : null
        i.TOTAL_DESPLAZAMIENTO_LIQUIDO ? desplazamientoLiquido.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_LIQUIDO}) : null
        i.TOTAL_DESPLAZAMIENTO_N2 ? desplazamientoN2.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_N2}) : null
        i.TOTAL_PRECOLCHON_N2 ? totalPrecolchonN2.push({ x: utc, y: i.TOTAL_PRECOLCHON_N2}) : null
        i.TOTAL_LIQUIDO ? liquido.push({ x: utc, y: i.TOTAL_LIQUIDO}) : null
        i.TOTAL_APUNTALANTE ? apuntalante.push({ x: utc, y: i.TOTAL_APUNTALANTE}) : null
        i.TOTAL_GEL_DE_FRACTURA ? gelDeFractura.push({ x: utc, y: i.TOTAL_GEL_DE_FRACTURA}) : null
        i.TOTAL_PRECOLCHON_APUNTALANTE ? precolchonApuntalante.push({ x: utc, y: i.TOTAL_PRECOLCHON_APUNTALANTE}) : null
        i.TOTAL_VAPOR_INJECTED ? vaporInjected.push({ x: utc, y: i.TOTAL_VAPOR_INJECTED}) : null
      })

      series = [{
        name: 'Sistema No Reactivo',
        data: sistemaNoReactivoData,
        yAxis: 0,
      },{
        name: 'Sistema Reactivo',
        data: sistemaReactivo,
        yAxis: 0,
      },{
        name: 'Sistema Divergente',
        data: sistemaDivergente,
        yAxis: 0,
      },{
        name: 'Desplazamiento Liquido',
        data: desplazamientoLiquido,
        yAxis: 0,
      },{
        name: 'Desplazamiento N2',
        data: desplazamientoN2,
        yAxis: 1,
      },{
        name: 'Precolchon N2',
        data: totalPrecolchonN2,
        yAxis: 1,
      },{
        name: 'Liquido',
        data: liquido,
        yAxis: 0,
      },{
        name: 'Apuntalante',
        data: apuntalante,
        yAxis: 0,
      },{
        name: 'Gel De Fractura',
        data: gelDeFractura,
        yAxis: 0,
      },{
        name: 'Precolchon Apuntalante',
        data: precolchonApuntalante,
        yAxis: 0,
      },{
        name: 'Vapor Injected',
        data: vaporInjected,
        yAxis: 1,
      }]

    }
   
    let config = {
      chart: {
          type: 'area',
          zoomType: 'x',
      },
      title: {
          text: ''
      },
      xAxis: {
        title: {
          text: 'Item'
        },
        type: 'datetime'
      },
      yAxis: [{
        title: {
          text: 'Volume Liquido (m3)'
        }
      },{
        title: {
          text: 'Volume Gasto (m3)'
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      plotOptions: {
        area: {
          stacking: 'normal'
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
          />
        </div>
      </div>
    )
  }
}



export default VolumeLine
