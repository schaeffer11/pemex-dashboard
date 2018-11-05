import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeBar extends PureComponent {

  render() {
    let { data, estData } = this.props

    console.log(data, estData)
    
    let categories = []
    let series = []

    data = data.length > 0 ? data[0] : {}
    estData = estData.length > 0 ? estData[0] : {}

    Object.keys(data).forEach(i => {
      if (data[i] && data[i] > 0)
      categories.push(i)
    })

    Object.keys(estData).forEach(i => {
      if (estData[i] && estData[i] > 0 && !(categories.includes(i))) {
        categories.push(i)
      }
    })


    let actualData = []
    let estimatedData = []


    categories.forEach(item => {
      let realItem = data[item]
      let estItem = estData[item]

      actualData.push(realItem ? realItem : 0)
      estimatedData.push(estItem ? estItem : 0)
    })

    series = [{
      name: 'Estimated',
      data: estimatedData
    }, {
      name: 'Actual',
      data: actualData
    }]

    console.log(series, categories)


    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: 'Estimated Vs Actual Voumes'
      },
      xAxis: {
        title: {
          text: 'Item'
        },
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Volumes (m3)'
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



export default VolumeBar
