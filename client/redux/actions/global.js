export const setShowForms = value => ({ type: 'set_showForms', value })
export const setSaved = value => ({ type: 'set_saved', value })
export const setIsLoading = obj => ({ type: 'set_isLoading', obj })
export const setImagesInState = images => ({ type: 'set_imagesInState', images })
export const resetNotification = () => ({ type: 'reset_notification' })
export const setCurrentPage = value => ({ type: 'set_currentPage', value })
export const setHasSubmitted = value => ({ type: 'set_hasSubmitted', value})
export const setTransactionID = value => ({ type: 'set_transactionID', value})
export const setSaveName = value => ({ type: 'set_saveName', value})


export const setActivo = value => ({ type: 'set_activo', value})
export const setField = value => ({ type: 'set_field', value})
export const setWell = value => ({ type: 'set_well', value})
export const setJob = value => ({ type: 'set_job', value})
export const setFormation = value => ({ type: 'set_formation', value})
export const setJobType = value => ({ type: 'set_jobType', value})

export const setGeneralGlobalAnalysis = (location, value) => ({
  type: 'set_generalGlobalAnalysis',
  location,
  value,
})