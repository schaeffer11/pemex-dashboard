import React, { Component } from 'react'
import autobind from 'autobind-decorator'

@autobind class EvaluacionPetrofisica extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  render() {


    return (
      <div className="form">
        I am a formmmmm EvaluacionPetrofisica
        <div style={{color: 'red'}}>TODO, add way to add one layer at a time</div>
        <div style={{color: 'red'}}>TODO: add upload well log file (image upload)</div>
      </div>
    )
  }
}


export default EvaluacionPetrofisica
