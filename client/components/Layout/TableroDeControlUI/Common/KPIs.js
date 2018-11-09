import React from 'react'

export const KPI = ({ header, value }) => {

  return (
    <div className='KPI' >
      <span style={{fontWeight: '700'}}> 
        {header}:
      </span> 
      <span> 
        {" " + value}
      </span>
    </div>
    )
}
