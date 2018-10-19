import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class DeltaWater extends PureComponent {
  render() {
  let { data } = this.props
	let max = 0

    data = data.map(i => {
    	let color = i.qwResult <= i.qw ? 'green' : 'red'
    	if (i.qw > max) {
    		max = i.qw
    	}
    	if (i.qwResult > max) {
    		max = i.qwResult
    	}

    	return {
    		name: i.name,
    		x: i.qw,
    		y: i.qwResult,
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
	        text: 'Delta Water'
	    },
	    xAxis: {
	    	title: {
	    		text: 'Pre-Water'
	    	}
	    },
	    yAxis: {
	    	title: {
	    		text: 'Post-Water'
	    	}
	    },
	    credits: {
	    	enabled: false
	    },
	    series: series
	}

    return (
      <div className="delta-water test">
      	<ReactHighcharts
      		className='chart'
      		config={config}
      	/>
      </div>
    )
  }
}


export default DeltaWater
