import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class JobBreakdown extends PureComponent {
  render() {
    let { data } = this.props

    let config = {
	    chart: {
	        type: 'pie'
	    },
	    title: {
	        text: 'Job Breakdown'
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
      <div className="job-breakdown test">
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


export default JobBreakdown
