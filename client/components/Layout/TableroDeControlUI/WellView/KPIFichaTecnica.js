import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'
import { KPI } from '../Common/KPIs'

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


    let pwsFecha = data.PWS_FECHA ? new Date(data.PWS_FECHA) : null
    pwsFecha = pwsFecha ? `${pwsFecha.getDate()}/${pwsFecha.getMonth() + 1}/${pwsFecha.getFullYear()}` : ''
    
    let pwfFecha = data.PWF_FECHA ? new Date(data.PWF_FECHA) : null
    pwfFecha = pwfFecha ? `${pwfFecha.getDate()}/${pwfFecha.getMonth() + 1}/${pwfFecha.getFullYear()}` : ''


    return (        
      <div className="KPIs" style={{padding: '0px 20px 20px 20px'}}>
        <KPI header='Field' value={data.FIELD_NAME} />
        <KPI header='Formation' value={data.FORMACION} />
        <KPI header='Tipo De Pozo' value={data.TIPO_DE_POZO} />
        <KPI header='Caliza' value={data.CALIZA} unit='%'/>
        <KPI header='Dolomia' value={data.DOLOMIA} unit='%'/>
        <KPI header='Arcilla' value={data.ARCILLA} unit='%'/>
        <KPI header='Porosidad' value={data.POROSIDAD} unit='%'/>
        <KPI header='Permeabilidad' value={numWithCommas(data.PERMEABILIDAD)} unit=' mD'/>
        <KPI header='SW' value={data.SW} unit='%'/>
        <KPI header='CAA' value={numWithCommas(data.CAA)} unit=' mvbnm'/>
        <KPI header='CGA' value={numWithCommas(data.CGA)} unit=' mvbnm'/>
        <KPI header='PWS' value={numWithCommas(data.PWS)} unit={<span> Kg/cm<sup>2</sup></span>}/>
        <KPI header='PWS Fecha' value={pwsFecha} />
        <KPI header='PWF' value={numWithCommas(data.PWF)} unit={<span> Kg/cm<sup>2</sup></span>}/>
        <KPI header='PWF Fecha' value={pwfFecha} />
        <KPI header='Δp/mes' value={data.DELTA_P_PER_MES} unit={<span> Kg/cm<sup>2</sup>/mes</span>}/>
        <KPI header='TYAC' value={numWithCommas(data.TYAC)} unit=' °C'/>
        <KPI header='PVT' value={data.PVT} />
        <KPI header='Aparejo De Produccion' value={data.APAREJO_DE_PRODUCCION} />
        <KPI header='Prof Empacador' value={numWithCommas(data.PROF_EMPACADOR)} unit=' md' />
        <KPI header='Prof Sesor PYT' value={numWithCommas(data.PROF_SENSOR_PYT)} unit=' md' />
        <KPI header='Tipo De Sistema' value={data.TIPO_DE_SISTEMA} />
      </div>
    )
  }
}

export default KPIs

