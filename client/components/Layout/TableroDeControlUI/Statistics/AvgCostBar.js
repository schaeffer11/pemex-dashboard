import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class AvgCostBar extends PureComponent {
  render() {
    let { data } = this.props
    
    data = data.map(i => {
      console.log(i)
      return {
        name: i.name,
        data: [i.totalCost]
      }
    })

    console.log(data)

    let config = {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Costs'
	    },
	    credits: {
	    	enabled: false
	    },
	    series: data
		}

    return (
      <div className="classification-breakdown test">
      	<ReactHighcharts
      		className='chart'
      		config={config}
      	/>
      </div>
    )
  }
}


export default AvgCostBar
