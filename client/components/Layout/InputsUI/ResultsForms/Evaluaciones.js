import React from 'react'
import { connect } from 'react-redux'
import EvaluacionEstimulacion from './EvaluacionEstimulacion'
import EvaluacionApuntalado from './EvaluacionApuntalado'
import EvaluacionAcido from './EvaluacionAcido'
import EvaluacionTermica from './EvaluacionTermica'

const Evaluaciones = ({ interventionType }) => {
  switch (interventionType) {
    case 'estimulacion':
      return <EvaluacionEstimulacion />
    case 'acido':
      return <EvaluacionAcido />
    case 'apuntalado':
      return <EvaluacionApuntalado />
    case 'termico':
      return <EvaluacionTermica />
    default:
      return <div>Nothing</div>
  }
}

const mapStateToProps = state => ({
  interventionType: state.getIn(['resultsMeta', 'interventionType'])
})

export default connect(mapStateToProps)(Evaluaciones)
