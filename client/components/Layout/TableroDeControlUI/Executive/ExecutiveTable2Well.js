import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { CategoryDist, TrafficLight, Currency, Integer } from '../../../../lib/formatters'

@autobind class ExecutiveTable2Well extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }
  


  render() {
    let { data, estIncData, aforosData, groupBy } = this.props

    let header = ''

    switch(groupBy) {
      case 'subdireccion':
        header = 'Subdireccion Name'
        break
      case 'activo':
        header = 'Activo Name'
        break
      case 'field':
        header = 'Field Name'
        break
      case 'well':
        header = 'Well Name'
        break
      case 'formation':
        header = 'Formacion'
        break
      case 'company':
        header = 'Propuesta Compania'
        break
      case 'interventionType':
        header = 'Tipo De Intervenciones'
        break
      case 'terminationType':
        header = 'Tipo De Terminacion'
        break
    }


      let columns = [{
        Header: <div>Total de<br/>Tratamientos</div>,
        accessor: 'numTreatments',
        minWidth: 150,
        Cell: Integer,
      },{
        Header: '% Category',
        accessor: 'bar', 
        minWidth: 150,
        Cell: CategoryDist
      },{
        Header: 'Costo Total',
        accessor: 'cost', 
        minWidth: 150,
        Cell: Currency,
      },{
        Header: 'Produccion Estimada',
        accessor: 'estProd', 
        minWidth: 150,
        Cell: Integer
      },{
        Header: 'Produccion Real',
        accessor: 'realProd', 
        minWidth: 150,
        Cell: Integer
      },{
        Header: 'Traffic Light',
        accessor: 'light', 
        minWidth: 150,
        Cell: TrafficLight
      },{
        Header: <div>Date / Type of<br/>Last Treatment</div>,
        accessor: 'dateType', 
        minWidth: 150
      }]

      if (groupBy) {
        columns.unshift({
          Header: header,
          accessor: 'name', 
          minWidth: 150,
        })
      }
      console.log(data, estIncData, aforosData, groupBy)



    data = data.map(i => {

        let estProd = estIncData.find(j => j.groupedName === i.groupedName) ? estIncData.find(j => j.groupedName === i.groupedName).EST_INC_Qo : undefined
        let realProd = aforosData.filter(j => j.groupedName === i.groupedName).length > 0 ? aforosData.filter(j => j.groupedName === i.groupedName).reduce((sum, cur) => sum + cur.qoResult, 0) : null

        return {
            name: i.groupedName,
            numTreatments: i.NUM_TREATMENTS,
            numAcido: i.NUM_ACIDO,
            percAcido: i.NUM_ACIDO / i.NUM_TREATMENTS * 100,
            numApuntalado: i.NUM_APUNTALADO,
            percApuntalado: i.NUM_APUNTALADO / i.NUM_TREATMENTS * 100,
            numEstimulacion: i.NUM_ESTIMULACION,
            percEstimulacion: i.NUM_ESTIMULACION / i.NUM_TREATMENTS * 100,
            numTermico: i.NUM_TERMICO,
            percTermico: i.NUM_TERMICO / i.NUM_TREATMENTS * 100,
            cost: i.COST,
            estProd: estProd,
            realProd: realProd,
            light: estProd && realProd ? realProd / estProd : null,
            dateType: '-'
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
            id: 'numTreatments',
            desc: true
          }
        ]}
      />
    )
  }
}


export default ExecutiveTable2Well
