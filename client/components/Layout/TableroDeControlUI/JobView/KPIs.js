import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'

import { KPI } from '../Common/KPIs'

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
        <KPI className='company' header='Company' value={company} />
        <KPI className='est-cost' header='Estimated Cost' value={estCost} />
        <KPI className='cost' header='Cost' value={cost} />
        <KPI className='delta-cost' header='Delta' value={delta.toFixed(2) + '%'} />
        <KPI className='est-prod' header='Estimated Inc Prod' value={estProd} />
        <KPI className='prod' header='Inc Prod' value={prod} />
        <KPI className='delta-prod' header='Delta' value={deltaProd.toFixed(2) + '%'} />
      </div>
    )
  }
}



export default KPIs
