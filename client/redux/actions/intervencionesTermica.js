
export const setMergePropuestaTermica = (value) => ({
  value,
  type: 'set_mergePropuestaTermica',
})

export const setCedulaPropuestaTermica = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaPropuestaTermica',
})

export const setObervacionesEstIncTermico = value => ({ type: 'set_obervacionesEstIncTermico', value})

export const setGeneralEstProduccionTermico = (loc, val) => ({ type: 'set_generalEstProduccionTermico', loc, val })
export const setEstIncProdTermicoImgURL = (url, name) => ({ type: 'set_estIncProdTermicoImgURL', url, name})
