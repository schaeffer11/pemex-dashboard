// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputsUI from './InputsUI/InputsUI'
import DiagnosticosUI from './DiagnosticosUI/DiagnosticosUI'
import HomeUI from './HomeUI/HomeUI'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import LoginForm from '../User/LoginForm'


@autobind class Productspace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    let { } = this.props
  }

  render() {
    const onPage = this.props.onPage || 'sample_page'
    const { isLoading } = this.state

    return (
      <BrowserRouter>
        <div className="productspace">
          <PrivateRoute exact path="/inputs" component={InputsUI} user={this.props.user} />
          <PrivateRoute exact path="/diagnosticos" component={DiagnosticosUI} user={this.props.user} />
          <Route exact path="/" component={HomeUI} />

          { this.props.user === null && (
            <div className="login">
              <div className="loginModal">
                <LoginForm loginAction={this.props.loginAction} user={this.props.user} />
              </div>
            </div>
          )}
        </div>
      </BrowserRouter>
    )
  }
}

export default Productspace

const PrivateRoute = ({ component: Component, user: user, ...properties}) => (
  <Route {...properties} render={(props) => (
    user !== null
      ? <Component {...props} />
      : <Redirect to={{pathname:'/', state: {referrer: props.location} }}/>
  )} />
)


