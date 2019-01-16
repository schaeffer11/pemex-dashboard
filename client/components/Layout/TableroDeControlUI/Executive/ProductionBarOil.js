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
		let { data, groupBy, groups } = this.props
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
        categories: ['Aceite']
	    },
	    yAxis: {
	    	title: {
	    		text: 'Producción Incremental (bbl/d)'
	    	}
	    },
	    credits: {
	    	enabled: false
	    },
	    series: [{
        name: 'Real',
        data: [data.qoResult]
      }, {
        name: 'Programada',
        data: [data.qo],
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
