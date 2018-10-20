import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import CompromisosForm from './CompromisosForm'
import ReactTable from "react-table";
import moment from 'moment'
import ReactHighCharts from 'react-highcharts'
import Select from 'react-select'

moment.locale('es-mx');


let config = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Compromisos Completados'
    },
    credits: {
        enabled: false
    },
    xAxis: {
        title: {
            enabled: true,
            text: ''
        },
        type: 'category'
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: ''
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'Sin Completar',
        color: '#6c757d',
        data: []
    }, {
        name: 'Completos',
        color: '#35b06d',
        data: []
    }],
}


@autobind class ManageCompromisos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            compromisoId: 0,
            users: {},
            activos: [{}],
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
    }

    componentDidUpdate(prevProps) {

    }

    createCompromiso(){
        this.setState({compromisoId: 0, openModal: true})
    }

    handleClose(){
        this.setState({compromisoId: 0, openModal: false})
    }

    editCompromiso(id){
        this.setState({ compromisoId: id, openModal: true})
    }

    onUpdateData(){
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
    }

    makeCompletedGraph() {
        const compromisos = this.state.compromisos

        if (compromisos.length > 1) {
            let completos = []
            let sinCompletar = []
            let activos = groupRecords(compromisos, 'nombreActivo')

            Object.entries(activos).forEach(([key, a]) => {
                let completosInActivo = a.filter(e => e.fechaCumplimiento)
                let incompletosInActivo = a.filter(e => !e.fechaCumplimiento)

                completos.push([key, completosInActivo.length])
                sinCompletar.push([key, incompletosInActivo.length])
            })


            config.series[0].data = sinCompletar
            config.series[1].data = completos
        }

        return (
            <div className="graph">
                <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {config} />
            </div>
        )

    }


    render() {
        return (
            <div className="compromisos">
                { this.state.openModal && <Modal compromisoId={this.state.compromisoId} handleClose={this.handleClose} onUpdateData={this.onUpdateData} activos={this.state.activos} users={this.state.users}/> }

                <div className="title">
                    <i className="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => this.props.history.push('/compromisos')}></i>
                    SISTEMA DE SEGUIMIENTO DE COMPROMISOS Y REUNIONES
                </div>
                { this.state.compromisos && <CompromisosTable editCompromiso={this.editCompromiso} compromisos={this.state.compromisos}/> }
                <button className="submit button" onClick={this.createCompromiso}>Nuevo Compromiso</button>


                {this.makeCompletedGraph()}
            </div>
        )
    }
}

const groupRecords = function(rec, key) {
    return rec.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const isWithinAWeek = function(date) {
    var today = moment(new Date());
    var momentDate = moment(date, "DD-MM-YYYY");
    var A_WEEK_OLD = today.clone().add(7, 'days').startOf('day');
    return !momentDate.isBefore(today) && momentDate.isBefore(A_WEEK_OLD);
}

const isWithinAMonth = function(date) {
    var today = moment(new Date());
    var momentDate = moment(date, "DD-MM-YYYY");
    var A_MONTH_OLD = today.clone().add(1, 'months').startOf('day');
    return !momentDate.isBefore(today) && momentDate.isBefore(A_MONTH_OLD);
}

const isWithinThreeMonth = function(date) {
    var today = moment(new Date());
    var momentDate = moment(date, "DD-MM-YYYY");
    var A_WEEK_OLD = today.clone().add(3, 'months').startOf('day');
    return !momentDate.isBefore(today) && momentDate.isBefore(A_WEEK_OLD);
}

const CompromisosTable = (props) => {
    return (<ReactTable
        filterable
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
                Header: "Responsable",
                accessor: "nombreResponable",
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
                },
                filterMethod: (filter, row) => {
                    if (filter.value === "todos") {
                        return true;
                    }
                    if (filter.value === "semana") {
                        return isWithinAWeek(row[filter.id]);
                    }
                    if (filter.value === "mes") {
                        return isWithinAMonth(row[filter.id]);
                    }
                    if (filter.value === "meses") {
                        return isWithinThreeMonth(row[filter.id]);
                    }
                    return true;
                },
                Filter: ({filter, onChange}) => {
                    return (
                        <Select
                            simpleValue
                            placeholder="Seleccionar"
                            className='input'
                            options={[
                                {value: 'todos' , 'label': 'Mostrar Todos'},
                                {value: 'semana', 'label': 'Próxima Semana'},
                                {value: 'mes'   , 'label': 'Próximo Mes'},
                                {value: 'meses' , 'label': 'Próximo 3 Meses'},
                            ]}
                            value={ filter ? filter.index : 'todos' }
                            onChange={selectedOption => {
                                onChange(selectedOption.value)
                            }}
                        />
                        /*
                        <select
                            onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}
                        >
                            <option value="todos">Mostrar Todos</option>
                            <option value="semana">Próxima Semana</option>
                            <option value="mes">Próximo Mes</option>
                            <option value="meses">Próximo 3 Meses</option>
                        </select>
                        */
                    )}
            },
            {
                Header: "Minuta",
                accessor: "minuta",
                width: 150,
            }, {
                Header: '',
                maxWidth: 150,
                Cell: ({row, original}) => (<button className="completar" id={original.id} onClick={() => props.editCompromiso(original.id)}>Editar</button>),
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
                <CompromisosForm
                    id={props.compromisoId}
                    handleClose={props.handleClose}
                    onUpdateData={props.onUpdateData}
                    activos={props.activos}
                    users={props.users} />
            </div>
        </AriaModal>
    )
}


export default ManageCompromisos
