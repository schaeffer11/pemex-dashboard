import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import JobBreakdown from './JobBreakdown'

@autobind class executiveUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	jobBreakdownData: []
    }
  }

  fetchData() {
  	console.log('fetching')
  	fetch(`/executive/jobBreakdown`)
  	.then(res => res.json())
  	.then(res => {
  		console.log(res)
	  	this.setState({
	  		jobBreakdownData: res
	  	})
  	})

  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
		if (false) {
			this.fetchData()	
		}
  }

  render() {
    let { jobBreakdownData } = this.state

    return (
      <div className="home">
      	<JobBreakdown data={jobBreakdownData} />
      </div>
    )
  }
}


export default executiveUI
