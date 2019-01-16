import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import objectPath from 'object-path'
import Select from 'react-select'
import CreateWell from './CreateWell'

@autobind class AdminUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // create user
      newUsername: '',
      newFirstPassword: '',
      newSecondPassword: '',
      subdireccion: '',
      activo: '',
      isCorrectPassword: false,
      isEqualPassword: false,
      isCorrectUsername: false,
      usernameIsUnique: false,
      isAdmin: { value: 0, label: 'No'},
      subdirecciones: {},
      // change password
      newFirstChangePassword: '',
      newSecondChangePassword: '',
      usernameChangePassword: '',
      isCorrectChangePassword: false,
      isEqualChangePassword: false,
      users: [],
    }
  }

  async componentDidMount() {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    const subdireccionData = await fetch('/api/activo', { headers }).then(r => r.json())
    const users = await fetch('/api/users', { headers }).then(r => r.json())
    const subdirecciones = {}
    subdireccionData.forEach(elem => {
      const { SUBDIRECCION_NAME, SUBDIRECCION_ID, ACTIVO_NAME, ACTIVO_ID } = elem
      objectPath.set(subdirecciones,  `sub_${SUBDIRECCION_ID}.id`, SUBDIRECCION_ID)
      objectPath.set(subdirecciones,  `sub_${SUBDIRECCION_ID}.name`, SUBDIRECCION_NAME)
      objectPath.push(subdirecciones, `sub_${SUBDIRECCION_ID}.activos`, { 
        name: ACTIVO_NAME, 
        id: ACTIVO_ID, 
      })
    })
    this.setState({ subdirecciones, users: users.results })
  }

  handleNewUsername(e) {
    const { value } = e.target
    const regex = /^[a-zA-z0-9]+(?:[-_.]\S?[a-zA-z0-9]+)*$/
    const usernameMeetsCriteria = regex.test(value) && value.length > 5
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
      this.setState({ isCorrectPassword: passwordMeetsCriteria, isEqualPassword: isEqual })
    })
  }

  handleNewChangePassword(e, statePass) {
    const { value } = e.target
    const regex = /^([a-zA-Z0-9!@#$%^&*]{8,15})$/
    const passwordMeetsCriteria = regex.test(value)
    this.setState({ [statePass]: value }, () => {
      const { newFirstChangePassword, newSecondChangePassword } = this.state
      const isEqual = newFirstChangePassword === newSecondChangePassword
      this.setState({ isCorrectChangePassword: passwordMeetsCriteria, isEqualChangePassword: isEqual })
    })
  }

  checkUsernameUniqueness() {
    const { newUsername, users } = this.state
    const isUnique = users.filter(user => {
      return user.username === newUsername
    }).length === 0
    this.setState({ usernameIsUnique: isUnique })
  }

  changePassword() {
    const { token } = this.props
    const canChangePassword = this.getCanChangePassword()
    if (canChangePassword) {
      const { newFirstChangePassword, usernameChangePassword } = this.state
      const headers = {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      }
      const body = {
        username: usernameChangePassword.value,
        password: newFirstChangePassword,
      }
      fetch('/auth/changePassword', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then(r => r.json())
        .then((r) => {
          if (r.success) {
            this.setState({
              newFirstChangePassword: '',
              newSecondChangePassword: '',
              usernameChangePassword: '',
              isCorrectChangePassword: false,
              isEqualChangePassword: false,
            })
          } else {
            console.log('Something went wrong')
          }
        })
    }
  }

  createNewUser() {
    const { token } = this.props
    const canSubmit = this.getCanSbumitNewUser()
    if (canSubmit) {
      const { newUsername, newFirstPassword, isAdmin, subdireccion, activo } = this.state
      const headers = {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      }
      const body = {
        username: newUsername,
        password: newFirstPassword,
        isAdmin: isAdmin.value,
      }
      if (subdireccion !== '' && activo !== '') {
        body.subdireccionID = subdireccion.value
        body.activoID = activo.value
      }
      fetch('/auth/createUser', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
      })
        .then(r => r.json())
        .then((r) => {
          if (r.success) {
            this.setState({
              newUsername: '',
              newFirstPassword: '',
              newSecondPassword: '',
              subdireccion: '',
              activo: '',
              isCorrectPassword: false,
              isEqualPassword: false,
              isCorrectUsername: false,
              usernameIsUnique: false,
              isAdmin: { value: 0, label: 'No'},
            })
          } else {
            console.log('Something went wrong')
          }
        })
    }
  }

  getCanSbumitNewUser() {
    const { isCorrectPassword, isCorrectUsername, isEqualPassword, isAdmin, usernameIsUnique } = this.state
    const hasIsAdmin = isAdmin !== ''
    if (isCorrectPassword && isCorrectUsername && hasIsAdmin && isEqualPassword && usernameIsUnique) {
      return true
    }
    return false
  }

  getCanChangePassword() {
    const { isCorrectChangePassword, isEqualChangePassword, usernameChangePassword } = this.state
    const hasUsername = usernameChangePassword !== ''
    if (isCorrectChangePassword && isEqualChangePassword && hasUsername) {
      return true
    }
    return false
  }

  renderCorrectness(bool) {
    if (bool) {
      return <i style={{ color: 'green' }} className="fas fa-check" />
    }
    return <i style={{ color: '#d84040' }} className="fas fa-times" />
  }

  handleSubdireccionSelect(e) {
    const newState = {
      subdireccion: e
    }
    if (e === null) {
      newState.activo = null
    }
    this.setState(newState)
  }

  renderCreateNewUser() {
    const { isEqualPassword, usernameIsUnique, isCorrectUsername, newUsername, newFirstPassword, newSecondPassword, isCorrectPassword, subdirecciones, subdireccion, activo, isAdmin } = this.state
    const subdireccionesOptions = Object.keys(subdirecciones).map(key => ({
      label: subdirecciones[key].name,
      value: subdirecciones[key].id,
    }))
    let activoOptions = []
    if (subdireccion) {
      activoOptions = subdirecciones[`sub_${subdireccion.value}`].activos.map(elem => {
        return {
        label: elem.name,
        value: elem.id,
        }
      })
    }
    const canSubmit = this.getCanSbumitNewUser()
    return (
      <div className="createUser">
        <h3>Crear Usuario</h3>
        <div className="adminContainer">
          <ul className="createUserForm">
            <li>
              <label htmlFor="">Nombre de Usuario</label>
              <input
                autoComplete="off"
                type="text"
                value={newUsername}
                onChange={this.handleNewUsername}
                onBlur={this.checkUsernameUniqueness}
              />
            </li>
            <li>
              <label htmlFor="">Contraseña</label>
              <input autoComplete="off" type="password" value={newFirstPassword} onChange={e => this.handleNewPassword(e, 'newFirstPassword')}/>
            </li>
            <li>
              <label htmlFor="">Repetir Contraseña</label>
              <input autoComplete="off" type="password" value={newSecondPassword} onChange={e => this.handleNewPassword(e, 'newSecondPassword')}/>
            </li>
            <li>
              <label htmlFor="">Subdirección</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={subdireccionesOptions}
                value={subdireccion}
                onChange={this.handleSubdireccionSelect}
                isClearable
              />
            </li>
            <li>
              <label htmlFor="">Activo</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={activoOptions}
                value={activo}
                onChange={(e) => this.setState({ activo: e })}
                isClearable
              />
            </li>
            <li>
            <label htmlFor="">Es Administrador?</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={[{ value: 1, label: 'Sí' }, { value: 0, label: 'No'}]}
                value={isAdmin}
                onChange={(e) => this.setState({ isAdmin: e })}
              />
            </li>
          </ul>
          <ul>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderCorrectness(isCorrectUsername)}
                </div>
                <div className="validationExplanation">
                  <p>
                    Nombre de usuario solo contiene caracteres alfa-numéricos más los siguientes caracteres -_. (guión, guión bajo, y punto)
                  </p>
                  <p>
                    Tiene al menos 5 caracteres
                  </p>
                  <p>
                    Empieza y termina con un valor alfa-numérico
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                    {this.renderCorrectness(usernameIsUnique)}
                </div>
                <div className="validationExplanation">
                  <p>Usuario es único</p>
                </div>
              </div>
            </li>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderCorrectness(isCorrectPassword)}
                </div>
                <div className="validationExplanation">
                  <p>
                    Contraseña solo contiene caracteres alfa-numéricos y los siguientes caracteres !@#$%^&*
                  </p>
                  <p>
                    Contiene al menos 9 caracteres 
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderCorrectness(isEqualPassword)}
                </div>
                <div className="validationExplanation">
                  Contraseñas son iguales
                </div>
              </div>
            </li>
          </ul>
        </div>
        <button className="cta" disabled={!canSubmit} onClick={this.createNewUser}>Crear Usuario</button>
      </div>
    )
  }

  renderChangePassword() {
    const { users, usernameChangePassword, newFirstChangePassword, newSecondChangePassword, isEqualChangePassword, isCorrectChangePassword } = this.state
    const userOptions = users.map(elem => ({
      label: elem.username,
      value: elem.username,
    }))
    return (
      <div className="changePassword">
        <h3>Cambiar Contraseña</h3>
        <div className="adminContainer">
          <ul>
            <li>
              <label>Nombre de Usuario</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={userOptions}
                value={usernameChangePassword}
                onChange={(e) => this.setState({ usernameChangePassword: e })}
              />
            </li>
            <li>
              <label htmlFor="">Contraseña</label>
              <input autoComplete="off" type="password" value={newFirstChangePassword} onChange={e => this.handleNewChangePassword(e, 'newFirstChangePassword')}/>
            </li>
            <li>
              <label htmlFor="">Repetir Contraseña</label>
              <input autoComplete="off" type="password" value={newSecondChangePassword} onChange={e => this.handleNewChangePassword(e, 'newSecondChangePassword')}/>
            </li>
          </ul>
          <ul>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderCorrectness(isCorrectChangePassword)}
                </div>
                <div className="validationExplanation">
                  <p>
                    Contraseña solo contiene caracteres alfa-numéricos y los siguientes caracteres !@#$%^&*
                  </p>
                  <p>
                    Contiene al menos 9 caracteres 
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderCorrectness(isEqualChangePassword)}
                </div>
                <div className="validationExplanation">
                  <p>Contraseñas son iguales</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <button className="cta" disabled={!this.getCanChangePassword()} onClick={this.changePassword}>Cambiar Contraseña</button>
      </div>
    )
  }

  render() {
    return (
      <div className="admin">
        <h1>Administrar Usuarios</h1>
        {this.renderCreateNewUser()}
        {this.renderChangePassword()}
        <CreateWell subdirecciones={this.state.subdirecciones} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
})

export default connect(mapStateToProps)(AdminUI)
