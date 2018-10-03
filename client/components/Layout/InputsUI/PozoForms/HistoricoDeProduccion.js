import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputDate } from '../../Common/InputRow'
import {withValidate} from '../../Common/Validate'
import ExcelUpload from '../../Common/ExcelUpload'
import { setProduccionData, setChecked } from '../../../../redux/actions/pozo'
import InputTable from '../../Common/InputTable'
import ReactHighCharts from 'react-highcharts'

let config = {
   chart: {
        type: 'line',
        zoomType: 'xy'
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    tooltip: {
      shared: true,
      formatter:function () {
        let xVal = new Date(this.x)
        let xString = `${xVal.getDate()}/${xVal.getMonth() + 1}/${xVal.getFullYear()}`
        var retVal="<small>"+xString+"</small><br><br>";
        retVal+="<div style=height:14px;font-size:12px;line-height:14px;>";
        for(let i = 0; i < this.points.length; i++) {
          retVal+= "<div class='tooltip-line'>" + this.points[i].series.name+": <strong>"+this.points[i].y.toFixed(2) + ' ' + this.points[i].series.userOptions.label+"</strong> </div> <br>";
        }
        return retVal;
      }
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
        series: {
          animation: false,
        },
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
    Header: 'Días',
    accessor: 'dias',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>o</sub><br></br>(bbl)</div>,
    accessor: 'qo_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>w</sub><br></br>(bbl)</div>,
    accessor: 'qw_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>g</sub><br></br>(MMpc)</div>,
    accessor: 'qg_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>V<sub>gi</sub><br></br>(MMpc)</div>,
    accessor: 'qgi_vol',
    cell: 'renderNumber',
  }, { 
    Header: <div>Q<sub>o</sub><br></br>(bbl/d)</div>,
    accessor: 'qo',
  }, { 
    Header: <div>Q<sub>w</sub><br></br>(bbl/d)</div>,
    accessor: 'qw',
  }, { 
    Header: <div>Q<sub>g</sub><br></br>(MMpc/d)</div>,
    accessor: 'qg',
  }, { 
    Header: <div>Q<sub>gi</sub><br></br>(MMpc/d)</div>,
    accessor: 'qgi',
  }, { 
    Header: <div>N<sub>p</sub><br></br>(MMbbl)</div>,
    accessor: 'np',
  }, { 
    Header: <div>W<sub>p</sub><br></br>(MMbbl)</div>,
    accessor: 'wp',
  }, { 
    Header: <div>G<sub>p</sub><br></br>(MMpc)</div>,
    accessor: 'gp',
  }, { 
    Header: <div>G<sub>i</sub><br></br>(MMpc)</div>,
    accessor: 'gi',
  }, { 
    Header: <div>RGA<br></br>(m<sup>3</sup>/m<sup>3</sup>)</div>,
    accessor: 'rga',
  }, { 
    Header: <div>w<br></br>(%)</div>,
    accessor: 'fw',
    Cell: row => <div>{(row.value * 100)}%</div>
  }
]







@autobind class HistoricoDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containsErrors: false,
      errors: [],
      checked: []
    }
  }

  componentDidMount(){

  }

  componentDidUpdate(){

  }



  makeProductionGraph() {
    let { formData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    let qoData = []
    let qwData = []
    let qgData = []

    produccionData.forEach(i => {
      if (i.fecha) {
        let date = new Date(i.fecha)
        date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        i.qo.length > 0 ? qoData.push([date, parseFloat(i.qo)]) : null
        i.qw.length > 0 ? qwData.push([date, parseFloat(i.qw)]) : null
        i.qg.length > 0 ? qgData.push([date, parseFloat(i.qg)]) : null
      }
    })

    config.series[0].data = qoData.sort((a, b) => { return a[0] - b[0]})
    config.series[1].data = qgData.sort((a, b) => { return a[0] - b[0]})
    config.series[2].data = qwData.sort((a, b) => { return a[0] - b[0]})

    return (        
      <div className="graph">
            <ReactHighCharts className="chart" ref={(ref) => this.chart = ref} config= {config} />
      </div>
    )

  }

  addNewRow() {
    let { formData, setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    produccionData[0].length = 2

    setProduccionData([...produccionData, {index: produccionData.length, fecha: null, dias: '', qo: '', qw: '', qg: '', qgi: '', qo_vol: '', qw_vol: '', qg_vol: '', qgi_vol: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: '', length: produccionData.length + 1, 'edited': false}])
  }


  deleteRow(state, rowInfo, column, instance) {
    let { formData, setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    return {
      onClick: e => {
        if (column.id === 'delete' && produccionData.length > 1) {
          produccionData.splice(rowInfo.original.index, 1)

          produccionData.forEach((i, index) => {
            i.index = index
            i.length = produccionData.length
          }) 

          setProduccionData(produccionData)
        }
      }
    }
  }

  makeHistoricoDeProduccionInput() {
    let { formData ,setProduccionData } = this.props
    formData = formData.toJS()
    let { produccionData } = formData

    const objectTemplate = {fecha: null, dias: '', qo: '', qw: '', qg: '', qgi: '', qo_vol: '', qw_vol: '', qg_vol: '', qgi_vol: '', np: '', wp: '', gp: '', gi: '', rga: '', fw: ''}

    console.log('render produccion')


    return (
      <div className='historico-produccion' >
        <div className='table'>
          <InputTable
            className="-striped"
            data={produccionData}
            newRow={objectTemplate}
            setData={setProduccionData}
            columns={columns}
            showPagination={false}
            showPageSizeOptions={false}
            pageSize={produccionData.length}
            sortable={false}
            getTdProps={this.deleteRow}
          />
        </div>

        <button className='new-row-button' onClick={this.addNewRow}>Añadir un renglón</button>
      </div>
    )
  }

  render() {

    return (
      <div className="form historico-de-produccion">
        <ExcelUpload
          template="HistoricoProduccion"
          headers={[
            { name: 'fecha', type: 'date' },
            { name: 'dias', type: 'number' },
            { name: 'qo_vol', type: 'number' },
            { name: 'qw_vol', type: 'number' },
            { name: 'qg_vol', type: 'number' },
            { name: 'qgi_vol', type: 'number' }
          ]}
          setData={this.props.setProduccionData}
        />
        { this.makeHistoricoDeProduccionInput() }
        { this.makeProductionGraph() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('historicoDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
    setProduccionData: val => dispatch(setProduccionData(val)),
    setChecked: val => dispatch(setChecked(val, 'historicoDeProduccion'))    
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDeProduccion)

