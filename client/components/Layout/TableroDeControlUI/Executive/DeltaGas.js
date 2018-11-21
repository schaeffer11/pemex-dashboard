import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatScatter as formatter } from '../../../../lib/tooltipFormatters'


let classificationSeries = [{
    name: 'Exitosa',
    color: 'green'
},{
    name: 'No Exitosa',
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
        
      return i
    })

    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        i.data = i.name === 'Exitosa' ? data.filter(j => j.qgResult > j.qg) : data.filter(j => j.qgResult <= j.qg)
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
        tooltip: { formatter },
        title: {
            text: ''
        },
        xAxis: {
            title: {
                text: 'Producción Incremental Estimada (MMpc/d)'
            }
        },
        yAxis: {
            title: {
                text: 'Producción Incremental Real (MMpc/d)'
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
