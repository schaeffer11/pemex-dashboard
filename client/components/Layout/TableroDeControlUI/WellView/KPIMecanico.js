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
        <KPI header='H Intervalo Productor' value={data.H_INTERVALO_PRODUCTOR} unit=' md'/> 
        <KPI header='Empacador' value={data.EMPACADOR} unit=' md'/>
        <KPI header='Presion Dif Empacador' value={data.PRESION_DIF_EMPACADOR} unit=' psi'/>
        <KPI header='Sensor PYT' value={data.SENSOR_PYT} unit=' md'/>
        <KPI header='Tipo De liner' value={data.TIP_DE_LINER} />
        <KPI header='Diametro De Liner' value={data.DIAMETRO_DE_LINER} unit=' pg'/>
        { data.TIPO_DE_PISTOLAS ? <KPI header='Tipo De Pistolas' value={data.TIPO_DE_PISTOLAS} /> : null }
        { data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL ? <KPI header='Densidad De Disparos Mecanico' value={data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL} unit=' c/m'/> : null }
        { data.FASE ? <KPI header='Fase' value={data.FASE} unit=' Grados'/> : null }
        { data.DIAMETRO_DE_ORIFICIO ? <KPI header='Diametro De Orificio' value={data.DIAMETRO_DE_ORIFICIO} unit=' pg'/> : null }
        { data.PENETRACION ? <KPI header='Penetracion' value={data.PENETRACION} unit=' pg'/> : null }
        <KPI header='Tratamiento Por' value={data.TRATAMIENTO_POR} />
        <KPI header='Volumen Aparejo De Produccion' value={data.VOLUMEN_APAREJO_DE_PRODUCCION} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen Intervalo Cima' value={data.VOLUMEN_INTERVALO_CIMA} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen Intervalo Base' value={data.VOLUMEN_INTERVALO_BASE} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen De Espacio Anula' value={data.VOLUMEN_DE_ESPACIO_ANULA} unit={<span> m<sup>3</sup></span>} />
      </div>
    )
  }
}

export default KPIs

