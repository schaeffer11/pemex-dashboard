export const setShowForms = value => ({ type: 'set_showForms', value })
export const setSaved = value => ({ type: 'set_saved', value })
export const setIsLoading = obj => ({ type: 'set_isLoading', obj })
export const setImagesInState = (images, pruebasDeLaboratorio, isSaved) => ({ 
  type: 'set_imagesInState',
  images,
  pruebasDeLaboratorio,
  isSaved 
})
export const resetNotification = () => ({ type: 'reset_notification' })
export const setTab = value => ({ type: 'set_tab', value })
export const setCurrentPage = value => ({ type: 'set_currentPage', value })
export const setHasSubmitted = value => ({ type: 'set_hasSubmitted', value})
export const setTransactionID = value => ({ type: 'set_transactionID', value})
export const setSaveName = value => ({ type: 'set_saveName', value})


export const setActivo = value => ({ type: 'set_activo', value })
export const setField = value => ({ type: 'set_field', value })
export const setWell = value => ({ type: 'set_well', value })
export const setJob = value => ({ type: 'set_job', value })
export const setFormation = value => ({ type: 'set_formation', value })
export const setJobType = value => ({ type: 'set_jobType', value })
export const setWellAndJob = value => ({ type: 'set_wellAndJob', value })

export const setGeneralGlobalAnalysis = (location, value) => ({
  type: 'set_generalGlobalAnalysis',
  location,
  value,
})

export const setMergeGlobalAnalysis = (obj) => ({
  type: 'set_mergeGlobalAnalysis',
  obj,
})

export const setGroupByAndGroups = (groupBy, groups) => ({
  type: 'set_groupByAndGroup',
  groupBy,
  groups,
})

export const setTimeSlider = (lowDate, highDate) => ({
  type: 'set_timeSlider',
  lowDate,
  highDate,
})

export const setGeneralFilters = (value) => ({
  type: 'set_generalFilters',
  value,
})

export const setCompanyOptions = value => ({ type: 'set_companyOptions', value})
export const setJustificationOptions = value => ({ type: 'set_justificationOptions', value})
export const setLitologiaOptions = value => ({ type: 'set_litologiaOptions', value})
export const setTipoDeTerminationOptions = value => ({ type: 'set_tipoDeTerminationOptions', value})
export const setTipoDeLinerOptions = value => ({ type: 'set_tipoDeLinerOptions', value})