import React from 'react'
import Select from 'react-select'

export const InputRow = ({ header, name, unit, value, onChange }) => {

  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }


  return (
    <div className='input-row'>
      <div className='header'>
        {header}
      </div>
      <input className='input' value={value} onChange={handleChange} type='text' name={name}>
      </input>
      <div className='unit'>
        {unit}
      </div>
    </div>
    )
}

export const InputRowUnitless = ({ header, name, unit, value, onChange }) => {

  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }


  return (
    <div className='input-row-unitless'>
      <div className='header'>
        {header}
      </div>
      <input className='input' type='text' value={value} onChange={handleChange} name={name}>
      </input>
    </div>
    )
}

export const InputRowSelectUnitless = ({ header, name, value, options, callback }) => {

  if (!options) {
    options = []
  }

  return (
    <div className='input-row-unitless'>
      <div className='header'>
        {header}
      </div>
      <Select className='input' simpleValue={true} options={options} value={options.find(i=>i.value === value)} onChange={callback} />
    </div>
    )
}

export const TextAreaUnitless = ({ header, name, unit, className, subheader, value, onChange }) => {
  
  let handleChange = (e) => {
    console.log(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className={`input-row-unitless ${className}`}>
      <div className='header'>
        {header}
        {subheader ? <br></br>: null}
        {subheader ? subheader : null}
      </div>
      <textarea type='text' style={{height: '130px'}} value={value} onChange={handleChange} name={name}>
      </textarea>
    </div>
    )
}

