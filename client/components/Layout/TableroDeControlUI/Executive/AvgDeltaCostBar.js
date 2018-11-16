import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'


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

@autobind class AvgDeltaCostBar extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }


  render() {
    let { data, groupBy } = this.props

    if (data.length > 0) {
      if (!groupBy) {
        data = [{
          name: 'Average Cost Deviation',
          data: [data[0].avgDeviation]
        }]
      }
      else {
        data = data.map(i => {
          return {
            name: i[groupBy],
            borderColor: 'black',
            data: [i.avgDeviation]
          }
        })
      }   
    }

    // console.log(data)

    let config = {
	    chart: {
	        type: 'column',
          zoomType: 'y',
	    },
	    title: {
	        text: ''
	    },
      yAxis: {
        title: {
          text: 'Percentage'
        },
        min: -100,
        max: 100,
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


export default AvgDeltaCostBar