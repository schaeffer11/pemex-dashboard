
import React from 'react'
import { connect } from 'react-redux'

const WellSelect = ({ wellOptions, well }) => {
    wellOptions = wellOptions.toJS()
    let selectedWell = wellOptions.find(i => i.value === well)
  return (
    <h1>
      Pozo - {selectedWell ? selectedWell.label : ''}
    </h1>
  )
}

const mapStateToProps = state => ({
  globalAnalysis: state.get('globalAnalysis'),
  wellOptions: state.getIn(['filters', 'well']),
  well: state.getIn(['globalAnalysis', 'well']),
})

export default connect(mapStateToProps)(WellSelect)
