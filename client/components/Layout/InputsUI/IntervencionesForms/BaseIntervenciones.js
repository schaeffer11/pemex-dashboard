import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'

import AcidoMultiStepForm from './Acido/AcidoMultiStepForm'
import ApuntaladoMultiStepForm from './Apuntalado/ApuntaladoMultiStepForm'
import EstimulacionMultiStepForm from './Estimulacion/EstimulacionMultiStepForm'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../Common/InputRow'

@autobind class BaseIntervenciones extends Component {
  constructor(props) {
    super(props)

  }


  render() {
    let { formData } = this.props
    formData = formData.toJS()

    let { tipoDeIntervenciones } = formData

    let form;
    switch(tipoDeIntervenciones){
            case 'estimulacion': 
              form = <EstimulacionMultiStepForm />
              break;
            case 'acido':
              form = <AcidoMultiStepForm />
              break;
            case 'apuntalado':
              form = <ApuntaladoMultiStepForm />
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

})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(BaseIntervenciones)


