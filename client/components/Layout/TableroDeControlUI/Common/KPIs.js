import React from 'react'

export const KPI = ({ header, value, unit, className, type }) => {


  let show = value && value !== null

  let style = type === 'wide' ? {
    width: '100%', height: 'auto', display: 'block'
  } : {}

  return (
    <div className={`KPI ${className}`} style={style}>
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
