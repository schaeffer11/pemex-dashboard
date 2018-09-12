import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, InputRowCosts, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstCostoDeRentaDeBarco, setEstCostDeSistemaReactivo, setEstCostDeSistemaNoReactivo, setEstCostDeDivergenes, setEstCostDeN2, setEstCostHCL } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class EstimacionCostosEstimulacion extends Component {
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
    let { setEstCostCompaniaDeServicio, setEstCostoDeRentaDeBarco, setEstCostDeSistemaReactivo, setEstCostDeSistemaNoReactivo, setEstCostDeDivergenes, setEstCostDeN2, setEstCostHCL, formData } = this.props
    formData = formData.toJS()
    let {  estCostCompaniaDeServicio, estCostoDeRentaDeBarco, estCostDeSistemaReactivo, estCostDeSistemaNoReactivo, estCostDeDivergenes, estCostDeN2, estCostHCL } = formData
    
    return (
      <div className='costos-form' >
        <div className='header'>
          Costos
        </div>
        <InputRowCosts header="Costo de renta de barco" name='' unit="MNX" value={estCostoDeRentaDeBarco} onChange={setEstCostoDeRentaDeBarco}/>
        <InputRowCosts header="Costo de sistema reactivo" name='' unit="MNX" value={estCostDeSistemaReactivo} onChange={setEstCostDeSistemaReactivo}/>
        <InputRowCosts header="Costo de sistema no reactivo" name='' unit="MNX" value={estCostDeSistemaNoReactivo} onChange={setEstCostDeSistemaNoReactivo}/>
        <InputRowCosts header="Costo de divergentes" name='' unit="MNX" value={estCostDeDivergenes} onChange={setEstCostDeDivergenes}/>
        <InputRowCosts header="Costo de N2" name='' unit="MNX" value={estCostDeN2} onChange={setEstCostDeN2}/>
        <InputRowCosts header="Costo de HCl" name='' unit="MNX" value={estCostHCL} onChange={setEstCostHCL}/>
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

})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionCostosEstimulacion)