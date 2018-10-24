import React from 'react'
import { connect } from 'react-redux'
import TratamientoEstimulacion from './TratamientoEstimulacion'
import TratamientoApuntalado from './TratamientoApuntalado'
import TratamientoAcido from './TratamientoAcido'
import TratamientoTermico from './TratamientoTermico'

const Tratamientos = ({ interventionType }) => {
  interventionType = 'termico'
  switch (interventionType) {
    case 'estimulacion':
      return <TratamientoEstimulacion />
    case 'acido':
      return <TratamientoAcido />
    case 'apuntalado':
      return <TratamientoApuntalado />
    case 'termico':
      return <TratamientoTermico />
    default:
      return <div>Nothing</div>
  }
}

const mapStateToProps = state => ({
  interventionType: state.getIn(['resultsMeta', 'interventionType'])
})


export default connect(mapStateToProps)(Tratamientos)
