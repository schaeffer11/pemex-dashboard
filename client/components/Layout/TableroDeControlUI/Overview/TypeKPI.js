import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import Gauge from './Gauge'

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


    return (
      <div className={`kpi-outer ${data.name}`}>
        <div className='name'>
            {data.name}
        </div>
        <div className = 'gauge'>
            <Gauge className="discretionary-score" subLabel='Duration and Active decision-making' label="Discretionary" value={80} />
         </div>
        <div className='kpi'>
            <div className='value'>
                {data.numProposals ? data.numProposals : '-'}
            </div>
            <div className='header'>
                # De Tratamientos
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {data.cost ? `$${numWithCommas(data.cost.toFixed(2))}` : '-' }
            </div>
            <div className='header'>
                Costo Tltal (MNX)
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {data.days ? data.days.toFixed(2) : '-'}
            </div>
            <div className='header'>
                Desviacion Promedio (days)
            </div>
        </div>
        <div className='kpi'>
            <div className='value'>
                {data.percEstimated ? `${data.percEstimated.toFixed(2)}%` : '-' } 
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
