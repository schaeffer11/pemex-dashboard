import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactHighCharts from 'react-highcharts'


const config = {
        chart: {
          type: 'area',
          inverted: true,
          margin: [50, 0, 50, 100],
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [
            'Sodio',
            'Calcio',
            'Magnesio',
            'Fierro'
          ]
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.x + '</b>: ' + this.y
          }
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          showFirstLabel: false,
          min: 1,
          max: 10000,
          reversed: true,
          type: 'logarithmic',
          title: {
            text: 'meg/L'
          }
        },
        series: [{
          animation: false,
          name: 'something',
          data: [2500, 500, 180, 1]
        }]
      }

      const config2 = {
        chart: {
          type: 'area',
          inverted: true,
          margin: [50, 100, 50, 0]
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          opposite: true,
          categories: [
          'Cloruros',
          'Bicarbonatos',
          'Sulfatos',
          'Carbonatos'
          ]
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.x + '</b>: ' + this.y
          }
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          min: 1,
          max: 10000,
          type: 'logarithmic',
          title: {
            text: 'meg/L'
          }
        },
        series: [{
          animation: false,
          name: 'something',
          data: [2100, 8, 8, 1]
        }]
      }


@autobind class AnalisisDelAguaGraph extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      chartConfig: {
        title: {
          text: ''
        },
        credits: {
          enabled: false
        }
      },
      chartConfig2: {
        title: {
          text: ''
        },
        credits: {
          enabled: false
        }
      }
    }
  }

  componentDidMount(){

  }

  shouldComponentUpdate(nextProps, nextState) {
    let { formData } = nextProps
    formData = formData.toJS()

    // if (nextProps.sodio !== this.props.sodio || nextProps.calcio !== this.props.calcio || nextProps.magnesio !== this.props.magnesio || nextProps.fierro !== this.props.fierro || nextProps.cloruros !== this.props.cloruros || nextProps.bicarbonatos !== this.props.bicarbonatos || nextProps.sulfatos !== this.props.sulfatos || nextProps.carbonatos !== this.props.carbonatos) {
    //   return true
    // }

    // return false
    return true
  }

  componentDidUpdate(prevProps){
    let { formData } = this.props
    let oldFormData = prevProps.formData
    oldFormData = oldFormData.toJS()
    formData = formData.toJS()

    let { sodio, calcio, magnesio, fierro, cloruros, bicarbonatos, sulfatos, carbonatos } = formData
    

    if (oldFormData.sodio !== sodio || oldFormData.calcio !== calcio || oldFormData.magnesio !== magnesio || oldFormData.fierro !== fierro || oldFormData.cloruros !== cloruros || oldFormData.bicarbonatos !== bicarbonatos || oldFormData.sulfatos !== sulfatos || oldFormData.carbonatos !== carbonatos) {
      console.log(sodio, calcio, magnesio, fierro, cloruros, bicarbonatos, sulfatos, carbonatos)

      let newConfig = config
      let newConfig2 = config2

      sodio = parseInt(sodio) || 1
      calcio = parseInt(calcio) || 1
      magnesio = parseInt(magnesio) || 1
      fierro = parseInt(fierro) || 1
      cloruros = parseInt(cloruros) || 1
      bicarbonatos = parseInt(bicarbonatos) || 1
      sulfatos = parseInt(sulfatos) || 1
      carbonatos = parseInt(carbonatos) || 1

      newConfig.series[0].data = [sodio, calcio, magnesio, fierro]
      newConfig2.series[0].data = [cloruros, bicarbonatos, sulfatos, carbonatos]


      this.setState({
        chartConfig: newConfig,
        chartConfig2: newConfig2
      })
    }

  }



  render() {
    let { chartConfig, chartConfig2 } = this.state

    console.log(chartConfig2)
    console.log(chartConfig)
    return (
      <div className="graph">
        <div className='test' style={{position: 'relative', width: '50%', display: 'inline-block'}}>
          <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {chartConfig} />
        </div>
        <div className='test2' style={{position: 'relative', width: '50%', display: 'inline-block'}}>
          <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {chartConfig2} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('analisisDelAgua'),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AnalisisDelAguaGraph)
