import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import JobBreakdown from './JobBreakdown'
import DeltaOil from './DeltaOil'
import DeltaWater from './DeltaWater'
import ClassificationBreakdown from './ClassificationBreakdown'
import Filters from '../Common/Filters'

@autobind class executiveUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
    	jobBreakdownData: [],
      aforosData: []
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, field, well, formation } = globalAnalysis

    console.log(activo, field, well, formation)
    //TODO MAKE PARALLEL
  	fetch(`/executive/jobBreakdown`)
  	.then(res => res.json())
  	.then(res => {
  		console.log(res)
	  	this.setState({
	  		jobBreakdownData: res
	  	})
  	})

    fetch(`/executive/aforosData`)
    .then(res => res.json())
    .then(res => {
      console.log(res)
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

    fetch('/api/getFieldWellMapping', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })



  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    console.log('updated')
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()


		let { activo, field, well, formation } = globalAnalysis
    let activoPrev = globalAnalysis.activo
    let fieldPrev = globalAnalysis.field
    let wellPrev = globalAnalysis.well
    let formationPrev = globalAnalysis.formation

    if (activo !== activoPrev || field !== fieldPrev || well !== wellPrev || formation !== formationPrev) {
			this.fetchData()	
		}
  }

  render() {
    let { jobBreakdownData, aforosData, fieldWellOptions } = this.state

    return (
      <div className="home">
        <Filters fieldWellOptions={fieldWellOptions} />
      	<JobBreakdown data={jobBreakdownData} />
        <ClassificationBreakdown data={aforosData} />
        <DeltaOil data={aforosData} />
        <DeltaWater data={aforosData} />
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
