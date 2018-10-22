
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AsyncSelect from 'react-select/lib/Async'
import Select from 'react-select'
import { connect } from 'react-redux'

import { setJob, setJobType } from '../../../../redux/actions/global'
import { sortLabels } from '../../../../lib/formatters'

@autobind class JobSelect extends Component {
  constructor(props) {
    super(props)

  }



  handleSelectJob(val) {
  	let { setJob, setJobType } = this.props
  	let value = val ? val.value : null
    let type = val ? val.type : null

  	setJob(value)
    setJobType(type)
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
  setJobType: val => dispatch(setJobType(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JobSelect)

