import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparos, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular} from '../../../../redux/actions/mecanicoYAparejoDeProduccion'
import { connect } from 'react-redux'

@autobind class MecanicoYAparejo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeTerminacionForm() {
    let { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparos, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparos, fase, diametroDeOrificio, penetracion, tipoDeSAP } = formData
    
    return (
      <div className='terminacion-form' >
        <div className='header'>
          Terminacion
        </div>
        TIPO
        <InputRowUnitless header="Tipo de Terminacion" value={tipoDeTerminacion} onChange={setTipoDeTerminacion} name='' />
        <InputRow header="h (intervalo productor)" value={hIntervaloProductor} onChange={setHIntervaloProductor} name='' unit='m' />
        <InputRow header="Empacador" name='' value={empacador} onChange={setEmpacador} unit='m' />
        <InputRow header="Presion Dif. Empacador" name='' value={presionDifEmpacador} onChange={setPresionDifEmpacador} unit='psi' />
        <InputRow header="Sensor P y T" name='' value={sensorPyt} onChange={setSensorPyt} unit='m' />
        LINER
        <InputRowUnitless header="Tipo de Liner" name='' value={tipoDeLiner} onChange={setTipoDeLiner} />
        <InputRow header="Diametro de Liner" name='' value={diametroDeLiner} onChange={setDiametroDeLiner} unit='pg' />
        DISPAROS
        <InputRowUnitless header="Tipo de Pistolas" name='' value={tipoDePistolas} onChange={setTipoDePistolas}  />
        <InputRow header="Densidad de Disparos" name='' value={densidadDeDisparos} onChange={setDensidadDeDisparos} unit='c/m' />
        <InputRow header="Fase" name='' value={fase} onChange={setFase} unit='Grados' />
        <InputRow header="Diametro de Orificio" name='' value={diametroDeOrificio} onChange={setDiametroDeOrificio} unit='pg' />
        <InputRow header="Penetracion" name='' value={penetracion} onChange={setPenetracion} unit='pg' />
        SAP
        <InputRowUnitless header="Tipo de SAP" name='' value={tipoDeSAP} onChange={setTipoDeSAP}/>

      </div>
    )
  }
  
  makeCapacidadForm() {
    let { setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, formData } = this.props
    formData = formData.toJS()
    let { tratamientoPor, volumenAparejoDeProduccion, volumenCimaDeIntervalo, volumenBaseDeIntervalo, volumenDeEspacioAnular} = formData
 
    return (
      <div className='capacidad-form' >
        <div className='header'>
          Capacidad
        </div>
        VOLUMEN
        <InputRow header="Tratamiento por" name='' value={tratamientoPor} onChange={setTratamientoPor} unit='(ej- TP, TR-TP, EA)' />
        <InputRow header="Volumen Aparejo de Produccion" name='' value={volumenAparejoDeProduccion} onChange={setVolumenAparejoDeProduccion} unit='m3' />
        <InputRow header="Volumen @ Cima de Intervalo" name='' value={volumenCimaDeIntervalo} onChange={setVolumenCimaDeIntervalo} unit='m3' />
        <InputRow header="Volumen @ Base de Intervalo" name='' value={volumenBaseDeIntervalo} onChange={setVolumenBaseDeIntervalo} unit='m3' />
        <InputRow header="Volumen de Espacio Anular (EA)" name='' value={volumenDeEspacioAnular} onChange={setVolumenDeEspacioAnular} unit='m3' />

      </div>
    )
  }

  render() {

    return (
      <div className="form mecanico-y-aparejo">
        { this.makeTerminacionForm() }
        { this.makeCapacidadForm() }
        <div style={{color: 'red'}}>TODO: add upload well bore diagram file (image)</div>
        <div style={{color: 'red'}}>TODO: add upload aparejo de produccion (image or csv)??</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('mecanicoYAparejoDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
  setTipoDeTerminacion: val => dispatch(setTipoDeTerminacion(val)),
  setHIntervaloProductor: val => dispatch(setHIntervaloProductor(val)),
  setEmpacador: val => dispatch(setEmpacador(val)),
  setPresionDifEmpacador: val => dispatch(setPresionDifEmpacador(val)),
  setSensorPyt: val => dispatch(setSensorPyt(val)),
  setTipoDeLiner: val => dispatch(setTipoDeLiner(val)),
  setDiametroDeLiner: val => dispatch(setDiametroDeLiner(val)),
  setTipoDePistolas: val => dispatch(setTipoDePistolas(val)),
  setDensidadDeDisparos: val => dispatch(setDensidadDeDisparos(val)),
  setFase: val => dispatch(setFase(val)),
  setDiametroDeOrificio: val => dispatch(setDiametroDeOrificio(val)),
  setPenetracion: val => dispatch(setPenetracion(val)),
  setTipoDeSAP: val => dispatch(setTipoDeSAP(val)),
  setTratamientoPor: val => dispatch(setTratamientoPor(val)),
  setVolumenAparejoDeProduccion: val => dispatch(setVolumenAparejoDeProduccion(val)),
  setVolumenCimaDeIntervalo: val => dispatch(setVolumenCimaDeIntervalo(val)),
  setVolumenBaseDeIntervalo: val => dispatch(setVolumenBaseDeIntervalo(val)),
  setVolumenDeEspacioAnular: val => dispatch(setVolumenDeEspacioAnular(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MecanicoYAparejo)
