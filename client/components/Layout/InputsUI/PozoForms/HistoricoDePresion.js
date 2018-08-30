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
        I am a form HistoricoDePresion
        <div style={{color: 'red'}}>TODO: agregar opcion para subir campo pws vs tiempo (add upload campo pws vs tiempo) (image or csv??)</div>
        <div style={{color: 'red'}}>TODO: agregar opcion para subir pozo pws vs tiempo (add upload pozo pws vs tiempo) (image or csv??)</div>
      </div>
    )
  }
}


export default HistoricoDePresion
