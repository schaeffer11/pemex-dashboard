import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Select from 'react-select'
import { connect } from 'react-redux'
import { setObjetivo, setAlcances, setTipoDeIntervenciones } from '../../../../redux/actions/intervencionesEstimulacion'


@autobind class BaseIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  handleSelectIntervencionesType(val) {
    let { setTipoDeIntervenciones } = this.props

    setTipoDeIntervenciones(val.value)
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

    return (
      <form className="form base-intervenciones">
        <div className='main-form'>
          <TextAreaUnitless header="Objetivo - Describir el objetive de la intervencion indicando la cause principal, tipo de tratamineto a aplicar y tecnica de colocacion de los sistemas." name='' className={'objetivo'} value={objetivo} onChange={setObjetivo} />
          <TextAreaUnitless header="Alcances - Describir los alcances que se pretenden obtener con las intervencion programada a ejecutar." name='' className={'alcances'} value={alcances} onChange={setAlcances}/>
          <InputRowSelectUnitless header='Tipo de Intervenciones' value={tipoDeIntervenciones} options={tipoDeIntervencionesOptions} callback={this.handleSelectIntervencionesType} />
        </div>
      </form>
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


