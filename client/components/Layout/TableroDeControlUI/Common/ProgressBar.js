import React from 'react'

const ProgressBar = ({ percentage }) => {
  percentage = percentage > 100 ? 100 : percentage
  console.log('da percentage', percentage)
  return (
    <div className="my-progress-bar">
      <div className="my-filler" style={{ width: `${percentage}%` }} />
    </div>
  )
}

export default ProgressBar
