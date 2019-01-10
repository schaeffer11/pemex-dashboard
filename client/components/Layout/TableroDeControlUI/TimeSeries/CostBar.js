import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import { RenameInterventionTypes } from '../../../../lib/formatters'

@autobind class CostBar extends PureComponent {

  render() {
    let { data, groupBy } = this.props

    let groups = []
    let series = []

    data.forEach(i => {
      if (!groups.includes(i.groupedName)) {
        groups.push(i.groupedName)
      }
    })

    groups.forEach(name => {
      let filteredData = data.filter(i => i.groupedName === name).map(j => {
        let utc = Date.UTC(j.YEAR, j.MONTH - 1)

        return {
          x: utc,
          y: j.COST
        }
      })


      series.push({
        name: name !== 1 ? name : 'Costos',
        data: filteredData
      })
    })

    if (groupBy && groupBy === 'interventionType') {
      series = RenameInterventionTypes(series)
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
        type: 'datetime',
      },
      tooltip: { 
        valuePrefix: '$',
        valueDecimals: 0
       },
      yAxis: {
        title: {
          text: 'Costos ($MXN)'
        }
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



export default CostBar
