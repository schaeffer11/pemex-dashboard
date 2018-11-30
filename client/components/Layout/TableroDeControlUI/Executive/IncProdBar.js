import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { RenameInterventionTypes } from '../../../../lib/formatters'

let colorWheel = [
      '#56B3D8',
      '#C3E4CC',
      '#E4CE5E',
      '#C26A1B',
      '#5D2311',
      '#141551',
      '#355695',
      '#90D2CE',
      '#F4F296',
    ]

@autobind class IncProdBar extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }
  
  render() {
    let { data, groupBy } = this.props
    let dataPoints = []
    let series
    let categories = []
    if (data.length > 0) {
      if (!groupBy) {
        categories.push('')
        series = [{
          name: ' ',
          data: [data[0].qoResult]
        }]
      }
      else {
        data.forEach((i, index) => {
          let colorIndex = index % colorWheel.length

          dataPoints.push({y: i.qoResult, color: colorWheel[colorIndex]})
          categories.push(i.groupedName)
        })

        series = [{
          name: ' ',
          data: dataPoints
        }]
      }   
    }

    if (groupBy && groupBy === 'interventionType') {
      categories = RenameInterventionTypes(categories)
    }

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
      yAxis: {
        title: { text: 'bpd' },
      },
      xAxis: {
        categories: categories,
        title: { text: 'Producción Incremental Total' },
      },
	    credits: {
	    	enabled: false
	    },
      plotOptions: {
      },
	    series: series
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


export default IncProdBar
