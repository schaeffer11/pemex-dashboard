
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AsyncSelect from 'react-select/lib/Async'
import Select, { components } from 'react-select'
import { connect } from 'react-redux'

import { setJob, setJobType } from '../../../../redux/actions/global'
import { sortLabels } from '../../../../lib/formatters'

const Group = props => (
  <div>
    <components.Group {...props} />
  </div>
)

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
    const { options } = this.props
    return (
	      <div className='well-selector' >
	        Tratamiento
          <Select
            isClearable
            options={options}
            onChange={this.handleSelectJob}
            components={{Group}}
          />
	      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
	setJob: val => dispatch(setJob(val)),
  setJobType: val => dispatch(setJobType(val)),
})

export default connect(null, mapDispatchToProps)(JobSelect)

