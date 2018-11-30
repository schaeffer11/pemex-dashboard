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


    return (        
      <div className="KPIs" style={{padding: '0px 20px 20px 20px'}}>
        <KPI header='Tipo de Terminación' value={data.TIPO_DE_TERMINACION} />
        <KPI header='h(intervalo productor)' value={numWithCommas(data.H_INTERVALO_PRODUCTOR)} unit=' md'/> 
        <KPI header='Empacador' value={numWithCommas(data.EMPACADOR)} unit=' md'/>
        <KPI header='Presión dif. empacador' value={numWithCommas(data.PRESION_DIF_EMPACADOR)} unit=' psi'/>
        <KPI header='Prof. sensor P y T' value={numWithCommas(data.SENSOR_PYT)} unit=' md'/>
        <KPI header='Tipo De liner' value={data.TIP_DE_LINER} />
        <KPI header='Diámetro de liner' value={numWithCommas(data.DIAMETRO_DE_LINER)} unit=' pg'/>
        { data.TIPO_DE_PISTOLAS ? <KPI header='Tipo De Pistolas' value={data.TIPO_DE_PISTOLAS} /> : null }
        { data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL ? <KPI header='Densidad De Disparos Mecanico' value={numWithCommas(data.DENSIDAD_DE_DISPAROS_MECANICO_DUPL)} unit=' c/m'/> : null }
        { data.FASE ? <KPI header='Fase' value={numWithCommas(data.FASE)} unit=' Grados'/> : null }
        { data.DIAMETRO_DE_ORIFICIO ? <KPI header='Diametro De Orificio' value={numWithCommas(data.DIAMETRO_DE_ORIFICIO)} unit=' pg'/> : null }
        { data.PENETRACION ? <KPI header='Penetracion' value={numWithCommas(data.PENETRACION)} unit=' pg'/> : null }
        <KPI header='Tratamiento Por' value={data.TRATAMIENTO_POR} />
        <KPI header='Volumen Aparejo De Produccion' value={numWithCommas(data.VOLUMEN_APAREJO_DE_PRODUCCION)} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen a la cima' value={numWithCommas(data.VOLUMEN_INTERVALO_CIMA)} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen a la base' value={numWithCommas(data.VOLUMEN_INTERVALO_BASE)} unit={<span> m<sup>3</sup></span>} />
        <KPI header='Volumen de EA' value={numWithCommas(data.VOLUMEN_DE_ESPACIO_ANULA)} unit={<span> m<sup>3</sup></span>} />
      </div>
    )
  }
}

export default KPIs

