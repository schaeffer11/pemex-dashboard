import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import { setAforosData, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ReactTable from 'react-table'
import ReactHighCharts from 'react-highcharts'

let config = {
   chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: 'Aforos Data'
    },
    tooltip: {
      formatter:function () {
        let xVal = new Date(this.x)
        let xString = `${xVal.getDate()}/${xVal.getMonth() + 1}/${xVal.getFullYear()}`
        var retVal="<small>"+xString+"</small><br><br>";
        retVal+="<div style=height:14px;font-size:12px;line-height:14px;>";
        retVal+= "<div class='tooltip-line'>" + this.point.series.name+": <strong>"+this.y.toFixed(0)+ ' ' + this.point.series.userOptions.label+"</strong> </div> <br>";
        return retVal;
      }
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Date'
        },
        type: 'datetime'
    },
    yAxis: [{
        title: {
            text: 'Rate (bbl/d)'
        }
    }, {
        opposite: true,
        title: {
            text: 'Rate (MMpc/d)'
        }
    }],
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
            },

        }
    },
    series: [{
        name: 'Qo',
        color: '#35b06d',
        label: 'bbl/d',
        data: []
    }, {
        name: 'Qg',
        color: '#CC3D3D',
        yAxis: 1,
        label: 'MMpc/d',
        data: []
    }, {
        name: 'Qw',
        color: '#3a88c0',
        label: 'bbl/d',
        data: []
    }]
}

let columns = [
  {
    Header: '',
    accessor: 'delete',
    width: 35,
    resizable: false,
    Cell: row => {
      if (row.original.length > 1) {
        return (<div style={{color: 'white', background: 'red', borderRadius: '4px', textAlign: 'center', cursor: 'pointer'}}>X</div>)
      }
    }
  }, {
    Header: 'Fecha',
    accessor: 'fecha',
    cell: 'renderDate',
  }, { 
    Header: <div>Tiempo<br/>(hrs)</div>,
    accessor: 'tiempo',
    cell: 'renderNumber',
  }, { 
    Header: <div>Estrangulador<br/>(pg)</div>,
    accessor: 'estrangulador',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>TP</sub><br/>(kg/cm<sup>2</sup>)</div>,
    accessor: 'ptp',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>TP</sub><br/>(°C)</div>,
    accessor: 'ttp',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>baj</sub><br/>(kg/cm<sup>2</sup>)</div>,
    accessor: 'pbaj',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>baj</sub><br/>(°C)</div>,
    accessor: 'tbaj',
    cell: 'renderNumber',
  }, { 
    Header: <div>P<sub>sep</sub><br/>(kg/cm<sup>2</sup>)</div>,
    accessor: 'psep',
    cell: 'renderNumber',
  }, { 
    Header: <div>T<sub>sep</sub><br/>(°C)</div>,
    accessor: 'tsep',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>o</sub><br/>(bbl/d)</div>,
    accessor: 'qo',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>w</sub><br/>(bbl/d)</div>,
    accessor: 'qw',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>g</sub><br/>(MMpc/d)</div>,
    accessor: 'qg',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>gi</sub><br/>(MMpc/d)</div>,
    accessor: 'ql',
    cell: 'renderNumber',
  }, { 
    Header: <div>RGA<br/>m<sup>3</sup>/m<sup>3</sup></div>,
    accessor: 'rga',
    cell: 'renderNumber',
  }, { 
    Header: <div>Salinidad<br/>(ppm)</div>,
    accessor: 'salinidad',
    cell: 'renderNumber',
  }, { 
    Header: 'pH',
    accessor: 'ph',
    cell: 'renderNumber',
  }
]


@autobind class HistoricoDeAforos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: [],
      checked: []
    }
  }

  componentDidMount(){
    this.validate()
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    }
  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked(checked)
    }
  }


  makeAforosGraph() {
    let { formData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    let qoData = []
    let qwData = []
    let qgData = []

    aforosData.forEach(i => {
      if (i.fecha) {
        let date = new Date(i.fecha)
        date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        i.qo.length > 0 ? qoData.push([date, parseFloat(i.qo)]) : null
        i.qw.length > 0 ? qwData.push([date, parseFloat(i.qw)]) : null
        i.qg.length > 0 ? qgData.push([date, parseFloat(i.qg)]) : null
      }
    })

    config.series[0].data = qoData
    config.series[1].data = qgData
    config.series[2].data = qwData

    return (        
      <div className="graph">
            <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {config} />
      </div>
      )

  }




  renderEditable(cellInfo) {
    let { setAforosData, formData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          aforosData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          setAforosData(aforosData)
        }}
      >{aforosData[cellInfo.index][cellInfo.column.id]}</div>
    );
  }

  addNewRow() {
    let { formData, setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    aforosData[0].length = 2

    setAforosData([...aforosData, {index: aforosData.length, fecha: null, tiempo: '', estrangulador: '', ptp: '', ttp: '', pbaj: '',tbaj: '',psep: '',tsep: '', ql: '',qo: '', qg: '', qw: '', rga: '', salinidad: '', ph: '', length: aforosData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && aforosData.length > 1) {
          aforosData.splice(rowInfo.original.index, 1)

          aforosData.forEach((i, index) => {
            i.index = index
            i.length = aforosData.length
          }) 

          setAforosData(aforosData)
        }
      }
    }
  }

  makeHistoricoDeAforosInput() {
    let { formData ,setAforosData } = this.props
    formData = formData.toJS()
    let { aforosData } = formData

    const objectTemplate = {fecha: null, tiempo: '', estrangulador: '', ptp: '', ttp: '', pbaj: '',tbaj: '',psep: '',tsep: '', ql: '',qo: '', qg: '', qw: '', rga: '', salinidad: '', ph: ''}

    return (
      <div className='historico-produccion' >
        <div className='table'>
          <InputTable
            className="-striped"
            data={aforosData}
            newRow={objectTemplate}
            setData={setAforosData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={aforosData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>
        { this.state.errors.aforosData && this.state.errors.aforosData.checked &&
          <div className="error">{this.state.errors.aforosData.message}</div>
        }
        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }

  render() {
    return (
      <div className="form historico-de-produccion">
        { this.makeHistoricoDeAforosInput() }
        { this.makeAforosGraph() }
      </div>
    )
  }
}

const validate = values => {
    const errors = {}

    if(!values.aforosData){
      errors.aforosData = {message: "Esta forma no puede estar vacia"}
    }else {
      values.aforosData.forEach((row, index) => {
        let hasEmpty = Object.values(row).find((value) => { return value === null || value.toString().trim() == '' })
        if(hasEmpty !== undefined){
            errors.aforosData = {message: "Ningun campo puede estar vacio."}
        }
      })
    }

    return errors
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDeAforos'),
})

const mapDispatchToProps = dispatch => ({
    setAforosData: val => dispatch(setAforosData(val)),
    setChecked: val => dispatch(setChecked(val))    
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(HistoricoDeAforos)
)
