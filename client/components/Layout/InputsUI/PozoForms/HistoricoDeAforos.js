import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ExcelUpload from '../../Common/ExcelUpload'
import { setAforosData, setChecked, setHasErrorsHistoricoDeAforos, setFromSaveHistoricoDeAforos } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ReactHighCharts from 'react-highcharts'

let config = {
   chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: ''
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
    credits: {
        enabled: false
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Fecha'
        },
        type: 'datetime'
    },
    yAxis: [{
        title: {
            text: 'Gasto (bbl/d)'
        }
    }, {
        opposite: true,
        title: {
            text: 'Gasto (MMpc/d)'
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
      errors: {
        table: {
          value: '',
          type: 'table',
        },
      },
      checked: []
    }
  }

  componentDidMount(){
    const { setHasErrorsHistoricoDeAforos, hasSubmitted } = this.props

    if (hasSubmitted) {
      const hasErrors = this.checkAllInputs()
      setHasErrorsHistoricoDeAforos(hasErrors)
    }
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveHistoricoDeAforos, setHasErrorsHistoricoDeAforos } = this.props
    formData = formData.toJS()
    let { fromSave } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true)
      setHasErrorsHistoricoDeAforos(err)
      if (fromSave === true) {
        setFromSaveHistoricoDeAforos(false)
      }
    }
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    let hasErrors = false
    let error
    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors)
      } else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors)
      } else if (errObj.type === 'table') {
        error = errObj.value === '' ? true : errObj.value
      }
      error === true ? hasErrors = true : null
    })
    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  checkForErrors(value) {
    const errorsCopy = {...this.state.errors}
    errorsCopy.table.value = value
    this.setState({ errors: errorsCopy }, () => {
      const { setHasErrorsHistoricoDeAforos } = this.props
      const hasErrors = this.checkAllInputs()
      setHasErrorsHistoricoDeAforos(hasErrors)
    })
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
        console.log('da date', typeof i.qo, i.qo, parseFloat(i.qo))
        date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        i.qo.length > 0 || typeof i.qo === 'number' ? qoData.push([date, parseFloat(i.qo)]) : null
        i.qw.length > 0 || typeof i.qw === 'number' ? qwData.push([date, parseFloat(i.qw)]) : null
        i.qg.length > 0 || typeof i.qg === 'number' ? qgData.push([date, parseFloat(i.qg)]) : null
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

  makeHistoricoDeAforosInput() {
    let { formData, setAforosData, hasSubmitted } = this.props
    formData = formData.toJS()
    let { aforosData } = formData
    const rowObj = {
      error: true,
      fecha: null,
      tiempo: '',
      estrangulador: '',
      ptp: '',
      ttp: '',
      pbaj: '',
      tbaj: '',
      psep: '',
      tsep: '',
      ql: '',
      qo: '',
      qg: '',
      qw: '',
      rga: '',
      salinidad: '',
      ph: '',
    }
    const errors = [
      { name: 'fecha', type: 'date' },
      { name: 'tiempo', type: 'number' },
      { name: 'estrangulador', type: 'number' },
      { name: 'ptp', type: 'number' },
      { name: 'ttp', type: 'number' },
      { name: 'pbaj', type: 'number' },
      { name: 'tbaj', type: 'number' },
      { name: 'psep', type: 'number' },
      { name: 'tsep', type: 'number' },
      { name: 'ql', type: 'number' },
      { name: 'qo', type: 'number' },
      { name: 'qg', type: 'number' },
      { name: 'qw', type: 'number' },
      { name: 'rga', type: 'number' },
      { name: 'salinidad', type: 'number' },
      { name: 'ph', type: 'number' },
    ]
    return (
      <div className='historico-produccion' >
        <div className='table'>
          <InputTable
            className="-striped"
            data={aforosData}
            setData={setAforosData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            sortable={false}
            rowObj={rowObj}
            errorArray={errors}
            checkForErrors={this.checkForErrors}
            hasSubmitted={hasSubmitted}
          />
        </div>

        {/* <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button> */}
      </div>
    )
  }

  render() {
    return (
      <div className="form historico-de-produccion">
        <ExcelUpload
          template="HistoricoAforo"
          headers={[
            { name: 'fecha', type: 'date' },
            { name: 'tiempo', type: 'number' },
            { name: 'estrangulador', type: 'number' },
            { name: 'ptp', type: 'number' },
            { name: 'ttp', type: 'number' },
            { name: 'pbaj', type: 'number' },
            { name: 'tbaj', type: 'number' },
            { name: 'psep', type: 'number' },
            { name: 'tsep', type: 'number' },
            { name: 'qo', type: 'number' },
            { name: 'qw', type: 'number' },
            { name: 'qg', type: 'number' },
            { name: 'ql', type: 'number' },
            { name: 'rga', type: 'number' },
            { name: 'salinidad', type: 'number' },
            { name: 'ph', type: 'number' },
          ]}
          setData={this.props.setAforosData}
          />
        { this.makeHistoricoDeAforosInput() }
        { this.makeAforosGraph() }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('historicoDeAforos'),
  hasErrors: state.getIn(['historicoDeAforos', 'hasErrors']),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
    setAforosData: val => dispatch(setAforosData(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDeAforos')),
    setHasErrorsHistoricoDeAforos: val => dispatch(setHasErrorsHistoricoDeAforos(val)),
    setFromSaveHistoricoDeAforos: val => dispatch(setFromSaveHistoricoDeAforos(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDeAforos)
