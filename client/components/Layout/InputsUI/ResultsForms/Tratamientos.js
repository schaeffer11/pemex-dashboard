import React from 'react'
import { connect } from 'react-redux'
import TratamientoEstimulacion from './TratamientoEstimulacion'
import TratamientoApuntalado from './TratamientoApuntalado'
import TratamientoAcido from './TratamientoAcido'

const Tratamientos = ({ interventionType }) => {
  switch (interventionType) {
    case 'estimulacion':
      return <TratamientoEstimulacion />
    case 'acido':
      return <TratamientoAcido />
    case 'apuntalado':
      return <TratamientoApuntalado />
    default:
      return <div>Nothing</div>
  }
}

const mapStateToProps = state => ({
  interventionType: state.getIn(['resultsMeta', 'interventionType'])
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps)(Tratamientos)
