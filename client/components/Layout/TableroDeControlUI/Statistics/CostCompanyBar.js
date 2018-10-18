import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class CostCompanyBar extends PureComponent {
  render() {
    let { data } = this.props

    console.log(data)

    data = data.map(i => {
      let val

      if (i.COMPANY === 'Halliburton'){
        val = [i.TOTAL_COST, 0, 0, 0, 0, 0]
      }
      else if (i.COMPANY === 'Schlumberger') {
        val = [0, i.TOTAL_COST, 0, 0, 0, 0]
      }
      else if (i.COMPANY === 'PFM') {
        val = [0, 0, i.TOTAL_COST, 0, 0, 0]
      }
      else if (i.COMPANY === 'Chemiservices') {
        val = [0, 0, 0, i.TOTAL_COST, 0, 0]
      }
      else if (i.COMPANY === 'BJ') {
        val = [0, 0, 0, 0, i.TOTAL_COST, 0]
      }
      else {
        val = [0, 0, 0, 0, 0, i.TOTAL_COST]
      }

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        data: val
      }
    })

    let config = {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Costs'
	    },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: ['Halliburton', 'Schlumberger', 'PFM', 'Chemiservices', 'BJ', 'Weatherford']
      },
	    credits: {
	    	enabled: false
	    },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
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


export default CostCompanyBar
