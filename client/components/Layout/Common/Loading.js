import React from 'react'
import { connect } from 'react-redux'
import { ScaleLoader } from 'react-spinners'


const Loading = ({ isLoading }) => {
  // const isLoading = true
  console.log('looking for something?', isLoading)
  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="loader-div">
          <h1>Cargando</h1>
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
})

export default connect(mapStateToProps)(Loading)
