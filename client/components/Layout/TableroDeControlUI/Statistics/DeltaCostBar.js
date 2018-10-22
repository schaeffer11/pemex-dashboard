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

      let val = ((i.TOTAL_COST / i.TOTAL_ESTIMATED_COST) - 1) * 100


      if (i.TIPO_DE_INTERVENCIONES === 'acido'){
        val > 200 ? val = 100 : null
        row = [0, val, 0]
        color = val < 0 ? '#56B3D8' : 'red'

      }
      else if (i.TIPO_DE_INTERVENCIONES === 'apuntalado') {
        row = [0, 0, val]
        color = val < 0 ? '#C3E4CC' : 'red'
      }
      else {
        row = [val, 0, 0]
        color = val < 0 ? '#E4CE5E' : 'red'
      }

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        color: color,
        data: row,
      }
    })

    console.log(data)

    let config = {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Deviation From Expected Cost'
	    },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: ['Estimulacion', 'Acido', 'Apuntalado']
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


export default DeltaCostBar
