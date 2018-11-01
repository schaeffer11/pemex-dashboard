import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class CostBar extends PureComponent {
  render() {
    let { data, groupBy } = this.props

    console.log(data)
    console.log(groupBy)

    let series = []

    if (data.length > 0) {
      if (!groupBy) {
        series.push({
          name: 'Total Cost',
          data: [data[0].totalCost]
        })
      }
      else {
        series = data.map(i => {
          return {
            name: i[groupBy],
            data: i.totalCost
          }
        })
      }   
    }

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
