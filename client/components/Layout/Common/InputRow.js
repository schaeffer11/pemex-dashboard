import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";
import moment from 'moment'
import { checkEmpty, checkDate } from '../../../lib/errorCheckers'
import datepicker from "react-datepicker/dist/react-datepicker.css";

const generateErrorElements = ( name = '', errors = [] ) => {
  let rowError = errors[name]

  if(rowError && rowError.checked){
    return ( <div className="error">{rowError.message}</div> )
  }

  return ''
}

export const InputRow = ({ header, type='number', name, unit, value, onChange, onBlur, index, errors = {}, style = {} }) => {
  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  // const errorElements = generateErrorElements(name, errors)

  return (
    <div className='input-row' style={style}>
      <div className='label'>
        {header}
      </div>
      <input className='input' type={type} value={value} onChange={handleChange} onBlur={(e) => checkEmpty(e, name, errors, onBlur)} name={name} index={index} required>
      </input>
      <div className='unit'>
        {unit}
      </div>
      {errors[name] !== null && <div className="error">{errors[name]}</div>}
    </div>
    )
}

export const CalculatedValue = ({ header, name, unit, value, style={} }) => {
  return (

  <div className='input-row' style={style}>
      <div className='label'>
        {header}
      </div>
      <span className='input'>
        {value}
      </span>
      <div className='unit'>
        {unit}
      </div>
    </div>
  )
}

export const InputRowUnitless = ({ ref, header, type='text', name, unit, value, onChange, onBlur, index={index}, errors = {} }) => {

  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  // const errorElements = generateErrorElements(name, errors)
 
  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <input className='input' type={type} value={value} onChange={handleChange} onBlur={(e) => checkEmpty(e.target.value, name, errors, onBlur)} name={name} index={index}/>
      {errors[name] && errors[name].value !== null && <div className="error">{errors[name].value}</div>}
    </div>
    )
}

export const InputRowSelectMulti = ({ header, name, value, options, callback, onBlur, index, errors=[] }) => {
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
  {/* value={options.find(i=>i.value === value) || null}
        onChange={callback}
        onBlur={handleBlur} */}

  return (
    <div className='input-row input-row-unitless'>
      <div className='label'>
        {header}
      </div>
      <Select
        className='input'
        isMulti
        simpleValue={true}
        options={options}
        onChange={callback}
        name={name}
        index={index}
        onBlur={handleBlur}
      />
      {/* { errorElements } */}
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
      <Select placeholder="Seleccionar..." className='input' simpleValue={true} options={options} value={options.find(i=>i.value === value) || null} onChange={callback} onBlur={handleBlur} name={name} index={index} />
      { errorElements }
    </div>
    )
}

export const TextAreaUnitless = ({ header, name, unit, className, subheader, value, onChange, index, onBlur, tooltip, errors =[] }) => {
  
  let handleChange = (e) => {
    onChange(e.target.value, e)
  }

  const errorElements = generateErrorElements(name, errors)

  return (
    <div className={`input-row input-row-unitless ${className}`}>
      <div className='label' title={tooltip}>
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
  // const errorElements = generateErrorElements(name, errors)
  let handleSelect = (date, event) => {
    console.log('what are ', date)
    if (date) {
      onChange(date.format('YYYY-MM-DD'))
    }
  }
  // function handleSelect2(date) {
  //   console.log('numero 2', date)
  // }

  function handleBlur(e) {
    console.log('blur', e.target.value)
    const error = checkDate(e.target.value, name, errors, onBlur)
    if (error === null) {
      onChange(moment(e.target.value).format('YYYY-MM-DD'))
    } else {
      console.log('error')
    }
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
        onChange={handleSelect}
        onBlur={handleBlur}
        selected={objValue}
        locale="es-mx"
      />
      {errors[name] && errors[name].value !== null && <div className="error">{errors[name].value}</div>}      
    </div>
    
  )
}



