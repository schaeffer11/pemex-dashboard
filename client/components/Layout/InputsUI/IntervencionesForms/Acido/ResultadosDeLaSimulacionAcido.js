import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEvidenceSimulationAcidoImgURL, setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }


  makeResultForm() {
    let { setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudTotal, longitudEfectivaGrabada, alturaGrabada, anchoPromedio, concentracionDelAcido, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData
    
    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud total" name='' unit="m" value={longitudTotal} onChange={setLongitudTotal}/>
        <InputRow header="Longitud efectiva grabada" name='' unit="m" value={longitudEfectivaGrabada} onChange={setLongitudEfectivaGrabada}/>
        <InputRow header="Altura grabada" name='' unit="m" value={alturaGrabada} onChange={setAlturaGrabada}/>
        <InputRow header="Ancho promedio" name='' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio}/>
        <InputRow header="Concentración del ácido" name='' unit="lb/pg2" value={concentracionDelAcido} onChange={setConcentracionDelAcido}/>
        <InputRow header="Conductividad" name='' unit="mD*ft" value={conductividad} onChange={setConductividad}/>
        <InputRow header="FCD" name='' unit="adim." value={fcd} onChange={setFcd}/>
        <InputRow header="Presión neta" name='' unit="psi" value={presionNeta} onChange={setPresionNeta}/>
        <InputRow header="Eficiencia de fluido de fractura" name='' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura}/>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    let { files } = e.target

    console.log(files)

    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeEvidenceSimulationInput() {
    let { formData, setEvidenceSimulationAcidoImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Evidence of Simulation (sim results) (spanish)
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationAcidoImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }



  render() {

    return (
      <div className="form resultados-de-simulacion-acido">
        <div className='left'>
          { this.makeResultForm() }
        </div>
        <div className='right'>
          { this.makeEvidenceSimulationInput() }
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionAcido'),
})

const mapDispatchToProps = dispatch => ({
  setLongitudTotal: val => dispatch(setLongitudTotal(val)),
  setLongitudEfectivaGrabada: val => dispatch(setLongitudEfectivaGrabada(val)),
  setAlturaGrabada: val => dispatch(setAlturaGrabada(val)),
  setAnchoPromedio: val => dispatch(setAnchoPromedio(val)),
  setConcentracionDelAcido: val => dispatch(setConcentracionDelAcido(val)),
  setConductividad: val => dispatch(setConductividad(val)),
  setFcd: val => dispatch(setFcd(val)),
  setPresionNeta: val => dispatch(setPresionNeta(val)),
  setEficienciaDeFluidoDeFractura: val => dispatch(setEficienciaDeFluidoDeFractura(val)),
  setEvidenceSimulationAcidoImgURL: val => dispatch(setEvidenceSimulationAcidoImgURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionAcido)

