import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Select from 'react-select'
import { connect } from 'react-redux'
import { setObjetivo, setAlcances, setTipoDeIntervenciones } from '../../../../redux/actions/intervencionesEstimulacion'

import AcidoMultiStepForm from './Acido/AcidoMultiStepForm'
import ApuntaladoMultiStepForm from './Apuntalado/ApuntaladoMultiStepForm'
import EstimulacionMultiStepForm from './Estimulacion/EstimulacionMultiStepForm'


@autobind class BaseIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      form: null,
      errors: []
    }
  }

  handleSelectIntervencionesType(val) {
    let { setTipoDeIntervenciones } = this.props

    setTipoDeIntervenciones(val.value)
  }

  handleSubmit(event){
    event.preventDefault();
    let {formData} = this.props
    const errors = this.validate(formData.toJS())

    if(Object.keys(errors).length){ // There were errors in the form
      this.setState({
        errors: errors
      })
      return false;
    }

    this.setState({
      form: 'test',
      errors: errors
    })

  }

  validate(formData){
    let errors = {};
    if(!formData.tipoDeIntervenciones){
      errors.tipoDeIntervenciones = {message: "Este campo no puede estar vacio", checked: true}
    }
    if(!formData.objetivo){
      errors.objetivo = {message: "Este campo no puede estar vacio", checked: true}
    }
    if(!formData.alcances){
      errors.alcances = {message: "Este campo no puede estar vacio", checked: true}
    }
    return errors;
  }

  render() {
    let { setObjetivo, setAlcances, formData } = this.props
    formData = formData.toJS()
    let { objetivo, alcances, tipoDeIntervenciones } = formData

    let tipoDeIntervencionesOptions = [
      {label: 'Tratamiento de Estimulacion', value: 'estimulacion'},
      {label: 'Fracuramiento Acido', value: 'acido'},
      {label: 'Fracturamiento Apuntalado', value: 'apuntalado'},
    ]

    
    if(this.state.form === null){
      return (
        <div>
          <div className="subtabs"></div>
          <div className="tab-content">
          <div className="multistep-form">
          <div className="content">
          <form className="form base-intervenciones" onSubmit={this.handleSubmit}>
            <div className='main-form'>
              <TextAreaUnitless header="Objetivo - Describir el objetivo de la intervención indicando la causa principal, tipo de tratamiento a aplicar y técnica de colocación de los sistemas." name='objetivo' className={'objetivo'} value={objetivo} onChange={setObjetivo} errors={this.state.errors} />
              <TextAreaUnitless header="Alcances - Describir los alcances que se pretenden obtener con la intervención programada a ejecutar." name='alcances' className={'alcances'} value={alcances} onChange={setAlcances} errors={this.state.errors}/>
              <InputRowSelectUnitless header='Tipo de intervenciones' name='tipoDeIntervenciones' value={tipoDeIntervenciones} options={tipoDeIntervencionesOptions} callback={this.handleSelectIntervencionesType} errors={this.state.errors} />
              <button className="submit">Siguiente</button>
            </div>
          </form>
          </div>
          </div>
          </div>
        </div>
      )
    }

    let form;
    switch(formData.tipoDeIntervenciones){
            case 'estimulacion': 
              form = <EstimulacionMultiStepForm/>
              break;
            case 'acido':
              form = <AcidoMultiStepForm/>
              break;
            case 'apuntalado':
              form = <ApuntaladoMultiStepForm/>
              break; 
    }


    return (
          <div>
            {form}
          </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('objetivoYAlcancesIntervencion'),
})

const mapDispatchToProps = dispatch => ({
  setObjetivo : val => dispatch(setObjetivo(val)),
  setAlcances : val => dispatch(setAlcances(val)),
  setTipoDeIntervenciones : val => dispatch(setTipoDeIntervenciones(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BaseIntervenciones)


