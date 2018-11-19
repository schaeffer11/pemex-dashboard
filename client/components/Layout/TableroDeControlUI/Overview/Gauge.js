// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'

import Highcharts from 'highcharts';
import ReactHighCharts from 'react-highcharts';
require('highcharts/js/highcharts-more.js')(ReactHighCharts.Highcharts);
require('highcharts/modules/solid-gauge.js')(ReactHighCharts.Highcharts);

export const Gauge = ({ topLabel, botLabel, value, topSubLabel, botSubLabel, className }) => {



  let config = {
    chart: {
      type: 'solidgauge'
    },
    title: {
      text: ''
    },
    pane: {
      center: ['50%', '70%'],
      size: '80%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: 'red',
        innerRadius: '50%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      solidgauge: {

      }
    },
    yAxis: {
      min: 0,
      max: 100,
      minorTickInterval: null,
      // stops: [[0.5, '#70AD46'],],
      stops: [
          [0.1, '#C71C31'],
          [0.5, '#DDDF0D'], 
          [0.9, '#70AD46'] 
        // [0.9, 'blue'] 
            
      ],
      tickAmount: 9,
      tickWidth: 0,
      labels: {
          formatter: function () {
              return '.';
          },
          y: -10,
          style: {
            color: 'white',
            fontSize: '24px'
          }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Test',
      data: [parseInt(value) * 1.2],
      innerRadius: '50%',
      radius: '100%',
      dataLabels: {
        enabled: false
      }
    }],
  }

  console.log(value)

  botLabel ? botLabel = parseFloat(botLabel).toFixed(2) : null

  return (
    <div className={classnames("Gauge")} style={{height: '100%'}}>
      <div className='chart gauge-chart'>
        <ReactHighCharts className="chart" config={config} />
      </div>
      <div className="gaugeLabel" style={{top: '-205px'}}>
        { topLabel }
      </div>
      <div className="gaugeSubLabel" style={{top: '-205px'}}>
        { topSubLabel }
      </div>
      <div className="gaugeLabel" style={{top: '-107px'}}>
        { botLabel }%
      </div>
      <div className="gaugeSubLabel" style={{top: '-107px'}}>
        { botSubLabel }
      </div>
    </div>

  )
}


export default Gauge

