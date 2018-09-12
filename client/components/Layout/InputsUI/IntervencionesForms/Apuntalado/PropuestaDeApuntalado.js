import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../../Common/InputRow'
import { setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, setEtapa, setSistema, setTipoDeApuntalante, setConcentraciDeApuntalante, setVolLiquid, setGastoN2, setGastoLiqudo, setGastoEnFondo, setCalidad, setVolN2, setVolLiquidoAcum, setVolN2Acum, setRelN2Liq, setTiempo, setIntervalo, setLongitudDeIntervalo, setVolAparejo, setCapacidadTotalDelPozo, setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido } from '../../../../../redux/actions/intervencionesApuntalado'
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
        <InputRowUnitless header="Etapa" name='' value={etapa} onChange={setEtapa}/>
        <InputRowUnitless header="Sistema (NR-R-D)" name='' value={sistema} onChange={setSistema}/>
        <InputRow header="Vol. Liquid" name='' unit='m3' value={volLiquid} onChange={setVolLiquid}/>
        <InputRow header="Gasto N2" name='' unit='m3/min' value={gastoN2} onChange={setGastoN2}/>
        <InputRow header="Gasto Liquido" name='' unit='bpm' value={gastoLiqudo} onChange={setGastoLiqudo}/>
        <InputRow header="Gasto en fondo" name='' unit='bpm' value={gastoEnFondo} onChange={setGastoEnFondo}/>
        <InputRow header="Calidad" name='' unit='%' value={calidad} onChange={setCalidad}/>
        <InputRow header="Vol. N2" name='' unit='m3 std' value={volN2} onChange={setVolN2}/>
        <InputRow header="Vol. Liquido Acum." name='' unit='m3' value={volLiquidoAcum} onChange={setVolLiquidoAcum}/>
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
    let { setVolumenPrecolchonN2, setVolumenDeApuntalante, setVolumenDeGelDeFractura, setVolumenDesplazamiento, setVolumenTotalDeLiquido, formData } = this.props
    formData = formData.toJS()
    let { volumenPrecolchonN2, volumenDeApuntalante, volumenDeGelDeFractura, volumenDesplazamiento, volumenTotalDeLiquido } = formData
    
    return (
      <div className='detalles-form' >
        <div className='header'>
          Detalles
        </div>
        <InputRow header="Volumen Precolchon N2" name='' unit='m3' value={volumenPrecolchonN2} onChange={setVolumenPrecolchonN2}/>
        <InputRow header="Volumen De apuntalante" name='' unit='m3' value={volumenDeApuntalante} onChange={setVolumenDeApuntalante}/>
        <InputRow header="Volumen de gel de fractura" name='' unit='m3' value={volumenDeGelDeFractura} onChange={setVolumenDeGelDeFractura}/>
        <InputRow header="Volumen Desplazamiento" name='' unit='m3' value={volumenDesplazamiento} onChange={setVolumenDesplazamiento}/>
        <InputRow header="Volumen Total de Liqudo" name='' unit='m3' value={volumenTotalDeLiquido} onChange={setVolumenTotalDeLiquido}/>
      </div>
    )
  }

  makeGeomecanicaForm() {
    let { setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, formData } = this.props
    formData = formData.toJS()
    let { moduloYoungArena, moduloYoungLutitas, relacPoissonArena, relacPoissonLutatas, gradienteDeFractura, densidadDeDisparos, diametroDeDisparos } = formData
    
    return (
      <div className='geomecanica-form' >
        <div className='header'>
          Informacion de Geomecánica
        </div>
        <InputRow header="Modulo young arena" name='moduloYoungArena' value={moduloYoungArena} onChange={setModuloYoungArena} unit='psi' />
        <InputRow header="Modulo young lutitas" name='moduloYoungLutitas' value={moduloYoungLutitas} onChange={setModuloYoungLutitas} unit='psi' />
        <InputRow header="Relac. poisson arena" name='relacPoissonArena' value={relacPoissonArena} onChange={setRelacPoissonArena} unit='adim' />
        <InputRow header="Relac. poisson lutatas" name='relacPoissonLutatas' value={relacPoissonLutatas} onChange={setRelacPoissonLutatas} unit='adim' />
        <InputRow header="Gradiente de fractura" name='gradienteDeFractura' value={gradienteDeFractura} onChange={setGradienteDeFractura} unit='psi/ft' />
        <InputRow header="Densidad de disparos" name='densidadDeDisparos' value={densidadDeDisparos} onChange={setDensidadDeDisparos} unit='c/m' />
        <InputRow header="Diámetro de disparos" name='diametroDeDisparos' value={diametroDeDisparos} onChange={setDiametroDeDisparos} unit='pg' />
      </div>
    )
  }

  render() {

    return (
      <div className="form propuesta-de-apuntalado">
        <div className='top'>
          <div className="left">
            { this.makeGeneralForm() }
            { this.makeDetallesForm() }
          </div>
          <div className="right">
            { this.makeGeomecanicaForm() }
          </div>
        </div>
        <div className='bot'>
          <div style={{color: 'red'}}>TODO: add cedula table</div>
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

  setModuloYoungArena: val => dispatch(setModuloYoungArena(val)),
  setModuloYoungLutitas: val => dispatch(setModuloYoungLutitas(val)),
  setRelacPoissonArena: val => dispatch(setRelacPoissonArena(val)),
  setRelacPoissonLutatas: val => dispatch(setRelacPoissonLutatas(val)),
  setGradienteDeFractura: val => dispatch(setGradienteDeFractura(val)),
  setDensidadDeDisparos: val => dispatch(setDensidadDeDisparos(val)),
  setDiametroDeDisparos: val => dispatch(setDiametroDeDisparos(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropuestaDeApuntalado)