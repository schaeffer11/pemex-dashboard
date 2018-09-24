import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import axios from 'axios';

import { setShowForms } from '../../../../redux/actions/global'
import TecnicaDelPozo from './TecnicaDelPozo'
import TecnicaDelCampo from './TecnicaDelCampo'
import SistemasArtificialesDeProduccion from './SistemasArtificialesDeProduccion'
import EvaluacionPetrofisica from './EvaluacionPetrofisica'
import MecanicoYAparejo from './MecanicoYAparejo'
import HistoricoDePresionCampo from './HistoricoDePresionCampo'
import HistoricoDePresionPozo from './HistoricoDePresionPozo'
import HistoricoDeProduccion from './HistoricoDeProduccion'
import AnalisisDelAgua from './AnalisisDelAgua'

import { setFichaTecnicaDelCampo, setFichaTecnicaDelPozo, setEvaluacionPetrofisica, setMecanicoYAparejoDeProduccion, 
  setAnalisisDelAgua, setSistemasArtificialesDeProduccion, setPresionDataCampo, setPresionDataPozo, setHistoricoProduccion } from '../../../../redux/actions/pozo'

@autobind class PozoMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }

    this.fichaTecnicaDelCampo = React.createRef();
    this.fichaTecnicaDelPozo = React.createRef();
    this.evaluacionPetrofisica = React.createRef();
    this.mecanicoYAparejo = React.createRef();
    this.analisisDelAgua = React.createRef();
    this.sistemasArtificialesDeProduccion = React.createRef();
    this.historicoDePresionCampo = React.createRef();
    this.historicoDePresionPozo = React.createRef();
    this.historicoDeProduccion = React.createRef();
    

    // TODO: Refactor the tabs to be children instead
    this.forms = [
      {'title' : 'Ficha Técnica del Campo', 'type': 'TecnicaDelCampo', 'content': <TecnicaDelCampo ref={Ref =>  this.fichaTecnicaDelCampo=Ref } containsErrors={this.containsErrors} /> },
      {'title' : 'Ficha Técnica del Pozo' , 'type':'TecnicaDelPozo',  'content':<TecnicaDelPozo ref={Ref =>  this.fichaTecnicaDelPozo=Ref } containsErrors={this.containsErrors} /> },
      {'title' : 'Evaluación Petrofísica', 'type':'EvaluacionPetrofisica', 'content': <EvaluacionPetrofisica ref={Ref => this.evaluacionPetrofisica=Ref} containsErrors={this.containsErrors}  /> },
      {'title' : 'Edo. Mecánico y Aparejo de Producción', 'type':'MecanicoYAparejo',  'content': <MecanicoYAparejo ref={Ref => this.mecanicoYAparejo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Análisis del Agua', 'type':'AnalisisDelAgua', 'content': <AnalisisDelAgua ref={Ref => this.analisisDelAgua=Ref } containsErrors={this.containsErrors}  /> }, 
      {'title' : 'Información de Sistemas Artificiales de Producción', 'type':'SistemasArtificialesDeProduccion', 'content': <SistemasArtificialesDeProduccion ref={Ref => this.sistemasArtificialesDeProduccion=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Presión - Campo', 'type':'HistoricoDePresionCampo', 'content': <HistoricoDePresionCampo ref={Ref => this.historicoDePresionCampo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Presión - Pozo', 'type':'HistoricoDePresionPozo', 'content': <HistoricoDePresionPozo ref={Ref => this.historicoDePresionPozo=Ref } containsErrors={this.containsErrors}  /> },
      {'title' : 'Histórico de Producción', 'type':'HistoricoDeProduccion', 'content': <HistoricoDeProduccion ref={Ref => this.historicoDeProduccion=Ref } containsErrors={this.containsErrors}  /> },
    ];
  }


  async loadTecnicaDelCampo() {
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelCampo } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { campo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionField?fieldID=${campo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getFields?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err) {
        setFichaTecnicaDelCampo(data.fichaTecnicaDelCampo)
      }
    }
    else {
      console.log('no data found')
    }
  }

  async loadTecnicaDelPozo() {
    let { fichaTecnicaDelPozoHighLevel, setFichaTecnicaDelPozo } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    console.log(transactionID)

    if (transactionID) {
      let data = await fetch(`api/getWell?transactionID=${transactionID}`).then(r => r.json())
      let interventionData = await fetch(`api/getHistIntervenciones?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err && !interventionData.err) {
        let newObj = data.fichaTecnicaDelPozo
        newObj.historialIntervencionesData = interventionData.fichaTecnicaDelPozo.historialIntervencionesData

        setFichaTecnicaDelPozo(newObj)

      }
    }
    else { 
      console.log('no data found')
    }
  }

  async loadEvaluacionPetrofisica() {
    let { fichaTecnicaDelPozoHighLevel, setEvaluacionPetrofisica } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    console.log(transactionID)

    if (transactionID) {
      let data = await fetch(`api/getMudLoss?transactionID=${transactionID}`).then(r => r.json())
      let layerData = await fetch(`api/getLayer?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err && !layerData.err) {

        let newObj = data.evaluacionPetrofisica
        newObj.layerData = layerData.evaluacionPetrofisica.layerData

        setEvaluacionPetrofisica(newObj)

      }
    }
    else { 
      console.log('no data found')
    }
  }


  async loadMecanicoYAparejo() {
    let { fichaTecnicaDelPozoHighLevel, setMecanicoYAparejoDeProduccion } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getMecanico?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err) {
        setMecanicoYAparejoDeProduccion(data.mecanicoYAparejoDeProduccion)
      }
    }
    else {
      console.log('no data found')
    }
  }

  async loadAnalisisDelAgua() {
    let { fichaTecnicaDelPozoHighLevel, setAnalisisDelAgua } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getAnalisisAgua?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err) {
        setAnalisisDelAgua(data.analisisDelAgua)
      }
    }
    else {
      console.log('no data found')
    }
  }

  async loadSistemasArtificialesDeProduccion() {
    let { fichaTecnicaDelPozoHighLevel, setSistemasArtificialesDeProduccion } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
    .then(res => res.json())
    .then(res => res.transactionID)

    if (transactionID) {
      let type = await fetch(`api/getWell?transactionID=${transactionID}`).then(r => r.json())

      if (!type.err) {
        type = type.sistemasArtificialesDeProduccion.tipoDeSistemo

        let data

        if (type === 'emboloViajero') {
          data = await fetch(`api/getEmboloViajero?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoNeumatico') {
          data = await  fetch(`api/getBombeoNeumatico?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoHidraulico') {
          data = await fetch(`api/getBombeoHidraulico?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoCavidadesProgresivas') {
          data = await fetch(`api/getBombeoCavidades?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoElectrocentrifugo') {
          data = await fetch(`api/getBombeoElectrocentrifugo?transactionID=${transactionID}`).then(r => r.json())
        }
        else if (type === 'bombeoMecanico') {
          data = await  fetch(`api/getBombeoMecanico?transactionID=${transactionID}`).then(r => r.json())
        }

        if (!data.err) {
        
          let newObj = data.sistemasArtificialesDeProduccion
          newObj.tipoDeSistemo = type

          setSistemasArtificialesDeProduccion(newObj)
        }
        else {
          console.log('no data found')
        }
      }
    }
    else {
      console.log('no data found')
    }
  }


  async loadHistoricoDePresionCampo() {
    let { fichaTecnicaDelPozoHighLevel, setPresionDataCampo } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    console.log(transactionID)

    if (transactionID) {
      let data = await fetch(`api/getFieldPressure?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err) {

        let newObj = data.historicoDePresion.presionDataCampo

        setPresionDataCampo(newObj)

      }
    }
    else { 
      console.log('no data found')
    }
  }


  async loadHistoricoDePresionPozo() {
    let { fichaTecnicaDelPozoHighLevel, setPresionDataPozo } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let data = await fetch(`api/getWellPressure?transactionID=${transactionID}`).then(r => r.json())

      if (!data.err) {

        let newObj = data.historicoDePresion.presionDataPozo

        setPresionDataPozo(newObj)

      }
    }
    else { 
      console.log('no data found')
    }
  }


  async loadHistoricoDeProduccion() {
    let { fichaTecnicaDelPozoHighLevel, setHistoricoProduccion } = this.props
    fichaTecnicaDelPozoHighLevel = fichaTecnicaDelPozoHighLevel.toJS()
    let { pozo } = fichaTecnicaDelPozoHighLevel

    let transactionID = await fetch(`/api/getTransactionWell?wellID=${pozo}`)
      .then(res => res.json())
      .then(res => res.transactionID)

    if (transactionID) {
      let aforosData = await fetch(`api/getWellAforos?transactionID=${transactionID}`).then(r => r.json())
      let produccionData = await fetch(`api/getWellProduccion?transactionID=${transactionID}`).then(r => r.json())

      if (!produccionData.err && !aforosData.err) {

        let newObj = aforosData.historicoDeProduccion
        newObj.produccionData = produccionData.historicoDeProduccion.produccionData

        console.log(newObj)
        setHistoricoProduccion(newObj)
      }
    }
    else { 
      console.log('no data found')
    }
  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  containsErrors(el, errors){
    if(el === undefined) return false

    var found = this.forms.findIndex((form) => form.type == el._reactInternalFiber.type.name)
    if(found !== -1)
      this.forms[found]['error'] = errors
  }

  handleNextSubtab(){
    if(this.forms.length > this.state.currentStep + 1){
      this.setState({
        currentStep: this.state.currentStep + 1
      }) 
    }
  }

  handlePrevSubtab(){
    if( this.state.currentStep - 1 >= 0){
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }

  validate() {
    return (
      this.fichaTecnicaDelCampo.selector.props.forceValidation() &&
      this.fichaTecnicaDelPozo.selector.props.forceValidation() &&
      this.evaluacionPetrofisica.selector.props.forceValidation() &&
      this.mecanicoYAparejo.selector.props.forceValidation() &&
      this.analisisDelAgua.selector.props.forceValidation() &&
      this.sistemasArtificialesDeProduccion.selector.props.forceValidation() &&
      this.historicoDePresionCampo.selector.props.forceValidation() &&
      this.historicoDePresionPozo.selector.props.forceValidation() &&
      this.historicoDeProduccion.selector.props.forceValidation() 
    )
  }

  render() {
    let { setShowForms } = this.props
    let className = 'subtab'
    let title = this.forms[this.state.currentStep].title
    
    let pozoFormSubmitting = this.props.formsState.get('pozoFormSubmitting')
    const submitting = pozoFormSubmitting ? 'submitting' : ''
    const errors = this.props.formsState.get('pozoFormError')

    const errorClass = errors.length ? 'error' : ''


    let loadFunctions = [this.loadTecnicaDelCampo, this.loadTecnicaDelPozo, this.loadEvaluacionPetrofisica, this.loadMecanicoYAparejo, this.loadAnalisisDelAgua, this.loadSistemasArtificialesDeProduccion, this.loadHistoricoDePresionCampo, this.loadHistoricoDePresionPozo, this.loadHistoricoDeProduccion]
    let loadFunction =loadFunctions[this.state.currentStep]

    return (
       <div className={`multistep-form ${submitting} ${errorClass}`}>
        <div className="subtabs">
            {this.forms.map( (tab, index) => {
               const active = this.state.currentStep === index ? 'active' : ''; 
               const tabError = tab.error ? 'error' : ''
               return <div className={`${className} ${active} ${tabError}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
               }
            )}
        </div>
        <div className="content">
          <div className="tab-title">
            <i class="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => setShowForms(false)}></i>
            { title }
            <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
            <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
            <button className="cta load" onClick={loadFunction}>Load</button> 
          </div>

          {this.forms[this.state.currentStep].content}
        </div>

        <div style={{display: 'none'}}>
          {this.forms.map((form, index) => {
             if(index != this.state.currentStep)
               return this.forms[index].content}
          )}
        </div>
      
        { errors.length > 0 &&
            <div className="error">Se han encontrado errores en la forma.</div>
        }
       </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
  setShowForms : values => { dispatch(setShowForms(values))},
  setFichaTecnicaDelCampo : values => { dispatch(setFichaTecnicaDelCampo(values))},
  setFichaTecnicaDelPozo : values => { dispatch(setFichaTecnicaDelPozo(values))},
  setEvaluacionPetrofisica : values => { dispatch(setEvaluacionPetrofisica(values))},
  setMecanicoYAparejoDeProduccion : values => { dispatch(setMecanicoYAparejoDeProduccion(values))},
  setAnalisisDelAgua : values => { dispatch(setAnalisisDelAgua(values))},
  setSistemasArtificialesDeProduccion : values => {dispatch(setSistemasArtificialesDeProduccion(values))},
  setPresionDataPozo : values => {dispatch(setPresionDataPozo(values))},
  setPresionDataCampo : values => {dispatch(setPresionDataCampo(values))},
  setHistoricoProduccion : values => {dispatch(setHistoricoProduccion(values))},
})

const mapStateToProps = state => ({
  everything: state,
  formsState: state.get('forms'),
  fichaTecnicaDelPozoHighLevel: state.get('fichaTecnicaDelPozoHighLevel'),
  fichaTecnicaDelPozo: state.get('fichaTecnicaDelPozo'),
  fichaTecnicaDelCampo: state.get('fichaTecnicaDelCampo'),
  objetivoYAlcancesIntervencion: state.get('objetivoYAlcancesIntervencion'),
  sistemasArtificialesDeProduccion: state.get('sistemasArtificialesDeProduccion'),
  mecanicoYAparejoDeProduccion: state.get('mecanicoYAparejoDeProduccion'),
  analisisDelAgua: state.get('analisisDelAgua'),
  user: state.get('user')

})


export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(PozoMultiStepForm)
