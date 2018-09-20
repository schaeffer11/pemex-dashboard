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

    let userid = this.refs.userid.value
    let userpwd = this.refs.userpwd.value

    this.setState({ isVerifying: true, error: false })
    this.forceUpdate()

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
        <div className="heading">
          <h2>Iniciar sesión</h2>
        </div>
        <div className="body">
          <div className="field">
            <label>
              <span>Usuario:</span>
              <input type="text" ref="userid" placeholder="" disabled={isVerifying} />
            </label>
          </div>

          <div className="field">
            <label>
              <span>Contraseña:</span>
              <input type="password" ref="userpwd" placeholder="" disabled={isVerifying} />
            </label>
          </div>
        </div>

        <div className="footer">
          <button className={classNames(isVerifying ? 'verifying' : '', 'submit')}>{ isVerifying ? 'Verifying...' : 'Iniciar sesión' }</button>
        </div>

        {errorMessage}
      </form>
    )
  }
}

export default LoginForm
