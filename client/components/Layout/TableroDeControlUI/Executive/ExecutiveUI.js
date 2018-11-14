import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import JobBreakdown from './JobBreakdown'
import DeltaOil from './DeltaOil'
import DeltaWater from './DeltaWater'
import DeltaGas from './DeltaGas'
import Filters from '../Common/Filters'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import DeltaCostBar from './DeltaCostBar'
import AvgDeltaCostBar from './AvgDeltaCostBar'
import ExecutiveTable from './ExecutiveTable'

@autobind class executiveUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	jobBreakdownData: [],
      aforosData: [],
      aforosCarouselData: [],
      costData: [],
      costDataAverage: [],
      singularCostData: [],
      execTableData: [],
      estIncData: [],
      volumeData: []
    }

    this.cards = []
    for (let i = 0; i < 4; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  async fetchData() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { subdireccion, activo, field, well, formation, company, interventionType, terminationType, groupBy } = globalAnalysis

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }


    let params = []
    let query

    subdireccion ? params.push(`subdir=${subdireccion}`) : null
    activo ? params.push(`activo=${activo}`) : null
    field ? params.push(`field=${field}`) : null
    well ? params.push(`well=${well}`) : null
    formation ? params.push(`formation=${formation}`) : null
    company ? params.push(`company=${company}`) : null
    interventionType ? params.push(`tipoDeIntervencion=${interventionType}`) : null
    terminationType ? params.push(`tipoDeTerminacion=${terminationType}`) : null
    groupBy ? params.push(`groupBy=${groupBy}`) : null

    //TODO: MAKE PARALLEL
    let jobQuery = `/executive/jobBreakdown?` + params.join('&')
  	let aforosQuery = `/executive/aforosData?` + params.join('&')
    let aforosCarouselQuery = `/executive/aforosData?` + params.join('&') + `&carousel=1`
    let costQuery = `/executive/costData?` + params.join('&')
    let avgCostQuery = `/executive/costData?` + params.join('&') + `&avg=1`
    let singularCostQuery = `/executive/costData?` + params.join('&') + `&noGroup=1`
    let execTableQuery = `/executive/tableData?` + params.join('&')
    let estIncQuery = `/executive/estIncData?` + params.join('&')
    let volumeQuery = `/executive/volumeData?` + params.join('&')

    const data = await Promise.all([
      fetch(jobQuery, headers).then(r => r.json()),
      fetch(aforosQuery, headers).then(r => r.json()),
      fetch(aforosCarouselQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      fetch(avgCostQuery, headers).then(r => r.json()),
      fetch(singularCostQuery, headers).then(r => r.json()),
      fetch(execTableQuery, headers).then(r => r.json()),
      fetch(estIncQuery, headers).then(r => r.json()),
      fetch(volumeQuery, headers).then(r => r.json())
    ])
      .catch(error => {
        console.log('err', error)
      })


    let newState = {
      jobBreakdownData: data[0],
      aforosData: data[1],
      aforosCarouselData: data[2],
      costData: data[3],
      costDataAverage: data[4],
      singularCostData: data[5], 
      execTableData: data[6],
      estIncData: data[7],
      volumeData: data[8]
    }

    this.setState(newState)

  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { subdireccion, activo, field, well, formation, company, interventionType, terminationType, groupBy } = globalAnalysis

    if (subdireccion !== prev.subdireccion || activo !== prev.activo || field !== prev.field || well !== prev.well || formation !== prev.formation ||
      company !== prev.company || interventionType !== prev.interventionType || terminationType !== prev.terminationType ||
      groupBy !== prev.groupBy) {
			this.fetchData()	
		}
  }

  render() {
    let { jobBreakdownData, aforosData, aforosCarouselData, costData, costDataAverage, singularCostData, execTableData, estIncData, volumeData } = this.state
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { groupBy } = globalAnalysis

    console.log(aforosData)

    return (
      <div className="data executive">
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="productionGraphs"
                title="Delta Production Graphs"
                ref={this.cards[0]}
              >
              <DeltaOil label='Oil' data={aforosData} groupBy={groupBy} />
              <DeltaWater label='Water' data={aforosData} groupBy={groupBy} />
              <DeltaGas label='Gas' data={aforosData} groupBy={groupBy} />
            </Card>
            <Card
                id="classifications"
                title="Classification"
                ref={this.cards[1]}
                multiplyChartsOnGrouping
              >
              <JobBreakdown label='Job Type' data={jobBreakdownData} />
              <JobBreakdown label='Success' data={aforosCarouselData} />
            </Card>
            <Card
                id="costs"
                title="Costs"
                ref={this.cards[2]}
              >
              <CostBar label={'Total'} data={costData} groupBy={groupBy} />  
              <CostBar label={'Average'} data={costDataAverage} groupBy={groupBy} />  
            </Card>
            <Card
                id="costDeviations"
                title="Cost Deviations"
                ref={this.cards[3]}
              >       
              <DeltaCostBar label={'Total'} data={singularCostData} groupBy={groupBy} />
              <AvgDeltaCostBar label={'Avg'} data={costDataAverage} groupBy={groupBy} />
            </Card>
          </CardDeck>
          <ExecutiveTable data={execTableData} estIncData={estIncData} aforosData={aforosData} volumeData={volumeData} groupBy={groupBy} />
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
    
