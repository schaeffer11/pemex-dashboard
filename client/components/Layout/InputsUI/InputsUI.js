import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import axios from 'axios';
import { connect } from 'react-redux'

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
    let { fichaTecnicaDelPozo, fichaTecnicaDelPozoHighLevel } = this.props

    fichaTecnicaDelPozo = fichaTecnicaDelPozo.toJS()
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()


    let { subdireccion, bloque, activo, campo, pozo, formacion } = fichaTecnicaDelPozoHighLevel
    let { intervaloProductor, espesorBruto, espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, 
      sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, 
      profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, 
      gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = fichaTecnicaDelPozo


    let data = {
      subdireccion: subdireccion,
      bloque: bloque,
      activo: activo, 
      campo: campo, 
      pozo: pozo, 
      formacion: formacion, 
      intervaloProductor: intervaloProductor, 
      espesorBruto: espesorBruto, 
      espesorNeto: espesorNeto, 
      caliza: caliza,
      dolomia: dolomia, 
      arcilla: arcilla, 
      porosidad: porosidad, 
      permeabilidad: permeabilidad, 
      sw: sw, 
      caa: caa, 
      cga: cga, 
      tipoDePozo: tipoDePozo, 
      pwsFecha: pwsFecha, 
      pwfFecha: pwfFecha, 
      deltaPPerMes: deltaPPerMes, 
      tyac: tyac,
      pvt: pvt, 
      aparejoDeProduccion: aparejoDeProduccion, 
      profEmpacador: profEmpacador, 
      profSensorPYT: profSensorPYT, 
      tipoDeSap: tipoDeSap, 
      moduloYoungArena: moduloYoungArena, 
      moduloYoungLutitas: moduloYoungLutitas,
      relacPoissonArena: relacPoissonArena, 
      relacPoissonLutatas: relacPoissonLutatas, 
      gradienteDeFractura: gradienteDeFractura, 
      densidadDeDisparos: densidadDeDisparos, 
      diametroDeDisparos: diametroDeDisparos,
    }


    axios({
        method: "POST",
        url: "api/storeWellData",
        data: data,
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
        <div class="tab-content">
          <div className="title">
            { title }
          </div>
          { form }
        </div>
        <button class="submit" onClick={this.submitForms}>Enviar</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
