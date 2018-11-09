// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'


export const Bar = ({ estimated, actual }) => {


  let estWidth = estimated > actual ? '100%' : `${estimated / actual * 100}%`
  let realWidth = estimated > actual ? `${actual / estimated * 100}%` : '100%'
  let realColor = estimated > actual ? 'red' : '#93D050'

  return (
    <div className={classnames("Bar")} style={{height: '100%', padding: '33px'}}>
      <div style={{textAlign: 'left'}}> Real Prod. - {actual ? `${actual.toFixed(0)} bbl/d` : null} </div>
      <div style={{height: '20%', background: realColor, width: realWidth }} />
      <div style={{textAlign: 'left'}}> Est Prod. - {estimated ? `${estimated.toFixed(0)} bbl/d` : null} </div>
      <div style={{height: '20%', background: 'grey', width: estWidth }} />
    </div>

  )
}


export default Bar

