import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'
import Gauge from './Gauge'
import Bar from './Bar'
import { dealWithNaN } from '../../../../lib/helpers';

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
    let { name, classname, cost, estCost, numProposals, numResults, days, percEstimated, percResults, prodEstimated, prodReal } = data

    percResults = percResults ? percResults : 0
    
    return (
      <div className={`kpi-outer ${classname}`}>
        <div className='name'>
            {name}
        </div>
        <div className = 'gauge' style={{height: '210px', width: '50%', display: 'inline-block', borderBottom: 'solid 2px #b1b1b1', verticalAlign: 'top'}}>
            <Gauge topLabel={`${dealWithNaN(numResults)}/${dealWithNaN(numProposals)}`} topSubLabel={'# de Tratamientos'} botLabel={`${percResults}`} botSubLabel={'% de Avance'} value={percResults} />
         </div>
         <div className = 'kpis' style={{height: '210px', width: '50%', display: 'inline-block', borderBottom: 'solid 2px #b1b1b1', borderLeft: 'solid 2px #b1b1b1'}}>
            <div className='kpi'>
                <div className='value'>
                    {estCost ? `$${numWithCommas(estCost.toFixed(0))}` : '-' }
                </div>
                <div className='header'>
                    Est. Costo Total (MXN)
                </div>
            </div>
            <div className='kpi'>
                <div className='value'>
                    {cost ? `$${numWithCommas(cost.toFixed(0))}` : '-' }
                </div>
                <div className='header'>
                    Costo Total (MXN)
                </div>
            </div>
            <div className='kpi'>
                <div className='value'>
                    {days ? days.toFixed(2) : '-'}
                </div>
                <div className='header'>
                    Desviación Promedio (días)
                </div>
            </div>

         </div>

        <div className = 'bar' style={{height: '235px', width: '100%', position: 'relative'}}>
             <div className='kpi' style={{paddingTop: '10px'}}>
                <div className='value'>
                    {percEstimated ? `${percEstimated.toFixed(2)}%` : '-' } 
                </div>
                <div className='header'>
                    % de Cumplimiento
                </div>
            </div>
            <Bar estimated={prodEstimated} actual={prodReal} />
         </div>
       
      </div>
    )
  }
}


export default TypeKPI
