import React, { Component } from 'react'
import autobind from 'autobind-decorator'

class TratamientoApuntalado extends Component {
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
      <h1>Welcome to the Machine - Apuntalado</h1>
    )
  }
}

export default TratamientoApuntalado
