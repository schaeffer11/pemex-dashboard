import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeCostBubble extends PureComponent {

  render() {
    let { data, numTreatmentData, groupBy } = this.props

    let series = []

    if (data) {
      numTreatmentData = numTreatmentData.filter(i => i.groupedName === data[0].groupedName).map(i => {
        let utc = Date.UTC(i.YEAR, i.MONTH - 1)
        return {
          x: utc,
          y: i.COUNT,
          groupedName: i.groupedName,
        }
      }).sort((a, b) => {return a.x - b.x})



      data = data.map(j => {
        let utc = Date.UTC(j.YEAR, j.MONTH - 1)

        return {
          x: utc,
          y: j.TOTAL_VOLUME,
        }
      })

      series.push({
        name: 'Volumen Utilizado',
        data: data,  
        yAxis: 0,
        zIndex: 0       
      })


      series.push({
        name: 'Número de Tratamientos',
        data: numTreatmentData,
        type: 'line',
        color: '#0D547B',
        yAxis: 1,
        zIndex: 1
      })
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
          text: 'Fecha'
        },
        tickInterval   : 24 * 3600 * 1000*30,
        type: 'datetime'
      },
      yAxis: [{
        title: {
          useHTML: true,
          text: 'Volumen Total Utilizado (m<sup>3</sup>)'
        }
      }, {
        title: {
          text: 'Número de Tratamientos'
        },
        opposite: true
      }],
      credits: {
        enabled: false
      },
      series: series
  }

  // console.log(series)

    return (
      <div className="production-bubble test">
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



export default VolumeCostBubble
