import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import CompromisosForm from './CompromisosForm'
import ReactTable from "react-table";
import moment from 'moment'



@autobind class CompromisosUI extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            users: {},
            activos: [{}],
            myCompromisos: [{}],
            compromisos: [{}]
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

        fetch('/api/users', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    users: res.results,
                })
            })

        fetch('/api/activo', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    activos: res
                })
            })

        fetch('/api/compromiso', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    compromisos: res
                })
            })

        fetch('/api/compromiso/mine', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    myCompromisos: res
                })
            })
    }

    componentDidUpdate(prevProps) {

    }

    openForm(){
        this.setState({openModal: true})
    }

    updateData(){
        const { token } = this.props
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }

        fetch('/api/compromiso', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    openModal: false,
                    compromisos: res,
                })
            })

        fetch('/api/compromiso/mine', {
            headers,
            method: 'GET'
        })
            .then(r => r.json())
            .then((res) => {
                this.setState({
                    myCompromisos: res
                })
            })
    }

    /* TODO: IMPLEMENT */
    completeCompromiso(){
        console.log('Completar')
    }

    render() {
        return (
            <div className="compromisos">
                { this.state.openModal && <Modal updateData={this.updateData} activos={this.state.activos} users={this.state.users}/> }

                <div className="title">SISTEMA DE SEGUIMIENTO DE COMPROMISOS Y REUNIONES</div>
                { this.state.compromisos && <CompromisosTable compromisos={this.state.compromisos}/> }
                <button className="submit button" onClick={this.openForm}>Nuevo Compromiso</button>

                <div className="title">Mis Compromisos</div>
                { this.state.myCompromisos && <MyCompromisos completeCompromiso={this.completeCompromiso} compromisos={this.state.myCompromisos}/>}

            </div>
        )
    }
}

const MyCompromisos = (props) => {
    return (<ReactTable
        data={props.compromisos}
        columns={[
            {
                Header: "No.",
                accessor: "id"
            },{
                Header: "Compromiso",
                accessor: "descripcion"
            },{
                Header: "Activo",
                accessor: "nombreActivo"
            },{
                Header: "Fecha De Revision",
                id: 'fechaRevision',
                accessor: d => {
                    return moment(d.fechaRevision)
                        .local()
                        .format("DD/MM/YYYY")
                }
            },
            {
                Header: "Minuta",
                accessor: "minuta",
            },{
                Header: 'Complete',
                maxWidth: 50,
                Cell: (<button onChange={props.completeCompromiso}>Completar</button>)
            },

        ]}
        defaultPageSize={10}
        className="compromisos-table -striped -highlight"
    />)


}

const CompromisosTable = (props) => {
    return (<ReactTable
        data={props.compromisos}
        columns={[
            {
                Header: "No.",
                accessor: "id"
            },{
                Header: "Compromiso",
                accessor: "descripcion"
            },{
                Header: "Activo",
                accessor: "nombreActivo"
            },{
                Header: "Responsable",
                accessor: "nombreResponable",
            },{
                Header: "Fecha De Revision",
                id: 'fechaRevision',
                accessor: d => {
                    return moment(d.fechaRevision)
                        .local()
                        .format("DD/MM/YYYY")
                }
            },
            {
                Header: "Minuta",
                accessor: "minuta",
            }
        ]}
        defaultPageSize={10}
        className="compromisos-table -striped -highlight"
    />)


}

const Modal = (props) => {

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
                <CompromisosForm updateData={props.updateData} activos={props.activos} users={props.users}/>
            </div>
        </AriaModal>
    )
}


export default CompromisosUI
