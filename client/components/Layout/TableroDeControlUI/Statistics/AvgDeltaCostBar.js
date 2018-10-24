import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class AvgDeltaCostBar extends PureComponent {
  render() {
    let { data } = this.props
    
    data = data.map(i => {
      return {
        name: i.name,
        borderColor: 'black',
        data: [((i.avgCost / i.avgEstCost) - 1) * 100]
      }
    })

    let config = {
	    chart: {
	        type: 'column',
          zoomType: 'y',
	    },
	    title: {
	        text: ''
	    },
      yAxis: {
        reversed: true,
        title: {
          text: 'Percentage'
        },
        plotBands: [{
          color: '#ecb4b4',
          from: 0,
          to: 1000
        }, {
          color: '#b4ecb4',
          from: 0,
          to: -1000
        }]
      },
	    credits: {
	    	enabled: false
	    },
	    series: data
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
