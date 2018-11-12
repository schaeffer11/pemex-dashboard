import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeCostBubble extends PureComponent {

  render() {
    let { data, numTreatmentData, groupBy } = this.props

    let series = []
    
    if (data) {
      let groups = Object.keys(data)

      numTreatmentData = numTreatmentData.map(i => {
        let utc = Date.UTC(i.YEAR, i.MONTH - 1)
        return {
          x: utc,
          y: i.COUNT,
          groupedName: i.groupedName,
        }
      })

      numTreatmentData = numTreatmentData.sort((a, b) => {return a.x - b.x})

      groups.forEach(name => {
        let filteredData = data.map(j => {
          let utc = Date.UTC(j.YEAR, j.MONTH - 1)

          return {
            x: utc,
            y: j.TOTAL_VOLUME,
          }
        })

        series.push({
          name: name !== 'undefined' ? name : 'Volume Data',
          data: filteredData,  
          yAxis: 0,
          zIndex: 0       
        })


        series.push({
          name: name ? name : 'Num Treatments',
          data: numTreatmentData.filter(i => i.groupedName === name),
          type: 'line',
          yAxis: 1,
          zIndex: 1
        })
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
          text: 'Total Volume Used (m3)'
        }
      }, {
        title: {
          text: 'Count'
        },
        opposite: true
      }],
      credits: {
        enabled: false
      },
      series: series
  }

  console.log(series)

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
