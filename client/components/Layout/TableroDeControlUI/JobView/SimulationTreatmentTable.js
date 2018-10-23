import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighcharts from 'react-highcharts'

import { KPI } from '../Common/KPIs'
import ReactTable from 'react-table'

@autobind class SimulationTreatmentTable extends PureComponent {

  render() {
    let { interventionData, interventionResultsData, type } = this.props

    console.log(interventionData, interventionResultsData)
    interventionData ? interventionData = interventionData[0] : null
    interventionResultsData ? interventionResultsData = interventionResultsData[0] : null
    
    let hide = false
    let columns = [{
        Header: 'Item',
        accessor: 'item', 
        width: 250,
      },{
        Header: 'Unit',
        accessor: 'unit',
        width: 70,
      },{
        Header: 'Simulated',
        accessor: 'sim', 
        width: 150
      },{
        Header: 'Actual',
        accessor: 'actual', 
        width: 150
      }]

    let data

    if (interventionData && interventionResultsData)  {
      if (type === 'Estimulacion') {
        if (!interventionData.LONGITUD_DE_AGUJERO_DE_GUSANO || !interventionData.PENETRACION_RADIAL) {
          hide = true
        }
        else {
          data = [{
            item: 'Longitud de agujero de gusano', unit: 'pg', sim: interventionData.LONGITUD_DE_AGUJERO_DE_GUSANO, actual: interventionResultsData.LONGITUD_DE_AGUJERO_DE_GUSANO
          },{
            item: 'Penetración radial', unit: 'pg', sim: interventionData.PENETRACION_RADIAL, actual: interventionResultsData.PENETRACION_RADIAL
          }]
        }
      }
      else if (type === 'Acido') {
        data = [{
          item: 'Longitud total', unit: 'm', sim: interventionData.LONGITUD_TOTAL, actual: interventionResultsData.LONGITUD_TOTAL
        },{
          item: 'Longitud efectiva grabada', unit: 'm', sim: interventionData.LONGITUD_EFECTIVA_GRABADA, actual: interventionResultsData.LONGITUD_EFECTIVA_GRABADA
        },{
          item: 'Altura grabada', unit: 'm', sim: interventionData.ALTURA_GRABADA, actual: interventionResultsData.ALTURA_GRABADA
        },{
          item: 'Ancho promedio', unit: 'pg', sim: interventionData.ANCHO_PROMEDIO, actual: interventionResultsData.ANCHO_PROMEDIO
        },{
          item: 'Concentración del ácido', unit: <div>lb/pg<sup>2</sup></div>, sim: interventionData.CONCENTRACION_DEL_ACIDO, actual: interventionResultsData.CONCENTRACION_DEL_ACIDO
        },{
          item: 'Conductividad', unit: 'mD*ft', sim: interventionData.CONDUCTIVIDAD, actual: interventionResultsData.CONDUCTIVIDAD
        },{
          item: 'FCD', unit: 'adim.', sim: interventionData.FCD, actual: interventionResultsData.FCD
        },{
          item: 'Presión neta', unit: 'psi', sim: interventionData.PRESION_NETA, actual: interventionResultsData.PRESION_NETA
        },{
          item: 'Eficiencia de fluido de fractura', unit: '%', sim: interventionData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA, actual: interventionResultsData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA
        }]
      }
      else {
        data = [{
          item: 'Longitud apuntalada', unit: 'm', sim: interventionData.LONGITUD_APUNTALADA, actual: interventionResultsData.LONGITUD_APUNTALADA
        },{
          item: 'Altura total de fractura', unit: 'm', sim: interventionData.ALTURA_TOTAL_DE_FRACTURA, actual: interventionResultsData.ALTURA_TOTAL_DE_FRACTURA
        },{
          item: 'Ancho promedio', unit: 'pg', sim: interventionData.ANCHO_PROMEDIO, actual: interventionResultsData.ANCHO_PROMEDIO
        },{
          item: 'Concentración areal', unit: <div>lb/pg<sup>2</sup></div>, sim: interventionData.CONCENTRACION_AREAL, actual: interventionResultsData.CONCENTRACION_AREAL
        },{
          item: 'Conductividad', unit: 'mD*ft', sim: interventionData.CONDUCTIVIDAD, actual: interventionResultsData.CONDUCTIVIDAD
        },{
          item: 'FCD', unit: 'adim.', sim: interventionData.FCD, actual: interventionResultsData.FCD
        },{
          item: 'Presión neta', unit: 'psi', sim: interventionData.PRESION_NETA, actual: interventionResultsData.PRESION_NETA
        },{
          item: 'Eficiencia de fluido  de fractura', unit: '%', sim: interventionData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA, actual: interventionResultsData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA
        }]
      }  
    }

    return (
      <div className="simulation-treatment">
      { hide === true ? 
        <div>
          No simulation/results needed for limpieza
        </div> :
        <div>
          Simulation Vs Results
          <ReactTable 
            columns={columns}
            showPagination={false}
            data={data}
            pageSize={8}
          />
        </div>
      }
      </div>
    )
  }
}



export default SimulationTreatmentTable
