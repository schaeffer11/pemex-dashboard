import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'


@autobind class ProductionGraph extends PureComponent {

  render() {
    let { data } = this.props

    let config = {
     chart: {
          type: 'line',
          zoomType: 'xy'
      },
      title: {
          text: ''
      },
      credits: {
          enabled: false
      },
      tooltip: {
        shared: true,
        formatter:function () {
          let xVal = new Date(this.x)
          let xString = `${xVal.getDate()}/${xVal.getMonth() + 1}/${xVal.getFullYear()}`
          var retVal="<small>"+xString+"</small><br><br>";
          retVal+="<div style=height:14px;font-size:12px;line-height:14px;>";
          for(let i = 0; i < this.points.length; i++) {
            retVal+= "<div class='tooltip-line'>" + this.points[i].series.name+": <strong>"+this.points[i].y.toFixed(2) + ' ' + this.points[i].series.userOptions.label+"</strong> </div> <br>";
          }
          return retVal;
        }
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
              text: 'PWS (someUnit)'
          }
      }, {
          opposite: true,
          title: {
              text: 'PWF (someUnit)'
          }
      }],
      plotOptions: {
          series: {
            animation: false,
          },
          scatter: {
              marker: {
                  radius: 5,
              },

          }
      },
      series: [{
          name: 'PWS',
          color: '#0000A0',
          label: 'bbl/d',
          data: []
      }, {
          name: 'PWF',
          color: '#3a88c0',
          yAxis: 1,
          label: 'MMpc/d',
          data: []
      }]
    }

    let pwsData = []
    let pwfData = []

    data.forEach(i => {
      if (i.FECHA) {
        let date = new Date(i.FECHA)
        date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  
        pwsData.push([date, i.PWS])
        pwfData.push([date, i.PWF])
 
      }
    })

    config.series[0].data = pwsData.sort((a, b) => { return a[0] - b[0]})
    config.series[1].data = pwfData.sort((a, b) => { return a[0] - b[0]})

    return (        
      <div className="graph">
        <ReactHighCharts 
          className="chart" 
          config= {config} 
        />
      </div>
    )
  }
}

export default ProductionGraph

