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
    // const { uwi } = this.props

    // const prevPropsUWI = prevProps.uwi
    // const thisPropsUWI = uwi

    // if (prevPropsUWI !== thisPropsUWI) {
    //   this.getData(thisPropsUWI)
    // }
  }



  submitWellForms() {
    let { fichaTecnicaDelPozo, fichaTecnicaDelPozoHighLevel, fichaTecnicaDelCampo, sistemasArtificialesDeProduccion, mecanicoYAparejoDeProduccion, analisisDelAgua } = this.props
    let self = this


    fichaTecnicaDelPozo = fichaTecnicaDelPozo.toJS()
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    fichaTecnicaDelCampo = fichaTecnicaDelCampo.toJS()
    sistemasArtificialesDeProduccion = sistemasArtificialesDeProduccion.toJS()
    mecanicoYAparejoDeProduccion = mecanicoYAparejoDeProduccion.toJS()
    analisisDelAgua = analisisDelAgua.toJS()

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

    //Informacion de Sistemas Artificiales De Produccion
    let {tipoDeSistemo, presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV, 
      presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN, 
      volumenDeGasInyectadoBN, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH, 
      fluidoMotrizBH, equipoSuperficialBH, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, 
      hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP, profundidadDelMotorBE, 
      diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE, 
      longitudDeCableBE, rmpBE, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, 
      tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM, 
      nivelDinamico, nivelEstatico } = sistemasArtificialesDeProduccion

    //Edo Mecanico y Aparejo De Produccion
    let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, 
      tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMechanico, fase, 
      diametroDeOrificio, penetracion, tipoDeSAP, tratamientoPor, volumenAparejoDeProduccion, 
      volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular} = mecanicoYAparejoDeProduccion

    //Analisis Del Agua
    let { pH, temperaturaDeConductividad, resistividad, salinidadConConductimetro, solidosDisueltosTotales, 
      durezaTotalComoCaCO3, durezaDeCalcioComoCaCO3, durezaDeMagnesioComoCaCO3, alcalinidadTotalComoCaCO3, alcalinidadALaFenolftaleinaComoCaCO3, 
      salinidadComoNaCl, sodio, calcio, magnesio, fierro, 
      cloruros, bicarbonatos, sulfatos, carbonatos, densidadAt15, 
      densidadAt20} = analisisDelAgua

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
      n2Field: n2Field,
      tipoDeSistemo: tipoDeSistemo,
      presionDeCabeza: presionDeCabeza,
      presionDeLineaODeSeparador: presionDeLineaODeSeparador,
      tipoDeTerminacion: tipoDeTerminacion,
      hIntervaloProductor: hIntervaloProductor,
      empacador: empacador,
      presionDifEmpacador: presionDifEmpacador,
      sensorPyt: sensorPyt,
      tipoDeLiner: tipoDeLiner,
      diametroDeLiner: diametroDeLiner,
      tipoDePistolas: tipoDePistolas,
      densidadDeDisparosMechanico: densidadDeDisparosMechanico,
      fase: fase,
      diametroDeOrificio: diametroDeOrificio,
      penetracion: penetracion,
      tipoDeSAP: tipoDeSAP,
      tratamientoPor: tratamientoPor,
      volumenAparejoDeProduccion: volumenAparejoDeProduccion,
      volumenCimaDeIntervalo: volumenCimaDeIntervalo,
      volumenBaseDeIntervalo: volumenBaseDeIntervalo,
      volumenDeEspacioAnular: volumenDeEspacioAnular,
      pH: pH,
      temperaturaDeConductividad: temperaturaDeConductividad,
      resistividad: resistividad,
      salinidadConConductimetro: salinidadConConductimetro,
      solidosDisueltosTotales: solidosDisueltosTotales,
      durezaTotalComoCaCO3: durezaTotalComoCaCO3,
      durezaDeCalcioComoCaCO3: durezaDeCalcioComoCaCO3,
      durezaDeMagnesioComoCaCO3: durezaDeMagnesioComoCaCO3,
      alcalinidadTotalComoCaCO3: alcalinidadTotalComoCaCO3,
      alcalinidadALaFenolftaleinaComoCaCO3: alcalinidadALaFenolftaleinaComoCaCO3,
      salinidadComoNaCl: salinidadComoNaCl,
      sodio: sodio,
      calcio: calcio,
      magnesio: magnesio,
      fierro: fierro,
      cloruros: cloruros,
      bicarbonatos: bicarbonatos,
      sulfatos: sulfatos,
      carbonatos: carbonatos,
      densidadAt15: densidadAt15,
      densidadAt20: densidadAt20,
    }

    switch(tipoDeSistemo) {
      case 'emboloViajero':
        data.numeroDeDescargasOCiclosEV = numeroDeDescargasOCiclosEV
        data.volumenDesplazadoPorCircloEV = volumenDesplazadoPorCircloEV
        break
      case 'bombeoNeumatico':
        data.presionDeInyeccionBN = presionDeInyeccionBN
        data.presionDeDescargaBN = presionDeDescargaBN
        data.numeroDeValvulasBN = numeroDeValvulasBN
        data.profundidadDeLaVulvulaOperanteBN = profundidadDeLaVulvulaOperanteBN
        data.orificioBN = orificioBN
        data.volumenDeGasInyectadoBN = volumenDeGasInyectadoBN
      case 'bombeoHidraulico':
        data.profundidadDeLaBombaBH = profundidadDeLaBombaBH
        data.tipoYMarcaDeBombaBH = tipoYMarcaDeBombaBH
        data.orificioBH = orificioBH
        data.tipoDeCamisaBH = tipoDeCamisaBH
        data.fluidoMotrizBH = fluidoMotrizBH
        data.equipoSuperficialBH = equipoSuperficialBH
      case 'bombeoCavidadesProgresivas':
        data.motorYTipoDeMotorBCP = motorYTipoDeMotorBCP
        data.profunidadDelMotorBCP = profunidadDelMotorBCP
        data.velocidadBCP = velocidadBCP
        data.hpBCP = hpBCP
        data.arregloDeVarillasBCP = arregloDeVarillasBCP
        data.tipoDeElastomeroBCP = tipoDeElastomeroBCP
        data.profundidadDelAnclaAntitorqueBCP = profundidadDelAnclaAntitorqueBCP
      case 'bombeoElectrocentrifugo':
        data.profundidadDelMotorBE = profundidadDelMotorBE
        data.diametroBE = diametroBE
        data.voltsBE = voltsBE 
        data.amparajeBE = amparajeBE
        data.armaduraBE = armaduraBE
        data.tipoDeCableBE = tipoDeCableBE
        data.longitudDeCableBE = longitudDeCableBE
        data.rmpBE = rmpBE
      case 'bombeoMecanico':
        data.tipoDeUnidadBM = tipoDeUnidadBM
        data.velocidadBM = velocidadBM
        data.longitudDeCareraBM = longitudDeCareraBM
        data.tipoDeBombaSubsuperficialBM = tipoDeBombaSubsuperficialBM
        data.tamanoDeBombaSubsuperficialBM = tamanoDeBombaSubsuperficialBM
        data.profundidadDeLaBombaBM = profundidadDeLaBombaBM
        data.arregloDeVarillasBM = arregloDeVarillasBM
        data.CuantaConAnclaBM = CuantaConAnclaBM
        data.nivelDinamico = nivelDinamico
        data.nivelEstatico = nivelEstatico
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
        if (res.data.err) {
          self.setState({
            error: res.data.err.sqlMessage
          })  
        }
        else {
          self.setState({
            error: ''
          })
        }

        return;
    })

  }


  submitInterventionForms() {    
    let self = this
    let { objetivoYAlcancesIntervencion, propuestaEstimulacion, pruebasDeLaboratorio, resultadosSimulacionEstimulacion, estIncProduccionEstimulacion, estCostEstimulacion, 
      propuestaAcido, pruebasDeLaboratorioAcido, resultadosSimulacionAcido, estIncProduccionAcido, estCostAcido,
      propuestaApuntalado, pruebasDeLaboratorioApuntalado, resultadosSimulacionApuntalado, estIncProduccionApuntalado, estCostApuntalado } = this.props


    objetivoYAlcancesIntervencion = objetivoYAlcancesIntervencion.toJS()
    propuestaEstimulacion = propuestaEstimulacion.toJS()
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    resultadosSimulacionEstimulacion = resultadosSimulacionEstimulacion.toJS()
    estIncProduccionEstimulacion = estIncProduccionEstimulacion.toJS()
    estCostEstimulacion = estCostEstimulacion.toJS()
    propuestaAcido = propuestaAcido.toJS()
    pruebasDeLaboratorioAcido = pruebasDeLaboratorioAcido.toJS()
    resultadosSimulacionAcido = resultadosSimulacionAcido.toJS()
    estIncProduccionAcido = estIncProduccionAcido.toJS()
    estCostAcido = estCostAcido.toJS()


    //ObjetivoYAlcancesIntervencion
    let { objetivo, alcances, tipoDeIntervenciones } = objetivoYAlcancesIntervencion
    let { tipoDeAnalisis, fechaDeMuestreo, fechaDePrueba, compania, personalDePemexQueSuperViso, obervacionesLab } = pruebasDeLaboratorio
 
    let data = {
      objetivo: objetivo,
      alcances: alcances,
      tipoDeIntervenciones: tipoDeIntervenciones
    }


    if (tipoDeIntervenciones === 'estimulacion') {
      let { etapa, sistema, volLiquid, gastoN2, gastoLiquido, gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoN2, volumenTotalDeLiquido } = propuestaEstimulacion
      let { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto, numeroDeEtapas, volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano} = resultadosSimulacionEstimulacion
      let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, estIncGastoCompromisoQg, obervacionesEstIncEstim } = estIncProduccionEstimulacion
      let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes, estCostDeN2, estCostHCL } = estCostEstimulacion

      data = {
        objetivo: objetivo,
        alcances: alcances,
        tipoDeIntervenciones: tipoDeIntervenciones,
        etapa: etapa,
        sistema: sistema,
        volLiquid: volLiquid,
        gastoN2: gastoN2,
        gastoLiquido: gastoLiquido,
        gastoEnFondo: gastoEnFondo,
        calidad: calidad,
        volN2: volN2,
        volLiquidoAcum: volLiquidoAcum,
        volN2Acum: volN2Acum,
        relN2Liq: relN2Liq,
        tiempo: tiempo,
        intervalo: intervalo,
        longitudDeIntervalo: longitudDeIntervalo,
        volAparejo: volAparejo,
        capacidadTotalDelPozo: capacidadTotalDelPozo,
        volumenPrecolchonN2: volumenPrecolchonN2,
        volumenSistemaNoReativo: volumenSistemaNoReativo,
        volumenSistemaReactivo: volumenSistemaReactivo,
        volumenSistemaDivergente: volumenSistemaDivergente,
        volumenDesplazamientoLiquido: volumenDesplazamientoLiquido,
        volumenDesplazamientoN2: volumenDesplazamientoN2,
        volumenTotalDeLiquido : volumenTotalDeLiquido,
        tipoDeAnalisis: tipoDeAnalisis,
        fechaDeMuestreo: fechaDeMuestreo,
        fechaDePrueba: fechaDePrueba,
        compania: compania,
        personalDePemexQueSuperViso: personalDePemexQueSuperViso,
        obervacionesLab: obervacionesLab,
        volumenDelSistemaAcidoLimpieza: volumenDelSistemaAcidoLimpieza,
        volumenDelSistemaNoAcidoLimpieza: volumenDelSistemaNoAcidoLimpieza,
        tipoDeColocacion: tipoDeColocacion,
        tiempoDeContacto: tiempoDeContacto,
        numeroDeEtapas: numeroDeEtapas,
        volumenDelSistemAcido: volumenDelSistemAcido,
        volumenDelSistemNoAcido: volumenDelSistemNoAcido,
        volumenDeDivergente: volumenDeDivergente,
        volumenDeN2: volumenDeN2,
        calidadDeEspuma: calidadDeEspuma,
        volumenDePrecolchonN2: volumenDePrecolchonN2,
        volumenDeDesplazamiento: volumenDeDesplazamiento,
        penetracionRadial: penetracionRadial,
        longitudDeAgujeroDeGusano: longitudDeAgujeroDeGusano,
        estIncEstrangulador: estIncEstrangulador,
        estIncPtp: estIncPtp,
        estIncTtp: estIncTtp,
        estIncPbaj: estIncPbaj,
        estIncTbaj: estIncTbaj,
        estIncPtr: estIncPtr,
        estIncQl: estIncQl,
        estIncQo: estIncQo,
        estIncQg: estIncQg,
        estIncQw: estIncQw,
        estIncRGA: estIncRGA,
        estIncSalinidad: estIncSalinidad,
        estIncIP: estIncIP,
        estIncDeltaP: estIncDeltaP,
        estIncGastoCompromisoQo: estIncGastoCompromisoQo,
        estIncGastoCompromisoQg: estIncGastoCompromisoQg,
        obervacionesEstIncEstim: obervacionesEstIncEstim,
        estCostCompaniaDeServicio: estCostCompaniaDeServicio,
        estCostoDeRentaDeBarco: estCostoDeRentaDeBarco,
        estCostDeSistemaReactivo: estCostDeSistemaReactivo,
        estCostDeSistemaNoReactivo: estCostDeSistemaNoReactivo,
        estCostDeDivergenes: estCostDeDivergenes,
        estCostDeN2: estCostDeN2,
        estCostHCL: estCostHCL,
      }

    }
    else if (tipoDeIntervenciones === 'acido') {
      let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo, intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo, volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal} = propuestaAcido
      let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, viscosidadDelAceite, sistemAcido, pesoMuestraInicial, pesoMuestraFinal, solubilidad, sistemaAcidoGrabado, nucleoDeFormacion, grabado, tipoDeGelLineal, viscosidadDelGelLineal, tiempoDeReticulacion, pHGelLineal, tiempoDeRompedorDelGel, obervacionesPruebasLabAcido} = pruebasDeLaboratorioAcido
      let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura} = resultadosSimulacionAcido
      let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP, estIncGastoCompromisoQo, estIncGastoCompromisoQg, obervacionesEstIncAcido} = estIncProduccionAcido
      let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante} = estCostAcido
 

      data = {
        objetivo: objetivo,
        alcances: alcances,
        tipoDeIntervenciones: tipoDeIntervenciones,
        etapa: etapa,
        sistema: sistema, 
        tipoDeApuntalante: tipoDeApuntalante, 
        concentraciDeApuntalante: concentraciDeApuntalante, 
        volLiquid: volLiquid, 
        gastoN2: gastoN2, 
        gastoLiqudo: gastoLiqudo, 
        gastoEnFondo: gastoEnFondo, 
        calidad: calidad, 
        volN2: volN2, 
        volLiquidoAcum: volLiquidoAcum, 
        volN2Acum: volN2Acum, 
        relN2Liq: relN2Liq, 
        tiempo: tiempo, 
        intervalo: intervalo, 
        longitudDeIntervalo: longitudDeIntervalo, 
        volAparejo: volAparejo, 
        capacidadTotalDelPozo: capacidadTotalDelPozo, 
        volumenPrecolchonN2: volumenPrecolchonN2, 
        volumenSistemaNoReativo: volumenSistemaNoReativo, 
        volumenSistemaReactivo: volumenSistemaReactivo, 
        volumenSistemaDivergente: volumenSistemaDivergente, 
        volumenDesplazamientoLiquido: volumenDesplazamientoLiquido, 
        volumenDesplazamientoGelLineal: volumenDesplazamientoGelLineal, 
        tipoDeAnalisis: tipoDeAnalisis, 
        contenidoDeAceite: contenidoDeAceite, 
        contenidoDeAgua: contenidoDeAgua, 
        contenidoDeEmulsion: contenidoDeEmulsion, 
        contenidoDeSolidos: contenidoDeSolidos, 
        tipoDeSolidos: tipoDeSolidos, 
        densidadDelAceite: densidadDelAceite, 
        densidadDelAgua: densidadDelAgua, 
        densidadDeLaEmulsion: densidadDeLaEmulsion, 
        contenidoDeAsfaltenos: contenidoDeAsfaltenos, 
        contenidoDeParafinas: contenidoDeParafinas, 
        contenidoDeResinas: contenidoDeResinas, 
        indiceDeEstabilidadDelColoidal: indiceDeEstabilidadDelColoidal, 
        indiceDeEstabilidadDelAgua: indiceDeEstabilidadDelAgua, 
        pH: pH, 
        salinidad: salinidad, 
        viscosidadDelAceite: viscosidadDelAceite, 
        sistemAcido: sistemAcido, 
        pesoMuestraInicial: pesoMuestraInicial, 
        pesoMuestraFinal: pesoMuestraFinal, 
        solubilidad: solubilidad, 
        sistemaAcidoGrabado: sistemaAcidoGrabado, 
        nucleoDeFormacion: nucleoDeFormacion, 
        grabado: grabado, 
        tipoDeGelLineal: tipoDeGelLineal, 
        viscosidadDelGelLineal: viscosidadDelGelLineal, 
        tiempoDeReticulacion: tiempoDeReticulacion, 
        pHGelLineal: pHGelLineal, 
        tiempoDeRompedorDelGel: tiempoDeRompedorDelGel, 
        obervacionesPruebasLabAcido: obervacionesPruebasLabAcido, 
        longitudTotal: longitudTotal, 
        longitudEfectivaGrabada: longitudEfectivaGrabada, 
        alturaGrabada: alturaGrabada, 
        anchoPromedio: anchoPromedio, 
        concentracionDelAcido: concentracionDelAcido, 
        conductividad: conductividad, 
        fcd: fcd, 
        presionNeta: presionNeta, 
        eficienciaDeFluidoDeFractura: eficienciaDeFluidoDeFractura, 
        estIncEstrangulador: estIncEstrangulador, 
        estIncPtp: estIncPtp, 
        estIncTtp: estIncTtp, 
        estIncPbaj: estIncPbaj, 
        estIncTbaj: estIncTbaj, 
        estIncPtr: estIncPtr, 
        estIncQl: estIncQl, 
        estIncQo: estIncQo, 
        estIncQg: estIncQg, 
        estIncQw: estIncQw, 
        estIncRGA: estIncRGA, 
        estIncSalinidad: estIncSalinidad, 
        estIncIP: estIncIP, 
        estIncDeltaP: estIncDeltaP, 
        estIncGastoCompromisoQo: estIncGastoCompromisoQo, 
        estIncGastoCompromisoQg: estIncGastoCompromisoQg, 
        obervacionesEstIncAcido: obervacionesEstIncAcido, 
        estCostCompaniaDeServicio: estCostCompaniaDeServicio, 
        estCostoDeRentaDeBarco: estCostoDeRentaDeBarco, 
        estCostUnidadesDeAltaPresion: estCostUnidadesDeAltaPresion, 
        estCostDelGelDeFractura: estCostDelGelDeFractura, 
        estCostDeSistemoRactivo: estCostDeSistemoRactivo, 
        estCostDeSistemoNoRactivo: estCostDeSistemoNoRactivo, 
        estCostDeDivergentes: estCostDeDivergentes, 
        estCostDeN2: estCostDeN2, 
        estCostDeHCL: estCostDeHCL, 
        estCostDeSistemasAcidosRetardados: estCostDeSistemasAcidosRetardados, 
        estCostDeCostoEquipoDeFacturamientoDePozos: estCostDeCostoEquipoDeFacturamientoDePozos, 
        estCostGelLineal: estCostGelLineal, 
        estCostTrabajosDeBombeoDiversos: estCostTrabajosDeBombeoDiversos, 
        estCostLlenadoDePozoYPruebaDeAdmision: estCostLlenadoDePozoYPruebaDeAdmision, 
        estCostMinifrac: estCostMinifrac, 
        estCostBacheNeutralizador: estCostBacheNeutralizador, 
        estCostProtectorDeArbol: estCostProtectorDeArbol, 
        estCostApuntalante: estCostApuntalante, 
      }
    }
    else if (tipoDeIntervenciones === 'apuntalado') {

    }






    // switch(tipoDeSistemo) {
    //   case 'emboloViajero':
    //     data.numeroDeDescargasOCiclosEV = numeroDeDescargasOCiclosEV
    //     data.volumenDesplazadoPorCircloEV = volumenDesplazadoPorCircloEV
    //     break
    //   case 'bombeoNeumatico':
    //     data.presionDeInyeccionBN = presionDeInyeccionBN
    //     data.presionDeDescargaBN = presionDeDescargaBN
    // }

    axios({
        method: "POST",
        url: "api/storeInterventionData",
        data: data,
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    }).then(function(res) {
        console.log(res)
        if (res.data.err) {
          self.setState({
            error: res.data.err.sqlMessage
          })  
        }
        else {
          self.setState({
            error: ''
          })
        }

        return;
    })

  }




  render() {
    let { selectedTab, selectedSubtab, error } = this.state
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
        { selectedTab === 'Pozo'  
          ? <button className='submit-button' onClick={this.submiWellForms}> Enviar Datos De Pozo </button> 
          : <button className='submit-button' onClick={this.submitInterventionForms}> Enviar Datos De Intervención </button> }
        <div style={{color: 'red'}}>{error}</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  propuestaEstimulacion: state.get('propuestaEstimulacion'), 
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'), 
  resultadosSimulacionEstimulacion: state.get('resultadosSimulacionEstimulacion'), 
  estIncProduccionEstimulacion: state.get('estIncProduccionEstimulacion'), 
  estCostEstimulacion: state.get('estCostEstimulacion'),
  propuestaAcido: state.get('propuestaAcido'),
  pruebasDeLaboratorioAcido: state.get('pruebasDeLaboratorioAcido'),
  resultadosSimulacionAcido: state.get('resultadosSimulacionAcido'),
  estIncProduccionAcido: state.get('estIncProduccionAcido'),
  estCostAcido: state.get('estCostAcido'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InputsUI)
