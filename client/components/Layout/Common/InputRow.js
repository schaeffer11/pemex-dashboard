import React from 'react'
import Select from 'react-select'

const generateErrorElements = ( name = '', errors = [] ) => {
  let rowError = errors.find(error => error.field == name)

  if(rowError){
    return ( <div className="error">{rowError.message}</div> )
  }

/*
  rowErrors.forEach(error => {
    errorElements.push(<div className="error">{error.message}</div>)
  })
*/
  return ''
}

export const InputRow = ({ header, name, unit, value, onChange, errors = [] }) => {

  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }

  const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row'>
      <div className='label'>
        {header}
      </div>
      <input className='input' value={value} onChange={handleChange} name={name} required>
      </input>
      <div className='unit'>
        {unit}
      </div>
    </div>
    )
}

export const InputRowUnitless = ({ header, name, unit, value, onChange, errors = [] }) => {

  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }

  const errorElements = generateErrorElements(name, errors)
 
  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <input className='input' type='text' value={value} onChange={handleChange} name={name}/>
      { errorElements }
    </div>
    )
}

export const InputRowSelectUnitless = ({ header, name, value, options, callback, errors=[] }) => {

  if (!options) {
    options = []
  }

  const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <Select className='input' simpleValue={true} options={options} value={options.find(i=>i.value === value)} onChange={callback} name={name} />
      { errorElements }
    </div>
    )
}

export const TextAreaUnitless = ({ header, name, unit, className, subheader, value, onChange, errors =[] }) => {
  
  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className={`input-row input-row-unitless ${className}`}>
      <div className='label'>
        {header}
        {subheader ? <br></br>: null}
        {subheader ? subheader : null}
      </div>
      <textarea type='text' style={{height: '130px'}} value={value} onChange={handleChange} name={name}>
      </textarea>
    </div>
    )
}

