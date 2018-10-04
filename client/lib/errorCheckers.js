import moment from 'moment'
export function checkEmpty(value, name, errors, onBlur) {
  let error = null
  if (!value || value.length < 1) {
    error = 'Este campo no puede estar vacio'
  } 
  console.log('errors', name, errors, errors[name])
  errors[name].value = error
  onBlur(errors)
}

export function checkDate(value, name, errors, onBlur) {
  let error = null
  console.log('checking dates', typeof value, value, !value, value.length)
  if (!value || value.length < 1 || value === 'Invalid date') {
    error = 'Este campo no puede estar vacio'
  } else if (!moment(value, 'YYYY-MM-DD').isValid()) {
    error = 'La fecha no esta en el formato correcto'
  }
  errors[name].value = error
  onBlur(errors)
  return error
}
