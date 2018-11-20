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

@autobind class DeltaCostBar extends PureComponent {

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


    console.log(data)

    if (data.length > 0) {
      if (!groupBy) {
        categories.push('Individual Cost Devations')
        series = [{
          name: ' ',
          data: data.map(i => {
            return {
              x: 0,
              y: i.deviation
            }
          })
        }]
        console.log(series)
      }
      else {
        data.forEach(i => {

          if (!categories.includes(i[groupBy])) {
            categories.push(i[groupBy])      
          }

        })

        categories.forEach((i, index) => {
          let colorIndex = index % colorWheel.length
          let subData = data.filter(j => j[groupBy] === i)

          subData.forEach(j => {
            console.log(j)
            dataPoints.push({
              x: index, 
              y: j.deviation, 
              color: colorWheel[colorIndex]})
          })
        })

        series = [{
          name: ' ',
          data: dataPoints
        }]
      }   
    }

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
        categories: categories
      },
      yAxis: {
        min: -100,
        max: 100,
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
	    series: series
		}

    console.log(series)

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
