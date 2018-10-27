import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import CompromisosForm from './CompromisosForm'
import ReactTable from "react-table";
import moment from 'moment'
import ReactHighCharts from 'react-highcharts'
import Select from 'react-select'
import Fuse from 'fuse.js'

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


const FutureDateFilter = ({filter, onChange}) => {
    return (
        <Select
            simpleValue
            placeholder="Seleccionar"
            className='input'
            options={[
                {value: 'todos' , 'label': 'Mostrar Todos'},
                {value: 'semana', 'label': 'Próxima Semana'},
                {value: 'mes'   , 'label': 'Próximo Mes'},
                {value: 'meses' , 'label': 'Próximos 3 Meses'},
            ]}
            value={ filter ? filter.index : 'todos' }
            onChange={selectedOption => {
                onChange(selectedOption.value)
            }}
        />
    )
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


var fuzzyFilterOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: []
}

const fuzzyFilterMethod = (filter, rows) => {
    let options = Object.assign({}, fuzzyFilterOptions, {keys: [filter.id]});
    let fuse = new Fuse(rows, options);
    return fuse.search(filter.value);
}

const futureDateFilterMethod = (filter, row) => {
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
}



const CompromisosTable = (props) => {
    return (<ReactTable
        filterable
        data={props.compromisos}
        columns={[
            {
                Header: "No.",
                accessor: "id",
                width: 100,
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            },{
                Header: "Compromiso",
                accessor: "descripcion",
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            },{
                Header: "Activo",
                accessor: "nombreActivo",
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            },{
                Header: "Responsable",
                accessor: "nombreResponable",
                width: 200,
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            },{
                Header: "Fecha De Compromiso",
                id: 'fechaCompromiso',
                className: 'center',
                width: 200,
                accessor: d => {
                    return moment(d.fechaCompromiso)
                        .local()
                        .format("DD/MM/YYYY")
                },
                sortMethod: (a, b) => {
                    a = new Date(a).getTime();
                    b = new Date(b).getTime();
                    return b > a ? 1 : -1;
                },
                filterMethod: futureDateFilterMethod,
                Filter: FutureDateFilter
            },{
                Header: "Fecha De Cumplimiento",
                id: 'fechaCumplimiento',
                className: 'center',
                width: 200,
                accessor: d => {
                    return d.fechaCumplimiento ?
                        moment(d.fechaCumplimiento)
                         .local()
                         .format("DD/MM/YYYY") : "";
                },
                sortMethod: (a, b) => {
                    a = new Date(a).getTime();
                    b = new Date(b).getTime();
                    return b > a ? 1 : -1;
                },
                filterMethod: futureDateFilterMethod,
                Filter: FutureDateFilter
            }, {
                Header: "Minuta",
                accessor: "minuta",
                className: 'center',
                width: 120,
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            }, {
                Header: "Estado",
                accessor: "estado",
                className: 'center',
                width: 120,
                Cell: ({ row, original }) => (<Status row={row} original={original}/>)
            }, {
                Header: '',
                maxWidth: 150,
                filterable: false,
                Cell: ({row, original}) => (<button className="completar" id={original.id} onClick={() => props.editCompromiso(original.id)}>Editar</button>),
            }
        ]}
        defaultPageSize={10}
        className="compromisos-table -striped -highlight"
    />)


}

const Status = ({ row, original }) => {
    if(original.fechaCumplimiento){
        return (<span className="complete">Completo</span>)
    }

    const pastDue = moment(new Date()) > moment(original.fechaCompromiso);
    return (
        <span class={pastDue ? 'incomplete' : 'open'}>
            {pastDue ? 'Vencido' : 'Abierto' }
        </span>
    )
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
