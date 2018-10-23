import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class AvgDeltaCostBar extends PureComponent {
  render() {
    let { data } = this.props
    
    data = data.map(i => {
      return {
        name: i.name,
        borderColor: 'black',
        data: [((i.avgCost / i.avgEstCost) - 1) * 100]
      }
    })

    let config = {
	    chart: {
	        type: 'column',
          zoomType: 'y',
	    },
	    title: {
	        text: 'Avg Deviation From Expected Cost Per Job'
	    },
      yAxis: {
        reversed: true,
        title: {
          text: 'Percentage'
        },
        plotBands: [{
          color: '#ecb4b4',
          from: 0,
          to: 1000
        }, {
          color: '#b4ecb4',
          from: 0,
          to: -1000
        }]
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
