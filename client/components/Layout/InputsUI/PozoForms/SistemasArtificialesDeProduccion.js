import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { connect } from 'react-redux'
import { setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico } from '../../../../redux/actions/sistemasArtificialesDeProduccion'

@autobind class SistemasArtificialesDeProduccion extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeEmboloViajeroForm() {
    let { setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, formData } = this.props
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV } = formData

    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='kg/cm2'/>
        <InputRowUnitless header="Numero de descargas o ciclos" name='' value={numeroDeDescargasOCiclosEV} onChange={setNumeroDeDescargasOCiclosEV} />
        <InputRowUnitless header="Volumen desplazado por ciclo" name='' value={volumenDesplazadoPorCircloEV} onChange={setVolumenDesplazadoPorCircloEV} />
      </div>
    )
  }

  makeBombeoNeumaticoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, formData } = this.props
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN } = formData
    
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2'/>
        <InputRow header="Presion de Inyeccion" name='' value={presionDeInyeccionBN} onChange={setPresionDeInyeccionBN} unit='Kg/cm2'/>
        <InputRow header="Presion de descarga" name='' value={presionDeDescargaBN} onChange={setPresionDeDescargaBN} unit='Kg/cm2'/>
        <InputRowUnitless header="Numero de valvulas" value={numeroDeValvulasBN} onChange={setNumeroDeValvulasBN} name='' />
        <InputRow header="Profundidad de la vulvula operante" name='' value={profundidadDeLaVulvulaOperanteBN} onChange={setProfundidadDeLaVulvulaOperanteBN} unit='m'/>
        <InputRow header="Orificio" name='' value={orificioBN} onChange={setOrificioBN} unit='pg'/>
        <InputRow header="Volumen de gas inyectado" name='' value={volumenDeGasInyectadoBN} onChange={setVolumenDeGasInyectadoBN} unit='m3'/>
      </div>
    )
  }

  makeBombeoHidraulicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, formData } = this.props
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH } = formData
    
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2'/>
        <InputRow header="Profundidad de la bomba" name='' value={profundidadDeLaBombaBH} onChange={setProfundidadDeLaBombaBH} unit='m'/>
        <InputRowUnitless header="Tipo y marca de Bomba" value={tipoYMarcaDeBombaBH} onChange={setTipoYMarcaDeBombaBH} name='' />
        <InputRow header="Orificio" name='' value={orificioBH} onChange={setOrificioBH} unit='pg'/>
        <InputRow header="Tipo de camisa" name='' value={tipoDeCamisaBH} onChange={setTipoDeCamisaBH} unit='pg'/>
        <InputRowUnitless header="Fluido motriz" value={fluidoMotrizBH} onChange={setFluidoMotrizBH} name='' />
        <InputRow header="Equipo Superficial" name='' value={equipoSuperficialBH} onChange={setEquipoSuperficialBH} unit='HP'/>
      </div>
    )
  }

  makeBombeoCavidadesProgresivasForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, formData } = this.props
    formData = formData.toJS() 
    let { presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP } = formData
    
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2'/>
        <InputRowUnitless header="Motor y Tipo de motor" name='' value={motorYTipoDeMotorBCP} onChange={setMotorYTipoDeMotorBCP} />
        <InputRowUnitless header="Profunidad del motor" name='' value={profunidadDelMotorBCP} onChange={setProfunidadDelMotorBCP} />
        <InputRow header="Velocidad" name='' unit='' value={velocidadBCP} onChange={setVelocidadBCP}/>
        <InputRow header="HP" name='' unit='' value={hpBCP} onChange={setHpBCP}/>
        <InputRow header="Arreglo de varillas" name='' unit='' value={arregloDeVarillasBCP} onChange={setArregloDeVarillasBCP}/>
        <InputRow header="Tipo de elastomero (compoicion quimica)" name='' unit='' value={tipoDeElastomeroBCP} onChange={setTipoDeElastomeroBCP}/>
        <InputRow header="Profundidad del ancla antitorque" name='' unit='' value={profundidadDelAnclaAntitorqueBCP} onChange={setProfundidadDelAnclaAntitorqueBCP}/>

      </div>
    )
  }

  makeBombeoElectrocentrifugoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, formData } = this.props
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE } = formData
    
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2'/>
        <InputRow header="Profundidad del motor" name='' value={profundidadDelMotorBE} onChange={setProfundidadDelMotorBE} unit='m'/>
        <InputRow header="Diametro" name='' value={diametroBE} onChange={setDiametroBE} unit='pg'/>
        <InputRow header="Volts" name='' value={voltsBE} onChange={setVoltsBE} unit='V'/>
        <InputRow header="Amparaje" name='' value={amparajeBE} onChange={setAmparajeBE} unit='A'/>
        <InputRowUnitless header="Armadura (Bomba)" name='' value={armaduraBE} onChange={setArmaduraBE} />
        <InputRowUnitless header="Tipo de cable" name='' value={tipoDeCableBE} onChange={setTipoDeCableBE} />
        <InputRow header="Longitud de cable" name='' value={longitudDeCableBE} onChange={setLongitudDeCableBE} unit='m'/>
        <InputRowUnitless header="RPM" name='' value={rmpBE} onChange={setRmpBE} />

      </div>
    )
  }

  makeBombeoMecanicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico, formData } = this.props
    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, cuantaConAnclaBM, nivelDinamico, nivelEstatico } = formData
    return (
      <div className='sistemas-artificiales-form' >
        <InputRow header="Presion de Cabeza" name='' value={presionDeCabeza} onChange={setPresionDeCabeza} unit='Kg/cm2'/>
        <InputRow header="Presion de linea o de separador" name='' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit='Kg/cm2'/>
        <InputRowUnitless header="Tipo de unidad" name='' value={tipoDeUnidadBM} onChange={setTipoDeUnidadBM}/>
        <InputRow header="Velocidad" name='' value={velocidadBM} onChange={setVelocidadBM} unit='EPM'/>
        <InputRow header="Longitud de carera" name='' value={longitudDeCareraBM} onChange={setLongitudDeCareraBM} unit='pg'/>
        <InputRowUnitless header="Tipo de bomba subsuperficial" name='' value={tipoDeBombaSubsuperficialBM} onChange={setTipoDeBombaSubsuperficialBM}/>
        <InputRowUnitless header="Tamano de Bomba Subsuperficial" name='' value={tamanoDeBombaSubsuperficialBM} onChange={setTamanoDeBombaSubsuperficialBM}/>
        <InputRow header="Profundidad de la bomba" name='' value={profundidadDeLaBombaBM} onChange={setProfundidadDeLaBombaBM} unit='m'/>
        <InputRowUnitless header="Arreglo de varillas" name='' value={arregloDeVarillasBM} onChange={setArregloDeVarillasBM}/>
        <InputRowUnitless header="Cuanta con Ancla mecanico o empacador" name='' value={cuantaConAnclaBM} onChange={setCuantaConAnclaBM}/>
        <InputRow header="Nivel dinamico" name='' value={nivelDinamico} onChange={setNivelDinamico} unit='m'/>
        <InputRow header="Nivel estatico" name='' value={nivelEstatico} onChange={setNivelEstatico} unit='m'/>
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

    let options = [
      { label: 'Ninguna', value: 'none' },
      { label: 'Embolo Viajero', value: 'emboloViajero' },
      { label: 'Bombeo Neumatico', value: 'bombeoNeumatico' },
      { label: 'Bombeo Hidraulico', value: 'bombeoHidraulico' },
      { label: 'Bombeo Cavidades Progresivas', value: 'bombeoCavidadesProgresivas' },
      { label: 'Bombeo Electrocentrifugo', value: 'bombeoElectrocentrifugo' },
      { label: 'Bombeo Mecanico', value: 'bombeoMecanico' },
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
          <InputRowSelectUnitless header='Tipo de Sistemo' value={tipoDeSistemo} options={options} callback={this.handleSelectSistema} />
        </div>
        { forms[tipoDeSistemo]}
      </div>
    )
  }
}

const mapStateToProps = state => ({
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
