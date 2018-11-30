import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'

import { KPI } from '../Common/KPIs'

const numWithCommas = (x) => {
  if (x === 0) {
    return 0
  }
  if (!x) {
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@autobind class KPIs extends PureComponent {

  render() {
    let { data, estData, estIncData } = this.props

    let cost = 0
    let estCost = 0
    let delta = 0
    let prod = 0
    let estProd = 0
    let deltaProd = 0
    let company = ''

    data.forEach(i => {
      cost += i.COST_DLS * i.MNXtoDLS + i.COST_MNX
    })

    estData.forEach(i => {
      estCost += i.COST_DLS * i.MNXtoDLS + i.COST_MNX
    })

    delta = ((cost / estCost) - 1) * 100

    if (estIncData.length > 0) {
      prod = estIncData[0].QO_RESULT
      estProd = estIncData[0].EST_INC_GASTO_COMPROMISO_QO
      deltaProd = ((prod / estProd) - 1) * 100
      company = estIncData[0].COMPANY
    }

    return (
      <div className="kpis">
        <KPI className='company' header='Compañía' value={company} />
        <KPI className='est-cost' header='Costos Estimados' value={'$' + numWithCommas(estCost)} unit=' MNX'/>
        <KPI className='cost' header='Costos Reales' value={'$' + numWithCommas(cost)} unit=' MNX'/>
        <KPI className='delta-cost' header='Desviación' value={delta.toFixed(2) + '%'} />
        <KPI className='est-prod' header='Prod. Inc. Estimada' value={estProd} unit=' bbl/d'/>
        <KPI className='prod' header='Prod. Inc. Real' value={prod} unit=' bbl/d'/>
        <KPI className='delta-prod' header='Desviación' value={deltaProd.toFixed(2) + '%'} />
      </div>
    )
  }
}



export default KPIs
