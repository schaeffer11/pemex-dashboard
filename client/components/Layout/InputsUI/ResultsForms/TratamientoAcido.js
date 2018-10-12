import React, { Component } from 'react'
import autobind from 'autobind-decorator'

class TratamientoAcido extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        tratamientoCompany: {
          type: 'text',
          value: '',
        },
        tipoDeEstimulacion: {
          type: 'text',
          value: '',
        },
        tipoDeColocacion: {
          type: 'text',
          value: '',
        },
        tiempoDeContacto: {
          type: 'number',
          value: '',
        },
        cedulaTable: {
          type: 'table',
          value: '',
        },
      }
    }
  }

  render() {
    return (
      <h1>Welcome to the Machine - Acido</h1>
    )
  }
}

export default TratamientoAcido
