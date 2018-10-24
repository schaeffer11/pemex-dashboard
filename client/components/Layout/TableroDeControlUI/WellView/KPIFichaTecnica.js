import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'
import { KPI } from '../Common/KPIs'

@autobind class KPIs extends PureComponent {

  render() {
    let { data } = this.props

    data.length > 0 ? data = data[0] : data = {}

    console.log(data)

    return (        
      <div className="KPIs" style={{padding: '0px 20px 20px 20px'}}>
        <KPI header='Field' value={data.FIELD_NAME} />
        <KPI header='Formation' value={data.FORMACION} />
        <KPI header='Tipo De Pozo' value={data.TIPO_DE_POZO} />
        <KPI header='Caliza' value={data.CALIZA} />
        <KPI header='Dolomia' value={data.DOLOMIA} />
        <KPI header='Arcilla' value={data.ARCILLA} />
        <KPI header='Porosidad' value={data.POROSIDAD} />
        <KPI header='Permeabilidad' value={data.PERMEABILIDAD} />
        <KPI header='SW' value={data.SW} />
        <KPI header='CAA' value={data.CAA} />
        <KPI header='CGA' value={data.CGA} />
        <KPI header='PWS' value={data.PWS} />
        <KPI header='PWS Fecha' value={data.PWS_FECHA} />
        <KPI header='PWF' value={data.PWF} />
        <KPI header='PWF Fecha' value={data.PWF_FECHA} />
        <KPI header='Δp/mes' value={data.DELTA_P_PER_MES} />
        <KPI header='TYAC' value={data.TYAC} />
        <KPI header='PVT' value={data.PVT} />
        <KPI header='Aparejo De Produccion' value={data.APAREJO_DE_PRODUCCION} />
        <KPI header='Prof Empacador' value={data.PROF_EMPACADOR} />
        <KPI header='Prof Sesor PYT' value={data.PROF_SENSOR_PYT} />
        <KPI header='Tipo De Sistema' value={data.TIPO_DE_SISTEMA} />
      </div>
    )
  }
}

export default KPIs

