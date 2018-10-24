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

