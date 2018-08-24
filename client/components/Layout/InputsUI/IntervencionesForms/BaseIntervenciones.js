import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'
import Select from 'react-select'

@autobind class BaseIntervenciones extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }


  render() {

    let { handleSelectIntervencionesType, intervencionesType } = this.props

    let tipoDeIntervencionesOptions = [
      {label: 'Tratamiento de Estimulacion', value: 'estimulacion'},
      {label: 'Fracuramiento Acido', value: 'acido'},
      {label: 'Fracturamiento Apuntalado', value: 'apuntalado'},
    ]

    return (
      <form className="form base-intervenciones">
        <div className='main-form'>
          <TextAreaUnitless header="Objetivo - Describir el objetive de la intervencion indicando la cause principal, tipo de tratamineto a aplicar y tecnica de colocacion de los sistemas." name='' className={'objetivo'} />
          <TextAreaUnitless header="Alcances - Describir los alcances que se pretenden obtener con las intervencion programada a ejecutar." name='' className={'alcances'} />
          <InputRowSelectUnitless header='Tipo de Intervenciones' value={intervencionesType} options={tipoDeIntervencionesOptions} callback={handleSelectIntervencionesType} />
        </div>
      </form>
    )
  }
}


export default BaseIntervenciones

