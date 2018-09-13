import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';
import { connect } from 'react-redux'

import Tabs from './Components/Tabs'
import Subtabs from './Components/Subtabs'
import { pagesPozo, pagesIntervenciones } from '../../../lib/maps'
import BaseIntervenciones from './IntervencionesForms/BaseIntervenciones'
import PozoMultiStepForm from './PozoForms/PozoMultiStepForm'

@autobind class InputsUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      selectedTab: 'Pozo',
      selectedSubtab: 'tecnicaDelPozoHighLevel',
    }
  }


  handleSelectTab(val) {
    let selectedSub = val === 'Pozo' ? Object.keys(pagesPozo)[0] : 'objectivoYAlcances'

    this.setState({
      selectedTab: val,
      selectedSubtab: selectedSub,
      error: ''
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

  }


  render() {
    let { selectedTab, selectedSubtab, error } = this.state
    let { objetivoYAlcancesIntervencion } = this.props
    objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS()
    let { tipoDeIntervenciones } = objetivoYAlcancesIntervencion

    let form = null


    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      form = <PozoMultiStepForm />
    }
    else if (selectedTab === 'Intervenciones') {
      form = <BaseIntervenciones />
    }

    return (
      <div className="input-forms">
        <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
        <div className="tab-content">
          { form }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
 
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
