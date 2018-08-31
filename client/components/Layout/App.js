// imports
import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Productbar from './ProductBar'
import Productspace from './ProductSpace'
import LoginForm from '../User/LoginForm'
import { login, logout } from '../../redux/actions/user'


const App = ({ children, user, username, loginAction, logoutAction, userActions, app, match }) => {
  const body = user !== null
    ? <Productspace /> // <Productspace onPage={match.params.page} />
    : <LoginForm loginAction={loginAction} user={user} />

  return (
    <div className={classnames('pemex-app', { 'logged-in': !!user }, { 'logged-out': !user })}>
      <Productbar app={app} user={user} logoutAction={logoutAction} />
      <Productspace app={app} user={user} loginAction={loginAction} />
    </div>
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

// export default connect({
//   props: {
//     username: 'user.name', // returns single name value from user register as 'username' prop
//     user: 'user', // returns entire user register as 'user' prop
//     app: 'app', // returns entire app register as 'app' prop
//   },
//   dispatchers: {
//     userActions: 'user', // returns all user actions as 'userActions' prop
//     loginAction: 'user.login', // returns single login action from user register as 'loginAction' prop
//     logoutAction: 'user.logout', // returns single logout action from user register as 'logoutAction' prop
//   },
// })(App)
