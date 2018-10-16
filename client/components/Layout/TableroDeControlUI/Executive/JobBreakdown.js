import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class JobBreakdown extends PureComponent {
  render() {
    let { data } = this.props
    console.log('got this data', data)

    let config = {
	    chart: {
	        type: 'pie'
	    },
	    title: {
	        text: 'Test'
	    },
	    credits: {
	    	enabled: false
	    },
	    series: [{
	        name: 'Test',
	        data: data
	    }]
		}

    return (
      <div className="job-breakdown">
      	<ReactHighcharts
      		className='chart'
      		config={config}
      	/>
      </div>
    )
  }
}


export default JobBreakdown
