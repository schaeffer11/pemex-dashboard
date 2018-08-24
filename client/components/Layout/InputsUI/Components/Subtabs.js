import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { pagesPozo, pagesIntervenciones } from '../../../../lib/maps'

@autobind class Subtabs extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  handleClick(i) {
    let { handleSelectSubtab } = this.props

    handleSelectSubtab(i)
  }

  makeSubtabs(selectedTab, selectedSubtab) {
    let { handleSelectSubtab } = this.props

    if (selectedTab === 'Pozo') {
      return Object.keys(pagesPozo).map((i, index) => {
        let className = 'subtab'

        if (selectedSubtab === i) {
          className += '-active'
        }

        return <div className={className} key={i} onClick={() => this.handleClick(i)}> {index + 1} </div>
      })

    }
    else if (selectedTab === 'Intervenciones') {
      console.log('inver ')
    }
  }





  render() {
    let { selectedTab, selectedSubtab } = this.props

    return (
      <div className="subtabs">
        { this.makeSubtabs(selectedTab, selectedSubtab) }
      </div>
    )
  }
}


export default Subtabs
