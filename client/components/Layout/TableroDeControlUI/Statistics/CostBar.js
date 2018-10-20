import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class CostBar extends PureComponent {
  render() {
    let { data } = this.props

    console.log(data)
    data = data.map(i => {
      let val
      let color


      if (i.TIPO_DE_INTERVENCIONES === 'acido'){
        val = [0, i.TOTAL_COST, 0]
        color = '#56B3D8'
      }
      else if (i.TIPO_DE_INTERVENCIONES === 'apuntalado') {
        val = [0, 0, i.TOTAL_COST]
        color = '#C3E4CC'
      }
      else {
        val = [i.TOTAL_COST, 0, 0]
        color = '#E4CE5E'
      }

      return {
        name: `${i.WELL_NAME} ${i.FECHA}`,
        color: color,
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
        categories: ['Estimulacion', 'Acido', 'Apuntalado']
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


export default CostBar
