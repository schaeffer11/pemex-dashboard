import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class CostBar extends PureComponent {

  render() {
    let { data, estData } = this.props


    let categories = []

    data.forEach(i => {
      categories.push(i.ITEM)
    })

    estData.forEach(i => {
      if (!(categories.includes(i.ITEM))) {
        categories.push(i.ITEM)
      }
    })


    let actualData = []
    let estimatedData = []


    categories.forEach(item => {
      let realItem = data.find(i => i.ITEM === item)
      let estItem = estData.find(i => i.ITEM === item)

      actualData.push(realItem ? realItem.COST_DLS * realItem.MNXtoDLS  + realItem.COST_MNX : 0)
      estimatedData.push(estItem ? estItem.COST_DLS * estItem.MNXtoDLS  + estItem.COST_MNX : 0)
    })

    let series = [{
      name: 'Estimados',
      data: estimatedData
    }, {
      name: 'Reales',
      data: actualData
    }]

    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: ' '
      },
      xAxis: {
        title: {
          text: 'Item'
        },
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Costos ($MNX)'
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
