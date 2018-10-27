
export const setMergePropuestaTermica = (value) => ({
  value,
  type: 'set_mergePropuestaTermica',
})

export const setCedulaPropuestaTermica = (cedula, volumes) => ({
  cedula,
  volumes,
  type: 'set_cedulaPropuestaTermica',
})
