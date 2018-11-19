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

let pieChart = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    credits: {
        enabled: false,
    },
    title: {
        text: 'Compromisos por Estado'
    },
    tooltip: {
        pointFormat: '{series.name}: <b> {point.y} ({point.percentage:.1f}%)</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Compromisos',
        colorByPoint: true,
        data: []
    }]
}


@autobind class ManageCompromisos extends Component {
    constructor(props) {
        super(props)
        this.compromisosTable = null;
        this.state = {
            openModal: false,
            compromisoId: 0,
            users: {},
            activos: [{}],
            compromisos: [{}],
            filteredCompromisos: [{}],
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
                    compromisos: res,
                    filteredCompromisos: res
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
                    filteredCompromisos: res
                })
            })
    }

    onFilterChange(){
        if(this.compromisosTable){
            let sortedData = this.compromisosTable.getResolvedState().sortedData
            let filteredData = sortedData.flatMap(x => x._original)
            this.setState({
                filteredCompromisos: filteredData
            })
        }
    }

    makeCompletedGraph() {
        const compromisos = this.state.filteredCompromisos

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

        return (
            <div className="graph">
                <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {config} />
            </div>
        )
    }

    makeCompromisosChart() {
        const compromisos = this.state.filteredCompromisos
        let completedInTime = 0,
            completedLate = 0,
            incompleteInTime = 0,
            overdue = 0;
        compromisos.forEach(c => {
            let today = moment(new Date())

            if( c.fechaCumplimiento  && moment(c.fechaCumplimiento) <= moment(c.fechaCompromiso) )
                completedInTime++;
            else if( c.fechaCumplimiento  && moment(c.fechaCumplimiento) > moment(c.fechaCompromiso))
                completedLate++;
            else if( !c.fechaCumplimiento && today <= moment(c.fechaCompromiso) )
                incompleteInTime++;
            else if( !c.fechaCumplimiento && today > moment(c.fechaCompromiso) )
                overdue++;
        })
        pieChart.series[0].data = [
            {name: "Completado a Tiempo", color: '#35b06d',  y: completedInTime},
            {name: "Completado Tarde", color: '#6c757d', y: completedLate },
            {name: "Pendiente", color: '#efd23b', y: incompleteInTime },
            {name: "Vencido", color: '#d03c28', y: overdue  }
        ]
        return (
            <div className="graph">
                <ReactHighCharts className="compromisosChart" ref={(ref) => this.chart = ref} config={pieChart} />
            </div>
        )
    }


    render() {
        return (
            <div className="compromisos">
                { this.state.openModal && <Modal compromisoId={this.state.compromisoId} handleClose={this.handleClose} onUpdateData={this.onUpdateData} activos={this.state.activos} users={this.state.users}/> }

                <div className="title">SISTEMA DE SEGUIMIENTO DE COMPROMISOS Y REUNIONES</div>
                <div className="actions">
                    <button className="cta clear" onClick={(e) => this.props.history.push('/compromisos')}><i className="fa fa-undo">&nbsp;</i></button>
                </div>
                { this.state.compromisos &&
                    <CompromisosTable
                        parent={this}
                        editCompromiso={this.editCompromiso}
                        compromisos={this.state.compromisos}
                        onFilterChange={this.onFilterChange} />
                }
                <button className="submit button" onClick={this.createCompromiso}>Nuevo Compromiso</button>


                {this.makeCompletedGraph()}
                {this.makeCompromisosChart()}
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

var uniqueArray = function(arrArg) {
    return arrArg.filter(function(elem, pos,arr) {
        return arr.indexOf(elem) == pos;
    });
};

const OptionsFilter = ({column, filter, onChange}) => {
    let values = column.data.map(val => val[column.id])
    let uniqueVals = uniqueArray(values).map(val => {return {'value': val, 'label': val}})
    return(
        <Select
            isClearable
            simpleValue
            placeholder="Seleccionar"
            className='input'
            options={uniqueVals}
            value={ filter ? filter.index : 'All' }
            onChange={selectedOption => {
                const val = selectedOption ? selectedOption.value : ''
                onChange(val)
            }}
        />
    )
}

const FutureDateFilter = ({filter, onChange}) => {
    return (
        <Select
            isClearable
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
                const val = selectedOption ? selectedOption.value : ''
                onChange(val)
            }}
        />
    )
}

const StatusFilter = ({filter, onChange}) => {
    return (
        <Select
            isClearable
            simpleValue
            placeholder="Seleccionar"
            className='input'
            options={[
                {value: 'todos'    , 'label': 'Mostrar Todos'},
                {value: 'Vencido'  , 'label': 'Vencido'},
                {value: 'Abierto'  , 'label': 'Abierto'},
                {value: 'Completo' , 'label': 'Completo'},
            ]}
            value={ filter ? filter.index : 'todos' }
            onChange={selectedOption => {
                const val = selectedOption ? selectedOption.value : ''
                onChange(val)
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

const optionsFilterMethod = (filter, row) => {
    if(filter.value === '') { return true }

    return row[filter.id] === filter.value
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
        ref={(r) => props.parent.compromisosTable = r}
        onFilteredChange={props.onFilterChange}
        columns={[
            {
                Header: "No.",
                accessor: "id",
                width: 100
            },{
                Header: "Compromiso",
                accessor: "descripcion",
                filterAll: true,
                filterMethod: fuzzyFilterMethod
            },{
                Header: "Subdireccion",
                accessor: "subdireccion",
                data: props.compromisos,
                Filter: OptionsFilter
            },{
                Header: "Activo",
                accessor: "nombreActivo",
                data: props.compromisos,
                Filter: OptionsFilter
            },{
                Header: "Responsable",
                accessor: "nombreResponable",
                id: "nombreResponable",
                width: 200,
                data: props.compromisos,
                Filter: OptionsFilter
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
                width: 120
            }, {
                Header: 'Porcentage de Avance',
                accessor: 'avance',
                Cell: row => (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#dadada',
                            borderRadius: '2px'
                        }}
                    >
                        <div
                            style={{
                                width: `${row.value}%`,
                                height: '100%',
                                backgroundColor: row.value > 66 ? '#33754a'
                                    : row.value > 33 ? '#efd23b'
                                        : '#d03c28',
                                borderRadius: '2px',
                                transition: 'all .2s ease-out'
                            }}
                        />
                    </div>
                )
            },{
                Header: "Estado",
                id: 'estado',
                className: 'center',
                width: 120,
                accessor: d => {
                    if(d.fechaCumplimiento){
                        return "Completo"
                    }

                    const pastDue = moment(new Date()) > moment(d.fechaCompromiso);
                    return pastDue ? 'Vencido' : 'Abierto'
                },
                filterMethod:optionsFilterMethod,
                Filter: StatusFilter,
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
        return (<span className="complete">Completo <i class="fas fa-check-square"></i></span>)
    }

    const pastDue = moment(new Date()) > moment(original.fechaCompromiso);
    return (
        <span className={pastDue ? 'incomplete' : 'open'}>
            {pastDue ?
                <span>Vencido <i class="fas fa-times-circle"></i></span> :
                <span>Abierto <i class="fas fa-exclamation-circle"></i></span>}
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
            dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '20%'}}
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
