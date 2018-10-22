import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'

import { KPI } from '../Common/KPIs'

@autobind class CostKPIs extends PureComponent {

  render() {
    let { data, estData } = this.props

    let cost = 0
    let estCost = 0
    let delta = 0

    data.forEach(i => {
      cost += i.COST_DLS * i.MNXtoDLS + i.COST_MNX
    })

    estData.forEach(i => {
      estCost += i.COST_DLS * i.MNXtoDLS + i.COST_MNX
    })

    delta = ((cost / estCost) - 1) * 100
    return (
      <div className="cost-kpis test">
        <KPI header='Estimated Cost' value={estCost} />
        <KPI header='Cost' value={cost} />
        <KPI header='Delta' value={delta.toFixed(2) + '%'} />
      </div>
    )
  }
}



export default CostKPIs
