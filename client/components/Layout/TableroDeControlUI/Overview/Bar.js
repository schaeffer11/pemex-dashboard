// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'

const numWithCommas = (x) => {
  if (x === 0) {
    return 0
  }
  if (!x) {
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export const Bar = ({ estimated, actual }) => {


  let estWidth = estimated > actual ? '100%' : `${estimated / actual * 100}%`
  let realWidth = estimated > actual ? `${actual / estimated * 100}%` : '100%'
  let realColor = estimated > actual ? '#C71C31' : '#70AD46'

  return (
    <div className={classnames("Bar")} style={{height: '80%', paddingLeft: '30px', paddingRight: '30px'}}>
      <div style={{textAlign: 'left'}}> Real Inc Production: <span style={{color: '#0D547B', fontSize: '20px', fontWeight: 'bold'}}> {actual ? `${numWithCommas(actual.toFixed(0))} bbl/d` : null} </span> </div>
      <div style={{height: '17%', background: realColor, width: realWidth }} />
      <div style={{textAlign: 'left', paddingTop: '15px'}}> Est Inc Production: <span style={{color: '#0D547B', fontSize: '20px', fontWeight: 'bold'}}> {estimated ? `${numWithCommas(estimated.toFixed(0))} bbl/d` : null} </span> </div>
      <div style={{height: '17%', background: '#7D7D7D', width: estWidth }} />
    </div>

  )
}


export default Bar

