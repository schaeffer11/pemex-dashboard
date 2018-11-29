import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatAverageDeviation as formatter } from '../../../../lib/tooltipFormatters'



let colorWheel = [
      '#56B3D8',
      '#C3E4CC',
      '#E4CE5E',
      '#C26A1B',
      '#5D2311',
      '#141551',
      '#355695',
      '#90D2CE',
      '#F4F296',
    ]

@autobind class AvgDeltaCostBar extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }


  render () {
    let { data, groupBy } = this.props

    let dataPoints = []
    let series
    let categories = []
    if (data.length > 0) {
      if (!groupBy) {
        categories.push('')
        series = [{
          name: ' ',
          data: [data[0].avgDeviation]
        }]
      }
      else {
        data.forEach((i, index) => {
          const colorIndex = index % colorWheel.length
          dataPoints.push({ y: i.avgDeviation, color: colorWheel[colorIndex] })
          categories.push(i[groupBy])
        })

        series = [{
          name: ' ',
          data: dataPoints
        }]
      }   
    }
    const config = {
	    chart: {
          zoomType: 'y',
	        type: 'column'
	    },
	    title: {
	        text: ''
      },
      tooltip: { formatter },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: '%'
        },
        // min: -1000,
        // max: 1000,
        plotBands: [{
          color: '#b4ecb4',
          from: 0,
          to: 10000
        }, {
          color: '#ecb4b4',
          from: 0,
          to: -10000
        }]
      },
      xAxis: {
        categories: categories,
        title: { text: '' },
      },
	    credits: {
	    	enabled: false
	    },
      plotOptions: {
      },
	    series: series
    }
    return (
    	<ReactHighcharts
    		className='chart'
    		config={config}
        ref={(ref) => { this.chart = ref }}
    	/>
    )
  }
}


export default AvgDeltaCostBar
