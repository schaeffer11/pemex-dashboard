import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class AforosScatter extends PureComponent {

  render() {
    let { data } = this.props



    data = data.map(i => {
      let utc = new Date(i.FECHA)
      utc = Date.UTC(utc.getFullYear(), utc.getMonth(), utc.getDate())
      
      return {
        x: utc,
        y: i.DELTA_QO
      }
    })
    console.log(data)

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
      series: [{
        name: 'Cost Data',
        data: data
      }]
  }

    return (
      <div className="aforos-scatter test">
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



export default AforosScatter
