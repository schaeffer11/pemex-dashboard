import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactTable from 'react-table' 
import { CategoryDist, TrafficLight, Currency, Integer } from '../../../../lib/formatters'

@autobind class Volume extends PureComponent {
  render() {
    let { data, estIncData, aforosData, volumenData } = this.props
      let columns = [{
        Header: 'Well Name',
        accessor: 'name', 
        minWidth: 150,
      },{
        Header: 'Formacion',
        accessor: 'formacion',
        minWidth: 150,
      },{
        Header: '% Category',
        accessor: 'bar', 
        minWidth: 150,
        Cell: CategoryDist
      },{
        Header: <div>Costo Total<br/>($MNX)</div>,
        accessor: 'cost', 
        minWidth: 150,
        Cell: Currency
      },{
        Header: <div>Desviacion De Produccion<br/>(bbl/d)</div>,
        accessor: 'desviacion', 
        minWidth: 150,
        Cell: Integer
      },{
        Header: <div>Produccion Acumulad<br/>a Puntual<br/>(bbl/d)</div>,
        accessor: 'acumuladPuntual', 
        minWidth: 150,
        Cell: Integer,
      },{
        Header: <div>Total Volumen<br/>de Lodo Perdido</div>,
        accessor: 'lodoPerdido', 
        minWidth: 150,
      },{
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

    data = data.map(i => {

        let estProd = estIncData.find(j => j.WELL_FORMACION_ID === i.WELL_FORMACION_ID) ? estIncData.find(j => j.WELL_FORMACION_ID === i.WELL_FORMACION_ID).EST_INC_Qo : undefined
        let realProd = aforosData.filter(j => j.id === i.WELL_FORMACION_ID).length > 0 ? aforosData.filter(j => j.id === i.WELL_FORMACION_ID).reduce((sum, cur) => sum + cur.qoResult, 0) : null
        let volumen = volumenData.find(j => j.WELL_FORMACION_ID === i.WELL_FORMACION_ID)

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
            acumuladPuntual: realProd,
            lodoPerdido: '-',
            sistemaNoReactivo: volumen ? volumen.TOTAL_SISTEMA_NO_REACTIVO : undefined,
            sistemaReactivo: volumen ? volumen.TOTAL_SISTEMA_REACTIVO : undefined,
            sistemaDivergente: volumen ? volumen.TOTAL_SISTEMA_DIVERGENTE : undefined,
            desplazamientoLiquido: volumen ? volumen.TOTAL_DESPLAZAMIENTO_LIQUIDO : undefined,
            desplazamientoN2: volumen ? volumen.TOTAL_DESPLAZAMIENTO_N2 : undefined,
            precolchonN2: volumen ? volumen.TOTAL_PRECOLCHON_N2 : undefined,
            liquido: volumen ? volumen.TOTAL_LIQUIDO : undefined,
            apuntalante: volumen ? volumen.TOTAL_APUNTALANTE : undefined,
            gelDeFractura: volumen ? volumen.TOTAL_GEL_DE_FRACTURA : undefined,
            precolchonApuntalante: volumen ? volumen.TOTAL_PRECOLCHON_APUNTALANTE : undefined,
            vapor: volumen ? volumen.TOTAL_VAPOR_INJECTED : undefined,
        }
    })

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


export default Volume
