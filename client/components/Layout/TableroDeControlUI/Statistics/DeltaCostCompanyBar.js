import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class DeltaCostCompanyBar extends PureComponent {
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

    data = data.map((i, index) => {
      let row
      let color

      let val = ((i.TOTAL_COST / i.TOTAL_ESTIMATED_COST) - 1) * 100

      if (i.COMPANY === 'Halliburton'){
        row = [val, 0, 0, 0, 0, 0]
        color = val < 0 ? colors[0] : 'red'
      }
      else if (i.COMPANY === 'Schlumberger') {
        row = [0, val, 0, 0, 0, 0]
        color = val < 0 ? colors[1] : 'red'
      }
      else if (i.COMPANY === 'PFM') {
        row = [0, 0, val, 0, 0, 0]
        color = val < 0 ? colors[2] : 'red'
      }
      else if (i.COMPANY === 'Chemiservices') {
        row = [0, 0, 0, val, 0, 0]
        color = val < 0 ? colors[3] : 'red'
      }
      else if (i.COMPANY === 'BJ') {
        row = [0, 0, 0, 0, val, 0]
        color = val < 0 ? colors[4] : 'red'
      }
      else {
        row = [0, 0, 0, 0, 0, val]
        color = val < 0 ? colors[5] : 'red'
      }

      row = row.map(i => {
        i > 100 ? i = 100 : null
        return i
      })

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        data: row,
        color: color
      }
    })

    let config = {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Deviation From Expected Costs'
	    },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: ['Halliburton', 'Schlumberger', 'PFM', 'Chemiservices', 'BJ', 'Weatherford']
      },
      yAxis: {
        title: {
          text: 'Percentage'
        }
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


export default DeltaCostCompanyBar
