import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setEstIncProdAcidoImgURL, setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, setObervacionesEstIncAcido } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class EstimacionIncProduccionAcido extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeModeladoForm() {
    let { setEstIncEstrangulador, setEstIncPtp, setEstIncTtp, setEstIncPbaj, setEstIncTbaj, setEstIncPtr, setEstIncQl, setEstIncQo, setEstIncQg, setEstIncQw, setEstIncRGA, setEstIncSalinidad, setEstIncIP, setEstIncDeltaP, formData } = this.props
    formData = formData.toJS()
    let { estIncEstrangulador, estIncPtp, estIncTtp, estIncPbaj, estIncTbaj, estIncPtr, estIncQl, estIncQo, estIncQg, estIncQw, estIncRGA, estIncSalinidad, estIncIP, estIncDeltaP } = formData

    return (
      <div className='modelado-form' >
        <div className='header'>
          Modelado
        </div>
        <InputRow header="Estrangulador" name='' unit="pg" value={estIncEstrangulador} onChange={setEstIncEstrangulador}/>
        <InputRow header="PTP" name='' unit="Kg/cm2" value={estIncPtp} onChange={setEstIncPtp}/>
        <InputRow header="TTP" name='' unit="C" value={estIncTtp} onChange={setEstIncTtp}/>
        <InputRow header="PBAJ" name='' unit="Kg/cm2" value={estIncPbaj} onChange={setEstIncPbaj}/>
        <InputRow header="TBAJ" name='' unit="C" value={estIncTbaj} onChange={setEstIncTbaj}/>
        <InputRow header="PTR" name='' unit="Kg/cm2" value={estIncPtr} onChange={setEstIncPtr}/>
        <InputRow header="Ql" name='' unit="bpd" value={estIncQl} onChange={setEstIncQl}/>
        <InputRow header="Qo" name='' unit="bpd" value={estIncQo} onChange={setEstIncQo}/>
        <InputRow header="Qg" name='' unit="MMpcd" value={estIncQg} onChange={setEstIncQg}/>
        <InputRow header="Qw" name='' unit="bpd" value={estIncQw} onChange={setEstIncQw}/>
        <InputRow header="RGA" name='' unit="m3/m3" value={estIncRGA} onChange={setEstIncRGA}/>
        <InputRow header="Salinidad" name='' unit="ppm" value={estIncSalinidad} onChange={setEstIncSalinidad}/>
        <InputRow header="IP estimado" name='' unit="bpd/psi" value={estIncIP} onChange={setEstIncIP}/>
        <InputRow header="ΔP" name='' unit="Kg/cm2" value={estIncDeltaP} onChange={setEstIncDeltaP}/>

      </div>
    )
  }

  makeGastoCompromisoForm() {
    let { setEstIncGastoCompromisoQo, setEstIncGastoCompromisoQg, formData } = this.props
    formData = formData.toJS()
    let { estIncGastoCompromisoQo, estIncGastoCompromisoQg } = formData
    
    return (
      <div className='gasto-compromiso-form' >
        <div className='header'>
          Gasto Compromiso
        </div>
        <InputRow header="QO" name='' unit="bpd" value={estIncGastoCompromisoQo} onChange={setEstIncGastoCompromisoQo}/>
        <InputRow header="QG" name='' unit="MMpcd" value={estIncGastoCompromisoQg} onChange={setEstIncGastoCompromisoQg}/>
      </div>
    )
  }

  makeObservacionesForm() {
    let { setObervacionesEstIncAcido, formData } = this.props
    formData = formData.toJS()
    let { obervacionesEstIncAcido} = formData
    
    return (
      <div className='obervaciones-form' >
        <div className='header'>
          Observaciones
        </div>
        <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} value={obervacionesEstIncAcido} onChange={setObervacionesEstIncAcido}/>
      </div>
    )
  }

  handleFileUpload(e, setURL) {
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setURL(localImgUrl)
  }

  makeImageInput() {
    let { formData, setEstIncProdAcidoImgURL } = this.props
    formData = formData.toJS()
    let { estIncProdAcidoImgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Upload Est Inc Prod Acido (spanish)
        </div>
        <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setEstIncProdAcidoImgURL)}></input>
        {estIncProdAcidoImgURL ? <img className='img-preview' src={estIncProdAcidoImgURL}></img> : null }
      </div>
    )
  }

  render() {

    return (
      <div className="form estimacion-inc-produccion-estimulacion-acido">
          <div className='left'>
            { this.makeModeladoForm() }
          </div>
          <div className='right'>
            { this.makeGastoCompromisoForm() }
            { this.makeObservacionesForm() }
            { this.makeImageInput() }
          </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('estIncProduccionAcido'),
})

const mapDispatchToProps = dispatch => ({
  setEstIncEstrangulador: val => dispatch(setEstIncEstrangulador(val)),
  setEstIncPtp: val => dispatch(setEstIncPtp(val)),
  setEstIncTtp: val => dispatch(setEstIncTtp(val)),
  setEstIncPbaj: val => dispatch(setEstIncPbaj(val)),
  setEstIncTbaj: val => dispatch(setEstIncTbaj(val)),
  setEstIncPtr: val => dispatch(setEstIncPtr(val)),
  setEstIncQl: val => dispatch(setEstIncQl(val)),
  setEstIncQo: val => dispatch(setEstIncQo(val)),
  setEstIncQg: val => dispatch(setEstIncQg(val)),
  setEstIncQw: val => dispatch(setEstIncQw(val)),
  setEstIncRGA: val => dispatch(setEstIncRGA(val)),
  setEstIncSalinidad: val => dispatch(setEstIncSalinidad(val)),
  setEstIncIP: val => dispatch(setEstIncIP(val)),
  setEstIncDeltaP: val => dispatch(setEstIncDeltaP(val)),
  setEstIncGastoCompromisoQo: val => dispatch(setEstIncGastoCompromisoQo(val)),
  setEstIncGastoCompromisoQg: val => dispatch(setEstIncGastoCompromisoQg(val)),
  setObervacionesEstIncAcido: val => dispatch(setObervacionesEstIncAcido(val)),
  setEstIncProdAcidoImgURL: val => dispatch(setEstIncProdAcidoImgURL(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EstimacionIncProduccionAcido)