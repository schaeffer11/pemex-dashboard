import axios from 'axios'
import {validatePozo} from '../../../common/utils/validation/pozoValidator'

export function submitForm(fields) {
  let data = getFieldsAsDataObject(fields)
  return (dispatch, getState) => {
    dispatch({type: 'POZO_FORM_SUBMIT'})
    if(formIsValid(data)){
      return postForm(data)
       .then(
          res  => dispatch({type: 'POZO_FORM_SUCCESS', response: res}),
          error => dispatch({type: 'POZO_FORM_ERROR', error: error})
       )
    }else {
      dispatch({type: 'POZO_FORM_ERROR'})
    }
  }
}

function formIsValid(data){
    return true;
}


function postForm(data){
    return axios.post('api/storeWellData', {
      data: data,
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
      .then(res => {return res})
      .catch(error => {return error})
}


function getFieldsAsDataObject(form){
   let { fichaTecnicaDelPozo, fichaTecnicaDelPozoHighLevel, fichaTecnicaDelCampo, sistemasArtificialesDeProduccion, mecanicoYAparejoDeProduccion, analisisDelAgua } = form
      
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
      densidadAt20: densidadAt20
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

  return data;   
}
