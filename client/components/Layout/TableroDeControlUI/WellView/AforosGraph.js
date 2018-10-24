import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'


@autobind class AforosGraph extends PureComponent {

  render() {
    let { data } = this.props

    let config = {
       chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        tooltip: {
          formatter:function () {
            let xVal = new Date(this.x)
            let xString = `${xVal.getDate()}/${xVal.getMonth() + 1}/${xVal.getFullYear()}`
            var retVal="<small>"+xString+"</small><br><br>";
            retVal+="<div style=height:14px;font-size:12px;line-height:14px;>";
            retVal+= "<div class='tooltip-line'>" + this.point.series.name+": <strong>"+this.y.toFixed(0)+ ' ' + this.point.series.userOptions.label+"</strong> </div> <br>";
            return retVal;
          }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Fecha'
            },
            type: 'datetime'
        },
        yAxis: [{
            title: {
                text: 'Gasto (bbl/d)'
            }
        }, {
            opposite: true,
            title: {
                text: 'Gasto (MMpc/d)'
            }
        }],
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                },

            }
        },
        series: [{
            name: 'Qo',
            color: '#35b06d',
            label: 'bbl/d',
            data: []
        }, {
            name: 'Qg',
            color: '#CC3D3D',
            yAxis: 1,
            label: 'MMpc/d',
            data: []
        }, {
            name: 'Qw',
            color: '#3a88c0',
            label: 'bbl/d',
            data: []
        }]
    }



    console.log(data)

    let qoData = []
    let qwData = []
    let qgData = []

    data.forEach(i => {
      if (i.FECHA) {
        let date = new Date(i.FECHA)
        date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        qoData.push([date, i.QO])
        qwData.push([date, i.QW])
        qgData.push([date, i.QG])
      }
    })

    config.series[0].data = qoData
    config.series[1].data = qgData
    config.series[2].data = qwData


    return (        
    <ReactHighCharts 
      className="chart" 
      config= {config} 
      ref={(ref) => { this.chart = ref }}
    />
    )
  }
}

export default AforosGraph

