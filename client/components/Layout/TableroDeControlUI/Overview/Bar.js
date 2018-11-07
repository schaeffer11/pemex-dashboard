// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'


export const Bar = ({ estimated, actual }) => {



  console.log(estimated, actual)

  return (
    <div className={classnames("Bar")} style={{height: '100%'}}>
    </div>

  )
}


export default Bar

