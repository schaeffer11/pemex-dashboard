
import React from 'react'
import { connect } from 'react-redux'

const WellSelect = ({ wellOptions, well }) => {
    wellOptions = wellOptions.toJS()
    let selectedWell = wellOptions.find(i => i.value === well)
  return (
    <div style={{fontSize: '26px', fontWeight: 'bold', paddingBottom: '10px'}}>
      Pozo:  <span style={{fontWeight: 'normal'}}> {selectedWell ? selectedWell.label : ''} </span>
    </div>
  )
}

const mapStateToProps = state => ({
  globalAnalysis: state.get('globalAnalysis'),
  wellOptions: state.getIn(['filters', 'well']),
  well: state.getIn(['globalAnalysis', 'well']),
})

export default connect(mapStateToProps)(WellSelect)
