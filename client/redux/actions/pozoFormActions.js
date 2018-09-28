import axios from 'axios'
import {validatePozo} from '../../../common/utils/validation/pozoValidator'
import { setIsSaved, setIsLoading } from '../../redux/actions/global'
import Immutable from 'immutable'

function bufferToBase64(buf) {
  var binstr = Array.prototype.map.call(buf, function (ch) {
      return String.fromCharCode(ch);
  }).join('');
  return btoa(binstr);
}

function getBase64FromURL(imgURL) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', imgURL, true)
    xhr.responseType = 'arraybuffer'
  
    xhr.onload = function(e) {

      if (this.status == 200) {
        var uInt8Array = new Uint8Array(this.response);
        var byte3 = uInt8Array[4]; 
        const base64 = bufferToBase64(uInt8Array)
        resolve(base64)
      } else {
        reject('no image')
      }
    }
    xhr.send()
  })
}

export function submitForm(action, saveName) {
  return async (dispatch, getState) => {

    dispatch(setIsLoading({ isLoading: true, loadText: 'Guardando' }))
    const ignore = {
      app: true,
      router: true,
    }
    const errors = []
    const convertedFields = getState().toJS()
    const formData = new FormData()
    const allKeys = Object.keys(convertedFields)
    
    const tipoDeIntervencion = convertedFields.objetivoYAlcancesIntervencion.tipoDeIntervenciones


    let filteredKeys

    if (tipoDeIntervencion === 'estimulacion') {
      filteredKeys = allKeys.filter(i => !((i.includes('Acido')) || i.includes('Apuntalado')))
    }
    else if (tipoDeIntervencion === 'acido') {
      filteredKeys = allKeys.filter(i => !((i.includes('Estimulacion')) || i.includes('Apuntalado')))
    }
    else if (tipoDeIntervencion === 'apuntalado') {
      //filteredKeys = allKeys.filter(i => i !== 'resultadosSimulacionEstimulacion' || i !== 'estIncProduccionEstimulacion' || i !== 'resultadosSimulacionAcido' || i!== 'estIncProduccionAcido')
      filteredKeys = allKeys.filter(i => !((i.includes('Estimulacion')) || i.includes('Acido')))
    }




    const { pozo } = convertedFields.fichaTecnicaDelPozoHighLevel
    const utc = Date.now()
    for (let k of filteredKeys) {
      if(!ignore[k]) {
        const innerObj = convertedFields[k]
        const innerKeys = Object.keys(innerObj)
        // look for immediate images
        // if (innerObj.hasOwnProperty('imgURL')) {
        //   if (innerObj.imgURL) {
        //     const img = await getBase64FromURL(innerObj.imgURL)
        //     innerObj.img = img
        //     // innerObj.imgName = [pozo, k, utc].join('.')
        //   }
        // }

        // Look for images inside arrays and get base64
        // for(let aKeys of innerKeys) {
        //   const property = innerObj[aKeys]
        //   if (Array.isArray(property)) {
        //     let index = 0
        //     for (let j of property) {
        //       if (j.hasOwnProperty('imgURL')) {
        //         if (j.imgURL) {
        //           const img = await getBase64FromURL(j.imgURL)
        //           j.img = img
        //           j.imgName = [pozo, k, j.type, index, utc].join('.')
        //           index += 1
        //         }
        //       }
        //     }
        //   }
        // }
        formData.append(k, JSON.stringify(innerObj))
      }
    }
   
    if(action === 'submit'){
      runValidation(allKeys, filteredKeys)
    }


    if (action === 'save') {
      formData.append('saveName', JSON.stringify(saveName))

      fetch('/api/wellSave', {
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ isSaved }) => {
          let notificationType = ''
          let notificationText = ''
          if (isSaved) {
            notificationType = 'success'
            notificationText = 'Su información se ha guardado'
          } else {
            notificationType = 'error'
            notificationText = 'Su información no se guardó'
          }
          // const notificationType = isSaved ? 'success' : 'error'
          // dispatch(setIsLoading({ isLoading: false, saved }))
          dispatch(setIsLoading({
            notificationType,
            notificationText,
            isLoading: false,
            showNotification: true,
          }))
        })
    }
    else if (action === 'submit') {
      fetch('/api/well', {
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ isSubmitted }) => {
          let notificationType = ''
          let notificationText = ''
          if (isSubmitted) {
            notificationType = 'success'
            notificationText = 'Su información se ha guardado'
          } else {
            notificationType = 'error'
            notificationText = 'Su información no se guardó'
          }
          // const submitted = isSubmitted ? 'success' : 'error'
          // dispatch(setIsLoading({ isLoading: false, submitted }))
          // dispatch({ type: 'RESET_APP' })
          dispatch(setIsLoading({
            notificationType,
            notificationText,
            isLoading: false,
            showNotification: true,
          }))
        })
    }
  }
}

export function runValidation(allKeys, filteredKeys){
  //console.log(allKeys)
  //console.log(filteredKeys)
}



// export function submitForm(fields) {
//   return (dispatch, getState) => {
//     const data = getFieldsAsDataObject(fields)
//     const errors = validateForm(data)

//     dispatch({type: 'POZO_FORM_SUBMIT'})
//     if(errors.length === 0){
//       return postForm(data)
//        .then(
//           res  => dispatch({type: 'POZO_FORM_SUCCESS', response: res}),
//           error => dispatch({type: 'POZO_FORM_ERROR', error: error})
//        )
//     }else {
//       dispatch({type: 'POZO_FORM_ERROR', errors: errors})
//       dispatch({type: 'POZO_FORM_SUCCESS', response: ""})
//     }
//   }
// }

function validateForm(data){
    let errors =  []

    if(!data.subdireccion || data.subdireccion.trim() === '')
      errors.push({field: 'subdireccion', message: 'Este campo no puede estar vacio'})

    if(!data.bloque || data.bloque.trim() === '')
      errors.push({field: 'bloque', message: 'Este campo no puede estar vacio'})

    if(!data.activo || data.activo.trim() === '')
      errors.push({field: 'activo', message: 'Este campo no puede estar vacio'})

    if(!data.campo || data.campo.trim() === '')
      errors.push({field: 'campo', message: 'Este campo no puede estar vacio'})

    if(!data.pozo || data.pozo.trim() === '')
      errors.push({field: 'pozo', message: 'Este campo no puede estar vacio'})

    if(!data.formacion || data.formacion.trim() === '')
      errors.push({field: 'formacion', message: 'Este campo no puede estar vacio'})

    if(!data.intervaloProductor || data.intervaloProductor.trim() === '')
      errors.push({field: 'intervaloProductor', message: 'Este campo no puede estar vacio'})

    if(!data.espesorBruto || data.espesorBruto.trim() === '')
      errors.push({field: 'espesorBruto', message: 'Este campo no puede estar vacio'})

    if(!data.espesorNeto || data.espesorNeto.trim() === '')
      errors.push({field: 'caliza', message: 'Este campo no puede estar vacio'})

    if(!data.dolomia || data.dolomia.trim() === '')
      errors.push({field: 'dolomia', message: 'Este campo no puede estar vacio'})

    if(!data.arcilla || data.arcilla.trim() === '')
      errors.push({field: 'porosidad', message: 'Este campo no puede estar vacio'})

    if(!data.porosidad || data.porosidad.trim() === '')
      errors.push({field: 'porosidad', message: 'Este campo no puede estar vacio'})

    if(!data.permeabilidad || data.permeabilidad.trim() === '')
      errors.push({field: 'permeabilidad', message: 'Este campo no puede estar vacio'})    

    if(!data.sw || data.sw.trim() === '')
      errors.push({field: 'sw', message: 'Este campo no puede estar vacio'})

    if(!data.caa || data.caa.trim() === '')
      errors.push({field: 'caa', message: 'Este campo no puede estar vacio'})

    if(!data.cga || data.cga.trim() === '')
       errors.push({field: 'cga', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDePozo || data.tipoDePozo.trim() === '')
       errors.push({field: 'tipoDePozo', message: 'Este campo no puede estar vacio'})

    if(!data.pwsFecha || data.pwsFecha.trim() === '')
       errors.push({field: 'pwsFecha', message: 'Este campo no puede estar vacio'})

    if(!data.pwfFecha || data.pwfFecha.trim() === '')
       errors.push({field: 'pwfFecha', message: 'Este campo no puede estar vacio'})

    if(!data.deltaPPerMes || data.deltaPPerMes.trim() === '')
       errors.push({field: 'deltaPPerMes', message: 'Este campo no puede estar vacio'})

    if(!data.tyac || data.tyac.trim() === '')
       errors.push({field: 'tyac', message: 'Este campo no puede estar vacio'})

    if(!data.pvt || data.pvt.trim() === '')
       errors.push({field: 'pvt', message: 'Este campo no puede estar vacio'})

    if(!data.aparejoDeProduccion || data.aparejoDeProduccion.trim() === '')
       errors.push({field: 'aparejoDeProduccion', message: 'Este campo no puede estar vacio'})

    if(!data.profEmpacador || data.profEmpacador.trim() === '')
       errors.push({field: 'profEmpacador', message: 'Este campo no puede estar vacio'})

    if(!data.profSensorPYT || data.profSensorPYT.trim() === '')
       errors.push({field: 'profSensorPYT', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDeSap || data.tipoDeSap.trim() === '')
       errors.push({field: 'tipoDeSap', message: 'Este campo no puede estar vacio'})

    if(!data.moduloYoungArena || data.moduloYoungArena.trim() === '')
       errors.push({field: 'moduloYoungArena', message: 'Este campo no puede estar vacio'})

    if(!data.moduloYoungLutitas || data.moduloYoungLutitas.trim() === '')
       errors.push({field: 'moduloYoungLutitas', message: 'Este campo no puede estar vacio'})

    if(!data.relacPoissonArena || data.relacPoissonArena.trim() === '')
       errors.push({field: 'relacPoissonArena', message: 'Este campo no puede estar vacio'})

    if(!data.relacPoissonLutatas || data.relacPoissonLutatas.trim() === '')
       errors.push({field: 'relacPoissonLutatas', message: 'Este campo no puede estar vacio'})

    if(!data.gradienteDeFractura || data.gradienteDeFractura.trim() === '')
       errors.push({field: 'gradienteDeFractura', message: 'Este campo no puede estar vacio'})

    if(!data.densidadDeDisparos || data.densidadDeDisparos.trim() === '')
       errors.push({field: 'densidadDeDisparos', message: 'Este campo no puede estar vacio'})

    if(!data.diametroDeDisparos || data.diametroDeDisparos.trim() === '')
       errors.push({field: 'diametroDeDisparos', message: 'Este campo no puede estar vacio'})

    if(!data.descubrimientoField || data.descubrimientoField.trim() === '')
       errors.push({field: 'descubrimiento', message: 'Este campo no puede estar vacio'})

    if(!data.fechaDeExplotacionField || data.fechaDeExplotacionField.trim() === '')
       errors.push({field: 'fechaDeExplotacion', message: 'Este campo no puede estar vacio'})

    if(!data.numeroDePozosOperandoField || data.numeroDePozosOperandoField.trim() === '')
       errors.push({field: 'numeroDePozosOperando', message: 'Este campo no puede estar vacio'})

    if(!data.pInicialAnoField || data.pInicialAnoField.trim() === '')
       errors.push({field: 'pInicialAno', message: 'Este campo no puede estar vacio'})

    if(!data.pActualFechaField || data.pActualFechaField.trim() === '')
       errors.push({field: 'pActualFecha', message: 'Este campo no puede estar vacio'})

    if(!data.dpPerAnoField || data.dpPerAnoField.trim() === '')
       errors.push({field: 'dpPerAno', message: 'Este campo no puede estar vacio'})

    if(!data.tyac || data.tyac.trim() === '')
       errors.push({field: 'tyac', message: 'Este campo no puede estar vacio'})

    if(!data.pr || data.pr.trim() === '')
       errors.push({field: 'pr', message: 'Este campo no puede estar vacio'})

    if(!data.densidadDelAceite || data.densidadDelAceite.trim() === '')
       errors.push({field: 'densidadDelAceite', message: 'Este campo no puede estar vacio'})

    if(!data.pSat || data.pSat.trim() === '')
       errors.push({field: 'pSat', message: 'Este campo no puede estar vacio'})


    if(!data.rgaFluidoField || data.rgaFluidoField.trim() === '')
       errors.push({field: 'rgaFluido', message: 'Este campo no puede estar vacio'})

    if(!data.salinidadField || data.salinidadField.trim() === '')
       errors.push({field: 'salinidad', message: 'Este campo no puede estar vacio'})

    if(!data.pvtRepresentativoField || data.pvtRepresentativoField.trim() === '')
       errors.push({field: 'pvtRepresentativo', message: 'Este campo no puede estar vacio'})

    if(!data.litologiaField || data.litologiaField.trim() === '')
       errors.push({field: 'litologia', message: 'Este campo no puede estar vacio'})

    if(!data.espesorNetoField || data.espesorNetoField.trim() === '')
       errors.push({field: 'espesorNeto', message: 'Este campo no puede estar vacio'})

    if(!data.porosidadField || data.porosidadField.trim() === '')
       errors.push({field: 'porosidad', message: 'Este campo no puede estar vacio'})

    if(!data.swField || data.swField.trim() === '')
       errors.push({field: 'sw', message: 'Este campo no puede estar vacio'})

    if(!data.kPromedioField || data.kPromedioField.trim() === '')
       errors.push({field: 'kPromedio', message: 'Este campo no puede estar vacio'})

    if(!data.caaField || data.caaField.trim() === '')
       errors.push({field: 'caaField', message: 'Este campo no puede estar vacio'})

    if(!data.cgaField || data.cgaField.trim() === '')
       errors.push({field: 'cga', message: 'Este campo no puede estar vacio'})

    if(!data.qoField || data.qoField.trim() === '')
       errors.push({field: 'qo', message: 'Este campo no puede estar vacio'})
    
    if(!data.qgField || data.qgField.trim() === '')
       errors.push({field: 'qg', message: 'Este campo no puede estar vacio'})

    if(!data.rgaField || data.rgaField.trim() === '')
       errors.push({field: 'rga', message: 'Este campo no puede estar vacio'})

    if(!data.fwField || data.fwField.trim() === '')
       errors.push({field: 'fw', message: 'Este campo no puede estar vacio'})

    if(!data.npField || data.npField.trim() === '')
       errors.push({field: 'np', message: 'Este campo no puede estar vacio'})

    if(!data.gpField || data.gpField.trim() === '')
       errors.push({field: 'gp', message: 'Este campo no puede estar vacio'})

    if(!data.wpField || data.wpField.trim() === '')
       errors.push({field: 'wp', message: 'Este campo no puede estar vacio'})

    if(!data.rraField || data.rraField.trim() === '')
       errors.push({field: 'rra', message: 'Este campo no puede estar vacio'})

    if(!data.rrgField || data.rrgField.trim() === '')
       errors.push({field: 'rrg', message: 'Este campo no puede estar vacio'})

    if(!data.rrpceField || data.rrpceField.trim() === '')
       errors.push({field: 'rrpce', message: 'Este campo no puede estar vacio'})

    if(!data.h2sField || data.h2sField.trim() === '')
       errors.push({field: 'h2s', message: 'Este campo no puede estar vacio'})

    if(!data.co2Field || data.co2Field.trim() === '')
       errors.push({field: 'co2', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDeSistemo || data.tipoDeSistemo.trim() === '')
       errors.push({field: 'tipoDeSistemo', message: 'Este campo no puede estar vacio'})

    if(!data.presionDeCabeza || data.presionDeCabeza.trim() === '')
       errors.push({field: 'presionDeCabeza', message: 'Este campo no puede estar vacio'})

    if(!data.presionDeLineaODeSeparador || data.presionDeLineaODeSeparador.trim() === '')
       errors.push({field: 'presionDeLineaODeSeparador', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDeTerminacion || data.tipoDeTerminacion.trim() === '')
       errors.push({field: 'tipoDeTerminacion', message: 'Este campo no puede estar vacio'})

    if(!data.hIntervaloProductor || data.hIntervaloProductor.trim() === '')
       errors.push({field: 'hIntervaloProductor', message: 'Este campo no puede estar vacio'})

    if(!data.empacador || data.empacador.trim() === '')
       errors.push({field: 'empacador', message: 'Este campo no puede estar vacio'})

    if(!data.presionDifEmpacador || data.presionDifEmpacador.trim() === '')
       errors.push({field: 'presionDifEmpacador', message: 'Este campo no puede estar vacio'})

    if(!data.sensorPyt || data.sensorPyt.trim() === '')
       errors.push({field: 'sensorPyt', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDeLiner || data.tipoDeLiner.trim() === '')
       errors.push({field: 'tipoDeLiner', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDePistolas || data.tipoDePistolas.trim() === '')
       errors.push({field: 'tipoDePistolas', message: 'Este campo no puede estar vacio'})

    if(!data.densidadDeDisparosMechanico || data.densidadDeDisparosMechanico.trim() === '')
       errors.push({field: 'densidadDeDisparosMechanico', message: 'Este campo no puede estar vacio'})

    if(!data.fase || data.fase.trim() === '')
       errors.push({field: 'fase', message: 'Este campo no puede estar vacio'})

    if(!data.diametroDeOrificio || data.diametroDeOrificio.trim() === '')
       errors.push({field: 'diametroDeOrificio', message: 'Este campo no puede estar vacio'})

    if(!data.penetracion || data.penetracion.trim() === '')
       errors.push({field: 'penetracion', message: 'Este campo no puede estar vacio'})

    if(!data.tipoDeSAP || data.tipoDeSAP.trim() === '')
       errors.push({field: 'tipoDeSAP', message: 'Este campo no puede estar vacio'})

    if(!data.tratamientoPor || data.tratamientoPor.trim() === '')
       errors.push({field: 'tratamientoPor', message: 'Este campo no puede estar vacio'})

    if(!data.tratamientoPor || data.tratamientoPor.trim() === '')
       errors.push({field: 'tratamientoPor', message: 'Este campo no puede estar vacio'})

    if(!data.volumenAparejoDeProduccion || data.volumenAparejoDeProduccion.trim() === '')
       errors.push({field: 'volumenAparejoDeProduccion', message: 'Este campo no puede estar vacio'})

    if(!data.volumenCimaDeIntervalo || data.volumenCimaDeIntervalo.trim() === '')
       errors.push({field: 'volumenCimaDeIntervalo', message: 'Este campo no puede estar vacio'})

    if(!data.volumenBaseDeIntervalo || data.volumenBaseDeIntervalo.trim() === '')
       errors.push({field: 'volumenBaseDeIntervalo', message: 'Este campo no puede estar vacio'})

    if(!data.volumenDeEspacioAnular || data.volumenDeEspacioAnular.trim() === '')
       errors.push({field: 'volumenDeEspacioAnular', message: 'Este campo no puede estar vacio'})

    if(!data.pH || data.pH.trim() === '')
       errors.push({field: 'pH', message: 'Este campo no puede estar vacio'})

    if(!data.temperaturaDeConductividad || data.temperaturaDeConductividad.trim() === '')
       errors.push({field: 'temperaturaDeConductividad', message: 'Este campo no puede estar vacio'})

    if(!data.resistividad || data.resistividad.trim() === '')
       errors.push({field: 'resistividad', message: 'Este campo no puede estar vacio'})

    if(!data.salinidadConConductimetro || data.salinidadConConductimetro.trim() === '')
       errors.push({field: 'salinidadConConductimetro', message: 'Este campo no puede estar vacio'})

    if(!data.solidosDisueltosTotales || data.solidosDisueltosTotales.trim() === '')
       errors.push({field: 'solidosDisueltosTotales', message: 'Este campo no puede estar vacio'})

    if(!data.durezaTotalComoCaCO3 || data.durezaTotalComoCaCO3.trim() === '')
       errors.push({field: 'durezaTotalComoCaCO3', message: 'Este campo no puede estar vacio'})

    if(!data.durezaDeCalcioComoCaCO3 || data.durezaDeCalcioComoCaCO3.trim() === '')
       errors.push({field: 'durezaDeCalcioComoCaCO3', message: 'Este campo no puede estar vacio'})

    if(!data.durezaDeMagnesioComoCaCO3 || data.durezaDeMagnesioComoCaCO3.trim() === '')
       errors.push({field: 'durezaDeMagnesioComoCaCO3', message: 'Este campo no puede estar vacio'})

    if(!data.alcalinidadTotalComoCaCO3 || data.alcalinidadTotalComoCaCO3.trim() === '')
       errors.push({field: 'alcalinidadTotalComoCaCO3', message: 'Este campo no puede estar vacio'})

    if(!data.alcalinidadALaFenolftaleinaComoCaCO3 || data.alcalinidadALaFenolftaleinaComoCaCO3.trim() === '')
       errors.push({field: 'alcalinidadALaFenolftaleinaComoCaCO3', message: 'Este campo no puede estar vacio'})

    if(!data.salinidadComoNaCl || data.salinidadComoNaCl.trim() === '')
       errors.push({field: 'salinidadComoNaCl', message: 'Este campo no puede estar vacio'})

    if(!data.sodio || data.sodio.trim() === '')
       errors.push({field: 'sodio', message: 'Este campo no puede estar vacio'})

    if(!data.calcio || data.calcio.trim() === '')
       errors.push({field: 'calcio', message: 'Este campo no puede estar vacio'})

    if(!data.magnesio || data.magnesio.trim() === '')
       errors.push({field: 'magnesio', message: 'Este campo no puede estar vacio'})

    if(!data.fierro || data.fierro.trim() === '')
       errors.push({field: 'fierro', message: 'Este campo no puede estar vacio'})

    if(!data.cloruros || data.cloruros.trim() === '')
       errors.push({field: 'cloruros', message: 'Este campo no puede estar vacio'})

    if(!data.bicarbonatos || data.bicarbonatos.trim() === '')
       errors.push({field: 'bicarbonatos', message: 'Este campo no puede estar vacio'})

    if(!data.sulfatos || data.sulfatos.trim() === '')
       errors.push({field: 'sulfatos', message: 'Este campo no puede estar vacio'})

    if(!data.carbonatos || data.carbonatos.trim() === '')
       errors.push({field: 'carbonatos', message: 'Este campo no puede estar vacio'})

    if(!data.densidadAt15 || data.densidadAt15.trim() === '')
       errors.push({field: 'densidadAt15', message: 'Este campo no puede estar vacio'})

    if(!data.densidadAt20 || data.densidadAt20.trim() === '')
       errors.push({field: 'densidadAt20', message: 'Este campo no puede estar vacio'})
    return errors          
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
