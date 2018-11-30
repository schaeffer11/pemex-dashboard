import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import AriaModal from 'react-aria-modal'
import DiagnosticoForm from './DiagnosticoForm'
import ImportForm from './ImportForm'


@autobind class DiagnosticosUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      selectedDiagnostico: false,
      diagnostico: null,
      diagnosticos: [{}],
      didSubmit: false,
    }
  }

  componentDidMount() {
    const { token, activoID, isAdmin } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    console.log('headers?', token)
    fetch('/api/diagnostico', { headers })
      .then(r => r.json())
      .then((res) => {
        let diagnosticos
        if (!isAdmin && activoID !== null) {
          diagnosticos = res.filter(elem => elem.activo === activoID)
        } else if(isAdmin) {
          diagnosticos = res
        } else {
          diagnosticos = []
        }
        this.setState({
          diagnosticos
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
    console.log('MY TOKEN', token)
    const headers = {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
    }

    if (id) {
      fetch('/api/diagnostico/' + id, { headers })
        .then(r => r.json())
        .then((res) => {
          this.setState({
            diagnostico: res[0],
            selectedDiagnostico: id,
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
            diagnosticos={this.state.diagnosticos}
            select={this.select}
            closeImportModal={this.closeImportModal} />
        }
        <div className="diagnostico">
          <DiagnosticoForm id={this.state.selectedDiagnostico} token={this.props.token} values={this.state.diagnostico} openImportModal={this.openImportModal} />
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
        <ImportForm diagnosticos={props.diagnosticos} select={props.select} closeImportModal={props.closeImportModal} />
      </div>
    </AriaModal>
  )
}

const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
  activoID: state.getIn(['user', 'activoID']),
})



export default connect(mapStateToProps)(DiagnosticosUI)
