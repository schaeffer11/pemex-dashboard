import { setIsSaved, setIsLoading } from '../../redux/actions/global'
import Immutable from 'immutable'



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

export const setMergeTratamientoAcido = (value) => ({
  value,
  type: 'set_mergeTratamientoAcido',
})

export const setMergeTratamientoApuntalado = (value) => ({
  value,
  type: 'set_mergeTratamientoApuntalado',
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

    
 
    let filteredKeys = ['user', 'global', 'historicoDeAforosResults', 'estCostResults', 
    'tratamientoEstimulacion', 'tratamientoAcido', 'tratamientoApuntalado', 
    'evaluacionApuntalado', 'evaluacionAcido', 'evaluacionEstimulacion', 'resultsMeta']


    // const { pozo } = convertedFields.global
    const pozo = 'SOMETHING'

    const utc = Date.now()
    for (let k of filteredKeys) {
      if(!ignore[k]) {
        const innerObj = convertedFields[k]
        const innerKeys = Object.keys(innerObj)
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
    	console.log('submittttting')
      fetch('/api/results', {
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