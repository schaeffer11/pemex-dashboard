// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import API from '../../lib/api-store'
import { Redirect } from 'react-router-dom';
import classNames from 'classnames'

@autobind class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVerifying: false,
      error: undefined,
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.refs.userid.focus()
  }

  componentWillUnmount() {
    this._isMounted = false
  }
 
  attemptLogin(e) {
    e.preventDefault()

    console.log('hihih')
    let userid = this.refs.userid.value
    let userpwd = this.refs.userpwd.value

    this.setState({ isVerifying: true, error: false })
    this.forceUpdate()
    console.log('calling auth')

    API
      .auth({ userid, userpwd })
      .then((user) => {
        console.log('attempting to login user': userid)
        const { loginAction } = this.props
        if (user.error) {
          throw user.error
        }
        if (this._isMounted) {
          loginAction(user)
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          console.log('Login Error', error.message)
          this.setState({ isVerifying: false, error })
          this.forceUpdate()
        }
      })
  }

  render() {
    const { error, isVerifying } = this.state
    const errorMessage = error
      ? <p className="error login-error">{error.message}</p>
      : null

    return (
      <form className={classNames('login-form', { error })} onSubmit={this.attemptLogin}>
        <label>
          <span>User ID <small>(usually an email address)</small></span>
          <input type="text" ref="userid" placeholder="Enter a user ID" disabled={isVerifying} />
        </label>

        <label>
          <span>Password</span>
          <input type="password" ref="userpwd" placeholder="Enter your password" disabled={isVerifying} />
        </label>

        <button className={isVerifying ? 'verifying' : ''}>{ isVerifying ? 'Verifying...' : 'Login' }</button>

        {errorMessage}
      </form>
    )
  }
}

export default LoginForm
