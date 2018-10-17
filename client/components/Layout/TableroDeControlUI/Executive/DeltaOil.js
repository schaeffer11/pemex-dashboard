import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class DeltaOil extends PureComponent {
  render() {
    let { data } = this.props
    let max = 0

    data = data.map(i => {
    	let color = i.qoResult >= i.qo ? 'green' : 'red'
    	if (i.qo > max) {
    		max = i.qo
    	}
    	if (i.qoResult > max) {
    		max = i.qoResult
    	}

    	return {
    		name: i.name,
    		x: i.qo,
    		y: i.qoResult,
    		color: color
    	}
    })

    let series = [{
    	name: 'Test',
    	data: data
    }, {
    	name: '',
    	type: 'line',
    	dashStyle: 'Dash',
    	lineWidth: 1,
    	showInLegend: false,
    	data: [[0,0], [max, max]]
    }]



    let config = {
	    chart: {
	        type: 'scatter',
	        zoomType: 'xy',
	    },
	    plotOptions: {
	    	line: {
	    		marker: {
	    			enabled: false
	    		}
	    	}
	    },
	    title: {
	        text: 'Delta Oil'
	    },
	    xAxis: {
	    	title: {
	    		text: 'Pre-Oil'
	    	}
	    },
	    yAxis: {
	    	title: {
	    		text: 'Post-Oil'
	    	}
	    },
	    credits: {
	    	enabled: false
	    },
	    series: series
	}

    return (
      <div className="delta-oil test">
      	<ReactHighcharts
      		className='chart'
      		config={config}
      	/>
      </div>
    )
  }
}


export default DeltaOil
