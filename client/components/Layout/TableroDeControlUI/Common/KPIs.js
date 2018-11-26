import React from 'react'

export const KPI = ({ header, value, unit, className }) => {


  let show = value && value !== null

  console.log(value, show)
  return (
    <div className={`KPI ${className}`} >
      <span style={{fontWeight: '700'}}> 
        {header}:
      </span> 
      <span> 
        {" " + (show ? value : '-')}
      </span>
      { show && unit ?
        <span>
          {unit}
        </span>
        : null
      }
    </div>
    )
}
