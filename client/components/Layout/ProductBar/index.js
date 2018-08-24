// imports
import React from 'react'
import ProductbarActions from './Actions'

const Productbar = ({ app, user, logoutAction }) => {
  // console.log('my appppppp', app.toJS())
  const title = app.get('title')
  return (
    <div className="productbar">
      <div className="title">
        <span>
          <strong>{title}</strong>
          <small className="version">{app.get('version')}</small>
        </span>
      </div>
      <ProductbarActions user={user} logoutAction={logoutAction} />
    </div>
  )
}

export default Productbar
