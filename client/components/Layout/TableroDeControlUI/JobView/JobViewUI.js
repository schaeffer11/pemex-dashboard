import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'
import JobSelect from '../Common/JobSelect'
import Images from './Images'
import CostBar from './CostBar'
import CostKPIs from './CostKPIs'
import SimulationTreatmentTable from './SimulationTreatmentTable'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import AforoScatter from './AforoScatter'

@autobind class jobViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      jobOptions: [],
      imageData: [],
      costData: [],
      estCostData: [],
      cedulaResultData: [],
      cedulaData: [],
      interventionData: [],
      interventionResultsData: [],
      aforoData: [],
      date: null
    }    
    this.cards = []
    for (let i = 0; i < 4; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchJobs() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well } = globalAnalysis

    let { token } = this.props

    fetch('/api/getJobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        well
      })
    })
      .then(r => r.json())
      .then(r => {
        let jobs = []

        r = r.sort((a, b) => {
          return a.FECHA_PROGRAMADA_INTERVENCION - b.FECHA_PROGRAMADA_INTERVENCION
        })

        r.forEach(i => {
          let date = new Date(i.FECHA_PROGRAMADA_INTERVENCION)
          date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          let type = i.TIPO_DE_INTERVENCIONES
          type = type.charAt(0).toUpperCase() + type.substr(1)
          jobs.push({
            type: type,
            date: date,
            transID: i.TRANSACTION_ID,
          })
        })
        
        jobs = jobs.map(i => ({
          label: `${i.type} ${i.date}`, value: i.transID, type: i.type
        }))

        this.setState({
          jobOptions: jobs
        })
    })
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { job, jobType } = globalAnalysis

    this.setState({
      estCostData: [],
      costData: [],
      imageData: [],
      cedulaData: [],
      cedulaResultData: [],
      interventionData: [],
      interventionResultsData: []
    })
    
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

    if (job) {

      fetch(`/job/getEstCostData?transactionID=${job}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          estCostData: res
        })
      })

      fetch(`/job/getCostData?transactionID=${job}`, {
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


      fetch(`/api/getInterventionImages?transactionID=${job}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          imageData: res
        })
      })

      fetch(`/job/getCedula?transactionID=${job}&type=${jobType}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          cedulaData: res
        })
      })

      fetch(`/job/getCedulaResults?transactionID=${job}&type=${jobType}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          cedulaResultData: res
        })
      })

      fetch(`/job/getInterventionData?transactionID=${job}&type=${jobType}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          interventionData: res
        })
      })

      fetch(`/job/getInterventionResultsData?transactionID=${job}&type=${jobType}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          interventionResultsData: res,
          date: res ? res[0].FECHA_INTERVENCION : null
        })
      })

      fetch(`/job/getAforoData?transactionID=${job}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          aforoData: res
        })
      })

    }

  }

  componentDidMount() {
  	this.fetchData()
    this.fetchJobs()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()

		let { well, job } = globalAnalysis
    let wellPrev = prevGlobalAnalysis.well
    let jobPrev = prevGlobalAnalysis.job

    if (well !== wellPrev) {
			this.fetchJobs()	
		}
    if (job !== jobPrev) {
      this.fetchData()
    }
  }

  render() {
    let { fieldWellOptions, jobOptions, imageData, costData, estCostData, cedulaData, cedulaResultData, date, aforoData, interventionData, interventionResultsData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()
    let { job, jobType } = globalAnalysis

    console.log('images', imageData)
    console.log('costs', costData)
    console.log('est costs', estCostData)
    console.log('cedula', cedulaData)
    console.log('cedula results', cedulaResultData)
    console.log('intervention', interventionData)
    console.log('intervention results', interventionResultsData)
    console.log('aforo data', aforoData)
    console.log('date', date)

    return (
      <div className="data job-view">
        <div className='header' >
          <WellSelect fieldWellOptions={fieldWellOptions}/>
          <JobSelect options={jobOptions}/>
        </div>
        <div className='content'>
          <CostKPIs estData={estCostData} data={costData} />
          <CardDeck className="content-deck">
            <Card
                id="costs"
                title="Estimated Vs Actual Costs"
                ref={this.cards[0]}
              >          
              <CostBar estData={estCostData} data={costData} />
            </Card>
            <Card
                id="simulationResults"
                title="Simulation Results"
                ref={this.cards[1]}
              >          
              <SimulationTreatmentTable type={jobType} interventionData={interventionData} interventionResultsData={interventionResultsData} />
            </Card>            
            <Card
                id="aforos"
                title="Aforos"
                ref={this.cards[2]}
              >          
              <AforoScatter data={aforoData} interventionDate={date}/>   
            </Card>
            <Card
                id="images"
                title="Images"
                ref={this.cards[3]}
              >          
              <Images data={imageData} />  
 
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

export default connect(mapStateToProps, mapDispatchToProps)(jobViewUI)
