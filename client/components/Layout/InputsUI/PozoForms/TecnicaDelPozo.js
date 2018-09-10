import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { connect } from 'react-redux'
import { setIntervaloProductor, setEspesorBruto, setEspesorNeto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, setTipoDePozo, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSap, setModuloYoungArena, setModuloYoungLutitas, setRelacPoissonArena, setRelacPoissonLutatas, setGradienteDeFractura, setDensidadDeDisparos, setDiametroDeDisparos, formData } from '../../../../redux/actions/fichaTecnicaDelPozo'

@autobind class TechnicaDelPozo extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false
    }
  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return ['intervalosProductores', 'espesorBruto', 'espesorNeto', 'caliza', 'dolomia', 'arcilla', 'porosidad', 
       'permeabilidad', 'sw', 'caa', 'cga', 
       'tipoDePozo', 'pwsFecha', 'pwfFecha', 'deltaPPerMes', 'setTyac', 'setPvt', 'aparejoDeProduccion',
       'profEmpacador', 'profSensorPYT','tipoDeSap',
       'moduloYoungArena', 'moduloYoungLutitas', 'relacPoissonArena', 'relacPoissonLutatas', 'gradienteDeFractura',
       'densidadDeDisparos', 'diametroDeDisparos'].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
     }
  }

  makeFormacionForm() {
    let { setIntervaloProductor, setEspesorBruto, setEspesorNeto, setCaliza, setDolomia, setArcilla, setPorosidad, setPermeabilidad, setSw, setCaa, setCga, formData } = this.props 
    formData = formData.toJS()
    let { intervaloProductor, espesorBruto, espesorNeto, caliza, dolomia, arcilla, porosidad, permeabilidad, sw, caa, cga } = formData
    const errors = []

    return (
      <div className='formacion-form' >
        <div className='header'>
          Los Datos de Formación
        </div>
        <InputRow header="Intervalos(s) productor(es)" type='number' name='intervalosProductores' value={intervaloProductor}  onChange={setIntervaloProductor} unit='md/mv' errors={errors} />
        <InputRow header="Espesor bruto" name='espesorBruto' value={espesorBruto} onChange={setEspesorBruto} unit='m' errors={errors} />
        <InputRow header="Espesor neto" name='espesorNeto' value={espesorNeto} onChange={setEspesorNeto} unit='m' errors={errors} />
        <InputRow header="Caliza" name='caliza' value={caliza} onChange={setCaliza} unit='%' errors={errors} />
        <InputRow header="Dolomia" name='dolomia' value={dolomia} onChange={setDolomia} unit='%' errors={errors} />
        <InputRow header="Arcilla" name='arcilla' value={arcilla} onChange={setArcilla} unit='%' errors={errors} />
        <InputRow header="Porosidad" name='porosidad' value={porosidad} onChange={setPorosidad} unit='%' errors={errors} />
        <InputRow header="Permeabilidad" name='permeabilidad' value={permeabilidad} onChange={setPermeabilidad} unit='mD' errors={errors} />
        <InputRow header="Sw" name='sw' value={sw} onChange={setSw} unit='%' errors={errors} />
        <InputRow header="CAA" name='caa' value={caa} onChange={setCaa} unit='mvbnm' errors={errors} />
        <InputRow header="CGA" name='cga' value={cga} onChange={setCga} unit='mvbnm' errors={errors} />
      </div>
    )
  }

  makePozoForm() {
    let { setTipoDePozo, setPwsFecha, setPwfFecha, setDeltaPPerMes, setTyac, setPvt, setAparejoDeProduccion, setProfEmpacador, setProfSensorPYT, setTipoDeSap, formData } = this.props 
    formData = formData.toJS()
    let { tipoDePozo, pwsFecha, pwfFecha, deltaPPerMes, tyac, pvt, aparejoDeProduccion, profEmpacador, profSensorPYT, tipoDeSap } = formData

    let wellOptions = [
      { label: 'Productor', value: 'Productor' },
      { label: 'Inyector', value: 'Inyector' },
      { label: 'Cerrado', value: 'Cerrado' }
    ]

    return (
      <div className='pozo-form' >
        <div className='header'>
          Los Datos de Pozo
        </div>
          <InputRowSelectUnitless header="Tipo de pozo" value={tipoDePozo} onChange={setTipoDePozo} name='' options={wellOptions} />
          <InputRow header="Pws (fecha)" name='pws' value={pwsFecha} onChange={setPwsFecha} unit='Kg/cm2' />
          <InputRow header="Pwf (fecha)" name='pwf' value={pwfFecha} onChange={setPwfFecha} unit='Kg/cm2' />
          <InputRow header="Δp/mes" name='deltaPperMes' value={deltaPPerMes} onChange={setDeltaPPerMes} unit='Kg/cm2/mes' />
          <InputRow header="Tyac" name='tyac' value={tyac} onChange={setTyac} unit='°C' />
          <InputRow header="PVT" name='pvt' value={pvt} onChange={setPvt} unit='Pozo' />
          <InputRow header="Aparejo de producción" value={aparejoDeProduccion} onChange={setAparejoDeProduccion} name='aparejoDeProduccion' unit='pg' />
          <InputRow header="Prof. empacador" name='profEmpacador' value={profEmpacador} onChange={setProfEmpacador} unit='md' />
          <InputRow header="Prof. sensor P y T" name='profSensorPYT' value={profSensorPYT} onChange={setProfSensorPYT} unit='md' />
          <InputRowUnitless header="Tipo de SAP" name='TipoDeSap' value={tipoDeSap} onChange={setTipoDeSap} />
      </div>
    )
  }

  makeIntervencionesForm() {
    return (
      <div className='intervenciones-form' >
        <div className='header'>
          Historial de Intervenciones
          <div style={{color: 'red'}}>TODO: agregar aportaciones de usario (add user input)</div>
        </div>

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
      <div className="form tecnica-del-pozo">
        { this.makeFormacionForm() }
        { this.makePozoForm() }
        { this.makeIntervencionesForm() }
        { this.makeGeomecanicaForm() }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('fichaTecnicaDelPozo'),
})

const mapDispatchToProps = dispatch => ({
  setIntervaloProductor: val => dispatch(setIntervaloProductor(val)),
  setEspesorBruto: val => dispatch(setEspesorBruto(val)),
  setEspesorNeto: val => dispatch(setEspesorNeto(val)),
  setCaliza: val => dispatch(setCaliza(val)),
  setDolomia: val => dispatch(setDolomia(val)),
  setArcilla: val => dispatch(setArcilla(val)),
  setPorosidad: val => dispatch(setPorosidad(val)),
  setPermeabilidad: val => dispatch(setPermeabilidad(val)),
  setSw: val => dispatch(setSw(val)),
  setCaa: val => dispatch(setCaa(val)),
  setCga: val => dispatch(setCga(val)),
  setTipoDePozo: val => dispatch(setTipoDePozo(val)),
  setPwsFecha: val => dispatch(setPwsFecha(val)),
  setPwfFecha: val => dispatch(setPwfFecha(val)),
  setDeltaPPerMes: val => dispatch(setDeltaPPerMes(val)),
  setTyac: val => dispatch(setTyac(val)),
  setPvt: val => dispatch(setPvt(val)),
  setAparejoDeProduccion: val => dispatch(setAparejoDeProduccion(val)),
  setProfEmpacador: val => dispatch(setProfEmpacador(val)),
  setProfSensorPYT: val => dispatch(setProfSensorPYT(val)),
  setTipoDeSap: val => dispatch(setTipoDeSap(val)),
  setModuloYoungArena: val => dispatch(setModuloYoungArena(val)),
  setModuloYoungLutitas: val => dispatch(setModuloYoungLutitas(val)),
  setRelacPoissonArena: val => dispatch(setRelacPoissonArena(val)),
  setRelacPoissonLutatas: val => dispatch(setRelacPoissonLutatas(val)),
  setGradienteDeFractura: val => dispatch(setGradienteDeFractura(val)),
  setDensidadDeDisparos: val => dispatch(setDensidadDeDisparos(val)),
  setDiametroDeDisparos: val => dispatch(setDiametroDeDisparos(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TechnicaDelPozo)

