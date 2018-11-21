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
    this.setState({ isModalOpen: !isModalOpen })
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
    const { jobID, children } = this.props
    return (
      <div>
        <button className={'open-export-btn'} onClick={() => this.toggleModal()}>generar presentacion {this.displayArrow()}</button>
        {isModalOpen && children}
      </div>
    )
  }
}

export default LocalModal
