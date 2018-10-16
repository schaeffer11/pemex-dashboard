import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import routes from '../../../routes/routes'
// import Navigation from '../../Layout/Navigation'

const Reservoir = (props) => {
  return (
    <div className="analysis-content">
      <h1>
        menu
      </h1>
      <ul>
        {
          routes().map(route => (
            <li key={route.name}>
              <NavLink
                to={route.path}
                activeClassName="active"
                className={`--${route.class}`}
              >
                {route.name}
              </NavLink>
            </li>
          ))
        }
      </ul>
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

export default Reservoir