import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class CostCompanyBar extends PureComponent {
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
      let val
      let color

      if (i.COMPANY === 'Halliburton'){
        val = [i.TOTAL_COST, 0, 0, 0, 0, 0]
        color = colors[0]
      }
      else if (i.COMPANY === 'Schlumberger') {
        val = [0, i.TOTAL_COST, 0, 0, 0, 0]
        color = colors[1]
      }
      else if (i.COMPANY === 'PFM') {
        val = [0, 0, i.TOTAL_COST, 0, 0, 0]
        color = colors[2]
      }
      else if (i.COMPANY === 'Chemiservices') {
        val = [0, 0, 0, i.TOTAL_COST, 0, 0]
        color = colors[3]
      }
      else if (i.COMPANY === 'BJ') {
        val = [0, 0, 0, 0, i.TOTAL_COST, 0]
        color = colors[4]
      }
      else {
        val = [0, 0, 0, 0, 0, i.TOTAL_COST]
        color = colors[5]
      }

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        data: val,
        color: color
      }
    })

    let config = {
	    chart: {
          zoomType: 'y',
	        type: 'column'
	    },
	    title: {
	        text: ''
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
    	<ReactHighcharts
    		className='chart'
    		config={config}
        ref={(ref) => { this.chart = ref }}
    	/>
    )
  }
}


export default CostCompanyBar
