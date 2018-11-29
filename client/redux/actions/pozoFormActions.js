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
      if (this.status == 200) {
        var uInt8Array = new Uint8Array(this.response);
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
            const img = innerObj.imgSource === 'local' ? await getBase64FromURL(innerObj.imgURL) : 'exists in s3'
            innerObj.img = img
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
                  console.log('converting some array img', property)
                  const img = j.imgSource === 'local' ? await getBase64FromURL(j.imgURL) : 'exists in s3'
                  j.img = img
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
        .then((r) => {
          let notificationType = ''
          let notificationText = ''
          const { isSaved, images, pruebasDeLaboratorio } = r
          if (isSaved) {
            notificationType = 'success'
            notificationText = 'Su información se ha guardado'
            dispatch(setImagesInState(images, pruebasDeLaboratorio, isSaved))
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
            dispatch({ type: 'RESET_APP_FROM_SUBMIT' })

            setTimeout(dispatch(setIsLoading({
              notificationType: 'success',
              notificationText: 'Su información se ha guardado',
              isLoading: false,
              showNotification: true,
            })), 300)

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

    // console.log('here we go baby')
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

