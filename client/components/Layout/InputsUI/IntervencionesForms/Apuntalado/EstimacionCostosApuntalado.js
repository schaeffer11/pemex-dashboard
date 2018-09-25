
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowCosts, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol, setChecked } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class EstimacionCostosApuntalado extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      containsErrors: false,
      errors: [],
      checked: []
    }
  }

  componentDidMount() {
    this.validate()
    this.containsErrors()
  }

  componentDidUpdate(prevProps) {
    this.containsErrors()
  }

  containsErrors(){
    let foundErrors = false
    for (const key of Object.keys(this.state.errors)) {
      if(this.state.errors[key].checked)
        foundErrors = true
    }

    if(foundErrors !== this.state.containsErrors){
      this.setState({
        containsErrors: foundErrors
      })
    }
  }

  validate(event){
    let {setChecked, formData} = this.props
    formData = formData.toJS()

    let field = event ? event.target.name : null
    let {errors, checked} = this.props.validate(field, formData)

    this.setState({
      errors: errors,
    })

    if(event && event.target.name){
      setChecked( checked)

      this.setState({
        checked: checked
      })
    }
  }

  makeCostosForm() {
    let { setEstCostoDeRentaDeBarco, setEstCostUnidadesDeAltaPresion, setEstCostDelGelDeFractura, setEstCostDeSistemoRactivo, setEstCostDeSistemoNoRactivo, setEstCostDeDivergentes, setEstCostDeN2, setEstCostDeHCL, setEstCostDeSistemasAcidosRetardados, setEstCostDeCostoEquipoDeFacturamientoDePozos, setEstCostGelLineal, setEstCostTrabajosDeBombeoDiversos, setEstCostLlenadoDePozoYPruebaDeAdmision, setEstCostMinifrac, setEstCostBacheNeutralizador, setEstCostProtectorDeArbol, formData } = this.props
    formData = formData.toJS()
    let { estCostoDeRentaDeBarco, estCostUnidadesDeAltaPresion, estCostDelGelDeFractura, estCostDeSistemoRactivo, estCostDeSistemoNoRactivo, estCostDeDivergentes, estCostDeN2, estCostDeHCL, estCostDeSistemasAcidosRetardados, estCostDeCostoEquipoDeFacturamientoDePozos, estCostGelLineal, estCostTrabajosDeBombeoDiversos, estCostLlenadoDePozoYPruebaDeAdmision, estCostMinifrac, estCostBacheNeutralizador, estCostProtectorDeArbol } = formData
   
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowCosts header="Costo de renta de barco" name='estCostoDeRentaDeBarco' unit="MNX" value={estCostoDeRentaDeBarco} onChange={setEstCostoDeRentaDeBarco} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo Unidades de alta presion" name='estCostUnidadesDeAltaPresion' unit="MNX" value={estCostUnidadesDeAltaPresion} onChange={setEstCostUnidadesDeAltaPresion} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo del gel de fractura" name='estCostDelGelDeFractura' unit="MNX" value={estCostDelGelDeFractura} onChange={setEstCostDelGelDeFractura} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de sistema reactivo" name='estCostDeSistemoRactivo' unit="MNX" value={estCostDeSistemoRactivo} onChange={setEstCostDeSistemoRactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de sistema no reactivo" name='estCostDeSistemoNoRactivo' unit="MNX" value={estCostDeSistemoNoRactivo} onChange={setEstCostDeSistemoNoRactivo}  errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de divergentes" name='estCostDeDivergentes' unit="MNX" value={estCostDeDivergentes} onChange={setEstCostDeDivergentes} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de N2" name='estCostDeN2' unit="MNX" value={estCostDeN2} onChange={setEstCostDeN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de HCL" name='estCostDeHCL' unit="MNX" value={estCostDeHCL} onChange={setEstCostDeHCL} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de sistemas acidos retardados" name='estCostDeSistemasAcidosRetardados' unit="MNX" value={estCostDeSistemasAcidosRetardados} onChange={setEstCostDeSistemasAcidosRetardados} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo equipo de fracturamiento de pozos" name='estCostDeCostoEquipoDeFacturamientoDePozos' unit="MNX" value={estCostDeCostoEquipoDeFacturamientoDePozos} onChange={setEstCostDeCostoEquipoDeFacturamientoDePozos} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo gel lineal" name='estCostGelLineal' unit="MNX" value={estCostGelLineal} onChange={setEstCostGelLineal} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de trabajos de bombeo diversos" name='estCostTrabajosDeBombeoDiversos' unit="MNX" value={estCostTrabajosDeBombeoDiversos} onChange={setEstCostTrabajosDeBombeoDiversos} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de llenado de pozo y prueba de admision" name='estCostLlenadoDePozoYPruebaDeAdmision' unit="MNX" value={estCostLlenadoDePozoYPruebaDeAdmision} onChange={setEstCostLlenadoDePozoYPruebaDeAdmision} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo del Minifrac" name='estCostMinifrac' unit="MNX" value={estCostMinifrac} onChange={setEstCostMinifrac} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de Bache neutralizador" name='estCostBacheNeutralizador' unit="MNX" value={estCostBacheNeutralizador} onChange={setEstCostBacheNeutralizador} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Protector de arbol" name='estCostProtectorDeArbol' unit="MNX" value={estCostProtectorDeArbol} onChange={setEstCostProtectorDeArbol} errors={this.state.errors} onBlur={this.validate}/>
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

const isEmpty = val => {
  return typeof(value) === "undefined" || value.trim().length === 0
}


const validate = values => {
    const errors = {}

    if(isEmpty(values.estCostoDeRentaDeBarco.cost) || isEmpty(values.estCostoDeRentaDeBarco.company)){
      errors.estCostoDeRentaDeBarco = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostUnidadesDeAltaPresion.cost) || isEmpty(values.estCostUnidadesDeAltaPresion.company)){
      errors.estCostUnidadesDeAltaPresion = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDelGelDeFractura.cost) || isEmpty(values.estCostDelGelDeFractura.company) ){
      errors.estCostDelGelDeFractura = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeSistemoRactivo.cost) || isEmpty(values.estCostDeSistemoRactivo.company) ){
      errors.estCostDeSistemoRactivo = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeSistemoNoRactivo.cost) || isEmpty(values.estCostDeSistemoNoRactivo.company)){
      errors.estCostDeSistemoNoRactivo = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeDivergentes.cost) || isEmpty(values.estCostDeDivergentes.company)){
      errors.estCostDeDivergentes = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeN2.cost) || isEmpty(values.estCostDeN2.company)){
      errors.estCostDeN2 = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeHCL.cost) || isEmpty(values.estCostDeHCL.company)){
      errors.estCostDeHCL = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeSistemasAcidosRetardados.cost) || isEmpty(values.estCostDeSistemasAcidosRetardados.company)){
      errors.estCostDeSistemasAcidosRetardados = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostDeCostoEquipoDeFacturamientoDePozos.cost) || isEmpty(values.estCostDeCostoEquipoDeFacturamientoDePozos.company)){
      errors.estCostDeCostoEquipoDeFacturamientoDePozos = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostGelLineal.cost) || isEmpty(values.estCostGelLineal.company)){
      errors.estCostGelLineal = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostTrabajosDeBombeoDiversos.cost) || isEmpty(values.estCostTrabajosDeBombeoDiversos.company)){
      errors.estCostTrabajosDeBombeoDiversos = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostLlenadoDePozoYPruebaDeAdmision.cost) || isEmpty(values.estCostLlenadoDePozoYPruebaDeAdmision.company)){
      errors.estCostLlenadoDePozoYPruebaDeAdmision = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostMinifrac.cost) || isEmpty(values.estCostMinifrac.company)){
      errors.estCostMinifrac = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostBacheNeutralizador.cost) || isEmpty(values.estCostBacheNeutralizador.company)){
      errors.estCostBacheNeutralizador = {message: "Este campo no puede estar vacio"}
    }

    if(isEmpty(values.estCostProtectorDeArbol.cost) || isEmpty(values.estCostProtectorDeArbol.company)){
      errors.estCostProtectorDeArbol = {message: "Este campo no puede estar vacio"}
    }

    return errors
}


const mapStateToProps = state => ({
  formData: state.get('estCostApuntalado'),
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
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(EstimacionCostosApuntalado)
)
