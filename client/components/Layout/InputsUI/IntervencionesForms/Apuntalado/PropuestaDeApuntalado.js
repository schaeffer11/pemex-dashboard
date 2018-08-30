import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setEtapa, setSistema, setTipoDeApuntalante, setConcentraciDeApuntalante, setVolLiquid, setGastoN2, setGastoLiqudo, setGastoEnFondo, setCalidad, setVolN2, setVolLiquidoAcum, setVolN2Acum, setRelN2Liq, setTiempo, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class PropuestaDeApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCedulaForm() {
    let { setEtapa, setSistema, setTipoDeApuntalante, setConcentraciDeApuntalante, setVolLiquid, setGastoN2, setGastoLiqudo, setGastoEnFondo, setCalidad, setVolN2, setVolLiquidoAcum, setVolN2Acum, setRelN2Liq, setTiempo, formData } = this.props
    formData = formData.toJS()
    let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, gastoN2, gastoLiqudo, gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo } = formData
    
    return (
      <div className='cedula-form' >
        <div className='header'>
          Cédula
        </div>
        <InputRowUnitless header="Etapa" name='' />
        <InputRowUnitless header="Sistema (NR-R-D)" name='' />
        <InputRow header="Vol. Liquid" name='' unit='m3' />
        <InputRow header="Gasto N2" name='' unit='m3/min' />
        <InputRow header="Gasto Liquido" name='' unit='bpm' />
        <InputRow header="Gasto en fondo" name='' unit='bpm' />
        <InputRow header="Calidad" name='' unit='%' />
        <InputRow header="Vol. N2" name='' unit='m3 std' />
        <InputRow header="Vol. Liquido Acum." name='' unit='m3' />
        <InputRow header="Vol. N2 Acum." name='' unit='m3 std' />
        <InputRow header="Rel. N2/Liq" name='' unit='m3 std/m3' />
        <InputRow header="Tiempo" name='' unit='min' />
      </div>
    )
  }

  makeGeneralForm() {
    let { setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, formData } = this.props
    formData = formData.toJS()
    let { intervalo, longitudDeIntervalo, volAparejo, capacidadTotalDelPozo } = formData

    return (
      <div className='general-form' >
        <div className='header'>
          General
        </div>
        <InputRowUnitless header="Intervalo(s)" name='' />
        <InputRow header="Longitud de intervalo a tratar" name='' unit='m' />
        <InputRow header="Vol. Aparejo (VAP)" name='' unit='m3' />
        <InputRow header="Capacidad total del pozo (cima/base)" name='' unit='m3/m3' />
      </div>
    )
  }

  makeDetallesForm() {
    let { setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, formData } = this.props
    formData = formData.toJS()
    let { volumenPrecolchonN2, volumenDeApuntalante, volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido } = formData
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <InputRow header="Volumen Precolchon N2" name='' unit='m3' />
        <InputRow header="Volumen De apuntalante" name='' unit='m3' />
        <InputRow header="Volumen de gel de fractura" name='' unit='m3' />
        <InputRow header="Volumen Desplazamiento" name='' unit='m3' />
        <InputRow header="Volumen Total de Liqudo" name='' unit='m3' />
      </div>
    )
  }

  render() {

    return (
      <div className="form propuesta-de-apuntalado">
        <div className="left">
          { this.makeCedulaForm() }
        </div>
        <div className="right">
          { this.makeGeneralForm() }
          { this.makeDetallesForm() }
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('propuestaApuntalado'),
})

const mapDispatchToProps = dispatch => ({
  setEtapa: val => dispatch(setEtapa(val)),
  setSistema: val => dispatch(setSistema(val)),
  setTipoDeApuntalante: val => dispatch(setTipoDeApuntalante(val)),
  setConcentraciDeApuntalante: val => dispatch(setConcentraciDeApuntalante(val)),
  setVolLiquid: val => dispatch(setVolLiquid(val)),
  setGastoN2: val => dispatch(setGastoN2(val)),
  setGastoLiqudo: val => dispatch(setGastoLiqudo(val)),
  setGastoEnFondo: val => dispatch(setGastoEnFondo(val)),
  setCalidad: val => dispatch(setCalidad(val)),
  setVolN2: val => dispatch(setVolN2(val)),
  setVolLiquidoAcum: val => dispatch(setVolLiquidoAcum(val)),
  setVolN2Acum: val => dispatch(setVolN2Acum(val)),
  setRelN2Liq: val => dispatch(setRelN2Liq(val)),
  setTiempo: val => dispatch(setTiempo(val)),
  setIntervalo: val => dispatch(setIntervalo(val)),
  setLongitudDeIntervalo: val => dispatch(setLongitudDeIntervalo(val)),
  setVolAparejo: val => dispatch(setVolAparejo(val)),
  setCapacidadTotalDelPozo: val => dispatch(setCapacidadTotalDelPozo(val)),
  setVolumenPrecolchonN2: val => dispatch(setVolumenPrecolchonN2(val)),
  setVolumenDeApuntalante: val => dispatch(setVolumenDeApuntalante(val)),
  setVolumenDeGelDeFractura: val => dispatch(setVolumenDeGelDeFractura(val)),
  setVolumenDesplazamiento: val => dispatch(setVolumenDesplazamiento(val)),
  setVolumenTotalDeLiquido: val => dispatch(setVolumenTotalDeLiquido(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaDeApuntalado)