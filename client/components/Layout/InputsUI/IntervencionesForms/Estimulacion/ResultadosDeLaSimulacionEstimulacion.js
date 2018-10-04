import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setPenetracionRadial, setLongitudDeAgujeroDeGusano, setEvidenceSimulationImgURL } from '../../../../../redux/actions/intervencionesEstimulacion'
import { checkEmpty, checkDate } from '../../../../../lib/errorCheckers';

@autobind class ResultadosDeLaSimulacionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        penetracionRadial: {
          type: 'number',
          value: null
        },
        longitudDeAgujeroDeGusano: {
          type: 'number',
          value: null
        },
      }
    }
  }

  componentDidMount() {
    this.checkAllInputs()
  }

  checkAllInputs() {
    let { formData } = this.props
    formData = formData.toJS()
    const { errors } = this.state
    Object.keys(errors).forEach(elem => {
      const errObj = errors[elem]
      if (errObj.type === 'text' || errObj.type === 'number') {
        checkEmpty(formData[elem], elem, errors, this.updateErrors)
      } else if (errObj.type === 'date') {
        checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.updateErrors)
      }
    })
  }

  updateErrors(errors) {
    this.setState({ errors })
  }

  makeMatricialForm() {
    let { setPenetracionRadial, setLongitudDeAgujeroDeGusano, formData } = this.props
    formData = formData.toJS()
    let { penetracionRadial, longitudDeAgujeroDeGusano } = formData
    return (
      <div className='matricail-form' >
        <div className='header'>
          Matricial
        </div>
        <InputRow header="Penetración radial" name='penetracionRadial' unit="pg" value={penetracionRadial} onChange={setPenetracionRadial} errors={this.state.errors} onBlur={this.updateErrors} />
        <InputRow header="Longitud de agujero de gusano" name='longitudDeAgujeroDeGusano' unit="pg" value={longitudDeAgujeroDeGusano} onChange={setLongitudDeAgujeroDeGusano} errors={this.state.errors} onBlur={this.updateErrors} />
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    let { files } = e.target

    console.log(files)

    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeEvidenceSimulationInput() {
    let { formData, setEvidenceSimulationImgURL } = this.props
    formData = formData.toJS()
    let { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar evidencia del laboratorio
        </div>
        <input type='file' accept="image/*"  onChange={(e) => this.handleFileUpload(e, setEvidenceSimulationImgURL)} multiple></input>
        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }


  render() {
    let { propuestaData } = this.props
    propuestaData = propuestaData.toJS()
    let { tipoDeEstimulacion } = propuestaData

    return (
      <div className="form resultados-de-simulacion">
        <div className='image' />
        <div className='left'>
          { tipoDeEstimulacion === 'matricial' ? this.makeMatricialForm() : <div>Simulación no es requerida para limpiezas</div> }
        </div>
        <div className='right'>
          { tipoDeEstimulacion === 'matricial' ? this.makeEvidenceSimulationInput() : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionEstimulacion'),
  propuestaData: state.get('propuestaEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setPenetracionRadial: val => dispatch(setPenetracionRadial(val)),
  setLongitudDeAgujeroDeGusano: val => dispatch(setLongitudDeAgujeroDeGusano(val)),
  setEvidenceSimulationImgURL: val => dispatch(setEvidenceSimulationImgURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionEstimulacion)