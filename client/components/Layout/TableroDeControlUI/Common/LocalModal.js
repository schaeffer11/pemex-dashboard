import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import Select from 'react-select'
import { generatePowerPoint } from '../../../../pptx'
import ProgressBar from '../Common/ProgressBar'

@autobind class LocalModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      isModalOpen: false,
    }
  }

  toggleModal() {
    const { isModalOpen } = this.state
    return this.setState({ isModalOpen: !isModalOpen })
  }

  closeModal() {
    this.setState({ isModalOpen: false })
  }

  displayArrow() {
    const { isModalOpen } = this.state
    if (isModalOpen) {
      return <i className="fas fa-chevron-up" />
    }
    return <i className="fas fa-chevron-down" />
  }

  render() {
    const { isModalOpen } = this.state
    const { children, title, id } = this.props
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { closeModal: this.closeModal, id })
    )
    return (
      <div className="localModal">
        <button id={id} className={'open-export-btn'} onClick={() => this.toggleModal()}>
          {title} {this.displayArrow()}
        </button>
        {isModalOpen && childrenWithProps}
      </div>
    )
  }
}

export default LocalModal
