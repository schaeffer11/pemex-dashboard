import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class AvgDeltaCostCompanyBar extends PureComponent {
  render() {
    let { data } = this.props
    
    const colors = [
    
      '#C26A1B',
      '#5D2311',
      '#141551',
      '#355695',
      '#90D2CE',
      '#F4F296',
      '#56B3D8',
      '#C3E4CC',
      '#E4CE5E',
    ]

      let color

    data = data.map(i => {

      if (i.name === 'Halliburton'){
        color = colors[0]
      }
      else if (i.name === 'Schlumberger') {
        color = colors[1]
      }
      else if (i.name === 'PFM') {
        color = colors[2]
      }
      else if (i.name === 'Chemiservices') {
        color = colors[3]
      }
      else if (i.name === 'BJ') {
        color = colors[4]
      }
      else {
        color = colors[5]
      }
      console.log(i)
      return {
        name: i.name,
        color: color,
        data: [((i.avgCost / i.avgEstCost) - 1) * 100]
      }
    })

    let config = {
	    chart: {
	        type: 'column'
	    },
      yAxis: {
        title: {
          text: 'Percentage'
        }
      },
	    title: {
	        text: 'Avg Deviation From Expected Cost Per Job'
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
        	<ReactHighcharts
        		className='chart'
        		config={config}
        	/>
        </div>
      </div>
    )
  }
}


export default AvgDeltaCostCompanyBar
