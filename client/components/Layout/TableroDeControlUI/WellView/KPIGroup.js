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
      <div className="KPIs">
        <div> FICHA TECNICA </div>
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
        <div>MECANICO DATA </div>
        <KPI header='Tipo De Terminacion' value={data.TIPO_DE_TERMINACION} />
        <KPI header='H Intervalo Productor' value={data.H_INTERVALO_PRODUCTOR} /> 
        <KPI header='Empacador' value={data.EMPACADOR} />
        <KPI header='Presion Dif Empacador' value={data.PRESION_DIF_EMPACADOR} />
        <KPI header='Sensor PYT' value={data.SENSOR_PYT} />
        <KPI header='Tipo De liner' value={data.TIP_DE_LINER} />
        <KPI header='Diametro De Liner' value={data.DIAMETRO_DE_LINER} />
        { data.TIPO_DE_PISTOLAS ? <KPI header='Tipo De Pistolas' value={data.TIPO_DE_PISTOLAS} /> : null }
        { data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL ? <KPI header='Densidad De Disparos Mecanico' value={data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL} /> : null }
        { data.FASE ? <KPI header='Fase' value={data.FASE} /> : null }
        { data.DIAMETRO_DE_ORIFICIO ? <KPI header='Diametro De Orificio' value={data.DIAMETRO_DE_ORIFICIO} /> : null }
        { data.PENETRACION ? <KPI header='Penetracion' value={data.PENETRACION} /> : null }
        <KPI header='Tratamiento Por' value={data.TRATAMIENTO_POR} />
        <KPI header='Volumen Aparejo De Produccion' value={data.VOLUMEN_APAREJO_DE_PRODUCCION} />
        <KPI header='Volumen Intervalo Cima' value={data.VOLUMEN_INTERVALO_CIMA} />
        <KPI header='Volumen Intervalo Base' value={data.VOLUMEN_INTERVALO_BASE} />
        <KPI header='Volumen De Espacio Anula' value={data.VOLUMEN_DE_ESPACIO_ANULA} />
      </div>
    )
  }
}

export default KPIs

