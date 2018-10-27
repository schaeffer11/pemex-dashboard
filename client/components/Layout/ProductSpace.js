// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputsUI from './InputsUI/InputsUI'
import DiagnosticosUI from './DiagnosticosUI/DiagnosticosUI'
import CompromisosUI from './CompromisosUI/CompromisosUI'
import ManageCompromisos from './CompromisosUI/ManageCompromisos'
import TableroDeControlUI from './TableroDeControlUI/TableroDeControlUI'
import HomeUI from './HomeUI/HomeUI'
import { Route, Redirect } from 'react-router-dom'
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
    console.log('something happened?')
    return (
        <div className="productspace">
          <PrivateRoute exact path="/carga_datos" component={InputsUI} user={this.props.user} />
          <PrivateRoute exact path="/diagnosticos" component={DiagnosticosUI} user={this.props.user} />
          <PrivateRoute exact path="/compromisos" component={CompromisosUI} user={this.props.user} />
          <PrivateRoute exact path="/compromisos/manage" component={ManageCompromisos} user={this.props.user} />
          <PrivateRoute path="/tablero_control" component={TableroDeControlUI} user={this.props.user} />
          <Route exact path="/" component={HomeUI} />
          { this.props.user === null && (
            <div className="login">
              <div className="loginModal">
                <LoginForm loginAction={this.props.loginAction} user={this.props.user} />
              </div>
            </div>
          )}
        </div>
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


