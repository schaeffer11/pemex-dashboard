import React from 'react'

export const KPI = ({ header, value }) => {

  return (
    <div className='KPI' style={{width: '200px', display: 'inline-block'}}>
      <span style={{fontWeight: '700'}}> 
        {header}:
      </span> 
      <span> 
        {" " + value}
      </span>
    </div>
    )
}
