import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import TecnicaDelPozo from './PozoForms/TecnicaDelPozo'
import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      selectedSubtab: null
    }
  }


  handleSelectTab(val) {
    this.setState({
      selectedTab: val
    })
  }

  handleSelectSubtab(val) {

    this.setState({
      selectedSubtab: val,
    })
  }


  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    // const { uwi } = this.props

    // const prevPropsUWI = prevProps.uwi
    // const thisPropsUWI = uwi

    // if (prevPropsUWI !== thisPropsUWI) {
    //   this.getData(thisPropsUWI)
    // }
  }

  render() {
    let { selectedTab, selectedSubtab } = this.state

    let title = null
    let form = null

    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      title = pagesPozo[selectedSubtab].title
      form = pagesPozo[selectedSubtab].form
    }
    else if (selectedTab === 'Intervenciones' && pagesIntervenciones[selectedSubtab]) {
      title = pagesIntervenciones[selectedSubtab].title
      form = pagesIntervenciones[selectedSubtab].form 
    }


    return (
      <div className="input-forms">
        <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
        <Subtabs handleSelectSubtab={this.handleSelectSubtab} selectedSubtab={selectedSubtab} selectedTab={selectedTab} />
        <div className="title-container" >
          <div className="title">
            { title }
          </div>
        </div>
        { form }
      </div>
    )
  }
}


export default InputsUI
