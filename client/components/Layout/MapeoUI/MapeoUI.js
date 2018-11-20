import React, { Component } from 'react'
import autobind from 'autobind-decorator'
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
        const { token } = this.props
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }

        fetch('/api/mapeo', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    mapeos: res,
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
            fetch('/api/mapeo/' +  id, {
                headers,
                method: 'GET'
            })
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
                { this.state.openModal &&
                    <ImportModal
                        mapeos={this.state.mapeos}
                        select={this.select}
                        closeImportModal={this.closeImportModal} />
                }
                <div className="diagnostico">
                    <MapeoForm id={this.state.selectedMapeo} values={this.state.mapeo} openImportModal={this.openImportModal}/>
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
            dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '10%'}}
        >
            <div className="compromisosModal" >
                <ImportForm mapeo={props.mapeo} select={props.select} closeImportModal={props.closeImportModal} />
            </div>
        </AriaModal>
    )
}



export default MapeoUI
