
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstCostCompaniaDeServicio, setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class EstimacionCostosApuntalado extends Component {
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
    let { setEstCostCompaniaDeServicio, setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol, formData } = this.props
    formData = formData.toJS()
    let { estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol } = formData
   
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowUnitless header="Compania de Servicio" name='' />
        <InputRow header="Costo de renta de barco" name='' unit="MNX"/>
        <InputRow header="Costo Unidades de alta presion" name='' unit="MNX"/>
        <InputRow header="Costo del gel de fractura" name='' unit="MNX"/>
        <InputRow header="Costo de sistema reactivo" name='' unit="MNX"/>
        <InputRow header="Costo de sistema no reactivo" name='' unit="MNX"/>
        <InputRow header="Costo de divergentes" name='' unit="MNX"/>
        <InputRow header="Costo de N2" name='' unit="MNX"/>
        <InputRow header="Costo de HCL" name='' unit="MNX"/>
        <InputRow header="Costo de sistemas acidos retardados" name='' unit="MNX"/>
        <InputRow header="Costo equipo de fracturamiento de pozos" name='' unit="MNX"/>
        <InputRow header="Costo gel lineal" name='' unit="MNX"/>
        <InputRow header="Costo de trabajos de bombeo diversos" name='' unit="MNX"/>
        <InputRow header="Costo de llenado de pozo y prueba de admision" name='' unit="MNX"/>
        <InputRow header="Costo del Minifrac" name='' unit="MNX"/>
        <InputRow header="Costo de Bache neutralizador" name='' unit="MNX"/>
        <InputRow header="Protector de arbol" name='' unit="MNX"/>
      </div>
    )
  }

  render() {

    return (
      <div className="form estimacion-costos-apuntalado">
            { this.makeCostosForm() }
          <div style={{color: 'red'}}>TODO: suma total abajo (summation as total at bottom)</div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('estCostApuntalado'),
})

const mapDispatchToProps = dispatch => ({
  setEstCostCompaniaDeServicio: val => dispatch(setEstCostCompaniaDeServicio(val)),
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
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionCostosApuntalado)