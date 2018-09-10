import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class HistoricoDeProduccion extends Component {
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

  makeAforoForm() {
    return (
      <div className='aforo-form' >
        <div className='header'>
          Aforo
        </div>
        <InputRow header="Fecha" name='' unit='dd/mmm/aa' />
        <InputRow header="Tiempo" name='' unit='hrs' />
        <InputRowUnitless header="Tipo de yac." name=''/>
        <InputRow header="Estrangulador" name='' unit='pg' />
        <InputRow header="PTP" name='' unit='Kg/cm2' />
        <InputRow header="TTP" name='' unit='°C' />
        <InputRow header="PBAJ" name='' unit='Kg/cm2' />
        <InputRow header="TBAJ" name='' unit='°C' />
        <InputRow header="Psep" name='' unit='Kg/cm2' />
        <InputRow header="Tsep" name='' unit='°C' />
        <InputRow header="Ql" name='' unit='bpd' />
        <InputRow header="Qo" name='' unit='bpd' />
        <InputRow header="Qg" name='' unit='MMpcd' />
        <InputRow header="Qw" name='' unit='bpd' />
        <InputRow header="RGA" name='' unit='m3/m3' />
        <InputRow header="Salinidad" name='' unit='ppm' />
        <InputRow header="pH" name='' unit='Adim.' />
      </div>
    )
  }

  render() {

    return (
      <div className="form historico-de-produccion">
        { this.makeAforoForm() }
        <div style={{color: 'red'}}>TODO: agregar opcion para subir los datos del pozo (add upload well data) (image or csv??)</div>
        <div style={{color: 'red'}}>TODO: esto podria o deberia ser varias lineas maneja esto de manera diferente (this could be multiple rows (should be) handle this differantly)</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('historicoDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoricoDeProduccion)
