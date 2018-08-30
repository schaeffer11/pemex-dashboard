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

  makeSubtabs(selectedTab, selectedSubtab, intervencionesType) {
    let { handleSelectSubtab } = this.props

    if (selectedTab === 'Pozo') {
      return Object.keys(pagesPozo).map((i, index) => {

        let className = 'subtab'

        if (selectedSubtab === i) {
          className += ' active'
        }

        return <div className={className} key={i} onClick={() => this.handleClick(i)}><span></span> {index + 1} </div>
      })

    }
    else if (selectedTab === 'Intervenciones') {

      if (intervencionesType) {


        return Object.keys(pagesIntervenciones[intervencionesType]).map((i, index) => {
          let className = 'subtab'

          if (selectedSubtab === i) {
            className += ' active'
          }

          return <div className={className} key={i} onClick={() => this.handleClick(i)}> {index + 2} </div>
        })

      }




    }
  }





  render() {
    let { selectedTab, selectedSubtab, handleSelectSubtab, intervencionesType } = this.props

    let className = selectedSubtab === 'objectivoYAlcances' ? 'subtab-active' : 'subtab'

    return (
      <div className="subtabs">
        { selectedTab === 'Pozo' ? null : <div className={className} onClick={() => handleSelectSubtab('objectivoYAlcances')}>  1 </div>}
        { this.makeSubtabs(selectedTab, selectedSubtab, intervencionesType) }
        
      </div>
    )
  }
}


export default Subtabs
