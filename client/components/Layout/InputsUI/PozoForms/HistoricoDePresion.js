import React, { Component } from 'react'
import autobind from 'autobind-decorator'

@autobind class HistoricoDePresion extends Component {
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
        I am a formmmmm HistoricoDePresion
        <div style={{color: 'red'}}>TODO: add upload campo pws vs tiempo (image or csv??)</div>
        <div style={{color: 'red'}}>TODO: add upload pozo pws vs tiempo (image or csv??)</div>
      </div>
    )
  }
}


export default HistoricoDePresion
