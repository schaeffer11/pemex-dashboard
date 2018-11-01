import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

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

@autobind class CostBar extends PureComponent {
  render() {
    let { data, groupBy } = this.props

    console.log(data)
    console.log(groupBy)
    let dataPoints = []
    let series
    let categories = []

    if (data.length > 0) {
      if (!groupBy) {
        categories.push('Total Cost')
        series = [{
          name: ' ',
          data: [data[0].totalCost]
        }]
      }
      else {
        data.forEach((i, index) => {
          let colorIndex = index % colorWheel.length

          dataPoints.push({y: i.totalCost, color: colorWheel[colorIndex]})
          categories.push(i[groupBy])
        })

        series = [{
          name: ' ',
          data: dataPoints
        }]
      }   
    }

    console.log(series)
    console.log(categories)

    let config = {
	    chart: {
          zoomType: 'y',
	        type: 'column'
	    },
	    title: {
	        text: ''
	    },

      legend: {
        enabled: false
      },
      xAxis: {
        categories: categories,
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


export default CostBar
