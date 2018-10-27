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
      name: 'Estimated',
      data: estimatedData
    }, {
      name: 'Actual',
      data: actualData
    }]

    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: 'Estimated Vs Actual Costs'
      },
      xAxis: {
        title: {
          text: 'Item'
        },
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Costs'
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



export default CostBar
