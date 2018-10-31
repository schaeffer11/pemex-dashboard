import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import routes from '../../../routes/routes'
import Sidebar from './Common/Sidebar'
// import Navigation from '../../Layout/Navigation'

const TableroDeControlUI = (props) => {
  return (
    <div className="analysis-content">
      <div className='menu'>
        <Sidebar />
        {
          routes().map(route => (
            <div className='menu-item'>
              <NavLink
                to={route.path}
                activeClassName="active"
                className={`menu-link`}
              >
                {route.name}
              </NavLink>
            </div>
          ))
        }
      </div>
      {routes().map(route => (
        <Route
          key={route.name}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </div>
  )
}

export default TableroDeControlUI