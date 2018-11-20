import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class LabTable extends PureComponent {

  render() {
    let { data, handleChange } = this.props

    console.log(data)


    let columns = [{
        Header: 'Tipo de Analisis',
        accessor: 'type',
        style: {
          cursor: 'pointer'
        },
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

    let newData = []

      data.forEach(i => {
       let muestreoDate = new Date(i.fechaMuestreo)
        muestreoDate = `${muestreoDate.getDate()}/${muestreoDate.getMonth() + 1}/${muestreoDate.getFullYear()}`
       
       let pruebaDate = new Date(i.fechaPrueba)
        pruebaDate = `${pruebaDate.getDate()}/${pruebaDate.getMonth() + 1}/${pruebaDate.getFullYear()}`

        newData.push({
            id: i.id,
            type: i.type,
            fechaMuestreo: muestreoDate,
            fechaPrueba: pruebaDate,
            compania: i.compania,
            superviso: i.superviso,
            observaciones: i.observaciones,
        })
  
      
    })



    return (
      <div className="lab-table">
        Lab Data
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={newData}
          pageSize={newData ? newData.length : 5}
          getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if (rowInfo) {
                    handleChange(rowInfo.original.id, rowInfo.original.type)
                  }
                
                }
              }
            }}
        />
      </div>
    )
  }
}

export default LabTable
