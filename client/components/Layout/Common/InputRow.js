import React from 'react'
import Select from 'react-select'

export const InputRow = ({ header, name, unit }) => {

  return (
    <div className='input-row'>
      <div className='header'>
        {header}
      </div>
      <input className='input' type='text' name={name}>
      </input>
      <div className='unit'>
        {unit}
      </div>
    </div>
    )
}

export const InputRowUnitless = ({ header, name, unit }) => {

  return (
    <div className='input-row-unitless'>
      <div className='header'>
        {header}
      </div>
      <input className='input' type='text' name={name}>
      </input>
    </div>
    )
}

export const InputRowSelectUnitless = ({ header, name, options, callback }) => {

  return (
    <div className='input-row-unitless'>
      <div className='header'>
        {header}
      </div>
      <Select className='input' options={options} onChange={callback || null} />
    </div>
    )
}

