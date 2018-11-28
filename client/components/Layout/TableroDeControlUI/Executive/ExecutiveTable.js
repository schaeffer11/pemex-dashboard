import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { CategoryDist, TrafficLight, Currency, Integer, numWithCommas } from '../../../../lib/formatters'

@autobind class ExecutiveTable2Well extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      pageSize: 1,
    }    
  }

  shouldComponentUpdate(nextProps) {
    if ((this.props.groupBy !== nextProps.groupBy)) {
      return false
    }
    
    return true
  }

  componentDidUpdate(prevProps) {
    let { data } = this.props

    if (data.length !== prevProps.data.length) {
      let length = data && data.length < 10 ? data.length : 10

      this.setState({
        pageSize: length
      })      
    }

  }

  render() {
    let { data, estIncData, volumeData, groupBy } = this.props
    let { pageSize } = this.state

    let header = ''

    switch(groupBy) {
      case 'subdireccion':
        header = 'Subdirección'
        break
      case 'activo':
        header = 'Activo'
        break
      case 'field':
        header = 'Campo'
        break
      case 'well':
        header = 'Pozo'
        break
      case 'formation':
        header = 'Formación'
        break
      case 'company':
        header = 'Companñía'
        break
      case 'interventionType':
        header = 'Tipo De Intervención'
        break
      case 'terminationType':
        header = 'Tipo De Terminación'
        break
    }


      let columns = [{
        Header: <div>Total de Tratamientos</div>,
        accessor: 'numTreatments',
        minWidth: 150,
        Cell: Integer,
      },{
        Header: <div>% de Tratamientos</div>,
        accessor: 'bar', 
        minWidth: 150,
        Cell: CategoryDist
      },{
        Header: 'Costo Total',
        accessor: 'cost', 
        minWidth: 150,
        Cell: Currency,
      },{
        Header: 'Producción Incremental Estimada',
        accessor: 'estProd', 
        minWidth: 150,
        Cell: Integer
      },{
        Header: 'Producción Incremental Real',
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
        Header: <div>Fecha y Tipo del Último Tratamiento</div>,
        accessor: 'dateType', 
        minWidth: 150
      }, {
        Header: <div>Sistema No Reactivo<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaNoReactivo', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Sistema Reactivo<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaReactivo', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Sistema Divergente<br/>(m<sup>3</sup>)</div>,
        accessor: 'sistemaDivergente', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Desplazamiento Líquido<br/>(m<sup>3</sup>)</div>,
        accessor: 'desplazamientoLiquido', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Desplazamiento N<sub>2</sub><br/>(m<sup>3</sup>)</div>,
        accessor: 'desplazamientoN2', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Precolchón N<sub>2</sub><br/>(m<sup>3</sup>)</div>,
        accessor: 'precolchonN2', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Líquidos Totales<br/>(m<sup>3</sup>)</div>,
        accessor: 'liquido', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Apuntalante<br/>(sacos)</div>,
        accessor: 'apuntalante', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Gel de Fractura<br/>(U.S. gal)</div>,
        accessor: 'gelDeFractura', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Precolchón apuntalante<br/>(U.S. gal)</div>,
        accessor: 'precolchonApuntalante', 
        Cell: Integer,
        minWidth: 150
      },{
        Header: <div>Vapor Inyectado<br/>(ton)</div>,
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
          showPagination={true}
          data={data}
          pageSize={pageSize}
          pageSizeOptions={[1, 5, 10, 20, 25, 50, 100]}
          onPageSizeChange={(e) => this.setState({pageSize: e})}
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
