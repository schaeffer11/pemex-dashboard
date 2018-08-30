import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setEtapa, setSistema, setTipoDeApuntalante, setConcentraciDeApuntalante, setVolLiquid, setGastoN2, setGastoLiqudo, setGastoEnFondo, setCalidad, setVolN2, setVolLiquidoAcum, setVolN2Acum, setRelN2Liq, setTiempo, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoGelLineal } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class PropuestaDeAcido extends Component {
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
    let { setEtapa, setSistema, setTipoDeApuntalante, setConcentraciDeApuntalante, setVolLiquid, setGastoN2, setGastoLiquid, setGastoEnFondo, setCalidad, setVolN2, setVolLiquidoAcum, setVolN2Acum, setRelN2Liq, setTiempo, formData } = this.props
    formData = formData.toJS()
    let { etapa, sistema, tipoDeApuntalante, concentraciDeApuntalante, volLiquid, gastoN2, gastoLiquid, gastoEnFondo, calidad, volN2, volLiquidoAcum, volN2Acum, relN2Liq, tiempo } = formData

    return (
      <div className='cedula-form' >
        <div className='header'>
          Cédula
        </div>
        <InputRowUnitless header="Etapa" name='' value={etapa} onChange={setEtapa}/>
        <InputRowUnitless header="Sistema (NR-R-D)" name='' value={sistema} onChange={setSistema}/>
        <InputRowUnitless header="Tipo de apuntalante" name='' value={tipoDeApuntalante} onChange={setTipoDeApuntalante}/>
        <InputRow header="Concentración de apuntalante" name='' unit='lbm/gal' value={concentraciDeApuntalante} onChange={setConcentraciDeApuntalante}/>
        <InputRow header="Vol. Líquido" name='' unit='m3' value={volLiquid} onChange={setVolLiquid}/>
        <InputRow header="Gasto N2" name='' unit='m3/min' value={gastoN2} onChange={setGastoN2}/>
        <InputRow header="Gasto Líquido" name='' unit='bpm' value={gastoLiquid} onChange={setGastoLiqudo}/>
        <InputRow header="Gasto en fondo" name='' unit='bpm' value={gastoEnFondo} onChange={setGastoEnFondo}/>
        <InputRow header="Calidad" name='' unit='%' value={calidad} onChange={setCalidad}/>
        <InputRow header="Vol. N2" name='' unit='m3 std' value={volN2} onChange={setVolN2}/>
        <InputRow header="Vol. Líquido Acum." name='' unit='m3' value={volLiquidoAcum} onChange={setVolLiquidoAcum}/>
        <InputRow header="Vol. N2 Acum." name='' unit='m3 std' value={volN2Acum} onChange={setVolN2Acum}/>
        <InputRow header="Rel. N2/Liq" name='' unit='m3 std/m3' value={relN2Liq} onChange={setRelN2Liq}/>
        <InputRow header="Tiempo" name='' unit='min' value={tiempo} onChange={setTiempo}/>
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
        <InputRowUnitless header="Intervalo(s)" name='' value={intervalo} onChange={setIntervalo}/>
        <InputRow header="Longitud de intervalo a tratar" name='' unit='m' value={longitudDeIntervalo} onChange={setLongitudDeIntervalo}/>
        <InputRow header="Vol. Aparejo (VAP)" name='' unit='m3' value={volAparejo} onChange={setVolAparejo}/>
        <InputRow header="Capacidad total del pozo (cima/base)" name='' unit='m3/m3' value={capacidadTotalDelPozo} onChange={setCapacidadTotalDelPozo}/>
      </div>
    )
  }

  makeDetallesForm() {
    let { setVolumenPrecolchonN2, setVolumenSistemaNoReativo, setVolumenSistemaReactivo, setVolumenSistemaDivergente, setVolumenDesplazamientoLiquido, setVolumenDesplazamientoGelLineal, formData } = this.props
    formData = formData.toJS()
    let { volumenPrecolchonN2, volumenSistemaNoReativo, volumenSistemaReactivo, volumenSistemaDivergente, volumenDesplazamientoLiquido, volumenDesplazamientoGelLineal} = formData
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <InputRow header="Volumen precolchón (gel lineal o N2)" name='' unit='m3' value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2}/>
        <InputRow header="Volumen sistema no reactivo" name='' unit='m3' value={volumenSistemaNoReativo} onChange={setVolumenSistemaNoReativo}/>
        <InputRow header="Volumen sistema reactivo" name='' unit='m3' value={volumenSistemaReactivo} onChange={setVolumenSistemaReactivo}/>
        <InputRow header="Volumen sistema divergente" name='' unit='m3' value={volumenSistemaDivergente} onChange={setVolumenSistemaDivergente}/>
        <InputRow header="Volumen desplazamiento líquido" name='' unit='m3' value={volumenDesplazamientoLiquido} onChange={setVolumenDesplazamientoLiquido}/>
        <InputRow header="Volumen desplazamiento gel lineal" name='' unit='m3' value={volumenDesplazamientoGelLineal} onChange={setVolumenDesplazamientoGelLineal}/>
      </div>
    )
  }

  render() {

    return (
      <div className="form propuesta-de-acido">
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
  formData: state.get('propuestaAcido'),
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
  setVolumenSistemaNoReativo: val => dispatch(setVolumenSistemaNoReativo(val)),
  setVolumenSistemaReactivo: val => dispatch(setVolumenSistemaReactivo(val)),
  setVolumenSistemaDivergente: val => dispatch(setVolumenSistemaDivergente(val)),
  setVolumenDesplazamientoLiquido: val => dispatch(setVolumenDesplazamientoLiquido(val)),
  setVolumenDesplazamientoGelLineal: val => dispatch(setVolumenDesplazamientoGelLineal(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaDeAcido)
