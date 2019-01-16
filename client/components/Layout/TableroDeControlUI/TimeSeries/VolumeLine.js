import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'

@autobind class VolumeLine extends PureComponent {

  render() {
    let { data } = this.props

    let sistemaNoReactivoData = []
    let sistemaReactivo = []
    let sistemaDivergente = []
    let desplazamientoLiquido = []
    let liquido = []
    let apuntalante = []
    let gelDeFractura = []
    let precolchonApuntalante = []
    let gelLineal = []
    let modificadorPermeabilidad = []
    let espaciador = []

    let series = []

    if (data) {
      data.forEach(i => {
        let utc = new Date(i.FECHA_INTERVENCION)
        utc = Date.UTC(utc.getFullYear(), utc.getMonth())

        i.TOTAL_SISTEMA_NO_REACTIVO ? sistemaNoReactivoData.push({ x: utc, y: i.TOTAL_SISTEMA_NO_REACTIVO}) : null
        i.TOTAL_SISTEMA_REACTIVO ? sistemaReactivo.push({ x: utc, y: i.TOTAL_SISTEMA_REACTIVO}) : null
        i.TOTAL_SISTEMA_DIVERGENTE ? sistemaDivergente.push({ x: utc, y: i.TOTAL_SISTEMA_DIVERGENTE}) : null
        i.TOTAL_DESPLAZAMIENTO_LIQUIDO ? desplazamientoLiquido.push({ x: utc, y: i.TOTAL_DESPLAZAMIENTO_LIQUIDO}) : null
        i.TOTAL_LIQUIDO ? liquido.push({ x: utc, y: i.TOTAL_LIQUIDO}) : null
        i.TOTAL_APUNTALANTE ? apuntalante.push({ x: utc, y: i.TOTAL_APUNTALANTE}) : null
        i.TOTAL_GEL_DE_FRACTURA ? gelDeFractura.push({ x: utc, y: i.TOTAL_GEL_DE_FRACTURA}) : null
        i.TOTAL_PRECOLCHON_APUNTALANTE ? precolchonApuntalante.push({ x: utc, y: i.TOTAL_PRECOLCHON_APUNTALANTE}) : null
        i.TOTAL_GEL_LINEAL ? gelLineal.push({ x: utc, y: i.TOTAL_GEL_LINEAL}) : null
        i.TOTAL_MODIFICADOR_PERMEABILIDAD ? modificadorPermeabilidad.push({ x: utc, y: i.TOTAL_MODIFICADOR_PERMEABILIDAD}) : null
        i.TOTAL_ESPACIADOR ? espaciador.push({ x: utc, y: i.TOTAL_ESPACIADOR}) : null
      })


      series = [{
        name: 'Sistema No Reactivo',
        data: sistemaNoReactivoData,
      },{
        name: 'Sistema Reactivo',
        data: sistemaReactivo,
      },{
        name: 'Sistema Divergente',
        data: sistemaDivergente,
      },{
        name: 'Desplazamiento Líquido',
        data: desplazamientoLiquido,
      },{
        name: 'Líquido',
        data: liquido,
      },{
        name: 'Apuntalante',
        data: apuntalante,
      },{
        name: 'Gel De Fractura',
        data: gelDeFractura,
      },{
        name: 'Precolchón Apuntalante',
        data: precolchonApuntalante,
      },{
        name: 'Gel Lineal',
        data: gelLineal,
      }, {
        name: 'Modificador de Permeabilidad',
        data: modificadorPermeabilidad,
      }, {
        name: 'Espaciador',
        data: espaciador,
      }, 
      ]

    }
   
    let config = {
      chart: {
          type: 'column',
          zoomType: 'x',
      },
      title: {
          text: ''
      },
      xAxis: {
        title: {
          text: 'Fecha'
        },
        tickInterval   : 24 * 3600 * 1000 * 30,
        type: 'datetime',

      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Volumen (m<sup>3</sup>)'
        }
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointRange: 24 * 3600 * 1000*30
        }
      },
      credits: {
        enabled: false
      },
      series: series
  }


    return (
      <div className="cost-bar test">
        <div className='chart'>
          <ReactHighcharts
            className='chart'
            config={config}
            ref={(ref) => { this.chart = ref }}
          />
        </div>
      </div>
    )
  }
}



export default VolumeLine
