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

@autobind class DeltaGas extends PureComponent {

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
        if (i.qg > max) {
            max = i.qg
        }
        if (i.qgResult > max) {
            max = i.qgResult
        }

      if (groupBy) {
        if (!groupByList.includes(i.groupedName)) {
          groupByList.push(i.groupedName)
        }
      }


      i.x = i.qg
      i.y = i.qgResult
      i.group =  i.qg > i.qgResult ? 'Unsuccessful' : 'Successful'
        
      return i
    })


    console.log('this', data)

    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        i.data = i.name === 'Successful' ? data.filter(j => j.qgResult > j.qg) : data.filter(j => j.qgResult <= j.qg)
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
                text: 'Est Inc Gas (MMpc/d)'
            }
        },
        yAxis: {
            title: {
                text: 'Real Inc Gas (MMpc/d)'
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


export default DeltaGas
