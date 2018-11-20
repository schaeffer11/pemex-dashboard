import React from 'react'

export const KPI = ({ header, value, className }) => {

  return (
    <div className={`KPI ${className}`} >
      <span style={{fontWeight: '700'}}> 
        {header}:
      </span> 
      <span> 
        {" " + value}
      </span>
    </div>
    )
}
