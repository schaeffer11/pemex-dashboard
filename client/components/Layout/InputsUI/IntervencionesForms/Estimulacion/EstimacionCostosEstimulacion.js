import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import {withValidate} from '../../../Common/Validate'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputRowCosts, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstCostoDeRentaDeBarco, setEstCostDeSistemaReactivo, setEstCostDeSistemaNoReactivo, setEstCostDeDivergenes, setEstCostDeN2, setEstCostHCL, setChecked } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class EstimacionCostosEstimulacion extends Component {
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

  setCheck(field){
    let {setChecked, formData} = this.props
    formData = formData.toJS()
    const checked = [ ...formData.checked, field ]

    checked.forEach(field => {
      if(errors[field])
        errors[field].checked = true
    })

    this.setState({
      checked: checked
    })

    setChecked(checked)
  }

  makeCostosForm() {
    let { setEstCostCompaniaDeServicio, setEstCostoDeRentaDeBarco, setEstCostDeSistemaReactivo, setEstCostDeSistemaNoReactivo, setEstCostDeDivergenes, setEstCostDeN2, setEstCostHCL, formData } = this.props
    formData = formData.toJS()
    let {  estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes, estCostDeN2, estCostHCL } = formData
    
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowCosts header="Costo de renta de barco" name='estCostoDeRentaDeBarco' unit="MNX" value={estCostoDeRentaDeBarco} onChange={setEstCostoDeRentaDeBarco} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de sistema reactivo" name='estCostDeSistemaReactivo' unit="MNX" value={estCostDeSistemaReactivo} onChange={setEstCostDeSistemaReactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de sistema no reactivo" name='estCostDeSistemaNoReactivo' unit="MNX" value={estCostDeSistemaNoReactivo} onChange={setEstCostDeSistemaNoReactivo} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de divergentes" name='estCostDeDivergenes' unit="MNX" value={estCostDeDivergenes} onChange={setEstCostDeDivergenes} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de N2" name='estCostDeN2' unit="MNX" value={estCostDeN2} onChange={setEstCostDeN2} errors={this.state.errors} onBlur={this.validate}/>
        <InputRowCosts header="Costo de HCl" name='estCostHCL' unit="MNX" value={estCostHCL} onChange={setEstCostHCL} errors={this.state.errors} onBlur={this.validate}/>
      </div>
    )
  }


  render() {

    return (
      <div className="form estimacion-costos-estimulacion">
            { this.makeCostosForm() }
          <div style={{color: 'red'}}>TODO: suma total abajo (summation as total at bottom)</div>

      </div>
    )
  }
}

const validate = values => {
    const errors = {}
/*
    if(!values.estCostoDeRentaDeBarco ){
       errors.estCostoDeRentaDeBarco = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estCostDeSistemaReactivo ){
       errors.estCostDeSistemaReactivo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estCostDeSistemaNoReactivo ){
       errors.estCostDeSistemaNoReactivo = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estCostDeDivergenes ){
       errors.estCostDeDivergenes = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estCostDeN2 ){
       errors.estCostDeN2 = {message: "Este campo no puede estar vacio"}
    }

    if(!values.estCostHCL ){
       errors.estCostHCL = {message: "Este campo no puede estar vacio"}
    }
*/
    return errors
}

const mapStateToProps = state => ({
  formData: state.get('estCostEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setEstCostoDeRentaDeBarco: val => dispatch(setEstCostoDeRentaDeBarco(val)),
  setEstCostDeSistemaReactivo: val => dispatch(setEstCostDeSistemaReactivo(val)),
  setEstCostDeSistemaNoReactivo: val => dispatch(setEstCostDeSistemaNoReactivo(val)),
  setEstCostDeDivergenes: val => dispatch(setEstCostDeDivergenes(val)),
  setEstCostDeN2: val => dispatch(setEstCostDeN2(val)),
  setEstCostHCL: val => dispatch(setEstCostHCL(val)),
  setChecked: val => dispatch(setChecked(val))
})

export default withValidate(
  validate,
  connect(mapStateToProps, mapDispatchToProps)(EstimacionCostosEstimulacion)
)
