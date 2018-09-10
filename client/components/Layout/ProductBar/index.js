// imports
import React from 'react'
import ProductbarActions from './Actions'

const Productbar = ({ app, user, logoutAction }) => {
  // console.log('my appppppp', app.toJS())
  const title = app.get('title')
  return (
    <div className="productbar">
      <div className="title">
        <span></span>
        <div style={{display: 'inline-block', color: 'red', fontSize: '25px', position: 'relative', top: '-6px', left: '-35px'}}>TEST APPLICATION </div>
      </div>
      { user !== null && (
        <ProductbarActions user={user} logoutAction={logoutAction} />
      )} 
    </div>
  )
}

export default Productbar
