import React from 'react'

const buildButtons = ({
  onRadioClick,
  disabled,
  buttons,
  selectedButton,
  mainClass,
  labelClass,
}) => buttons.map((button) => {
  const rand = [...Array(30)].map(() => Math.random().toString(36)[3]).join('')
  const name = `${button.value}_${rand}`
  return (
    <div
      key={`radio_${button.value}`}
      className={mainClass || ''}
    >
      <label htmlFor={name} className={labelClass || ''}>
        <input
          id={name}
          disabled={disabled}
          name={name}
          type="radio"
          checked={selectedButton === button.value}
          onChange={() => onRadioClick(button)}
        />
        {button.label}
      </label>
    </div>
  )
})

const RadioButtons = (props) => {
  const { divClass } = props
  return (
    <div className={divClass || ''}>
      {buildButtons(props)}
    </div>
  )
}

export default RadioButtons