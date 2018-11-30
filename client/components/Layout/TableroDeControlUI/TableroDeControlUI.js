import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Route, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { setGeneralGlobalAnalysis } from '../../../redux/actions/global'
import routes from '../../../routes/routes'

@autobind class TableroDeControlUI extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const { token, setGeneral } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }


    fetch(`/api/getDates`, headers)
      .then(r => r.json())
      .then(r => {
        setGeneral(['minDate'], r[0].MIN)
        setGeneral(['maxDate'], r[0].MAX) 
        setGeneral(['lowDate'], r[0].MIN)
        setGeneral(['highDate'], r[0].MAX) 
      })

  }
  async testAdmin() {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
  }
  console.log(headers)
    const data = await fetch('/api/testingAdmin', { headers }).then(r => r.text())
    console.log('am i an admin and allowed', data)
  }
  render() {
   return (
    <div className="analysis-content">
      <div className='menu'>
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
}


const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})


export default connect(mapStateToProps, mapDispatchToProps)(TableroDeControlUI)