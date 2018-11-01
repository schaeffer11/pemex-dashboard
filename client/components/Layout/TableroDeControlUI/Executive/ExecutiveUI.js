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
import CostBar from './CostBar'
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
      costData: [],
      costDataAverage: [],
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
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = globalAnalysis


    let params = []
    let query

    subdir ? params.push(`subdir=${subdir}`) : null
    activo ? params.push(`activo=${activo}`) : null
    field ? params.push(`field=${field}`) : null
    well ? params.push(`activo=${activo}`) : null
    formation ? params.push(`formation=${formation}`) : null
    company ? params.push(`company=${company}`) : null
    tipoDeIntervencion ? params.push(`tipoDeIntervencion=${tipoDeIntervencion}`) : null
    tipoDeTerminacion ? params.push(`tipoDeTerminacion=${tipoDeTerminacion}`) : null
    groupBy ? params.push(`groupBy=${groupBy}`) : null

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

    query = `/executive/aforosData?`
    query += params.join('&')
    fetch(query, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        aforosData: res
      })
    })

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    // fetch(`/statistics/avgCostByType`, {
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
    //     avgCostDataType: res
    //   })
    // })

    // fetch(`/statistics/avgCostByCompany`, {
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
    //     avgCostDataCompany: res
    //   })
    // })

    query = `/executive/realCostData?`
    query += params.join('&')

    fetch(query, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        costData: res
      })
    })

    query = `/executive/realCostData?`
    query += params.join('&')
    query += `&avg=1`

    fetch(query, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        costDataAverage: res
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

    // fetch(`/executive/estimatedIncreaseData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //     groupBy: 'type'
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     estIncData: res
    //   })
    // })

    // fetch(`/executive/estimatedIncreaseData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //     groupBy: 'well'
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     estIncWellData: res
    //   })
    // })


    // fetch(`/executive/estimatedIncreaseData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //     groupBy: 'field'
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     estIncFieldData: res
    //   })
    // })

    // fetch(`/executive/execTableData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //     groupBy: 'well'
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     execTableWellData: res
    //   })
    // })

    // fetch(`/executive/execTableData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //     groupBy: 'field'
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     execTableFieldData: res
    //   })
    // })

    // fetch(`/executive/volumenData`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     activo,
    //     field,
    //     well,
    //     formation,
    //   })
    // })
    // .then(res => res.json())
    // .then(res => {
    //   this.setState({
    //     volumenData: res
    //   })
    // })



  }


  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = globalAnalysis

    if (activo !== prev.activo || field !== prev.field || well !== prev.well || formation !== prev.formation ||
      company !== prev.company || tipoDeIntervencion !== prev.tipoDeIntervencion || tipoDeTerminacion !== prev.tipoDeTerminacion ||
      groupBy !== prev.groupBy) {
			this.fetchData()	
		}
  }

  render() {
    let { jobBreakdownData, aforosData, fieldWellOptions, costData, costDataAverage, countData, estIncData, 
      estIncWellData, estIncFieldData, execTableWellData, execTableFieldData, volumenData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()

    let { groupBy } = globalAnalysis

    return (
      <div className="data executive">
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="productionGraphs"
                title="Delta Production Graphs"
                ref={this.cards[0]}
              >
              <DeltaOil label='Oil' data={aforosData} groupBy={groupBy}/>
              <DeltaWater label='Water' data={aforosData} groupBy={groupBy} />
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
              <CostBar label={'Total'} data={costData} groupBy={groupBy}/>  
              <CostBar label={'Average'} data={costDataAverage} groupBy={groupBy}/>  
            </Card>
            <Card
                id="costDeviations"
                title="Cost Deviations"
                ref={this.cards[3]}
              >      
                <div>hi</div>   
{/*              <DeltaCostBar label={'Type'} data={costData} />
              <AvgDeltaCostBar label={'Avg Type'} data={avgCostDataType} />
              <DeltaCostCompanyBar label={'Company'} data={costData} />
              <AvgDeltaCostCompanyBar label={'Avg Company'} data={avgCostDataCompany} />*/}
            </Card>
          </CardDeck>
{/*          <ExecutiveTable aforosData={aforosData} costData={costData} countData={countData} estIncData={estIncData} />
          <ExecutiveTable2Well data={execTableWellData} estIncData={estIncWellData} aforosData={aforosData}/>*/}
         {/* <ExecutiveTable2Field data={execTableFieldData} estIncData={estIncWellData} /> */}
         {/* <ExecutiveTable3Well data={execTableWellData} estIncData={estIncWellData} aforosData={aforosData} volumenData={volumenData}/>*/}
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
