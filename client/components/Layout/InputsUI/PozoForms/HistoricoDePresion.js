import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

@autobind class HistoricoDePresion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors === undefined
      })
    }
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

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDePresion'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDePresion)
