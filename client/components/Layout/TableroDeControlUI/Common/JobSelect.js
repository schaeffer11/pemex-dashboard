
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AsyncSelect from 'react-select/lib/Async'
import Select from 'react-select'
import { connect } from 'react-redux'

import { setJob } from '../../../../redux/actions/global'
import { sortLabels } from '../../../../lib/formatters'

@autobind class JobSelect extends Component {
  constructor(props) {
    super(props)

  }



  handleSelectJob(val) {
  	let { setJob } = this.props
  	let value = val ? val.value : null

  	setJob(value)
  }

  render() {
    let { globalAnalysis, options } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { job } = globalAnalysis

  
  	const realJob = options.find(i=>i.value === job) || null

    return (
	      <div className='well-selector' >
	        Jobs
          <Select
	          value={realJob}
            options={options}
	          onChange={this.handleSelectJob}
	          isClearable = {true}
	        />
	      </div>
    )
  }
}

const mapStateToProps = state => ({
	globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({
	setJob: val => dispatch(setJob(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JobSelect)

