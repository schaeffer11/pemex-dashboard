// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'

import Highcharts from 'highcharts';
import ReactHighCharts from 'react-highcharts';
require('highcharts/js/highcharts-more.js')(ReactHighCharts.Highcharts);
require('highcharts/modules/solid-gauge.js')(ReactHighCharts.Highcharts);

export const Gauge = ({ label, value, subLabel, className }) => {



  let config = {
    chart: {
      type: 'solidgauge'
    },
    title: {
      text: ''
    },
    pane: {
      center: ['50%', '85%'],
      size: '80%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: '#EFEFEF',
        innerRadius: '80%',
        outerRadius: '95%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,        }
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: null,
      stops: [[0.5, '#3e8bc7'],],
      lineWidth: 0,
      tickAmount: 5,
      title: {
        text: ''
      },
      labels: {
        style: {
          color: '#C6C6C6',
          fontSize: '14px',
        },
        distance: 15
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Test',
      data: [parseInt(value)],
      innerRadius: '80%',
      radius: '95%',
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:42px;color:#4e8bc7;font-weight:regular !important;font-family:Roboto">{y}</span>'
      }
    }],
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  }

  return (
    <div className={classnames("Gauge", className)} >
      <div className='chart gauge-chart'>
        <ReactHighCharts className="chart" config={config} />
      </div>
      <div className="gaugeLabel" style={{color:'#505050', fontSize:'16px', textAlign: 'center', fontWeight: 'bold', padding: '5px'}}>
        { label }
      </div>
      <div className="gaugeSubLabel" style={{color:'#808080', fontSize:'12px', textAlign: 'center', fontWeight: 'normal'}}>
        { subLabel }
      </div>
    </div>

  )
}


export default Gauge

