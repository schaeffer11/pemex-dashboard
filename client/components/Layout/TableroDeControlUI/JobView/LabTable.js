import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class LabTable extends PureComponent {

  render() {
    let { data } = this.props

    console.log(data)
    let columns = [{
        Header: 'Tipo de Analisis',
        accessor: 'type',
        width: 420,
      }, { 
        Header: 'Fecha de Muestreo',
        accessor: 'fechaMuestreo',
      }, { 
        Header: 'Fecha de prueba',
        accessor: 'fechaPrueba',
      }, { 
        Header: 'Compañía',
        accessor: 'compania',
        width: 200,
      }, { 
        Header: 'Personal de Pemex que supervisó',
        accessor: 'superviso',
      },
    ] 

    data.forEach(i => {
       let muestreoDate = new Date(i.fechaMuestreo)
        muestreoDate = `${muestreoDate.getDate()}/${muestreoDate.getMonth() + 1}/${muestreoDate.getFullYear()}`
       
       let pruebaDate = new Date(i.fechaPrueba)
        pruebaDate = `${pruebaDate.getDate()}/${pruebaDate.getMonth() + 1}/${pruebaDate.getFullYear()}`


      i.fechaMuestreo = muestreoDate
      i.fechaPrueba = pruebaDate
      
    })
    return (
      <div className="lab-table">
        Lab Data
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={data ? data.length : 5}
        />
      </div>
    )
  }
}

export default LabTable
