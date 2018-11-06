import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'
import JobSelect from '../Common/JobSelect'
import Images from './Images'
import CostBar from './CostBar'
import VolumeBar from './VolumeBar'
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
      costData: [],
      estCostData: [],
      cedulaResultData: [],
      cedulaData: [],
      interventionData: [],
      interventionResultsData: [],
      aforoData: [],
      volumeData: [],
      estVolumeData: [],
      date: null
    }    
    this.cards = []
    for (let i = 0; i < 5; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchJobs() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well } = globalAnalysis

    let { token } = this.props

    fetch(`/api/getJobs?well=${well}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
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

  async fetchData() {
  	console.log('fetching')
    let { globalAnalysis, token } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { job, jobType } = globalAnalysis

    this.setState({
      estCostData: [],
      costData: [],
      imageData: null,
      cedulaData: [],
      cedulaResultData: [],
      interventionData: [],
      interventionResultsData: [],
      aforoData: [],
      date: null,
      volumeData: [],
      estVolumeData: []
    })

    let fieldWellOptionsQuery = `/api/getFieldWellMappingHasData`
    let estCostQuery = `/job/getEstCostData?transactionID=${job}`
    let costQuery = `/job/getCostData?transactionID=${job}`
    let cedulaQuery = `/job/getCedula?transactionID=${job}&type=${jobType}`
    let cedulaResultQuery = `/job/getCedulaResults?transactionID=${job}&type=${jobType}`
    let imageQuery = `/api/getInterventionImages?transactionID=${job}`
    let interventionQuery = `/job/getInterventionData?transactionID=${job}&type=${jobType}`
    let interventionResultsQuery = `/job/getInterventionResultsData?transactionID=${job}&type=${jobType}`
    let aforosQuery = `/job/getAforoData?transactionID=${job}`
    let volumeQuery = `/job/getVolumeData?transactionID=${job}&type=${jobType}`
    let estVolumeQuery = `/job/getEstimatedVolumeData?transactionID=${job}&type=${jobType}`

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
      const data = await Promise.all([
        fetch(estCostQuery, headers).then(r => r.json()),
        fetch(costQuery, headers).then(r => r.json()),
        fetch(cedulaQuery, headers).then(r => r.json()),
        fetch(cedulaResultQuery, headers).then(r => r.json()),
        fetch(imageQuery, headers).then(r => r.json()),
        fetch(interventionQuery, headers).then(r => r.json()),
        fetch(interventionResultsQuery, headers).then(r => r.json()),
        fetch(aforosQuery, headers).then(r => r.json()),
        fetch(volumeQuery, headers).then(r => r.json()),
        fetch(estVolumeQuery, headers).then(r => r.json())
      ])
        .catch(error => {
          console.log('err', error)
        })

      let newState = {
        estCostData: data[0],
        costData: data[1],
        cedulaData: data[2],
        cedulaResultData: data[3],
        imageData: data[4],
        interventionData: data[5],
        interventionResultsData: data[6],
        aforoData: data[7],
        data: data[6] ? data[6].FECHA_INTERVENCION : null,
        volumeData: data[8],
        estVolumeData: data[9]
      }

      this.setState(newState) 
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

  makeImages() {
    let { imageData } = this.state

    console.log('im hereeeeee', imageData)
    if (imageData && Object.keys(imageData).length > 0) {

      let out = Object.keys(imageData).map(i => {
        let obj = imageData[i]

        if (Array.isArray(obj)) {
          console.log(obj)
          return obj.map(j => {
            return <img label={`Lab - ${j.imgName.split('.')[2]}`} src={j.imgURL}></img> 
          })
        }
        else {
          return <img label={obj.imgName.split('.')[1]} src={obj.imgURL}></img>     
        }
      })

      return out.flat()

    }
    else {
      return <div>hi</div>
    }
  } 

  render() {
    let { fieldWellOptions, jobOptions, imageData, costData, estCostData, volumeData, estVolumeData, cedulaData, cedulaResultData, date, aforoData, interventionData, interventionResultsData } = this.state
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
                id="volumes"
                title="Estimated Vs Actual Volumes"
                ref={this.cards[1]}
              >          
              <VolumeBar estData={estVolumeData} data={volumeData} />
            </Card>
            <Card
                id="simulationResults"
                title="Simulation Results"
                ref={this.cards[2]}
              >          
              <SimulationTreatmentTable type={jobType} interventionData={interventionData} interventionResultsData={interventionResultsData} />
            </Card>            
            <Card
                id="aforos"
                title="Aforos"
                ref={this.cards[3]}
              >          
              <AforoScatter data={aforoData} interventionDate={date}/>   
            </Card>
            <Card
                id="images"
                title="Images"
                ref={this.cards[4]}
              >
              {this.makeImages()}
            </Card>
          </CardDeck>
          <div style={{height: '500px'}}/>
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
