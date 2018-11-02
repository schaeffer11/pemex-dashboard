import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'


@autobind class AvgDeltaCostBar extends PureComponent {
  render() {
    let { data } = this.props
    
    data = data.map(i => {
      return {
        name: i.name,
        borderColor: 'black',
        data: [((i.avgCost / i.avgEstCost) - 1) * 100]
      }
    })

    let config = {
	    chart: {
	        type: 'column',
          zoomType: 'y',
	    },
	    title: {
	        text: ''
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


// let { data, groupBy } = this.props
//     let dataPoints = []
//     let series
//     let categories = []

//     console.log(data, groupBy)

//     if (data.length > 0) {
//       if (!groupBy) {
//         categories.push('Total Cost')
//         series = [{
//           name: ' ',
//           data: [((data[0].totalCost / (data[0].totalCost + 5000)) - 1) * 100]
//         }]
//       }
//       else {
//         data.forEach((i, index) => {
//           let colorIndex = index % colorWheel.length

//           dataPoints.push({x: index, y: i.totalCost, color: colorWheel[colorIndex]})
//           categories.push(i[groupBy])
//         })

//         series = [{
//           name: ' ',
//           data: dataPoints
//         }]
//       }   
//     }