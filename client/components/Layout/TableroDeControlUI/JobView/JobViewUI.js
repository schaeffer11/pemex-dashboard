import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'


import WellSelect from '../Common/WellSelect'
import JobSelect from '../Common/JobSelect'
import Images from './Images'

@autobind class jobViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      jobOptions: [],
      imageData: []
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
          label: `${i.type} ${i.date}`, value: i.transID
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
    let { job } = globalAnalysis

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
    let { fieldWellOptions, jobOptions, imageData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()
    let { job } = globalAnalysis

    console.log('images', imageData)

    return (
      <div className="data job-view">
        <div className='header' >
          <WellSelect fieldWellOptions={fieldWellOptions}/>
          <JobSelect options={jobOptions}/>
        </div>
        <div className='content'>
          {job}
          <Images data={imageData} />
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
