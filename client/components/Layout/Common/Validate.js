import React, { Component } from 'react'
import { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

export function withValidate(validationFunction, WrappedComponent) {
    class Validate extends React.Component {
    
    constructor(props, context) {
      super(props, context)

    }

    componentDidMount(){
    }

    componentDidUpdate(){
    }

    containsErrors(){
      let foundErrors = false
      for (const key of Object.keys(this.state.errors)) {
        if(this.state.errors[key].checked)
          foundErrors = true
      }

      if(foundErrors !== this.state.containsErrors){
        this.setState({
          containsErrors: foundErrors
        })
      }
    }

    validate(field, values){
      const errors = validationFunction(values)
 

      let checked  = this.formData.get('checked') ? this.formData.get('checked').toJS() : []
      if(checked.indexOf(field) === -1)
        checked = [...checked, field]

      checked.forEach(field => {
        if(errors[field])
          errors[field].checked = true
      })

      return {
        errors: errors,
        checked: checked
      }
    }

    render(){
      const {forwardedRef, ...rest} = this.props;

      return (<WrappedComponent validate={this.validate} ref={forwardedRef} {...rest}/>);
    }
  }

  return React.forwardRef((props, ref) => {
    return <Validate {...props} forwardedRef={ref} />;
  })
}

