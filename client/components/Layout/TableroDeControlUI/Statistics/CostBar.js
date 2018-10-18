import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'



@autobind class CostBar extends PureComponent {
  render() {
    let { data } = this.props

    console.log(data)
    data = data.map(i => {
      let val

      if (i.TIPO_DE_INTERVENCIONES === 'acido'){
        val = [0, i.TOTAL_COST, 0]
      }
      else if (i.TIPO_DE_INTERVENCIONES === 'apuntalado') {
        val = [0, 0, i.TOTAL_COST]
      }
      else {
        val = [i.TOTAL_COST, 0, 0]
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
      	<ReactHighcharts
      		className='chart'
      		config={config}
      	/>
      </div>
    )
  }
}


export default CostBar
