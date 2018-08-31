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
    let { fichaTecnicaDelPozo, fichaTecnicaDelPozoHighLevel, fichaTecnicaDelCampo } = this.props

    fichaTecnicaDelPozo = fichaTecnicaDelPozo.toJS()
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    fichaTecnicaDelCampo = fichaTecnicaDelCampo.toJS()

    //Ficha Technica Del Pozo High Level
    let { subdireccion, bloque, activo, campo, pozo, formacion } = fichaTecnicaDelPozoHighLevel

    //Ficha Techinca Del Pozo 
    let { intervaloProductor, espesorBruto, espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, 
      sw, caa, cga, tipoDePozo, pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, 
      profSensorPYT, tipoDeSap, moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, 
      gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = fichaTecnicaDelPozo

    //Ficha Tecnica Del Campo
    let { descubrimientoField, fechaDeExplotacionField, numeroDePozosOperandoField, pInicialAnoField, pActualFechaField, 
      dpPerAnoField, tyacField, prField, densidadDelAceiteField, pSatField, 
      rgaFluidoField, salinidadField, pvtRepresentativoField, litologiaField, espesorNetoField, 
      porosidadField, swField, kPromedioField, caaField, cgaField, 
      qoField, qgField, rgaField, fwField, npField, 
      gpField, wpField, rraField, rrgField, rrpceField, 
      h2sField, co2Field, n2Field } = fichaTecnicaDelCampo


      console.log(fichaTecnicaDelCampo)

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
      descubrimientoField: descubrimientoField,
      fechaDeExplotacionField: fechaDeExplotacionField,
      numeroDePozosOperandoField: numeroDePozosOperandoField,
      pInicialAnoField: pInicialAnoField,
      pActualFechaField: pActualFechaField,
      dpPerAnoField: dpPerAnoField,
      tyacField: tyacField,
      prField: prField,
      densidadDelAceiteField: densidadDelAceiteField,
      pSatField: pSatField,
      rgaFluidoField: rgaFluidoField,
      salinidadField: salinidadField,
      pvtRepresentativoField: pvtRepresentativoField,
      litologiaField: litologiaField,
      espesorNetoField: espesorNetoField,
      porosidadField: porosidadField,
      swField: swField,
      kPromedioField: kPromedioField,
      caaField: caaField,
      cgaField: cgaField,
      qoField: qoField,
      qgField: qgField,
      rgaField: rgaField,
      fwField: fwField,
      npField: npField,
      gpField: gpField,
      wpField: wpField,
      rraField: rraField,
      rrgField: rrgField,
      rrpceField: rrpceField,
      h2sField: h2sField,
      co2Field: co2Field,
      n2Field: n2Field
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
    }

    return (
      <div className="input-forms">
        <Tabs handleSelectTab={this.handleSelectTab} selectedTab={selectedTab} />
        <div class="tab-content">
          { form }
        </div>
        <button className='submit-button' onClick={this.submitForms}> Submit </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
