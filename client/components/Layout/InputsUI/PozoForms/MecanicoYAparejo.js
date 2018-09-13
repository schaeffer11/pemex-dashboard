import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, setTratamientoPor, setVolumenAparejoDeProduccion, setVolumenCimaDeIntervalo, setVolumenBaseDeIntervalo, setVolumenDeEspacioAnular, setImgBoreDiagramURL, setImgAparejoDeProduccionURL} from '../../../../redux/actions/pozo'
import { connect } from 'react-redux'

let tipoDeTerminacionOptions = [
  { label: 'Agujero Descubierto (AD)', value: 'Agujero Descubierto (AD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Cola extendida', value: 'Cola extendida' }
]

let tipoDeLinerOptions = [
  { label: 'Liner Ranurado (LR)', value: 'Liner Ranurado (LR)' },
  { label: 'Liner Ranurado y Disparado (LRD)', value: 'Liner Ranurado y Disparado (LRD)' },
  { label: 'Liner Disparado (LD)', value: 'Liner Disparado (LD)' },
  { label: 'Liner Cementado y Disparado (LCD)', value: 'Liner Cementado y Disparado (LCD)' },
  { label: 'Cola extendida', value: 'Cola extendida' },
]

let tratamientoPorOptions = [
  { label: 'Tubería de Producción (TP)', value: 'Tubería de Producción (TP)' },
  { label: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)', value: 'Tubería de Revestimiento-Tubería de Producción (TR-TP)' },
  { label: 'Espacio Anular (EA)', value: 'Espacio Anular (EA)' },
  { label: 'Espacio Anular-Tuberia de Producción (EA-TP)', value: 'Espacio Anular-Tuberia de Producción (EA-TP)' },
]
@autobind class MecanicoYAparejo extends Component {
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
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors === undefined
      })
    }
  }

  handleSelectTerminacion(val) {
  let { tipoDeTerminacion, setTipoDeTerminacion } = this.props

  if (tipoDeTerminacion !== val.value) {
    setTipoDeTerminacion(val.value) 
  }
}


  makeTerminacionForm() {
    let { setTipoDeTerminacion, setHIntervaloProductor, setEmpacador, setPresionDifEmpacador, setSensorPyt, setTipoDeLiner, setDiametroDeLiner, setTipoDePistolas, setDensidadDeDisparosMecanico, setFase, setDiametroDeOrificio, setPenetracion, setTipoDeSAP, formData } = this.props
    formData = formData.toJS()
    let { tipoDeTerminacion, hIntervaloProductor, empacador, presionDifEmpacador, sensorPyt, tipoDeLiner, diametroDeLiner, tipoDePistolas, densidadDeDisparosMecanico, fase, diametroDeOrificio, penetracion, tipoDeSAP } = formData
    
    return (
      <div className='terminacion-form' >
        <div className='header'>
          Terminación
        </div>
        TIPO
        <InputRowSelectUnitless header="Tipo de terminación" value={tipoDeTerminacion} callback={(e) => setTipoDeTerminacion(e.value)} options={tipoDeTerminacionOptions} name='' />
        <InputRow header="h (intervalo productor)" value={hIntervaloProductor} onChange={setHIntervaloProductor} name='' unit='m' />
        <InputRow header="Empacador" name='' value={empacador} onChange={setEmpacador} unit='m' />
        <InputRow header="Presión dif. empacador" name='' value={presionDifEmpacador} onChange={setPresionDifEmpacador} unit='psi' />
        <InputRow header="Profundidad Sensor P y T" name='' value={sensorPyt} onChange={setSensorPyt} unit='m' />
        LINER
        <InputRowSelectUnitless header="Tipo de liner" name='' value={tipoDeLiner} options={tipoDeLinerOptions} callback={(e) => setTipoDeLiner(e.value)} />
        <InputRow header="Diámetro de liner" name='' value={diametroDeLiner} onChange={setDiametroDeLiner} unit='pg' />
        {
          tipoDeTerminacion === 'Agujero Descubierto (AD)' ? null :
          <div>
            DISPAROS
            <InputRowUnitless header="Tipo de pistolas" name='' value={tipoDePistolas} onChange={setTipoDePistolas}  />
            <InputRow header="Densidad de disparos" name='' value={densidadDeDisparosMecanico} onChange={setDensidadDeDisparosMecanico} unit='c/m' />
            <InputRow header="Fase" name='' value={fase} onChange={setFase} unit='Grados' />
            <InputRow header="Diámetro de orificio" name='' value={diametroDeOrificio} onChange={setDiametroDeOrificio} unit='pg' />
            <InputRow header="Penetración" name='' value={penetracion} onChange={setPenetracion} unit='pg' />
          </div>
        }
{/*        SAP
        <InputRowUnitless header="Tipo de SAP" name='' value={tipoDeSAP} onChange={setTipoDeSAP}/>*/}

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
        <InputRowSelectUnitless header="Tratamiento por" name='' value={tratamientoPor} callback={(e) => setTratamientoPor(e.value)} options={tratamientoPorOptions} />
        <InputRow header="Volumen aparejo de producción" name='' value={volumenAparejoDeProduccion} onChange={setVolumenAparejoDeProduccion} unit='m3' />
        <InputRow header="Volumen @ cima de intervalo" name='' value={volumenCimaDeIntervalo} onChange={setVolumenCimaDeIntervalo} unit='m3' />
        <InputRow header="Volumen @ base de intervalo" name='' value={volumenBaseDeIntervalo} onChange={setVolumenBaseDeIntervalo} unit='m3' />
        <InputRow header="Volumen de espacio anular (EA)" name='' value={volumenDeEspacioAnular} onChange={setVolumenDeEspacioAnular} unit='m3' />

      </div>
    )
  }
  
  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeBoreDiagramInput() {
    let { formData, setImgBoreDiagramURL} = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Well Bore Diagram (spanish)
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setImgBoreDiagramURL)}></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }

  makeAparejoDeProduccionInput() {
    let { formData, setImgAparejoDeProduccionURL } = this.props
    formData = formData.toJS()
    let { imgAparejoDeProduccionURL } = formData

    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Aparejo De Produccion (spanish) (this is excel file? upload image or parse???)
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setImgAparejoDeProduccionURL)}></input>
        {imgAparejoDeProduccionURL ? <img className='img-preview' src={imgAparejoDeProduccionURL}></img> : null }
      </div>
    )
  }

  render() {

    return (
      <div className="form mecanico-y-aparejo">
        <div className='left'>
          { this.makeTerminacionForm() }
        </div>
        <div className='right'>
          { this.makeCapacidadForm() }
          { this.makeBoreDiagramInput() }
          { this.makeAparejoDeProduccionInput() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
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
  setDensidadDeDisparosMecanico: val => dispatch(setDensidadDeDisparosMecanico(val)),
  setFase: val => dispatch(setFase(val)),
  setDiametroDeOrificio: val => dispatch(setDiametroDeOrificio(val)),
  setPenetracion: val => dispatch(setPenetracion(val)),
  setTipoDeSAP: val => dispatch(setTipoDeSAP(val)),
  setTratamientoPor: val => dispatch(setTratamientoPor(val)),
  setVolumenAparejoDeProduccion: val => dispatch(setVolumenAparejoDeProduccion(val)),
  setVolumenCimaDeIntervalo: val => dispatch(setVolumenCimaDeIntervalo(val)),
  setVolumenBaseDeIntervalo: val => dispatch(setVolumenBaseDeIntervalo(val)),
  setVolumenDeEspacioAnular: val => dispatch(setVolumenDeEspacioAnular(val)),
  setImgBoreDiagramURL: val => dispatch(setImgBoreDiagramURL(val)),
  setImgAparejoDeProduccionURL: val => dispatch(setImgAparejoDeProduccionURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MecanicoYAparejo)
