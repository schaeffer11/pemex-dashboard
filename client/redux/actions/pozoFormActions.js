import { setIsSaved, setIsLoading, setShowForms, setImagesInState } from '../../redux/actions/global'
import Immutable from 'immutable'

function bufferToBase64(buf) {
  var binstr = Array.prototype.map.call(buf, function (ch) {
      return String.fromCharCode(ch);
  }).join('');
  return btoa(binstr);
}

export function getBase64FromURL(imgURL) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', imgURL, true)
    xhr.responseType = 'arraybuffer'
  
    xhr.onload = function(e) {
      console.log('image status', this.status)
      if (this.status == 200) {
        var uInt8Array = new Uint8Array(this.response);
        var byte3 = uInt8Array[4]; 
        const base64 = bufferToBase64(uInt8Array)
        resolve(base64)
      } else {
        reject({ error: true, message: 'no image' })
      }
    }
    xhr.onerror = function (e) {
      reject({ error: true, message: 'no image' })
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
      historicoDeAforosResults: true,
      estCostResults: true,
      historicoDeAforosResults: true,
      graficaTratamiento: true,
      resultsMeta: true,
      globalAnalysis: true,
    }
    const errors = []
    const convertedFields = getState().toJS()
    const formData = new FormData()
    const allKeys = Object.keys(convertedFields)
    
    const tipoDeIntervencion = convertedFields.objetivoYAlcancesIntervencion.tipoDeIntervenciones


    let filteredKeys

    if (tipoDeIntervencion === 'estimulacion') {
      filteredKeys = allKeys.filter(i => !((i.includes('Acido')) || i.includes('Apuntalado') || i.includes('Termica')))
    }
    else if (tipoDeIntervencion === 'acido') {
      filteredKeys = allKeys.filter(i => !((i.includes('Estimulacion')) || i.includes('Apuntalado') || i.includes('Termica')))
    }
    else if (tipoDeIntervencion === 'apuntalado') {
      filteredKeys = allKeys.filter(i => !((i.includes('Estimulacion')) || i.includes('Acido') || i.includes('Termica')))
    }
    else if (tipoDeIntervencion === 'termico') {
      filteredKeys = allKeys.filter(i => !((i.includes('Estimulacion')) || i.includes('Acido') || i.includes('Apuntalado')))
    }




    const { pozo } = convertedFields.fichaTecnicaDelPozoHighLevel
    const utc = Date.now()
    for (let k of filteredKeys) {
      if(!ignore[k]) {
        const innerObj = convertedFields[k]
        const innerKeys = Object.keys(innerObj)
        // look for immediate images
        if (innerObj.hasOwnProperty('imgURL')) {
          if (innerObj.imgURL) {
            const img = innerObj.imgSource === 'local' ? await getBase64FromURL(innerObj.imgURL) : 'exists in s3'
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
              if (j.hasOwnProperty('imgURL')) {
                if (j.imgURL) {
                  console.log('converting some array img', property)
                  const img = j.imgSource === 'local' ? await getBase64FromURL(j.imgURL) : 'exists in s3'
                  // const img = await getBase64FromURL(j.imgURL)
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
      formData.append('saveName', JSON.stringify(saveName))

      fetch('/api/wellSave', {
        headers,
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ isSaved, images }) => {
          console.log('i got back images?', isSaved, images)
          let notificationType = ''
          let notificationText = ''
          if (isSaved) {
            notificationType = 'success'
            notificationText = 'Su información se ha guardado'
            dispatch(setImagesInState(images))
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
    // //TODO apply this change and make it work in database
    // //changes all -999 to null
    // for (let k of filteredKeys) {
    //   if(!ignore[k]) {
    //     let innerObj = convertedFields[k]
    //     let innerKeys = Object.keys(innerObj)

    //     innerKeys.forEach(key => {
    //       if (innerObj[key] === '-999' || innerObj[key] === '-999.00') {
    //         innerObj[key] = null
    //       }
    //     })
    //     // Look for images inside arrays and get base64
    //     for(let aKeys of innerKeys) {
    //       let property = innerObj[aKeys]
    //       if (Array.isArray(property)) {
    //         for (let j of property) {
    //           Object.keys(j).forEach(key => {
    //             if (j[key] === '-999' || j[key] === '-999.00') {
    //               j[key] = null
    //             }
    //           })
    //         }
    //       }
    //     }
    //     console.log(convertedFields[k])
    //   }
    // }



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
            dispatch({ type: 'RESET_APP_FROM_SUBMIT' })
          } else {
            notificationType = 'error'
            notificationText = 'Su información no se guardó ningún campo puede estar vacio'
          
            dispatch(setIsLoading({
              notificationType,
              notificationText,
              isLoading: false,
              showNotification: true,
            }))
          }
        })
    }
  }
}
