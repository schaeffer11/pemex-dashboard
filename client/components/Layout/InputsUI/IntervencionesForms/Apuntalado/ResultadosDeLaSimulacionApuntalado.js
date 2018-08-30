import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setLongitudApuntalada, setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionApuntalado extends Component {
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
    let { setLongitudApuntalada, setAlturaTotalDeFractura, setAnchoPromedio, setConcentractionAreal, setConductividad, setFcd, setPresionNeta, setEficienciaDeFluidoDeFractura, formData } = this.props
    formData = formData.toJS()
    let { longitudApuntalada, alturaTotalDeFractura, anchoPromedio, concentractionAreal, conductividad, fcd, presionNeta, eficienciaDeFluidoDeFractura } = formData

    return (
      <div className='result-form' >
        <div className='header'>
        </div>
        <InputRow header="Longitud Apuntalada" name='' unit="m" value={longitudApuntalada} onChange={setLongitudApuntalada} />
        <InputRow header="Altura Total de Fractura" name='' unit="m" value={alturaTotalDeFractura} onChange={setAlturaTotalDeFractura} />
        <InputRow header="Ancho Promedio" name='' unit="pg." value={anchoPromedio} onChange={setAnchoPromedio} />
        <InputRow header="Concentracion Areal" name='' unit="lb/pg2" value={concentractionAreal} onChange={setConcentractionAreal} />
        <InputRow header="Conductividad" name='' unit="mD*ft" value={conductividad} onChange={setConductividad} />
        <InputRow header="FCD" name='' unit="adim." value={fcd} onChange={setFcd} />
        <InputRow header="Presion Neta" name='' unit="psi" value={presionNeta} onChange={setPresionNeta} />
        <InputRow header="Eficiencia de Fluido  de Fractura" name='' unit="%" value={eficienciaDeFluidoDeFractura} onChange={setEficienciaDeFluidoDeFractura} />
      </div>
    )
  }


  render() {

    return (
      <div className="form resultados-de-simulacion-apuntalado">
          { this.makeResultForm() }
          <div style={{color: 'red'}}>TODO add uevidence of simulation</div>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionApuntalado'),
})

const mapDispatchToProps = dispatch => ({
  setLongitudApuntalada: val => dispatch(setLongitudApuntalada(val)),
  setAlturaTotalDeFractura: val => dispatch(setAlturaTotalDeFractura(val)),
  setAnchoPromedio: val => dispatch(setAnchoPromedio(val)),
  setConcentractionAreal: val => dispatch(setConcentractionAreal(val)),
  setConductividad: val => dispatch(setConductividad(val)),
  setFcd: val => dispatch(setFcd(val)),
  setPresionNeta: val => dispatch(setPresionNeta(val)),
  setEficienciaDeFluidoDeFractura: val => dispatch(setEficienciaDeFluidoDeFractura(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionApuntalado)
