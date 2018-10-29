import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { CategoryDist, TrafficLight } from '../../../../lib/formatters'

@autobind class ExecutiveTable2Well extends PureComponent {
  render() {
    let { data, estIncData, aforosData } = this.props
      let columns = [{
        Header: 'Well Name',
        accessor: 'name', 
        width: 250,
      },{
        Header: 'Formacion',
        accessor: 'formacion',
        width: 70,
      },{
        Header: '% Category',
        accessor: 'bar', 
        width: 150,
        Cell: CategoryDist
      },{
        Header: 'Costo Total',
        accessor: 'cost', 
        width: 150
      },{
        Header: 'Desviacion De Produccion',
        accessor: 'desviacion', 
        width: 150
      },{
        Header: 'Produccion Acumulad a Puntual',
        accessor: 'acumuladPuntual', 
        width: 150
      },{
        Header: 'Total Volumen de Lodo Perdido',
        accessor: 'lodoPerdido', 
        width: 150,
      },{
        Header: 'Total Sistema No Reactivo',
        accessor: 'sistemaNoReactivo', 
        width: 150
      },{
        Header: 'Total Sistema Reactivo',
        accessor: 'sistemaReactivo', 
        width: 150
      },{
        Header: 'Total Sistema Divergente',
        accessor: 'sistemaDivergente', 
        width: 150
      },{
        Header: 'Total Desplazamiento Liquido',
        accessor: 'desplazamientoLiquido', 
        width: 150
      },{
        Header: 'Total Desplazamiento N2',
        accessor: 'desplazamientoN2', 
        width: 150
      },{
        Header: 'Total Precolchon N2',
        accessor: 'precolchonN2', 
        width: 150
      }]

    data = data.map(i => {

        let estProd = estIncData.find(j => j.WELL_FORMACION_ID === i.WELL_FORMACION_ID) ? estIncData.find(j => j.WELL_FORMACION_ID === i.WELL_FORMACION_ID).EST_INC_Qo : undefined
        let realProd = aforosData.filter(j => j.id === i.WELL_FORMACION_ID).length > 0 ? aforosData.filter(j => j.id === i.WELL_FORMACION_ID).reduce((sum, cur) => sum + cur.qoResult, 0) : null

        return {
            name: i.WELL_NAME,
            formacion: '-',
            numAcido: i.NUM_ACIDO,
            percAcido: i.NUM_ACIDO / i.NUM_TREATMENTS * 100,
            numApuntalado: i.NUM_APUNTALADO,
            percApuntalado: i.NUM_APUNTALADO / i.NUM_TREATMENTS * 100,
            numEstimulacion: i.NUM_ESTIMULACION,
            percEstimulacion: i.NUM_ESTIMULACION / i.NUM_TREATMENTS * 100,
            numTermico: i.NUM_TERMICO,
            percTermico: i.NUM_TERMICO / i.NUM_TREATMENTS * 100,
            desviacion: realProd - estProd,
            cost: i.COST,
            desviacion: '-',
            acumuladPuntual: '-',
            lodoPerdido: '-',
            sistemaNoReactivo: '-',
            sistemaReactivo: '-',
            sistemaDivergente: '-',
            desplazamientoLiquido: '-',
            desplazamientoN2: '-',
            precolchonN2: '-',
        }
    })

    console.log(data)

    return (
      <ReactTable 
        columns={columns}
        showPagination={false}
        data={data}
        pageSize={8}
        defaultSorted={[
          {
            id: 'cost',
            desc: true
          }
        ]}
      />
    )
  }
}


export default ExecutiveTable2Well
