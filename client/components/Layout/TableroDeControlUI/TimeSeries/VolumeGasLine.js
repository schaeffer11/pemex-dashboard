import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeGasLine extends PureComponent {

  render() {
    let { data } = this.props

    let desplazamientoN2 = []
    let totalPrecolchonN2 = []
    let vaporInjected = [] 

    let series = []

    if (data) {
      data.forEach(i => {
        let utc = new Date(i.FECHA_INTERVENCION)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate())

        i.TOTAL_DESPLAZAMIENTO_N2 ? desplazamientoN2.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_N2}) : null
        i.TOTAL_PRECOLCHON_N2 ? totalPrecolchonN2.push({ x: utc, y: i.TOTAL_PRECOLCHON_N2}) : null
        i.TOTAL_VAPOR_INJECTED ? vaporInjected.push({ x: utc, y: i.TOTAL_VAPOR_INJECTED}) : null
      })
      

      series =  [{
        name: 'Desplazamiento N2',
        data: desplazamientoN2,

      },{
        name: 'Precolchon N2',
        data: totalPrecolchonN2,

      },{
        name: 'Vapor Injected',
        data: vaporInjected,

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
        type: 'datetime'
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



export default VolumeGasLine
