
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AsyncSelect from 'react-select/lib/Async'
import Select from 'react-select'
import { connect } from 'react-redux'

import { setActivo, setField, setWell, setFormation } from '../../../../redux/actions/global'
import { sortLabels } from '../../../../lib/formatters'

@autobind class WellSelect extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      wellOptions: []
    }
  }

  componentDidMount() {
    this.createOptions()
  }

  componentDidUpdate(prevProps) {
    let { fieldWellOptions } = this.props
    
    if (fieldWellOptions !== prevProps.fieldWellOptions) {
      this.createOptions()  
    }
  }

  createOptions() {
    let { fieldWellOptions } = this.props

    let wellOptions = []

    if (fieldWellOptions.length > 0) {
      let usedWells = []
      let wells = []
      fieldWellOptions.forEach(i => {
        if (!usedWells.includes(i.WELL_FORMACION_ID)) {
          usedWells.push(i.WELL_FORMACION_ID)
          wells.push(i)
        }
      })

      wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)
    }
    this.setState({
      wellOptions: wellOptions
    })
  }

  filterOptions(input, callback) {
    let { wellOptions } = this.state
    let options = []
    let limit = 1

    input = input.toLowerCase()

    options = input.length < limit ? [] : options = wellOptions.filter(i => i.label.toLowerCase().startsWith(input))

    callback(options)
  }

  handleSelectWell(val) {
  	let { setWell } = this.props
  	let value = val ? val.value : null

  	setWell(value)
  }

  render() {
    let { wellOptions } = this.state
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well } = globalAnalysis

    // let options = wellOptions.filter(i => i.value === well)
  	const realWell = wellOptions.find(i=>i.value === well) || null

    return (
	      <div className='well-selector' >
	        Well
{/*	        <AsyncSelect*/}
{/*            loadOptions={this.filterOptions}*/}
            {/*options={options}*/}
          <Select
	          value={realWell}
            options={wellOptions}
	          onChange={this.handleSelectWell}
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
	setActivo: val => dispatch(setActivo(val)),
	setField: val => dispatch(setField(val)),
	setWell: val => dispatch(setWell(val)),
	setFormation: val => dispatch(setFormation(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WellSelect)

