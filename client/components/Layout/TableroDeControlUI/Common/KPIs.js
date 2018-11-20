import React from 'react'

export const KPI = ({ header, value, unit, className }) => {

  return (
    <div className={`KPI ${className}`} >
      <span style={{fontWeight: '700'}}> 
        {header}:
      </span> 
      <span> 
        {" " + value}
      </span>
      { unit ?
        <span>
          {unit}
        </span>
        : null
      }
    </div>
    )
}
