import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import CompleteCompromisoForm from './CompleteCompromisoForm'
import ReactTable from "react-table";
import moment from 'moment'
import { Link, Redirect } from 'react-router-dom'



@autobind class CompromisosUI extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            compromisoId: 0,
            activos: [{}],
            myCompromisos: [{}]
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

    onUpdateData(){
        const { token } = this.props
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }

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

    viewDetails(id){
        console.log(id)
       this.setState({
           openModal: true,
           compromisoId: id
       })
    }

    handleClose(){
        this.setState({
            openModal: false
        })
    }

    render() {
        return (
            <div className="compromisos">
                { this.state.openModal && <Modal handleClose={this.handleClose} compromisoId={this.state.compromisoId} onUpdateData={this.onUpdateData} activos={this.state.activos}/> }

                <div className="title">
                    <i className="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => this.props.history.push('/')}></i>
                    Mis Compromisos
                    <Link className="cta" to="/compromisos/manage">Administrar Compromisos</Link>
                </div>
                { this.state.myCompromisos && <MyCompromisos viewDetails={this.viewDetails} compromisos={this.state.myCompromisos}/>}

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
                accessor: "id",
                width: 100
            },{
                Header: "Compromiso",
                accessor: "descripcion"
            },{
                Header: "Activo",
                accessor: "nombreActivo"
            },{
                Header: "Fecha De Revision",
                id: 'fechaRevision',
                width: 150,
                accessor: d => {
                    return moment(d.fechaRevision)
                        .local()
                        .format("DD/MM/YYYY")
                },
                sortMethod: (a, b) => {
                    a = new Date(a).getTime();
                    b = new Date(b).getTime();
                    return b > a ? 1 : -1;
                }
            },
            {
                Header: "Minuta",
                accessor: "minuta",
                width: 200,
            },{
                Header: '',
                maxWidth: 150,
                Cell: ({ row, original }) => (<button className="completar" id={original.id} onClick={() => props.viewDetails(original.id)}>Ver Detalles</button>)
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
                <button className="close" onClick={props.handleClose}>X</button>
                <CompleteCompromisoForm handleClose={props.handleClose} id={props.compromisoId} />
            </div>
        </AriaModal>
    )
}


export default CompromisosUI
