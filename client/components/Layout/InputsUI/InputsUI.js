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
      selectedSubtab: selectedSub
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
    let { selectedTab, selectedSubtab } = this.state
    let { objetivoYAlcancesIntervencion } = this.props
    objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS()
    let { tipoDeIntervenciones } = objetivoYAlcancesIntervencion

    let title = null
    let form = null


    if (selectedTab === 'Pozo' && pagesPozo[selectedSubtab]) {
      form = <PozoMultiStepForm />
    }
    else if (selectedTab === 'Intervenciones') {
      form = <BaseIntervenciones />
/*
      if (selectedSubtab === 'objectivoYAlcances') {
        title = 'Objetivo y alcances de la intervención'
        form = <BaseIntervenciones />
      }
      else if (pagesIntervenciones[tipoDeIntervenciones] && pagesIntervenciones[tipoDeIntervenciones][selectedSubtab]) {
        title = pagesIntervenciones[tipoDeIntervenciones][selectedSubtab].title
        form = pagesIntervenciones[tipoDeIntervenciones][selectedSubtab].form 
      }
*/
    }

    return (
      <div className="input-forms">
        <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
        <div class="tab-content">
          { form }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
