import moment from 'moment'
export function checkEmpty(value, name, errors, onBlur, fromSave = false) {
  let error = null
  if (!value || value.length < 1) {
    error = 'Este campo no puede estar vacio'
  } 

  if (error && fromSave) {
    error = 'Blank Error'
  }

  errors[name].value = error
  onBlur(errors)
  return error !== null
}

export function checkEmptySingular(value) {
  let error = null
  if (!value || value.length < 1) {
    error = 'Este campo no puede estar vacio'
  } 
  return error
}



export function checkDate(value, name, errors, onBlur, fromSave = false) {
  let error = null

  if (!value || value.length < 1 || value === 'Invalid date') {
    error = 'Este campo no puede estar vacio'
  } else if (!moment(value, 'YYYY-MM-DD').isValid() || (typeof value === 'string' && value.includes('_'))) {
    error = 'La fecha no esta en el formato correcto'
  }
  if (error && fromSave) {
    error = 'Blank Error'
  }
  errors[name].value = error
  onBlur(errors)
  return error !== null
 }


export function checkDateSingular(value) {
  let error = null

  if (!value || value.length < 1 || value === 'Invalid date') {
    error = 'Este campo no puede estar vacio'
  } else if (!moment(value, 'YYYY-MM-DD').isValid() || (typeof value === 'string' && value.includes('_'))) {
    error = 'La fecha no esta en el formato correcto'
  }

  return error 
 }