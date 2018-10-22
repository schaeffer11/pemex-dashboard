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
        <div style={{fontFamily: 'Roboto', display: 'inline-block', color: '#CE1A22', fontWeight: 'normal', fontSize: '16px', position: 'relative', top: '-10px', left: '-35px'}}>Versión beta para prueba </div>
      </div>
      { user !== null && (
        <ProductbarActions user={user} logoutAction={logoutAction} />
      )} 
    </div>
  )
}

export default Productbar
