import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';

import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'
import BaseIntervenciones from './IntervencionesForms/BaseIntervenciones'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      selectedSubtab: 'tecnicaDelPozoHighLevel',
      intervencionesType: null,
    }
  }


  handleSelectTab(val) {
    let selectedSub = val === 'Pozo' ? Object.keys(pagesPozo)[0] : 'objectivoYAlcances'

    this.setState({
      selectedTab: val,
      selectedSubtab: selectedSub
    })
  }

  handleSelectSubtab(val) {

    this.setState({
      selectedSubtab: val,
    })
  }

  handleSelectIntervencionesType(val) {
    this.setState({
      intervencionesType: val
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



  submitForms() {
    console.log('hihih')

    axios({
        method: "POST",
        url: "api/ping",
        data: {
          test: 1
        },
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    }).then(function(res) {
        console.log(res)
        
        return;
    })

  }





  render() {
    let { selectedTab, selectedSubtab, intervencionesType } = this.state

    let title = null
    let form = null


    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      title = pagesPozo[selectedSubtab].title
      form = pagesPozo[selectedSubtab].form
    }
    else if (selectedTab === 'Intervenciones') {
      if (selectedSubtab === 'objectivoYAlcances') {
        title = 'Objetivo y Alcances de la Intervencion'
        form = < BaseIntervenciones intervencionesType={intervencionesType} handleSelectIntervencionesType={this.handleSelectIntervencionesType}/>
      }
      else if (pagesIntervenciones[intervencionesType.value] && pagesIntervenciones[intervencionesType.value][selectedSubtab]) {
        title = pagesIntervenciones[intervencionesType.value][selectedSubtab].title
        form = pagesIntervenciones[intervencionesType.value][selectedSubtab].form 
      }
    }

    return (
      <div className="input-forms">
        <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
        <Subtabs handleSelectSubtab={this.handleSelectSubtab} selectedSubtab={selectedSubtab} selectedTab={selectedTab} intervencionesType={intervencionesType} />
        <div className="title-container" >
          <div className="title">
            { title }
          </div>
        </div>
        { form }
        <button onClick={this.submitForms}>Click Me!</button>
      </div>
    )
  }
}


export default InputsUI
