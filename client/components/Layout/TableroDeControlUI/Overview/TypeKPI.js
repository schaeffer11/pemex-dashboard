import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'

@autobind class TypeKPI extends PureComponent {
  render() {
    let { data } = this.props

    return (
      <div className={`kpi-outer ${data.name}`}>
        <div className='name'>
            {data.name}
        </div>
      </div>
    )
  }
}


export default TypeKPI
