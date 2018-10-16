import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'

@autobind class ButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  handleClick(selectedButton) {
    this.setState({ selectedButton })
  }

  buildButtons() {
    const { buttons, fn, className } = this.props
    return buttons.map(({ value, label }) => {
      let classes = classnames(this.props.individualButtonClass, {
        active: this.props.active === value
      })
      return(
        <button disabled={this.props.disabled || false} className={classes} key={`buttonGroup_${value}`} onClick={() => this.props.onClick(value)}>
          {label}
        </button>
      )
    })
  }

  render() {
    let classes = ''
    if(this.props.className) {
      classes = this.props.className
    }
    return(
      <div className={classes}>
        {this.buildButtons()}
      </div>
    )
  }
}
export default ButtonGroup