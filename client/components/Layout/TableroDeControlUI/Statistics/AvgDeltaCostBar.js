import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class AvgDeltaCostBar extends PureComponent {
  render() {
    let { data } = this.props
    
    data = data.map(i => {
      return {
        name: i.name,
        data: [((i.avgCost / i.avgEstCost) - 1) * 100]
      }
    })

    let config = {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Avg Deviation From Expected Cost Per Job'
	    },
      yAxis: {
        title: {
          text: 'Percentage'
        }
      },
	    credits: {
	    	enabled: false
	    },
	    series: data
		}

    console.log(data)
    
    return (
      <div className="classification-breakdown test">
        <div className='chart'>
          <div className='chart'>
          	<ReactHighcharts
          		className='chart'
          		config={config}
          	/>
          </div> 
        </div>
      </div>
    )
  }
}


export default AvgDeltaCostBar
