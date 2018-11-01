import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import JobBreakdown from './JobBreakdown'
import DeltaOil from './DeltaOil'
import DeltaWater from './DeltaWater'
import ClassificationBreakdown from './ClassificationBreakdown'
import Filters from '../Common/Filters'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import AvgCostBar from '../Statistics/AvgCostBar'
import AvgCostCompanyBar from '../Statistics/AvgCostCompanyBar'
import CostBar from '../Statistics/CostBar'
import CostCompanyBar from '../Statistics/CostCompanyBar'
import DeltaCostBar from '../Statistics/DeltaCostBar'
import AvgDeltaCostBar from '../Statistics/AvgDeltaCostBar'
import AvgDeltaCostCompanyBar from '../Statistics/AvgDeltaCostCompanyBar'
import DeltaCostCompanyBar from '../Statistics/DeltaCostCompanyBar'
import ExecutiveTable from './ExecutiveTable'
import ExecutiveTable2Well from './ExecutiveTable2Well'
import ExecutiveTable3Well from './ExecutiveTable3Well'

@autobind class executiveUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	jobBreakdownData: [],
      aforosData: [],
      avgCostDataType: [],
      avgCostDataCompany: [],
      costData: [],
      countData: [],
      estIncData: [],
      estIncWellData: [],
      estIncFieldData: [],
      execTableFieldData: [],
      execTableWellData: [],
      volumenData: []
    }
    this.cards = []
    for (let i = 0; i < 4; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, field, well, formation } = globalAnalysis

    console.log(activo, field, well, formation)
    //TODO: MAKE PARALLEL
  	fetch(`/executive/jobBreakdown`, {
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
	  		jobBreakdownData: res
	  	})
  	})

    // fetch(`/executive/aforosData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     aforosData: res
    //   })
    // })

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

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

    fetch(`/executive/countData`, {
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
        countData: res
      })
    })

    fetch(`/executive/estimatedIncreaseData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
        groupBy: 'type'
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        estIncData: res
      })
    })

    fetch(`/executive/estimatedIncreaseData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
        groupBy: 'well'
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        estIncWellData: res
      })
    })


    fetch(`/executive/estimatedIncreaseData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
        groupBy: 'field'
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        estIncFieldData: res
      })
    })

    fetch(`/executive/execTableData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
        groupBy: 'well'
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        execTableWellData: res
      })
    })

    fetch(`/executive/execTableData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
        groupBy: 'field'
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        execTableFieldData: res
      })
    })

    fetch(`/executive/volumenData`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        activo,
        field,
        well,
        formation,
      })
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        volumenData: res
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
    let { jobBreakdownData, aforosData, fieldWellOptions, avgCostDataType, avgCostDataCompany, costData, countData, estIncData, 
      estIncWellData, estIncFieldData, execTableWellData, execTableFieldData, volumenData } = this.state

    return (
      <div className="data executive">
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="productionGraphs"
                title="Delta Production Graphs"
                ref={this.cards[0]}
              >
              <DeltaOil label='Oil' data={aforosData} />
              <DeltaWater label='Water' data={aforosData} />
            </Card>
            <Card
                id="classifications"
                title="Classification"
                ref={this.cards[1]}
              >
              <JobBreakdown label='Job Type' data={jobBreakdownData} />
              <ClassificationBreakdown label='Success' data={aforosData} />
            </Card>
            <Card
                id="costs"
                title="Costs"
                ref={this.cards[2]}
              >
              <CostBar label={'Total Type'} data={costData} />
              <AvgCostBar label={'Avg Type'} data={avgCostDataType} />
              <CostCompanyBar label={'Total Company'} data={costData} />
              <AvgCostCompanyBar label={'Avg Company'} data={avgCostDataCompany} />
            </Card>
            <Card
                id="costDeviations"
                title="Cost Deviations"
                ref={this.cards[3]}
              >         
              <DeltaCostBar label={'Type'} data={costData} />
              <AvgDeltaCostBar label={'Avg Type'} data={avgCostDataType} />
              <DeltaCostCompanyBar label={'Company'} data={costData} />
              <AvgDeltaCostCompanyBar label={'Avg Company'} data={avgCostDataCompany} />
            </Card>
          </CardDeck>
          <ExecutiveTable aforosData={aforosData} costData={costData} countData={countData} estIncData={estIncData} />
          <ExecutiveTable2Well data={execTableWellData} estIncData={estIncWellData} aforosData={aforosData}/>
         {/* <ExecutiveTable2Field data={execTableFieldData} estIncData={estIncWellData} /> */}
          <ExecutiveTable3Well data={execTableWellData} estIncData={estIncWellData} aforosData={aforosData} volumenData={volumenData}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(executiveUI)
