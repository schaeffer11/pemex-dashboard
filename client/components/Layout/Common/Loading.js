import React from 'react'
import { connect } from 'react-redux'
import { ScaleLoader } from 'react-spinners'


const Loading = ({ isLoading, loadText }) => {
  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="loader-div">
          <h1>{loadText}</h1>
          <ScaleLoader
            className="loader"
            sizeUnit={"px"}
            color={'#d2d2d2'}
            loading={true}
          />
        </div>
      </div>
    )
  }
  return null
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['global', 'isLoading']),
  loadText: state.getIn(['global', 'loadText']),
})

export default connect(mapStateToProps)(Loading)
