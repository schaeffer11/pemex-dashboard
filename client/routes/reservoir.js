import React from 'react'
import { Route } from 'react-router-dom'
import routes from '../../../routes/reservoir'
import Navigation from '../../Layout/Navigation'

const Reservoir = (props) => {
  return (
    <div className="analysis-content">
      <Navigation
        isParent={false}
        routes={routes}
        className="side"
      />
      {rwoutes().map(route => (
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