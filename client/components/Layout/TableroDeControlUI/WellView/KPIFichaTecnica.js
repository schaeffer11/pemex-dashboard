import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'
import { KPI } from '../Common/KPIs'
import { formatText } from '../../../../pptx/formatters'



const numWithCommas = (x) => {
  if (x === 0) {
    return 0
  }
  if (!x) {
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@autobind class KPIs extends PureComponent {

  render() {
    let { data } = this.props

    data.length > 0 ? data = data[0] : data = {}
    const dataCopy = { ...data }

    Object.keys(dataCopy).forEach((key) => {
      dataCopy[key] = formatText(dataCopy[key])
    })
    return (
      <div className="KPIs" style={{padding: '0px 20px 20px 20px'}}>
        <KPI header='Campo' value={dataCopy.FIELD_NAME} />
        <KPI header='Formación' value={dataCopy.FORMACION} />
        <KPI header='Tipo De Pozo' value={dataCopy.TIPO_DE_POZO} />
        <KPI header='Caliza' value={dataCopy.CALIZA} unit='%'/>
        <KPI header='Dolomia' value={dataCopy.DOLOMIA} unit='%'/>
        <KPI header='Arcilla' value={dataCopy.ARCILLA} unit='%'/>
        <KPI header='Porosidad' value={dataCopy.POROSIDAD} unit='%'/>
        <KPI header='Permeabilidad' value={numWithCommas(dataCopy.PERMEABILIDAD)} unit=' mD'/>
        <KPI header='SW' value={dataCopy.SW} unit='%'/>
        <KPI header='CAA' value={numWithCommas(dataCopy.CAA)} unit=' mvbnm'/>
        <KPI header='CGA' value={numWithCommas(dataCopy.CGA)} unit=' mvbnm'/>
        <KPI header='PWS' value={numWithCommas(dataCopy.PWS)} unit={<span> Kg/cm<sup>2</sup></span>}/>
        <KPI header='PWS Fecha' value={dataCopy.PWS_FECHA} />
        <KPI header='PWF' value={numWithCommas(dataCopy.PWF)} unit={<span> Kg/cm<sup>2</sup></span>}/>
        <KPI header='PWF Fecha' value={dataCopy.PWF_FECHA} />
        <KPI header='Δp/mes' value={dataCopy.DELTA_P_PER_MES} unit={<span> Kg/cm<sup>2</sup>/mes</span>}/>
        <KPI header={<div style={{ display: 'inline-block'}}>T<sub>YAC</sub></div>} value={numWithCommas(dataCopy.TYAC)} unit=' °C'/>
        <KPI header='PVT' value={dataCopy.PVT} />
        <KPI header='Aparejo de Producción' value={dataCopy.APAREJO_DE_PRODUCCION} />
        <KPI header='Prof Empacador' value={numWithCommas(dataCopy.PROF_EMPACADOR)} unit=' md' />
        <KPI header='Prof. sensor P y T' value={numWithCommas(dataCopy.PROF_SENSOR_PYT)} unit=' md' />
        <KPI header='Tipo de Sistema Artificial de Producción' value={dataCopy.TIPO_DE_SISTEMA} />
      </div>
    )
  }
}

export default KPIs

