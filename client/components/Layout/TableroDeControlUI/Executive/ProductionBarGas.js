import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

@autobind class ProdBar extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }

  render() {
		let { data, groupBy } = this.props
    let config = {
	    chart: {
	        type: 'column',
	        zoomType: 'y',
	    },
	    plotOptions: {
	    	line: {
	    		marker: {
	    			enabled: false
	    		}
	    	}
	    },
	    title: {
	        text: ''
      },
	    xAxis: {
	    	title: {
	    		text: ' '
	    	},
        categories: ['Gas']
	    },
	    yAxis: {
        title: {
          text: 'Producción Incremental (MMpc/d)'
        },
      },
	    credits: {
	    	enabled: false
	    },
	    series: [{
        name: 'Real',
        data: [data.qgResult]
      }, {
        name: 'Programada',
        data: [data.qg],
      }]
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


export default ProdBar
