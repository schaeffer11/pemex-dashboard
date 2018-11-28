import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class LabTable extends PureComponent {

  render() {
    let { data, handleChange } = this.props

    let columns = [{
        Header: 'Tipo de Analisis',
        accessor: 'name',
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

    data.map(i => {
      switch (i.type) {
        case 'pruebasDeCompatibilidad':
          i.name = 'Pruebas de compatiblidad por emulsión'
          break;
        case 'caracterizacionFisico':
          i.name = 'Caracterización fisico-química de fluidos'
          break;
        case 'pruebasGelDeFractura':
          i.name = 'Pruebas gel de fractura'
          break;
        case 'pruebasDeSolubilidad':
          i.name = 'Pruebas de solubilidad'
          break;
        case 'pruebasParaApuntalante':
          i.name = 'Pruebas para apuntalante'
          break;
        case 'pruebasDeGrabado':
          i.name = 'Pruebas de grabado'
          break;
        case 'cromatografiaDelGas':
          i.name = 'Cromatografía del gas'
          break;
        case 'pruebaDeDureza':
          i.name = 'Prueba de dureza'
          break;
        case 'determinacionDeLaCalidad':
          i.name = 'Determinación de la calidad método de los cloruros'
          break;
        case 'curvaDeViscosidad':
          i.name = 'Curva De Viscosidad'
          break;
      }
      return i
    })

    return (
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={data ? data.length : 5}
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
    )
  }
}

export default LabTable
