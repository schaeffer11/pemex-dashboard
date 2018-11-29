import { setIsSaved, setIsLoading } from '../../redux/actions/global'
import Immutable from 'immutable'


export const setMergeTratamientoTermico = (value) => ({
  value,
  type: 'set_mergeTratamientoTermico',
})

export const setCedulaTratamientoTermico = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaTratamientoTermico',
})


export const setGeneralGraficaTratamiento = (location, value) => ({
  location,
  value,
  type: 'set_generalGraficaTratamiento',
})

export const setGeneralResultadosGenerales = (location, value) => ({
  location,
  value,
  type: 'set_generalResultadosGenerales',
})

export const setGeneralHistoricoDeAforosResults = (location, value) => ({
  location,
  value,
  type: 'set_generalHistoricoDeAforosResults',
})

export const setGeneralEvaluacionEstimulacion = (location, value) => ({
  location,
  value,
  type: 'set_generalEvaluacionEstimulacion',
})

export const setMergeEvaluacionEstimulacion = (value) => ({
  value,
  type: 'set_mergeEvaluacionEstimulacion',
})

export const setGeneralEvaluacionAcido = (location, value) => ({
  location,
  value,
  type: 'set_generalEvaluacionAcido',
})

export const setGeneralEvaluacionTermica = (location, value) => ({
  location,
  value,
  type: 'set_generalEvaluacionTermica',
})



export const setMergeEvaluacionAcido = (value) => ({
  value,
  type: 'set_mergeEvaluacionAcido',
})

export const setGeneralEvaluacionApuntalado = (location, value) => ({
  location,
  value,
  type: 'set_generalEvaluacionApuntalado',
})

export const setMergeEvaluacionApuntalado = (value) => ({
  value,
  type: 'set_mergeEvaluacionApuntalado',
})

export const setMergeTratamientoEstimulacion = (value) => ({
  value,
  type: 'set_mergeTratamientoEstimulacion',
})

export const setCedulaTratamientoEstimulacion = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaTratamientoEstimulacion',
})

export const setMergeTratamientoAcido = (value) => ({
  value,
  type: 'set_mergeTratamientoAcido',
})

export const setCedulaTratamientoAcido = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaTratamientoAcido',
})

export const setMergeTratamientoApuntalado = (value) => ({
  value,
  type: 'set_mergeTratamientoApuntalado',
})

export const setCedulaTratamientoApuntalado = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaTratamientoApuntalado',
})

export const setMergeResultsMeta = (value) => ({
  value,
  type: 'set_mergeResultsMeta',
})

export const setGeneralEstCostResults = (location, value) => ({
  location,
  value,
  type: 'set_generalEstCostResults',
})

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


export function submitResultsForm(action, token) {
  return async (dispatch, getState) => {

    dispatch(setIsLoading({ isLoading: true, loadText: 'Guardando' }))
    const ignore = {
      app: true,
      router: true,
    }
    const errors = []
    const convertedFields = getState().toJS()
    const formData = new FormData()

    
 
    let filteredKeys = ['user', 'global', 'graficaTratamiento', 'historicoDeAforosResults', 'estCostResults', 
    'tratamientoEstimulacion', 'tratamientoAcido', 'tratamientoApuntalado', 'tratamientoTermico',
    'evaluacionApuntalado', 'evaluacionAcido', 'evaluacionEstimulacion', 'evaluacionTermica', 'resultsMeta', 'resultadosGenerales']


    // const { pozo } = convertedFields.global
    const pozo = 'SOMETHING'

    const utc = Date.now()
    for (let k of filteredKeys) {
      if(!ignore[k]) {
        const innerObj = convertedFields[k]
        const innerKeys = Object.keys(innerObj)

        //convert -999 to nulls
        if (action === 'submit') {
          innerKeys.forEach(key => {
            if (innerObj[key] === '-999' || innerObj[key] === '-999.00') {
              innerObj[key] = null
            }
          })       
        }


        // look for immediate images
        if (innerObj.hasOwnProperty('imgURL')) {
          if (innerObj.imgURL) {
            const img = await getBase64FromURL(innerObj.imgURL)
            innerObj.img = img
            // innerObj.imgName = [pozo, k, utc].join('.')
          }
        }

        // Look for images inside arrays and get base64
        for(let aKeys of innerKeys) {
          const property = innerObj[aKeys]
          if (Array.isArray(property)) {
            let index = 0
            for (let j of property) {

              //convert -999 in arrays to nulls
              if (action === 'submit') {
                Object.keys(j).forEach(key => {
                  if (j[key] === '-999' || j[key] === '-999.00') {
                    j[key] = null
                  }
                })
              }



              if (j.hasOwnProperty('imgURL')) {
                if (j.imgURL) {
                  const img = await getBase64FromURL(j.imgURL)
                  j.img = img
                  // j.imgName = [pozo, k, j.type, index, utc].join('.')
                  index += 1
                }
              }
            }
          }
        }
        formData.append(k, JSON.stringify(innerObj))
      }
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
    }
   

    if (action === 'save') {

    }
    else if (action === 'submit') {
      fetch('/api/results', {
        headers,
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ isSubmitted }) => {
          if (isSubmitted) {
            dispatch({ type: 'RESET_APP_FROM_SUBMIT' })
            
            setTimeout(dispatch(setIsLoading({
              notificationType: 'success',
              notificationText: 'Su información se ha guardado',
              isLoading: false,
              showNotification: true,
            })), 300)
          } else {
            dispatch(setIsLoading({
              notificationType : 'error',
              notificationText : 'Su información no se guardó ningún campo puede estar vacio',
              isLoading: false,
              showNotification: true,
            }))
          }
        })
    }
  }
}