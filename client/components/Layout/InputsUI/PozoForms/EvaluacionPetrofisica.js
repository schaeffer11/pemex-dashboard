import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

@autobind class EvaluacionPetrofisica extends Component {
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
        <div style={{color: 'red'}}>TODO: agregar manera de agregar una capa a la vez (add way to add one layer at a time)</div>
        <div style={{color: 'red'}}>TODO: agregar opcion para la evaluacion petrofisica (add upload well log file) (image upload)</div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('evaluacionPetrofisica'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EvaluacionPetrofisica)
