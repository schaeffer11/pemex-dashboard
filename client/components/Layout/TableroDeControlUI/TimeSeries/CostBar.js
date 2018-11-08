import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class CostBar extends PureComponent {

  render() {
    let { data } = this.props

    let groups = []
    let series = []

    data.forEach(i => {
      if (!groups.includes(i.groupedName)) {
        groups.push(i.groupedName)
      }
    })

    groups.forEach(name => {
      let filteredData = data.filter(i => i.groupedName === name).map(j => {
        let utc = new Date(j.FECHA)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth())

        return {
          x: utc,
          y: j.COST
        }
      })

      series.push({
        name: name ? name : 'Cost Data',
        data: filteredData
      })
    })



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
        type: 'datetime',
        dateTimeLabelFormats: {
          year: '%Y'
        }
      },
      yAxis: {
        title: {
          text: 'Costs'
        }
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
            ref={(ref) => { this.chart = ref }}
          />
        </div>
      </div>
    )
  }
}



export default CostBar
