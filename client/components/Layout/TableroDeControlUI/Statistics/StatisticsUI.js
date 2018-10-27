import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import Filters from '../Common/Filters'
import AvgCostBar from './AvgCostBar'
import AvgCostCompanyBar from './AvgCostCompanyBar'
import CostBar from './CostBar'
import CostCompanyBar from './CostCompanyBar'
import DeltaCostBar from './DeltaCostBar'
import AvgDeltaCostBar from './AvgDeltaCostBar'
import AvgDeltaCostCompanyBar from './AvgDeltaCostCompanyBar'
import DeltaCostCompanyBar from './DeltaCostCompanyBar'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';

@autobind class statisticsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      avgCostDataType: [],
      avgCostDataCompany: [],
      costData: []
    }
    this.cards = []
    for (let i = 0; i < 2; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, field, well, formation } = globalAnalysis

    //TODO MAKE PARALLEL
    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    fetch('/api/getFieldWellMappingHasData', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })

    fetch(`/statistics/avgCostByType`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation
      })
    })
  	.then(res => res.json())
  	.then(res => {
	  	this.setState({
	  		avgCostDataType: res
	  	})
  	})

    fetch(`/statistics/avgCostByCompany`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        avgCostDataCompany: res
      })
    })

    fetch(`/statistics/costData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        costData: res
      })
    })
  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()


		let { activo, field, well, formation } = globalAnalysis
    let activoPrev = prevGlobalAnalysis.activo
    let fieldPrev = prevGlobalAnalysis.field
    let wellPrev = prevGlobalAnalysis.well
    let formationPrev = prevGlobalAnalysis.formation

    if (activo !== activoPrev || field !== fieldPrev || well !== wellPrev || formation !== formationPrev) {
			this.fetchData()	
		}
  }

  render() {
    let { fieldWellOptions, avgCostDataType, avgCostDataCompany, costData } = this.state

    console.log('cost', costData)
    console.log('avgCostType', avgCostDataType)
    console.log('avgCostCompany', avgCostDataCompany)


    return (
      <div className="data statistics">
        <div className='header'>
          <Filters fieldWellOptions={fieldWellOptions} />
        </div>
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="costs"
                title="Costs"
                ref={this.cards[0]}
              >
              <CostBar label={'Total Type'} data={costData} />
              <AvgCostBar label={'Avg Type'} data={avgCostDataType} />
              <CostCompanyBar label={'Total Company'} data={costData} />
              <AvgCostCompanyBar label={'Avg Company'} data={avgCostDataCompany} />
            </Card>
            <Card
                id="costDeviations"
                title="Cost Deviations"
                ref={this.cards[1]}
              >         
              <DeltaCostBar label={'Type'} data={costData} />
              <AvgDeltaCostBar label={'Avg Type'} data={avgCostDataType} />
              <DeltaCostCompanyBar label={'Company'} data={costData} />
              <AvgDeltaCostCompanyBar label={'Avg Company'} data={avgCostDataCompany} />
            </Card>
          </CardDeck>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(statisticsUI)
