import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { connect } from 'react-redux'
import { setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico } from '../../../../redux/actions/pozo'

@autobind class SistemasArtificialesDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = {
     containsErrors: false
    }

  }

  componentDidMount(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  componentDidUpdate(){
    this.containsErrors()
    this.props.containsErrors(this, this.state.containsErrors)
  }

  containsErrors(){
    const {forms} = this.props
    const errors = forms.get('pozoFormError')

    var foundErrors = errors.find(error => {
      return [].includes(error.field)
    })

    foundErrors = foundErrors === undefined ? false : true

    if(foundErrors !== this.state.containsErrors){     
      this.setState({
        containsErrors: foundErrors === undefined
      })
    }
  }

  makeEmboloViajeroForm() {
    let { setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV } = formData
    const errors = forms.pozoFormError

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='kg/cm2' errors={errors}/>
        <InputRowUnitless header="Número de descargas o ciclos" name='' value={numeroDeDescargasOCiclosEV} onChange={setNumeroDeDescargasOCiclosEV} errors={errors}/>
        <InputRowUnitless header="Volumen desplazado por ciclo" name='' value={volumenDesplazadoPorCircloEV} onChange={setVolumenDesplazadoPorCircloEV} errors={errors}/>
      </div>
    )
  }

  makeBombeoNeumaticoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, forms, formData } = this.props

    forms = forms.toJS()
    formData = formData.toJS()

    let { presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN } = formData
    const errors = forms.pozoFormError
    
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de inyección" name='' value={presionDeInyeccionBN} onChange={setPresionDeInyeccionBN} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de descarga" name='' value={presionDeDescargaBN} onChange={setPresionDeDescargaBN} unit='Kg/cm2' errors={errors}/>
        <InputRowUnitless header="Número de válvulas" value={numeroDeValvulasBN} onChange={setNumeroDeValvulasBN} name='' errors={errors} />
        <InputRow header="Profundidad de la válvula operante" name='' value={profundidadDeLaVulvulaOperanteBN} onChange={setProfundidadDeLaVulvulaOperanteBN} unit='m' errors={errors}/>
        <InputRow header="Orificio" name='' value={orificioBN} onChange={setOrificioBN} unit='pg' errors={errors}/>
        <InputRow header="Volumen de gas inyectado" name='' value={volumenDeGasInyectadoBN} onChange={setVolumenDeGasInyectadoBN} unit='m3' errors={errors}/>
      </div>
    )
  }

  makeBombeoHidraulicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH } = formData
    const errors = forms.pozoFormError    

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Profundidad de la bomba" name='' value={profundidadDeLaBombaBH} onChange={setProfundidadDeLaBombaBH} unit='m' errors={errors}/>
        <InputRowUnitless header="Tipo y marca de bomba" value={tipoYMarcaDeBombaBH} onChange={setTipoYMarcaDeBombaBH} name='' errors={errors} />
        <InputRow header="Orificio" name='' value={orificioBH} onChange={setOrificioBH} unit='pg' errors={errors}/>
        <InputRow header="Tipo de camisa" name='' value={tipoDeCamisaBH} onChange={setTipoDeCamisaBH} unit='pg' errors={errors}/>
        <InputRowUnitless header="Fluido motriz" value={fluidoMotrizBH} onChange={setFluidoMotrizBH} name='' errors={errors}/>
        <InputRow header="Equipo superficial" name='' value={equipoSuperficialBH} onChange={setEquipoSuperficialBH} unit='HP' errors={errors}/>
      </div>
    )
  }

  makeBombeoCavidadesProgresivasForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS() 
    let { presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP } = formData
    const errors = forms.pozoFormError

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2' errors={errors}/>
        <InputRowUnitless header="Motor y tipo de motor" name='' value={motorYTipoDeMotorBCP} onChange={setMotorYTipoDeMotorBCP} errors={errors}/>
        <InputRowUnitless header="Profundidad del motor" name='' value={profunidadDelMotorBCP} onChange={setProfunidadDelMotorBCP} errors={errors}/>
        <InputRow header="Velocidad" name='' unit='' value={velocidadBCP} onChange={setVelocidadBCP} errors={errors}/>
        <InputRow header="HP" name='' unit='' value={hpBCP} onChange={setHpBCP} errors={errors}/>
        <InputRow header="Arreglo de varillas" name='' unit='' value={arregloDeVarillasBCP} onChange={setArregloDeVarillasBCP} errors={errors}/>
        <InputRow header="Tipo de elastomero (composición quimica)" name='' unit='' value={tipoDeElastomeroBCP} onChange={setTipoDeElastomeroBCP} errors={errors}/>
        <InputRow header="Profundidad del ancla antitorque" name='' unit='' value={profundidadDelAnclaAntitorqueBCP} onChange={setProfundidadDelAnclaAntitorqueBCP} errors={errors}/>

      </div>
    )
  }

  makeBombeoElectrocentrifugoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE } = formData
    const errors = forms.pozoFormError

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Profundidad del motor" name='' value={profundidadDelMotorBE} onChange={setProfundidadDelMotorBE} unit='m' errors={errors}/>
        <InputRow header="Diámetro" name='' value={diametroBE} onChange={setDiametroBE} unit='pg' errors={errors}/>
        <InputRow header="Volts" name='' value={voltsBE} onChange={setVoltsBE} unit='V' errors={errors}/>
        <InputRow header="Amperaje" name='' value={amparajeBE} onChange={setAmparajeBE} unit='A' errors={errors}/>
        <InputRowUnitless header="Armadura (bomba)" name='' value={armaduraBE} onChange={setArmaduraBE} errors={errors}/>
        <InputRowUnitless header="Tipo de cable" name='' value={tipoDeCableBE} onChange={setTipoDeCableBE} errors={errors}/>
        <InputRow header="Longitud de cable" name='' value={longitudDeCableBE} onChange={setLongitudDeCableBE} unit='m' errors={errors}/>
        <InputRowUnitless header="RPM" name='' value={rmpBE} onChange={setRmpBE} errors={errors} />

      </div>
    )
  }

  makeBombeoMecanicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico, forms, formData } = this.props
    forms = forms.toJS()
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM, nivelDinamico, nivelEstatico } = formData
    const errors = forms.pozoFormError

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presión de cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2' errors={errors}/>
        <InputRow header="Presión de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2' errors={errors}/>
        <InputRowUnitless header="Tipo de unidad" name='' value={tipoDeUnidadBM} onChange={setTipoDeUnidadBM} errors={errors}/>
        <InputRow header="Velocidad" name='' value={velocidadBM} onChange={setVelocidadBM} unit='EPM' errors={errors}/>
        <InputRow header="Longitud de carera" name='' value={longitudDeCareraBM} onChange={setLongitudDeCareraBM} unit='pg' errors={errors}/>
        <InputRowUnitless header="Tipo de bomba subsuperficial" name='' value={tipoDeBombaSubsuperficialBM} onChange={setTipoDeBombaSubsuperficialBM} errors={errors}/>
        <InputRowUnitless header="Tamaño de bomba subsuperficial" name='' value={tamanoDeBombaSubsuperficialBM} onChange={setTamanoDeBombaSubsuperficialBM} errors={errors}/>
        <InputRow header="Profundidad de la bomba" name='' value={profundidadDeLaBombaBM} onChange={setProfundidadDeLaBombaBM} unit='m' errors={errors}/>
        <InputRowUnitless header="Arreglo de varillas" name='' value={arregloDeVarillasBM} onChange={setArregloDeVarillasBM} errors={errors}/>
        <InputRowUnitless header="Cuenta con ancla mecanica o empacador" name='' value={CuantaConAnclaBM} onChange={setCuantaConAnclaBM} errors={errors}/>
        <InputRow header="Nivel dinámico" name='' value={nivelDinamico} onChange={setNivelDinamico} unit='m' errors={errors}/>
        <InputRow header="Nivel estático" name='' value={nivelEstatico} onChange={setNivelEstatico} unit='m' errors={errors}/>
      </div>
    )
  }

  handleSelectSistema(val) {
    let { setTipoDeSistemo } = this.props

    setTipoDeSistemo(val.value)
  }

  render() {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeSistemo } = formData

    console.log('renderrrrr')

    let options = [
      { label: 'Ninguna', value: 'none' },
      { label: 'Embolo viajero', value: 'emboloViajero' },
      { label: 'Bombeo neumatico', value: 'bombeoNeumatico' },
      { label: 'Bombeo hidráulico', value: 'bombeoHidraulico' },
      { label: 'Bombeo cavidades progresivas', value: 'bombeoCavidadesProgresivas' },
      { label: 'Bombeo electrocentrífugo', value: 'bombeoElectrocentrifugo' },
      { label: 'Bombeo mecánico', value: 'bombeoMecanico' },
    ]

    let forms = {
      none: null,
      emboloViajero: this.makeEmboloViajeroForm(),
      bombeoNeumatico: this.makeBombeoNeumaticoForm(),
      bombeoHidraulico: this.makeBombeoHidraulicoForm(),
      bombeoCavidadesProgresivas: this.makeBombeoCavidadesProgresivasForm(),
      bombeoElectrocentrifugo: this.makeBombeoElectrocentrifugoForm(),
      bombeoMecanico: this.makeBombeoMecanicoForm(),
    }

    return (
      <div className="form sistemas-artificiales-de-produccion">
        <div className='select-sistema' >
          <InputRowSelectUnitless header='Tipo de sistema' value={tipoDeSistemo} options={options} callback={this.handleSelectSistema} />
        </div>
        { forms[tipoDeSistemo]}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('sistemasArtificialesDeProduccion'),
})

const mapDispatchToProps = dispatch => ({
  setTipoDeSistemo: val => dispatch(setTipoDeSistemo(val)),
  setPresionDeCabeza: val => dispatch(setPresionDeCabeza(val)),
  setPresionDeLineaODeSeparador: val => dispatch(setPresionDeLineaODeSeparador(val)),
  setNumeroDeDescargasOCiclosEV: val => dispatch(setNumeroDeDescargasOCiclosEV(val)),
  setVolumenDesplazadoPorCircloEV: val => dispatch(setVolumenDesplazadoPorCircloEV(val)),
  setPresionDeInyeccionBN: val => dispatch(setPresionDeInyeccionBN(val)),
  setPresionDeDescargaBN: val => dispatch(setPresionDeDescargaBN(val)),
  setNumeroDeValvulasBN: val => dispatch(setNumeroDeValvulasBN(val)),
  setProfundidadDeLaVulvulaOperanteBN: val => dispatch(setProfundidadDeLaVulvulaOperanteBN(val)),
  setOrificioBN: val => dispatch(setOrificioBN(val)),
  setVolumenDeGasInyectadoBN: val => dispatch(setVolumenDeGasInyectadoBN(val)),
  setProfundidadDeLaBombaBH: val => dispatch(setProfundidadDeLaBombaBH(val)),
  setTipoYMarcaDeBombaBH: val => dispatch(setTipoYMarcaDeBombaBH(val)),
  setOrificioBH: val => dispatch(setOrificioBH(val)),
  setTipoDeCamisaBH: val => dispatch(setTipoDeCamisaBH(val)),
  setFluidoMotrizBH: val => dispatch(setFluidoMotrizBH(val)),
  setEquipoSuperficialBH: val => dispatch(setEquipoSuperficialBH(val)),
  setMotorYTipoDeMotorBCP: val => dispatch(setMotorYTipoDeMotorBCP(val)),
  setProfunidadDelMotorBCP: val => dispatch(setProfunidadDelMotorBCP(val)),
  setVelocidadBCP: val => dispatch(setVelocidadBCP(val)),
  setHpBCP: val => dispatch(setHpBCP(val)),
  setArregloDeVarillasBCP: val => dispatch(setArregloDeVarillasBCP(val)),
  setTipoDeElastomeroBCP: val => dispatch(setTipoDeElastomeroBCP(val)),
  setProfundidadDelAnclaAntitorqueBCP: val => dispatch(setProfundidadDelAnclaAntitorqueBCP(val)),
  setProfundidadDelMotorBE: val => dispatch(setProfundidadDelMotorBE(val)),
  setDiametroBE: val => dispatch(setDiametroBE(val)),
  setVoltsBE: val => dispatch(setVoltsBE(val)),
  setAmparajeBE: val => dispatch(setAmparajeBE(val)),
  setArmaduraBE: val => dispatch(setArmaduraBE(val)),
  setTipoDeCableBE: val => dispatch(setTipoDeCableBE(val)),
  setLongitudDeCableBE: val => dispatch(setLongitudDeCableBE(val)),
  setRmpBE: val => dispatch(setRmpBE(val)),
  setTipoDeUnidadBM: val => dispatch(setTipoDeUnidadBM(val)),
  setVelocidadBM: val => dispatch(setVelocidadBM(val)),
  setLongitudDeCareraBM: val => dispatch(setLongitudDeCareraBM(val)),
  setTipoDeBombaSubsuperficialBM: val => dispatch(setTipoDeBombaSubsuperficialBM(val)),
  setTamanoDeBombaSubsuperficialBM: val => dispatch(setTamanoDeBombaSubsuperficialBM(val)),
  setProfundidadDeLaBombaBM: val => dispatch(setProfundidadDeLaBombaBM(val)),
  setArregloDeVarillasBM: val => dispatch(setArregloDeVarillasBM(val)),
  setCuantaConAnclaBM: val => dispatch(setCuantaConAnclaBM(val)),
  setNivelDinamico: val => dispatch(setNivelDinamico(val)),
  setNivelEstatico  : val => dispatch(setNivelEstatico (val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SistemasArtificialesDeProduccion)
