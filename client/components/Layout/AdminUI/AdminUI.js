import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'

@autobind class AdminUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newFirstPassword: '',
      newSecondPassword: '',
      isCorrectPassword: false,
    }
  }

  async componentDidMount() {
    const { token } = this.props
    console.log('token?', token)
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    const data = await fetch('/api/activo', { headers }).then(r => r.json())
    console.log('da data', data)
  }

  handleNewUsername(e) {
    const { value } = e.target
    const regex = /^[a-zA-z0-9]+(?:[-_.]\S?[a-zA-z0-9]+)*$/
    const usernameMeetsCriteria = regex.test(value)
    this.setState({ newUsername: value })
    this.setState({ isCorrectUsername: usernameMeetsCriteria })
  }

  handleNewPassword(e, statePass) {
    const { value } = e.target
    const regex = /^([a-zA-Z0-9!@#$%^&*]{8,15})$/
    const passwordMeetsCriteria = regex.test(value)
    this.setState({ [statePass]: value }, () => {
      const { newFirstPassword, newSecondPassword } = this.state
      const isEqual = newFirstPassword === newSecondPassword
      this.setState({ isCorrectPassword: passwordMeetsCriteria && isEqual })
    })
  }

  createNewUser() {
    const { newUsername, newFirstPassword, newSecondPassword, isCorrectPassword } = this.state
    console.log('username and pass', isCorrectPassword)
    return (
      <div>
        <h2>Crear Usuario</h2>
        <div>
          <label htmlFor="">username</label>
          <input autoComplete="off" type="text" value={newUsername} onChange={this.handleNewUsername}/>
        </div>
        <div>
          <label htmlFor="">password 1</label>
          <input autoComplete="off" type="password" value={newFirstPassword} onChange={e => this.handleNewPassword(e, 'newFirstPassword')}/>
        </div>
        <div>
          <label htmlFor="">password 2</label>
          <input autoComplete="off" type="password" value={newSecondPassword} onChange={e => this.handleNewPassword(e, 'newSecondPassword')}/>
        </div>
        <div>
          <label htmlFor="">Subdireccion</label>
          <input autoComplete="off" type="password" value={newSecondPassword} onChange={e => this.handleNewPassword(e, 'newSecondPassword')}/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div style={{ color: 'white' }}>
        <h1>Administrar Usuarios</h1>
        {this.createNewUser()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
})

export default connect(mapStateToProps)(AdminUI)