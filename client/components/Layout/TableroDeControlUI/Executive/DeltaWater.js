import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

let classificationSeries = [{
    name: 'Successful',
    color: 'green'
},{
    name: 'Unsuccessful',
    color: 'red'
}]

@autobind class DeltaWater extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }
  
  render() {
    let { data, groupBy } = this.props
    let max = 0
    let groupByList = []

    data = data.map(i => {
        if (i.qw > max) {
            max = i.qw
        }
        if (i.qwResult > max) {
            max = i.qwResult
        }

      if (groupBy) {
        if (!groupByList.includes(i.groupedName)) {
          groupByList.push(i.groupedName)
        }
      }


      i.x = i.qw
      i.y = i.qwResult
      i.group =  i.qw < i.qwResult ? 'Unsuccessful' : 'Successful'
        
      return i
    })


    console.log('this', data)

    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        i.data = i.name === 'Successful' ? data.filter(j => j.qwResult < j.qw) : data.filter(j => j.qwResult >= j.qw)
        return i
      })
    }
    else {
      series = groupByList.map(i => {
        return {
          name: i,
          data: data.filter(j => j.groupedName === i)
        }
      })
    }


    console.log(series)


    series.push({
        name: '',
        type: 'line',
        color: 'black',
        dashStyle: 'Dash',
        lineWidth: 1,
        showInLegend: false,
        data: [[0,0], [max, max]]
    })



    let config = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: 'Est Inc Water (bbl/d)'
            }
        },
        yAxis: {
            title: {
                text: 'Real Inc Water (bbl/d)'
            }
        },
        credits: {
            enabled: false
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


export default DeltaWater
