import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class JobBreakdown extends PureComponent {

  render() {
    let { data } = this.props

    console.log(data)
    
    let config = {
	    chart: {
	        type: 'pie'
	    },
	    title: {
	        text: ''
	    },
	    credits: {
	    	enabled: false
	    },
	    series: [{
	        name: 'Count',
	        data: data
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


export default JobBreakdown
