import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatPiePercent as formatter } from '../../../../lib/tooltipFormatters'



@autobind class JobBreakdown extends PureComponent {

  render() {
	  
    let { data } = this.props

    console.log(data)

    let graphData = []
    let newItem

    if (data && data.find(i => i.name === 'apuntalado')) { 
    	newItem = JSON.parse(JSON.stringify(data.find(i => i.name === 'apuntalado')))
    	newItem.color = '#C3E4CC'
    	newItem.name = 'Frac. Apuntalado'
    	graphData.push(newItem)
     }
    if (data && data.find(i => i.name === 'acido')) { 
    	newItem = JSON.parse(JSON.stringify(data.find(i => i.name === 'acido')))
    	newItem.color = '#56B3D8'
    	newItem.name = 'Frac. Ácido'
    	graphData.push(newItem)
     }
    if (data && data.find(i => i.name === 'estimulacionLimpieza')) { 
    	newItem = JSON.parse(JSON.stringify(data.find(i => i.name === 'estimulacionLimpieza')))
    	newItem.color = '#E4CE5E'
    	newItem.name = 'Estimulación Limpiezas'
    	graphData.push(newItem)
     }
    if (data && data.find(i => i.name === 'estimulacionMatricial')) { 
    	newItem = JSON.parse(JSON.stringify(data.find(i => i.name === 'estimulacionMatricial')))
    	newItem.color = '#C26A1B'
    	newItem.name = 'Estimulación Matricial'
    	graphData.push(newItem)
     }
    if (data && data.find(i => i.name === 'termico')) { 
    	newItem = JSON.parse(JSON.stringify(data.find(i => i.name === 'termico')))
    	newItem.color = '#5D2311'
    	newItem.name = 'Estimulación Térmica'
    	graphData.push(newItem)
     }

    let config = {
	    chart: {
	        type: 'pie'
	    },
	    title: {
	        text: ''
	    },
	    credits: {
	    	enabled: false
		},
		tooltip: { formatter },
	    series: [{
	        name: 'Count',
	        data: graphData
	    }],
	    plotOptions: {
	    	pie: {
	    		size: '50%',
	    		dataLabels: {
	    			enabled: true,
	    			formatter: function() {
              			return '<b>'+ this.point.name +'</b>: '+ this.y;
            		},
            		style: {
            			fontSize: '14px'
            		}
	    		}
	    	}
	    }
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


export default JobBreakdown
