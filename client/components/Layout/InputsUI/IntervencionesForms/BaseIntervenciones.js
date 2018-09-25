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

    this.estimulacionMultiStepFormRef = React.createRef();
    this.acidoMultiStepFormRef = React.createRef();
    this.apuntaladoMultiStepFormRef = React.createRef();

    this.estimulacionMultiStepForm = React.createElement(EstimulacionMultiStepForm,{ ref: this.estimulacionMultiStepFormRef })
    this.acidoMultiStepForm = React.createElement(AcidoMultiStepForm,{ ref: this.acidoMultiStepFormRef })
    this.apuntaladoMultiStepForm = React.createElement(ApuntaladoMultiStepForm,{ ref: this.apuntaladoMultiStepFormRef })
  }

  validate(){
    let { formData } = this.props
    formData = formData.toJS()

    let { tipoDeIntervenciones } = formData
    let valid = false

    if(tipoDeIntervenciones == 'estimulacion'){
      valid = this.estimulacionMultiStepFormRef.current.getWrappedInstance().validate()
    }else if(tipoDeIntervenciones == 'acido'){
      valid = this.acidoMultiStepFormRef.current.getWrappedInstance().validate()
    }else if(tipoDeIntervenciones == 'apuntalado'){
      valid = this.apuntaladoMultiStepFormRef.current.getWrappedInstance().validate()
    }

    return valid
  }

  render() {
    let { formData } = this.props
    formData = formData.toJS()

    let { tipoDeIntervenciones } = formData

    let form;
    switch(tipoDeIntervenciones){
            case 'estimulacion': 
              form = this.estimulacionMultiStepForm
              break;
            case 'acido':
              form = this.acidoMultiStepForm
              break;
            case 'apuntalado':
              form = this.apuntaladoMultiStepForm
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


