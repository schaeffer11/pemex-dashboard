import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import { formatScatter as formatter } from '../../../../lib/tooltipFormatters'
import { RenameInterventionTypes } from '../../../../lib/formatters'

let classificationSeries = [{
    name: 'Exitosa',
    color: 'green'
},{
    name: 'No Exitosa',
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
        
      return i
    })

    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        i.data = i.name === 'Exitosa' ? data.filter(j => j.qwResult < j.qw) : data.filter(j => j.qwResult >= j.qw)
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
        data: [[0,0], [max, max]],
        enableMouseTracking: false,
    })

  if (groupBy && groupBy === 'interventionType') {
    series = RenameInterventionTypes(series)
  }

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
        tooltip: { formatter },
        xAxis: {
            title: {
                text: 'Producción Incremental Estimada (bbl/d)'
            }
        },
        yAxis: {
            title: {
                text: 'Producción Incremental Real (bbl/d)'
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
