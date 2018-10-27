import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class DeltaCostBar extends PureComponent {
  render() {
    let { data } = this.props

    console.log(data)
    data = data.map(i => {
      let row
      let color
      let borderColor

      let val = ((i.TOTAL_COST / i.TOTAL_ESTIMATED_COST) - 1) * 100


      if (i.TIPO_DE_INTERVENCIONES === 'acido'){
        val > 200 ? val = 100 : null
        row = {x: 0, y: val}
        color = '#56B3D8'
        // borderColor = val < 0 ? 'green' : 'red'
        
      }
      else if (i.TIPO_DE_INTERVENCIONES === 'apuntalado') {
        row = {x: 1, y: val}
        color =  '#C3E4CC' 
        // borderColor = val < 0 ? 'green' : 'red'
      }
      else {
        row = {x: 2, y: val}
        color =  '#E4CE5E' 
        // borderColor = val < 0 ? 'green' : 'red'
      }

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        color: color,
        borderColor: 'black',
        data: [row],
      }
    })

    console.log(data)

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
        categories: ['Acido', 'Apuntalado', 'Estimulacion']
      },
      yAxis: {
        reversed: true,
        title: {
          text: 'Percentage'
        },
        plotLines: [{
          value: 0,
          color: 'black',
          width: 5,
        }],
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


export default DeltaCostBar
