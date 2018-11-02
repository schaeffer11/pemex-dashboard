import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class ClassificationBreakdown extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }
  
  render() {
    let { data } = this.props
    let successful = 0
    let unsuccessful = 0

    data.forEach(i => {
    	let oilInc = i.qoResult / i.qo
    	let waterInc = i.qwResult / i.qw
    	
    	if (oilInc + waterInc > 2) {
    		successful += 1
    	}
    	else {
    		unsuccessful += 1
    	}
    })

    data = [{
    	name: 'Successful',
    	y: successful,
    	color: 'green'
    }, {
    	name: 'Unsuccessful',
    	y: unsuccessful,
    	color: 'red'
    }]


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


export default ClassificationBreakdown
