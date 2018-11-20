import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { CategoryDist, TrafficLight, Currency, Integer, numWithCommas } from '../../../../lib/formatters'

@autobind class ExecutiveTable2Well extends PureComponent {

  shouldComponentUpdate(nextProps) {
    if (this.props.groupBy !== nextProps.groupBy) {
      return false
    }
    
    return true
  }


  render() {
    let { data, estIncData, volumeData, groupBy } = this.props

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
        Header: 'Produccion Incremental Estimada',
        accessor: 'estProd', 
        minWidth: 150,
        Cell: Integer
      },{
        Header: 'Produccion Incremental Real',
        accessor: 'realProd', 
        minWidth: 150,
        Cell: row => {
          let color = row.original.realProd > row.original.estProd ? '#44A808' : '#AA1F40'
          let transform = row.original.realProd > row.original.estProd ? 'none' : 'rotate(180deg)'

          return (
          <div>
            <span style={{
              color: color,
              transition: 'all .3s ease'
            }}>
              {row.value ? numWithCommas(row.value.toFixed(0)) : 0}
            </span>
            <svg style={{color: color, transform: transform}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" >
              <path d="M0,0h24v24H0V0z" fill="none"/>
              <path d="M6.1,8.8h3.4v11h3v-11h3.9L11.3,4L6.1,8.8z" fill={color}/>
            </svg>
          </div>
        )}
      },{
        Header: <div>Date / Type of<br/>Last Treatment</div>,
        accessor: 'dateType', 
        minWidth: 150
      }, {
        Header: <div>Total Sistema<br/>No Reactivo<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaNoReactivo', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Sistema<br/>Reactivo<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaReactivo', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Sistema<br/>Divergente<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaDivergente', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Desplazamiento<br/>Liquido<br/>(m<sup>3</sup>)</div>,
        accessor: 'desplazamientoLiquido', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Desplazamiento<br/>N2<br/>(m<sup>3</sup>)</div>,
        accessor: 'desplazamientoN2', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Precolchon<br/>N2<br/>(m<sup>3</sup>)</div>,
        accessor: 'precolchonN2', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Liquido<br/>(m<sup>3</sup>)</div>,
        accessor: 'liquido', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Apuntalante<br/>(sacos)</div>,
        accessor: 'apuntalante', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Gel de<br/>Fractura<br/>(U.S. gal)</div>,
        accessor: 'gelDeFractura', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Precolchon<br/>apuntalante<br/>(U.S. gal)</div>,
        accessor: 'precolchonApuntalante', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Total Vapor<br/>Injected<br/>(ton)</div>,
        accessor: 'vapor', 
        Cell: Integer,
        minWidth: 150
      }]

      if (groupBy) {
        columns.unshift({
          Header: header,
          accessor: 'name', 
          minWidth: 150,
        })
      }



    return (
      <div className='table'>
        <ReactTable 
          columns={columns}
          showPagination={false}
          data={data}
          pageSize={data  ? data.length : 5}
          defaultSorted={[
            {
              id: 'numTreatments',
              desc: true
            }
          ]}
        />
      </div>
    )
  }
}


export default ExecutiveTable2Well
