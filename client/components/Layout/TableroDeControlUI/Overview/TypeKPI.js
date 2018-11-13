import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import Gauge from './Gauge'
import Bar from './Bar'

const numWithCommas = (x) => {
  if (x === 0) {
    return 0
  }
  if (!x) {
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


@autobind class TypeKPI extends PureComponent {
  render() {
    let { data } = this.props
    let { name, classname, cost, numProposals, numResults, days, percEstimated, percResults, prodEstimated, prodReal } = data

    percResults = percResults ? percResults : 0

    return (
      <div className={`kpi-outer ${classname}`}>
        <div className='name'>
            {name}
        </div>
        <div className = 'gauge' style={{height: '200px', width: '50%', display: 'inline-block', verticalAlign: 'top'}}>
            <Gauge label={`${numResults}/${numProposals}`} subLabel={'% de Avance'} value={percResults} />
         </div>
        <div className = 'bar' style={{height: '200px', paddingTop: '20px', width: '50%', position: 'relative', left: '-10px', display: 'inline-block', verticalAlign: 'top'}}>
            <Bar estimated={prodEstimated} actual={prodReal} />
         </div>
        <div className='kpi'>
            <div className='value'>
                {numProposals ? numProposals : '-'}
            </div>
            <div className='header'>
                # De Tratamientos
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {cost ? `$${numWithCommas(cost.toFixed(0))}` : '-' }
            </div>
            <div className='header'>
                Costo Tltal (MNX)
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {days ? days.toFixed(2) : '-'}
            </div>
            <div className='header'>
                Desviacion Promedio (days)
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {percEstimated ? `${percEstimated.toFixed(2)}%` : '-' } 
            </div>
            <div className='header'>
                % de Cumplimento
            </div>
        </div>
      </div>
    )
  }
}


export default TypeKPI
