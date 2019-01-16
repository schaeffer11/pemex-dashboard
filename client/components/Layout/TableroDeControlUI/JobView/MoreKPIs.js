import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

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

@autobind class MoreKPIs extends PureComponent {

  render() {
    let { jobData, job } = this.props
    let alcances = ''
    let objetivo = ''
    if (job && jobData.length > 0) {
      alcances = jobData[0].ALCANCES
      objetivo = jobData[0].OBJETIVO
    }

    return (
      <div className="more-kpis">
        <KPI className='alcances' type='wide' header='Alcances' value={alcances} />
        <KPI className='objetivo' type='wide' header='Objetivo' value={objetivo} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  job: state.getIn(['globalAnalysis', 'job']),
})

export default connect(mapStateToProps)(MoreKPIs)
