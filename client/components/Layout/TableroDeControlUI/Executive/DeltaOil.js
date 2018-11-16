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

let companySeries = [{
  name: 'Halliburton',
  color: '#C26A1B'
},{
  name: 'Schlumberger',
  color: '#5D2311'
},{
  name: 'PFM',
  color: '#141551'
},{
  name: 'Chemiservices',
  color: '#355695'
},{
  name: 'BJ',
  color: '#90D2CE'
},{
  name: 'Weatherford',
  color: '#F4F296'
}]

let tipoDeInterventionSeries = [{
    name: 'acido',
    color: '#56B3D8',
  }, {
    name: 'apuntalado',
    color: '#C3E4CC',
  }, {
    name: 'estimulacion',
    color: '#E4CE5E',
  }, {
    name: 'termico',
    color: '#C26A1B',
  }]

@autobind class DeltaOil extends PureComponent {

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
    	if (i.qo > max) {
    		max = i.qo
    	}
    	if (i.qoResult > max) {
    		max = i.qoResult
    	}

      if (groupBy) {
        if (!groupByList.includes(i.groupedName)) {
          groupByList.push(i.groupedName)
        }
      }


      i.x = i.qo
      i.y = i.qoResult
      i.group =  i.qo > i.qoResult ? 'Unsuccessful' : 'Successful'
    	
      return i
    })


    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        console.log(i.name, data, data.filter(j => j.qoResult > j.qo), data.filter(j => j.qoResult <= j.qo))
        i.data = i.name === 'Successful' ? data.filter(j => j.qoResult > j.qo) : data.filter(j => j.qoResult <= j.qo)
        return i
      })
    }
    else if (groupBy === 'company') {
      series = companySeries.map(i => {
        i.data = data.filter(j => j.groupedName === i.name)
        return i
      })
    }
    else if (groupBy === 'type') {
      series = tipoDeInterventionSeries.map(i => {
        i.data = data.filter(j => j.groupedName === i.name)
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
	    		text: 'Pre-Oil (bbl/d)'
	    	}
	    },
	    yAxis: {
	    	title: {
	    		text: 'Post-Oil (bbl/d)'
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


export default DeltaOil
