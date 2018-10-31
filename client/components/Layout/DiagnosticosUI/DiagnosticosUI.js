import React, { Component } from 'react'
import autobind from 'autobind-decorator'
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
            diagnosticos: [{}]
        }
    }

    componentDidMount() {
        const { token } = this.props
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }

        fetch('/api/diagnostico', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    diagnosticos: res,
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
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }

        if (id) {
            fetch('/api/diagnostico/' +  id, {
                headers,
                method: 'GET'
            })
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
                { this.state.openModal && <ImportModal diagnosticos={this.state.diagnosticos} select={this.select} /> }
                <div className="diagnostico">
                    <DiagnosticoForm values={this.state.diagnostico} id={this.state.selectedDiagnostico}/>
                </div>
                <button className="submit" onClick={this.openImportModal}>Import</button>
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
            dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '2%'}}
        >
            <div className="compromisosModal" >
                <ImportForm diagnosticos={props.diagnosticos} select={props.select} />
            </div>
        </AriaModal>
    )
}



export default DiagnosticosUI
