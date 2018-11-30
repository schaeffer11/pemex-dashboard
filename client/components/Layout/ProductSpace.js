// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputsUI from './InputsUI/InputsUI'
import DiagnosticosUI from './DiagnosticosUI/DiagnosticosUI'
import MapeoUI from './MapeoUI/MapeoUI'
import CompromisosUI from './CompromisosUI/CompromisosUI'
import ManageCompromisos from './CompromisosUI/ManageCompromisos'
import TableroDeControlUI from './TableroDeControlUI/TableroDeControlUI'
import HomeUI from './HomeUI/HomeUI'
import AdminUI from './AdminUI/AdminUI'
import { Route, Redirect } from 'react-router-dom'
import LoginForm from '../User/LoginForm'


@autobind class Productspace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      isAdmin: false,
    }
  }

  async componentDidMount(){
    // const { history } = this.props;
    // this.unsubscribeFromHistory = history.listen(this.handleLocationChange);
    // this.handleLocationChange(history.location);
    const isAdmin = await this.showAdminRoute()
    this.setState({ isAdmin })
  }

  async componentDidUpdate(prevProps){
    const { user } = this.props
    if (user !== prevProps.user) {
      const isAdmin = await this.showAdminRoute()

      this.setState({ isAdmin })
    }
  }

  async showAdminRoute() {
    const { user } = this.props
    if (user) {
      const token = user.get('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      }
      console.log('iciiii')
      const isAdmin = await fetch('/api/isAdmin', { headers }).then(r => r.json())
      console.log('am i an admin and allowed', isAdmin)
      const { success } = isAdmin
      return success
    }
    return false
  }

  render() {
    const { isAdmin } = this.state

    return (
        <div id="page-wrap" className="productspace">
          <PrivateRoute exact path="/carga_datos" component={InputsUI} user={this.props.user} />
          <PrivateRoute exact path="/diagnosticos" component={DiagnosticosUI} isAdmin={isAdmin} user={this.props.user} />
          <PrivateRoute exact path="/mapeo" component={MapeoUI} isAdmin={isAdmin} user={this.props.user} />
          <AdminPrivateRoute exact path="/administrar" component={AdminUI} isAdmin={isAdmin} user={this.props.user} />
          <PrivateRoute exact path="/compromisos" component={CompromisosUI} user={this.props.user} isAdmin={isAdmin} />
          <AdminPrivateRoute exact path="/compromisos/manage" component={ManageCompromisos} user={this.props.user} isAdmin={isAdmin} />
          <PrivateRoute path="/tablero_control" component={TableroDeControlUI} user={this.props.user} />
          <Route
            exact
            path="/"
            render={(props) => <HomeUI {...props} isAdmin={isAdmin} />}
          />
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

const PrivateRoute = ({ component: Component, user: user, ...properties, isAdmin }) => (
  <Route {...properties} render={(props) => (
    user !== null
      ? <Component {...props} isAdmin={isAdmin} />
      : <Redirect to={{pathname:'/', state: {referrer: props.location} }}/>
  )} />
)


const AdminPrivateRoute = ({ component: Component, isAdmin, ...properties}) => {
  console.log('da route', isAdmin)
    return <Route {...properties} render={(props) => (
      isAdmin
      ? <Component {...props} />
      : <Redirect to={{pathname:'/', state: {referrer: props.location} }}/>
    )} />
  }



