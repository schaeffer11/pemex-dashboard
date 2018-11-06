import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'



@autobind class overviewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 

    }

  }

  
  render() {


    return (
      <div className="data overview">
        overview page
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

export default connect(mapStateToProps, mapDispatchToProps)(overviewUI)

