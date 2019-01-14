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

  renderFilters() {
    const { subdireccion, activo, terminationType, formation, company, interventionType, well, field, isFilter } = this.props
    const filters = [subdireccion, activo, terminationType, formation, company, interventionType, well, field]
    const numberOfFilters = filters.filter(elem => elem !== null).length
    if (isFilter && numberOfFilters > 0) {
      const map = {
        1: 'Un',
        2: 'Dos',
        3: 'Tres',
        4: 'Cuatro',
        5: 'Cinco',
        6: 'Seis',
        7: 'Siete',
        8: 'Ocho',
      }
      const filtroText = numberOfFilters > 1 ? 'Filtros Seleccionados' : 'Filtro Seleccionado'
      return (
        <span style={{ color: '#0D547B', fontWeight: 'bold' }}>: {map[numberOfFilters]} {filtroText}</span>
      )
    }
    return null
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
          {title}{this.renderFilters()} {this.displayArrow()}
        </button>
        {isModalOpen && childrenWithProps}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  subdireccion: state.getIn(['globalAnalysis', 'subdireccion']),
  activo: state.getIn(['globalAnalysis', 'activo']),
  terminationType: state.getIn(['globalAnalysis', 'terminationType']),
  formation: state.getIn(['globalAnalysis', 'formation']),
  company: state.getIn(['globalAnalysis', 'company']),
  interventionType: state.getIn(['globalAnalysis', 'interventionType']),
  well: state.getIn(['globalAnalysis', 'well']),
  field: state.getIn(['globalAnalysis', 'field'])
})

export default connect(mapStateToProps)(LocalModal)
