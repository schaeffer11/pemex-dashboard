import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class ProductionTreatmentsBar extends PureComponent {

  render() {
    let { data, numTreatmentData, groupBy } = this.props

    let series = []
    let groups = []
    
    if (data) {
      data.forEach(i => {
        if (!groups.includes(i.groupedName)) {
          groups.push(i.groupedName)
        }
      })

      numTreatmentData = numTreatmentData.map(i => {
        let utc = Date.UTC(i.YEAR, i.MONTH - 1)
        return {
          x: utc,
          y: i.COUNT,
          groupedName: i.groupedName,
        }
      })

      numTreatmentData = numTreatmentData.sort((a, b) => {return a.x - b.x})
      groups.forEach(name => {
        let filteredData = data.filter(i => i.groupedName === name).map(j => {
          let utc = Date.UTC(j.YEAR, j.MONTH - 1)
          return {
            x: utc,
            y: j.QO_RESULT,
          }
        })

        series.push({
          name: 'Producción Incremental',
          data: filteredData,
          yAxis: 0,
          zIndex: 0
        })

        series.push({
          name: 'Número de Tratamientos',
          data: numTreatmentData.filter(i => i.groupedName === name),
          type: 'line',
          color: '#0D547B',
          yAxis: 1,
          zIndex: 1
        })
      }) 
    }


    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: ''
      },
      xAxis: {
        title: {
          text: 'Fecha'
        },
        tickInterval   : 24 * 3600 * 1000*30,
        type: 'datetime'
      },
      yAxis: [{
        title: {
          text: 'Aceite (bbl/d)'
        }
      }, {
        title: {
          text: 'Número de Tratamientos'
        },
        opposite: true
      }],
      plotOptions: {
        column: {
          stacking: 'normal',
          pointRange: 24 * 3600 * 1000*30
        }
      },
      credits: {
        enabled: false
      },
      series: series
  }
  
    return (
      <div className="production-bubble test">
        <div className='chart'>
          <ReactHighcharts
            className='chart'
            config={config}
            ref={(ref) => { this.chart = ref }}
          />
        </div>
      </div>
    )
  }
}



export default ProductionTreatmentsBar
