import React, { Component } from 'react'
import autobind from 'autobind-decorator'

@autobind class Tabs extends Component {
  constructor(props) {
    super(props)

  }


  makeTab(val) {
    let { handleSelectTab, selectedTab } = this.props

    let className = 'tab'

    let selectedState = selectedTab === val ? 'active' : ''

    return <div className={`${className} ${selectedState}`} onClick={() => handleSelectTab(val)}>{val}</div>
  }


  render() {
    return (
      <div className='tabs'>
        { this.makeTab('Pozo')}
        { this.makeTab('Intervenciones')}

      </div>
    )
  }
}


export default Tabs
