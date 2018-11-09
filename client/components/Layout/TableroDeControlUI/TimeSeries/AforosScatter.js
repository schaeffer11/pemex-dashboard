import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class AforosScatter extends PureComponent {

  render() {
    let { data, groupBy } = this.props

    let series = []
    let groups = []

    data.forEach(i => {
      if (!groups.includes(i[groupBy])) {
        groups.push(i[groupBy])
      }
    })

    groups.forEach(name => {
      let filteredData = data.filter(i => i[groupBy] === name).map(j => {
        let utc = new Date(j.date)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate())

        return {
          x: utc,
          y: j.deltaQo
        }
      })

      series.push({
        name: name ? name : 'Production Data',
        data: filteredData,         
        tooltip: {
          headerFormat: '{point.key}\n'
        } 
      })
    })


    let config = {
      chart: {
          type: 'scatter',
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
          text: 'Delta Qo'
        }
      },
      credits: {
        enabled: false
      },
      series: series
  }

    return (
      <div className="aforos-scatter test">
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



export default AforosScatter
