import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setLongitudTotal, setLongitudEfectivaGrabada, setAlturaGrabada, setAnchoPromedio, setConcentracionDelAcido, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura } from '../../../../../redux/actions/intervencionesAcido'
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
        <InputRow header="Longitud Total" name='' unit="m" value={longitudTotal} onChange={setLongitudTotal}/>
        <InputRow header="Longitud Efectiva Grabada" name='' unit="m" value={longitudEfectivaGrabada} onChange={setLongitudEfectivaGrabada}/>
        <InputRow header="Altura Grabada" name='' unit="m" value={alturaGrabada} onChange={setAlturaGrabada}/>
        <InputRow header="Ancho Promedio" name='' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio}/>
        <InputRow header="Concentracion del Acido" name='' unit="lb/pg2" value={concentracionDelAcido} onChange={setConcentracionDelAcido}/>
        <InputRow header="Conductividad" name='' unit="mD*ft" value={conductividad} onChange={setConductividad}/>
        <InputRow header="FCD" name='' unit="adim." value={fcd} onChange={setFcd}/>
        <InputRow header="Presion Neta" name='' unit="psi" value={presionNeta} onChange={setPresionNeta}/>
        <InputRow header="Eficiencia de Fluido de Fractura" name='' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura}/>
      </div>
    )
  }


  render() {

    return (
      <div className="form resultados-de-simulacion-acido">
          { this.makeResultForm() }
          <div style={{color: 'red'}}>TODO add uevidence of simulation</div>

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
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionAcido)

