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
        row = {x: 0, y: val}
        color = colors[0]
      }
      else if (i.COMPANY === 'Schlumberger') {
        row = {x: 1, y: val}
        color = colors[1]
      }
      else if (i.COMPANY === 'PFM') {
        row = {x: 2, y: val}
        color = colors[2]
      }
      else if (i.COMPANY === 'Chemiservices') {
        row = {x: 3, y: val}
        color = colors[3]
      }
      else if (i.COMPANY === 'BJ') {
        row = {x: 4, y: val}
        color = colors[4]
      }
      else {
        row = {x: 5, y: val}
        color = colors[5]
      }

      Object.keys(row).forEach(key => {
        row[key] > 100 ? row[key] = 100 : null
      })

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        data: [row],
        borderColor: 'black',
        color: color
      }
    })

    let config = {
	    chart: {
	        type: 'scatter',
          zoomType: 'xy',
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
      plotOptions: {
        series: {
          marker: {
            lineColor: 'black',
            radius: 4,
            lineWidth: 1,
            symbol: 'square',
          }
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


export default DeltaCostCompanyBar
