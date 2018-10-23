import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class SimulationTreatmentTable extends PureComponent {

  render() {
    let { interventionData, interventionResultsData } = this.props

    console.log(interventionData, interventionResultsData)
    

    return (
      <div className="simulation-treatment test">
      eELELLOO
      </div>
    )
  }
}



export default SimulationTreatmentTable
