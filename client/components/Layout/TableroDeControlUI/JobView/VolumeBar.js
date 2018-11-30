import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeBar extends PureComponent {

  render() {
    let { data, estData } = this.props
    
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
          text: ' '
        },
        categories: categories
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Volúmenes Inyectados (m<sup>3</sup>)'
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



export default VolumeBar
