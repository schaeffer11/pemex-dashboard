import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowCosts, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol, setEstCostApuntalante } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class EstimacionCostosAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCostosForm() {
    let { setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol, setEstCostApuntalante, formData } = this.props
    formData = formData.toJS()
    let { estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol, estCostApuntalante } = formData
    
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowCosts header="Costo de renta de barco" name='' unit="MNX" value={estCostoDeRentaDeBarco} onChange={setEstCostoDeRentaDeBarco}/>
        <InputRowCosts header="Costo unidades de alta presión" name='' unit="MNX" value={estCostUnidadesDeAltaPresion} onChange={setEstCostUnidadesDeAltaPresion}/>
        <InputRowCosts header="Costo del gel de fractura" name='' unit="MNX" value={estCostDelGelDeFractura} onChange={setEstCostDelGelDeFractura}/>
        <InputRowCosts header="Costo de sistema reactivo" name='' unit="MNX" value={estCostDeSistemoRactivo} onChange={setEstCostDeSistemoRactivo}/>
        <InputRowCosts header="Costo de sistema no reactivo" name='' unit="MNX" value={estCostDeSistemoNoRactivo} onChange={setEstCostDeSistemoNoRactivo}/>
        <InputRowCosts header="Costo de divergentes" name='' unit="MNX" value={estCostDeDivergentes} onChange={setEstCostDeDivergentes}/>
        <InputRowCosts header="Costo de N2" name='' unit="MNX" value={estCostDeN2} onChange={setEstCostDeN2}/>
        <InputRowCosts header="Costo de HCL" name='' unit="MNX" value={estCostDeHCL} onChange={setEstCostDeHCL}/>
        <InputRowCosts header="Costo de sistemas ácidos retardados" name='' unit="MNX" value={estCostDeSistemasAcidosRetardados} onChange={setEstCostDeSistemasAcidosRetardados}/>
        <InputRowCosts header="Costo equipo de fracturamiento de pozos" name='' unit="MNX" value={estCostDeCostoEquipoDeFacturamientoDePozos} onChange={setEstCostDeCostoEquipoDeFacturamientoDePozos}/>
        <InputRowCosts header="Costo gel lineal" name='' unit="MNX" value={estCostGelLineal} onChange={setEstCostGelLineal}/>
        <InputRowCosts header="Costo de trabajos de bombeo diversos" name='' unit="MNX" value={estCostTrabajosDeBombeoDiversos} onChange={setEstCostTrabajosDeBombeoDiversos}/>
        <InputRowCosts header="Costo de llenado de pozo y prueba de admisión" name='' unit="MNX" value={estCostLlenadoDePozoYPruebaDeAdmision} onChange={setEstCostLlenadoDePozoYPruebaDeAdmision}/>
        <InputRowCosts header="Costo del Minifrac" name='' unit="MNX" value={estCostMinifrac} onChange={setEstCostMinifrac}/>
        <InputRowCosts header="Costo de bache neutralizador" name='' unit="MNX" value={estCostBacheNeutralizador} onChange={setEstCostBacheNeutralizador}/>
        <InputRowCosts header="Protector de árbol" name='' unit="MNX" value={estCostProtectorDeArbol} onChange={setEstCostProtectorDeArbol}/>
        <InputRowCosts header="Costo del apuntalante" name='' unit="MNX" value={estCostApuntalante} onChange={setEstCostApuntalante}/>

      </div>
    )
  }


  render() {

    return (
      <div className="form estimacion-costos-acido">
            { this.makeCostosForm() }
          <div style={{color: 'red'}}>TODO: suma total abajo (summation as total at bottom)</div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('estCostAcido'),
})

const mapDispatchToProps = dispatch => ({
  setEstCostoDeRentaDeBarco: val => dispatch(setEstCostoDeRentaDeBarco(val)),
  setEstCostUnidadesDeAltaPresion: val => dispatch(setEstCostUnidadesDeAltaPresion(val)),
  setEstCostDelGelDeFractura: val => dispatch(setEstCostDelGelDeFractura(val)),
  setEstCostDeSistemoRactivo: val => dispatch(setEstCostDeSistemoRactivo(val)),
  setEstCostDeSistemoNoRactivo: val => dispatch(setEstCostDeSistemoNoRactivo(val)),
  setEstCostDeDivergentes: val => dispatch(setEstCostDeDivergentes(val)),
  setEstCostDeN2: val => dispatch(setEstCostDeN2(val)),
  setEstCostDeHCL: val => dispatch(setEstCostDeHCL(val)),
  setEstCostDeSistemasAcidosRetardados: val => dispatch(setEstCostDeSistemasAcidosRetardados(val)),
  setEstCostDeCostoEquipoDeFacturamientoDePozos: val => dispatch(setEstCostDeCostoEquipoDeFacturamientoDePozos(val)),
  setEstCostGelLineal: val => dispatch(setEstCostGelLineal(val)),
  setEstCostTrabajosDeBombeoDiversos: val => dispatch(setEstCostTrabajosDeBombeoDiversos(val)),
  setEstCostLlenadoDePozoYPruebaDeAdmision: val => dispatch(setEstCostLlenadoDePozoYPruebaDeAdmision(val)),
  setEstCostMinifrac: val => dispatch(setEstCostMinifrac(val)),
  setEstCostBacheNeutralizador: val => dispatch(setEstCostBacheNeutralizador(val)),
  setEstCostProtectorDeArbol: val => dispatch(setEstCostProtectorDeArbol(val)),
  setEstCostApuntalante: val => dispatch(setEstCostApuntalante(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionCostosAcido)
