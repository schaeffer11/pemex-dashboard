import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import objectPath from 'object-path'
import Select from 'react-select'

@autobind class AdminUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newFirstPassword: '',
      newSecondPassword: '',
      isCorrectPassword: false,
      subdirecciones: {},
      subdireccion: '',
      activo: '',
      isAdmin: '',
      isCorrectUsername: false,
    }
  }

  async componentDidMount() {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    const data = await fetch('/api/activo', { headers }).then(r => r.json())
    const subdirecciones = {}
    data.forEach(elem => {
      const { SUBDIRECCION_NAME, SUBDIRECCION_ID, ACTIVO_NAME, ACTIVO_ID } = elem
      objectPath.set(subdirecciones,  `sub_${SUBDIRECCION_ID}.id`, SUBDIRECCION_ID)
      objectPath.set(subdirecciones,  `sub_${SUBDIRECCION_ID}.name`, SUBDIRECCION_NAME)
      objectPath.push(subdirecciones, `sub_${SUBDIRECCION_ID}.activos`, { 
        name: ACTIVO_NAME, 
        id: ACTIVO_ID, 
      })
    })
    this.setState({ subdirecciones })
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
    const { token } = this.props
    const canSubmit = this.getCanSbumitNewUser()
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    if (canSubmit) {
      
    }
  }

  getCanSbumitNewUser() {
    const { isCorrectPassword, isCorrectUsername, activo, subdireccion, isAdmin } = this.state
    const hasActivo = activo !== ''
    const hasSubdireccion = subdireccion !== ''
    const hasIsAdmin = isAdmin !== ''
    console.log('pass', isCorrectPassword, 'user', isCorrectUsername, 'activo', hasActivo, 'sub', hasSubdireccion, 'admin', hasIsAdmin)
    if (isCorrectPassword && isCorrectUsername && hasActivo && hasSubdireccion && hasIsAdmin) {
      return true
    }
    return false
  }

  renderCreateNewUser() {
    const { newUsername, newFirstPassword, newSecondPassword, isCorrectPassword, subdirecciones, subdireccion, activo, isAdmin } = this.state
    const subdireccionesOptions = Object.keys(subdirecciones).map(key => ({
      label: subdirecciones[key].name,
      value: subdirecciones[key].id,
    }))
    let activoOptions = []
    if (subdireccion !== '') {
      activoOptions = subdirecciones[`sub_${subdireccion.value}`].activos.map(elem => {
        return {
        label: elem.name,
        value: elem.id,
        }
      })
    }
    const canSubmit = this.getCanSbumitNewUser()
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
          <Select 
            placeholder='Seleccionar...'
            className='input'
            options={subdireccionesOptions}
            value={subdireccion}
            onChange={(e) => this.setState({ subdireccion: e })}
          />
        </div>
        <div>
          <label htmlFor="">Activo</label>
          <Select 
            placeholder='Seleccionar...'
            className='input'
            options={activoOptions}
            value={activo}
            onChange={(e) => this.setState({ activo: e })}
          />
        </div>
        <div>
        <label htmlFor="">Es Administrador?</label>
          <Select 
            placeholder='Seleccionar...'
            className='input'
            options={[{ value: 1, label: 'Si' }, { value: 0, label: 'No'}]}
            value={isAdmin}
            onChange={(e) => this.setState({ isAdmin: e })}
          />
        </div>
        <button disabled={canSubmit} onClick={this.createNewUser}>Crear Usuario</button>
      </div>
    )
  }

  render() {
    return (
      <div style={{ color: 'white' }}>
        <h1>Administrar Usuarios</h1>
        {this.renderCreateNewUser()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
})

export default connect(mapStateToProps)(AdminUI)