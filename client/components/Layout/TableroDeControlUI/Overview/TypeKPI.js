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
    let { name, cost, numProposals, numResults, days, percEstimated, percResults } = data

    percResults = percResults ? percResults : 0

    return (
      <div className={`kpi-outer ${name}`}>
        <div className='name'>
            {name}
        </div>
        <div className = 'gauge' style={{height: '200px', width: '50%', display: 'inline-block'}}>
            <Gauge label={`${numResults}/${numProposals}`} subLabel={'% de Avance'} value={percResults} />
         </div>
        <div className = 'bar' style={{height: '200px', width: '50%', display: 'inline-block'}}>
            <Bar estimated={5} actual={10} />
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
                {cost ? `$${numWithCommas(cost.toFixed(2))}` : '-' }
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
