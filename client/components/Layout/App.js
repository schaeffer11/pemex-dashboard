// imports
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Productbar from './ProductBar'
import Productspace from './ProductSpace'
import LoginForm from '../User/LoginForm'
import { login, logout } from '../../redux/actions/user'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'


const App = ({ user, loginAction, logoutAction, app }) => {
  const body = user !== null
    ? <Productspace />
    : <LoginForm loginAction={loginAction} user={user} />

  return (
    <BrowserRouter>
      <div id="outer-container" className={classnames('pemex-app', { 'logged-in': !!user }, { 'logged-out': !user })}>
        <Productbar app={app} user={user} logoutAction={logoutAction} />
        <Productspace app={app} user={user} loginAction={loginAction} />
      </div>
    </BrowserRouter>
  )
}


const mapStateToProps = state => ({
  username: state.getIn(['user', 'name']),
  user: state.get('user'),
  app: state.get('app'),
})

const mapDispatchToProps = dispatch => ({
  logoutAction: () => dispatch(logout()),
  loginAction: user => dispatch(login(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
