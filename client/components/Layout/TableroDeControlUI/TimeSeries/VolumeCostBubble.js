import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeCostBubble extends PureComponent {

  render() {
    let { data, costData, groupBy } = this.props

    let series = []
    let groups = Object.keys(data)

    costData = costData.map(i => {
      let utc = Date.UTC(i.YEAR, i.MONTH - 1)
      return {
        x: utc,
        groupedName: i.groupedName,
        cost: i.COST,
        year: i.YEAR,
        month: i.MONTH
      }
    })

    groups.forEach(name => {
      let filteredData = data[name].map(j => {
        let utc = Date.UTC(j.YEAR, j.MONTH - 1)

        let costObj = name 
                      ? costData.find(i => i.year === j.YEAR && i.month === j.MONTH && i.groupedName === j.groupedName)
                      : costData.find(i => i.year === j.YEAR && i.month === j.MONTH)

        let cost = 0
        if (costObj !== undefined) {
          cost = costObj.cost
        }

        return {
          x: utc,
          y: j.TOTAL_VOLUME,
          z: cost
        }
      })

      series.push({
        name: name !== 'undefined' ? name : 'Volume Data',
        data: filteredData,         
      })
    })

    let config = {
      chart: {
          type: 'bubble',
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
      yAxis: {
        title: {
          text: 'Total Volume Used (m3)'
        }
      },
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
