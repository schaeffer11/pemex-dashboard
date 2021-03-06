import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { formatBubbleProduction as formatter } from '../../../../lib/tooltipFormatters'
import { RenameInterventionTypes } from '../../../../lib/formatters'
import { KPI } from '../Common/KPIs'

@autobind class ProductionBubble extends PureComponent {

  render() {
    let { data, costData, groupBy } = this.props

    let series = []
    let groups = []

    data.forEach(i => {
      if (!groups.includes(i.groupedName)) {
        groups.push(i.groupedName)
      }
    })

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
      let filteredData = data.filter(i => i.groupedName === name).map(j => {
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
          y: j.QO_RESULT,
          z: cost
        }
      })

      series.push({
        name: name !== 1 ? name : 'Producción Incremental',
        data: filteredData,         
      })
    })

    if (groupBy && groupBy === 'interventionType') {
      series = RenameInterventionTypes(series)
    }

    let config = {
      chart: {
          type: 'bubble',
          zoomType: 'x',
      },
      title: {
          text: ''
      },
      tooltip: { formatter },
      xAxis: {
        title: {
          text: 'Fecha'
        },
        tickInterval   : 24 * 3600 * 1000*30,
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Aceite (bbl/d)'
        }
      },
      credits: {
        enabled: false
      },
      series: series
  }
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



export default ProductionBubble
