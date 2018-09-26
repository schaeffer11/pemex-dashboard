import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import datepicker from "react-datepicker/dist/react-datepicker.css";

const generateErrorElements = ( name = '', errors = [] ) => {
  let rowError = errors[name]

  if(rowError && rowError.checked){
    return ( <div className="error">{rowError.message}</div> )
  }

  return ''
}

export const InputRow = ({ header, type='number', name, unit, value, onChange, onBlur, index, errors = [] }) => {

  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row'>
      <div className='label'>
        {header}
      </div>
      <input className='input' type={type} value={value} onChange={handleChange} onBlur={onBlur} name={name} index={index} required>
      </input>
      <div className='unit'>
        {unit}
      </div>
      { errorElements }
    </div>
    )
}

export const InputRowUnitless = ({ header, type='text', name, unit, value, onChange, onBlur, index={index}, errors = [] }) => {

  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  const errorElements = generateErrorElements(name, errors)
 
  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <input className='input' type={type} value={value} onChange={handleChange} onBlur={onBlur} name={name} index={index}/>
      { errorElements }
    </div>
    )
}

export const InputRowSelectUnitless = ({ header, name, value, options, callback, onBlur, index, errors=[] }) => {

  if (!options) {
    options = []
  }

  //Suplement the event object with the properties that are not provided by the Select component
  let handleBlur = (e) => {
    if(onBlur && onBlur instanceof Function){
      e.target.name = name
      e.target.value = options.find(i=>i.value === value)
      onBlur(e)
    }
  }
  
  const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <Select className='input' simpleValue={true} options={options} value={options.find(i=>i.value === value) || null} onChange={callback} onBlur={handleBlur} name={name} index={index} />
      { errorElements }
    </div>
    )
}

export const TextAreaUnitless = ({ header, name, unit, className, subheader, value, onChange, index, onBlur, errors =[] }) => {
  
  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  const errorElements = generateErrorElements(name, errors)

  return (
    <div className={`input-row input-row-unitless ${className}`}>
      <div className='label'>
        {header}
        {subheader ? <br></br>: null}
        {subheader ? subheader : null}
      </div>
      <textarea type='text' style={{height: '130px'}} value={value} onChange={handleChange} onBlur={onBlur} name={name} index={index}>
      </textarea>
      { errorElements }
    </div>
    )
}

export const InputRowCosts = ({ header, name, unit, value, onChange, index, onBlur, errors = [] }) => {

  let handleCostChange = (e) => {
    onChange({ cost: e.target.value, company: value.company })
  }

    let handleCompChange = (e) => {
    onChange({ cost: value.cost, company: e.target.value })
  }

  const costName = `${name}`
  const companyName = `${name}`
  const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row input-row-company'>
      <div className='label'>
        {header}
      </div>
      <input className='input' type="number" value={value.cost} onChange={handleCostChange} name={costName} onBlur={onBlur}  index={index} required>
      </input>
      <div className='unit'>
        {unit}
      </div>
      <div className='company-header label'>
        Company
      </div>
      <input className='company-input' value={value.company} onChange={handleCompChange} name={companyName} onBlur={onBlur} index={index} required>
      </input>
      {errorElements}
    </div>
    )
}

export const InputDate = ({ name, onChange, value, header, onBlur, errors }) => {
  const errorElements = generateErrorElements(name, errors)
  let handleSelect = (date, event) => {
    if(date)
      onChange(date.format('YYYY-MM-DD'))
  }
  const objValue = value ? moment(value) : null 
 
  return (
     <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <DatePicker
        isClearable={true}
        dateFormat="L"
        name={name} 
        onKeyDown={(e) => {e.preventDefault(); return false; }} //Disable input from user
        onChange={handleSelect}
        onBlur={onBlur}
        selected={objValue}
        locale="es-mx"
      />
      {errorElements}
    </div>
    
  )
}



