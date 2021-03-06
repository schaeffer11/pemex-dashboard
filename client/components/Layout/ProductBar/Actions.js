// imports
import React from 'react'
import { Link, NavLink, Redirect } from 'react-router-dom'
import appConfig from '../../../../app-config'
import API from '../../../lib/api-store'

const ProductbarActions = ({ user, logoutAction }) => {
  const pages = appConfig.pages

  function logOut() {
    API.logout().then((data) => {
      console.log('i logged out')
      logoutAction()
    }).catch((err) => {
      console.log('.... i logged out too')
      // logoutAction()
    })
  }

  const logoutLink = user
    ? <button to="/" className="logout" onClick={logOut}>Cerrar Sesión</button>
    : null


  return (
    <div className="actions">
      { logoutLink }
    </div>
  )
}

export default ProductbarActions
