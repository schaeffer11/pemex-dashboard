import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import AriaModal from 'react-aria-modal'
import MapeoForm from './MapeoForm'
import ImportForm from './ImportForm'


@autobind class MapeoUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      selectedMapeo: false,
      mapeo: null,
      mapeos: [{}]
    }
  }

  componentDidMount() {
    const { token, activoID, isAdmin } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }

    fetch('/api/mapeo', { headers })
      .then(r => r.json())
      .then((res) => {
        let mapeos
        if (!isAdmin && activoID !== null) {
          mapeos = res.filter(elem => elem.activo === activoID)
        } else if(isAdmin) {
          mapeos = res
        } else {
          mapeos = []
        }
        this.setState({
          mapeos,
        })
      })
  }

  componentDidUpdate(prevProps) {

  }

  openImportModal() {
    this.setState({
      openModal: true
    })
  }

  closeImportModal() {
    this.setState({
      openModal: false
    })
  }

  select(id) {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }

    if (id) {
      fetch('/api/mapeo/' + id, { headers })
        .then(r => r.json())
        .then((res) => {
          this.setState({
            mapeo: res[0],
            selectedMapeo: id,
            openModal: false
          })
        })
    }
  }

  render() {
    return (
      <div>
        {this.state.openModal &&
          <ImportModal
            mapeos={this.state.mapeos}
            select={this.select}
            closeImportModal={this.closeImportModal} />
        }
        <div className="diagnostico">
          <MapeoForm id={this.state.selectedMapeo} values={this.state.mapeo} openImportModal={this.openImportModal} />
        </div>
      </div>
    )
  }
}

const ImportModal = (props) => {

  return (
    <AriaModal
      titleId="save-modal"
      underlayClickExits={true}
      verticallyCenter={true}
      focusDialog={true}
      dialogClass="queryModalPartialReset"
      dialogStyle={{ verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '10%' }}
    >
      <div className="compromisosModal" >
        <ImportForm mapeos={props.mapeos} select={props.select} closeImportModal={props.closeImportModal} />
      </div>
    </AriaModal>
  )
}


const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
  activoID: state.getIn(['user', 'activoID']),
})

export default connect(mapStateToProps)(MapeoUI)
