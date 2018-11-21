import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatAverageDeviation as formatter } from '../../../../lib/tooltipFormatters'



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

@autobind class AvgDeltaCostBar extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }


  render () {
    let { data, groupBy } = this.props
    console.log('what is groupby', groupBy)
    let dataPoints = []
    let series
    let categories = []
    if (data.length > 0) {
      if (!groupBy) {
        categories.push('')
        series = [{
          name: ' ',
          data: [data[0].avgDeviation]
        }]
      }
      else {
        data.forEach((i, index) => {
          console.log('wtf', i)
          const colorIndex = index % colorWheel.length
          dataPoints.push({ y: i.avgDeviation, color: colorWheel[colorIndex] })
          categories.push(i[groupBy])
        })

        series = [{
          name: ' ',
          data: dataPoints
        }]
      }   
    }
    const config = {
	    chart: {
          zoomType: 'y',
	        type: 'column'
	    },
	    title: {
	        text: ''
      },
      tooltip: { formatter },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: '%'
        },
        // min: -1000,
        // max: 1000,
        plotBands: [{
          color: '#b4ecb4',
          from: 0,
          to: 10000
        }, {
          color: '#ecb4b4',
          from: 0,
          to: -10000
        }]
      },
      xAxis: {
        categories: categories,
        title: { text: '' },
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


  // render() {
  //   let { data, groupBy } = this.props

  //   if (data.length > 0) {
  //     if (!groupBy) {
  //       data = [{
  //         name: '',
  //         data: [data[0].avgDeviation]
  //       }]
  //     }
  //     else {
  //       data = data.map(i => {
  //         return {
  //           name: i[groupBy],
  //           borderColor: 'black',
  //           data: [i.avgDeviation]
  //         }
  //       })
  //     }   
  //   }

  //   // console.log(data)

  //   let config = {
	//     chart: {
	//         type: 'column',
  //         zoomType: 'y',
	//     },
	//     title: {
	//         text: ''
  //     },
  //     tooltip: { formatter },
  //     yAxis: {
  //       title: {
  //         text: '%'
  //       },
  //       min: -100,
  //       max: 100,
  //       plotBands: [{
  //         color: '#ecb4b4',
  //         from: 0,
  //         to: 1000
  //       }, {
  //         color: '#b4ecb4',
  //         from: 0,
  //         to: -1000
  //       }]
  //     },
	//     credits: {
	//     	enabled: false
	//     },
	//     series: data
	// 	}

  //   return (
  //   	<ReactHighcharts
  //   		className='chart'
  //   		config={config}
  //       ref={(ref) => { this.chart = ref }}
  //   	/>
  //   )
  // }
}


export default AvgDeltaCostBar
