import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatPiePercent as formatter } from '../../../../lib/tooltipFormatters'



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
		tooltip: { formatter },
	    series: [{
	        name: 'Count',
	        data: data
	    }],
	    plotOptions: {
	    	pie: {
	    		size: '50%',
	    		dataLabels: {
	    			enabled: true,
	    			formatter: function() {
              			return '<b>'+ this.point.name +'</b>: '+ this.y;
            		},
            		style: {
            			fontSize: '14px'
            		}
	    		}
	    	}
	    }
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
