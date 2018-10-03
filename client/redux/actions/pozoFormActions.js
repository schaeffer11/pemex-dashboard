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

export function submitForm(action, token, saveName) {
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

    const headers = {
      'Authorization': `Bearer ${token}`,
    }
   


    if (action === 'save') {
      formData.append('saveName', JSON.stringify(saveName))

      fetch('/api/wellSave', {
        headers,
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
        headers,
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
            notificationText = 'Su información no se guardó ningún campo puede estar vacio'
          }
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
