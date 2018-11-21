import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

let classificationSeries = [{
    name: 'Exitosa',
    color: 'green'
},{
    name: 'No Exitosa',
    color: 'red'
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
    	
      return i
    })


    let series = []

    if (!groupBy) {
      series = classificationSeries.map(i => {
        i.data = i.name === 'Exitosa' ? data.filter(j => j.qoResult > j.qo) : data.filter(j => j.qoResult <= j.qo)
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
	    title: {
	        text: ''
	    },
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


export default DeltaOil
