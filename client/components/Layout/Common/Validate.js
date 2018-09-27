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

    setAllFieldsAsChecked(){
      const data = this.formData.toJS();
      const allFields = Object.keys(data)
      return allFields
    }

    validate(field, values){
      const errors = validationFunction(values)
 

      let checked  = this.formData.get('checked') ? this.formData.get('checked') : []
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

    validateAll(values){
      return this.validate(null, values)
    }

    forceValidation(){
      const values = this.formData.toJS();
      let {errors} = this.validateAll(values)
      let checked = this.setAllFieldsAsChecked()
  
      return {errors, checked} 
    }

    render(){
      const {forwardedRef, ...rest} = this.props;

      return (<WrappedComponent setAllFieldsAsChecked={this.setAllFieldsAsChecked} forceValidation={this.forceValidation} validate={this.validate} validateAll={this.validateAll} ref={forwardedRef} {...rest}/>);
    }
  }

  return React.forwardRef((props, ref) => {
    return <Validate {...props} forwardedRef={ref} />;
  })
}

