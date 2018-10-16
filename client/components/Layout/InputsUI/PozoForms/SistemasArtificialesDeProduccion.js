import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'

import { checkEmpty, checkDate } from '../../../../lib/errorCheckers'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'
import { setFromSaveSistemas, setHasErrorsSistemas, setSistemasArtificialesImgURL, setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico, setChecked } from '../../../../redux/actions/pozo'

@autobind class SistemasArtificialesDeProduccion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {
        presionDeCabeza: { 
            type: 'number',
            value: '',
          }, 
          presionDeLineaODeSeparador: { 
            type: 'number',
            value: '',
          }, 
          numeroDeDescargasOCiclosEV: { 
            type: 'number',
            value: '',
          }, 
          volumenDesplazadoPorCircloEV: { 
            type: 'number',
            value: '',
          },
          presionDeInyeccionBN: { 
            type: 'number',
            value: '',
          }, 
          presionDeDescargaBN: { 
            type: 'number',
            value: '',
          }, 
          numeroDeValvulasBN: { 
            type: 'number',
            value: '',
          }, 
          profundidadDeLaVulvulaOperanteBN: { 
            type: 'number',
            value: '',
          }, 
          orificioBN: { 
            type: 'number',
            value: '',
          }, 
          volumenDeGasInyectadoBN: { 
            type: 'number',
            value: '',
          },
          profundidadDeLaBombaBH: { 
            type: 'number',
            value: '',
          }, 
          tipoYMarcaDeBombaBH: { 
            type: 'text',
            value: '',
          }, 
          orificioBH: { 
            type: 'number',
            value: '',
          }, 
          tipoDeCamisaBH: { 
            type: 'number',
            value: '',
          },
          fluidoMotrizBH: { 
            type: 'text',
            value: '',
          }, 
          equipoSuperficialBH: { 
            type: 'number',
            value: '',
          },
          motorYTipoDeMotorBCP: { 
            type: 'text',
            value: '',
          }, 
          profunidadDelMotorBCP: { 
            type: 'text',
            value: '',
          }, 
          velocidadBCP: { 
            type: 'number',
            value: '',
          }, 
          hpBCP: { 
            type: 'number',
            value: '',
          }, 
          arregloDeVarillasBCP: { 
            type: 'number',
            value: '',
          }, 
          tipoDeElastomeroBCP: { 
            type: 'number',
            value: '',
          }, 
          profundidadDelAnclaAntitorqueBCP: { 
            type: 'number',
            value: '',
          },
          profundidadDelMotorBE: { 
            type: 'number',
            value: '',
          }, 
          diametroBE: { 
            type: 'number',
            value: '',
          }, 
          voltsBE: { 
            type: 'number',
            value: '',
          }, 
          amparajeBE: { 
            type: 'number',
            value: '',
          }, 
          armaduraBE: { 
            type: 'text',
            value: '',
          }, 
          tipoDeCableBE: { 
            type: 'text',
            value: '',
          }, 
          longitudDeCableBE: { 
            type: 'number',
            value: '',
          }, 
          rmpBE: { 
            type: 'number',
            value: '',
          },
          tipoDeUnidadBM: { 
            type: 'text',
            value: '',
          }, 
          velocidadBM: { 
            type: 'number',
            value: '',
          }, 
          longitudDeCareraBM: { 
            type: 'number',
            value: '',
          }, 
          tipoDeBombaSubsuperficialBM: { 
            type: 'text',
            value: '',
          }, 
          tamanoDeBombaSubsuperficialBM: { 
            type: 'text',
            value: '',
          }, 
          profundidadDeLaBombaBM: { 
            type: 'number',
            value: '',
          }, 
          arregloDeVarillasBM: { 
            type: 'text',
            value: '',
          }, 
          CuantaConAnclaBM: { 
            type: 'text',
            value: '',
          }, 
          nivelDinamico: { 
            type: 'number',
            value: '',
          }, 
          nivelEstatico: { 
            type: 'number',
            value: '',
          }
        }
    }

  }

  componentDidMount(){
    let { setHasErrorsSistemas, hasSubmitted } = this.props

    let hasErrors = this.checkAllInputs(hasSubmitted)
    setHasErrorsSistemas(hasErrors)
  }

  componentDidUpdate(prevProps) {
    let { hasSubmitted, formData, setFromSaveSistemas, setHasErrorsSistemas } = this.props
    formData = formData.toJS()
    let { fromSave } = formData
    
    if (hasSubmitted !== prevProps.hasSubmitted || fromSave) {
      let err = this.checkAllInputs(true)
      setHasErrorsSistemas(err)
      if (fromSave === true) {
        setFromSaveSistemas(false)
      }
    }
  }

  checkAllInputs(showErrors) {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeSistemo } = formData
    const { errors } = this.state
    let hasErrors = false
    let error 

    let items

    switch(tipoDeSistemo) {
      case 'none':
        items = []
        break
      case 'emboloViajero':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'numeroDeDescargasOCiclosEV', 'volumenDesplazadoPorCircloEV']
        break
      case 'bombeoNeumatico':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'presionDeInyeccionBN', 'presionDeDescargaBN', 'numeroDeValvulasBN', 'profundidadDeLaVulvulaOperanteBN', 'orificioBN', 'volumenDeGasInyectadoBN']
        break
      case 'bombeoHidraulico':
        items = ['presionDeCabeza','presionDeLineaODeSeparador','profundidadDeLaBombaBH','tipoYMarcaDeBombaBH','orificioBH','tipoDeCamisaBH','fluidoMotrizBH','equipoSuperficialBH']
        break
      case 'bombeoCavidadesProgresivas':
        items = ['presionDeCabeza','presionDeLineaODeSeparador','motorYTipoDeMotorBCP','profunidadDelMotorBCP','velocidadBCP','hpBCP','arregloDeVarillasBCP','tipoDeElastomeroBCP','profundidadDelAnclaAntitorqueBCP']
        break
      case 'bombeoElectrocentrifugo':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'profundidadDelMotorBE', 'diametroBE', 'voltsBE', 'amparajeBE', 'armaduraBE', 'tipoDeCableBE', 'longitudDeCableBE', 'rmpBE']
        break
      case 'bombeoMecanico':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'tipoDeUnidadBM', 'velocidadBM', 'longitudDeCareraBM', 'tipoDeBombaSubsuperficialBM', 'tamanoDeBombaSubsuperficialBM', 'profundidadDeLaBombaBM', 'arregloDeVarillasBM', 'CuantaConAnclaBM', 'nivelDinamico', 'nivelEstatico']
        break
    }


    items.forEach(elem => {
      const errObj = errors[elem]

      if (errObj.type === 'text' || errObj.type === 'number') {
        error = checkEmpty(formData[elem], elem, errors, this.setErrors, showErrors)
        
      } 
      else if (errObj.type === 'date') {
        error = checkDate(moment(formData[elem]).format('DD/MM/YYYY'), elem, errors, this.setErrors, showErrors)
      }

      error === true ? hasErrors = true : null
    })

    return hasErrors
  }

  setErrors(errors) {
    this.setState({ errors })
  }

  updateErrors(errors) {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeSistemo } = formData
    let { hasErrors, setHasErrorsSistemas } = this.props
    let hasErrorNew = false
    let items

    switch(tipoDeSistemo) {
      case 'none':
        items = []
        break
      case 'emboloViajero':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'numeroDeDescargasOCiclosEV', 'volumenDesplazadoPorCircloEV']
        break
      case 'bombeoNeumatico':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'presionDeInyeccionBN', 'presionDeDescargaBN', 'numeroDeValvulasBN', 'profundidadDeLaVulvulaOperanteBN', 'orificioBN', 'volumenDeGasInyectadoBN']
        break
      case 'bombeoHidraulico':
        items = ['presionDeCabeza','presionDeLineaODeSeparador','profundidadDeLaBombaBH','tipoYMarcaDeBombaBH','orificioBH','tipoDeCamisaBH','fluidoMotrizBH','equipoSuperficialBH']
        break
      case 'bombeoCavidadesProgresivas':
        items = ['presionDeCabeza','presionDeLineaODeSeparador','motorYTipoDeMotorBCP','profunidadDelMotorBCP','velocidadBCP','hpBCP','arregloDeVarillasBCP','tipoDeElastomeroBCP','profundidadDelAnclaAntitorqueBCP']
        break
      case 'bombeoElectrocentrifugo':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'profundidadDelMotorBE', 'diametroBE', 'voltsBE', 'amparajeBE', 'armaduraBE', 'tipoDeCableBE', 'longitudDeCableBE', 'rmpBE']
        break
      case 'bombeoMecanico':
        items = ['presionDeCabeza', 'presionDeLineaODeSeparador', 'tipoDeUnidadBM', 'velocidadBM', 'longitudDeCareraBM', 'tipoDeBombaSubsuperficialBM', 'tamanoDeBombaSubsuperficialBM', 'profundidadDeLaBombaBM', 'arregloDeVarillasBM', 'CuantaConAnclaBM', 'nivelDinamico', 'nivelEstatico']
        break
    }

    items.forEach(key => {
      if (errors[key].value !== null){
        hasErrorNew = true
      } 
    })

    if (hasErrorNew != hasErrors) {
      setHasErrorsSistemas(hasErrorNew)
    }

    this.setState({ errors })
  }

  makeEmboloViajeroForm() {
    let { setTipoDeSistemo, setPresionDeCabeza, setPresionDeLineaODeSeparador, setNumeroDeDescargasOCiclosEV, setVolumenDesplazadoPorCircloEV, formData } = this.props

    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, numeroDeDescargasOCiclosEV, volumenDesplazadoPorCircloEV } = formData

    return (
      <div className='sistemas-artificiales-form' key={1}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de línea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Número de descargas o ciclos" name='numeroDeDescargasOCiclosEV' value={numeroDeDescargasOCiclosEV} onChange={setNumeroDeDescargasOCiclosEV} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Volumen desplazado por ciclo" name='volumenDesplazadoPorCircloEV' value={volumenDesplazadoPorCircloEV} onChange={setVolumenDesplazadoPorCircloEV} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  makeBombeoNeumaticoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setPresionDeInyeccionBN, setPresionDeDescargaBN, setNumeroDeValvulasBN, setProfundidadDeLaVulvulaOperanteBN, setOrificioBN, setVolumenDeGasInyectadoBN, formData } = this.props


    formData = formData.toJS()

    let { presionDeCabeza, presionDeLineaODeSeparador, presionDeInyeccionBN, presionDeDescargaBN, numeroDeValvulasBN, profundidadDeLaVulvulaOperanteBN, orificioBN, volumenDeGasInyectadoBN } = formData
    
    return (
      <div className='sistemas-artificiales-form' key={2}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de linea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de inyección" name='presionDeInyeccionBN' value={presionDeInyeccionBN} onChange={setPresionDeInyeccionBN} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de descarga" name='presionDeDescargaBN' value={presionDeDescargaBN} onChange={setPresionDeDescargaBN} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Número de válvulas" name='numeroDeValvulasBN' value={numeroDeValvulasBN} onChange={setNumeroDeValvulasBN} errors={this.state.errors}  onBlur={this.updateErrors}/>
        <InputRow header="Profundidad de la válvula operante" name='profundidadDeLaVulvulaOperanteBN' value={profundidadDeLaVulvulaOperanteBN} onChange={setProfundidadDeLaVulvulaOperanteBN} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Orificio" name='orificioBN' value={orificioBN} onChange={setOrificioBN} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Volumen de gas inyectado" name='volumenDeGasInyectadoBN' value={volumenDeGasInyectadoBN} onChange={setVolumenDeGasInyectadoBN} unit={<div>m<sup>3</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  makeBombeoHidraulicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDeLaBombaBH, setTipoYMarcaDeBombaBH, setOrificioBH, setTipoDeCamisaBH, setFluidoMotrizBH, setEquipoSuperficialBH, formData } = this.props

    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDeLaBombaBH, tipoYMarcaDeBombaBH, orificioBH, tipoDeCamisaBH, fluidoMotrizBH, equipoSuperficialBH } = formData    

    return (
      <div className='sistemas-artificiales-form' key={3}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de linea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Profundidad de la bomba" name='profundidadDeLaBombaBH' value={profundidadDeLaBombaBH} onChange={setProfundidadDeLaBombaBH} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Tipo y marca de bomba" name="tipoYMarcaDeBombaBH" value={tipoYMarcaDeBombaBH} onChange={setTipoYMarcaDeBombaBH} errors={this.state.errors}  onBlur={this.updateErrors}/>
        <InputRow header="Orificio" name='orificioBH' value={orificioBH} onChange={setOrificioBH} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Tipo de camisa" name='tipoDeCamisaBH' value={tipoDeCamisaBH} onChange={setTipoDeCamisaBH} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Fluido motriz" name="fluidoMotrizBH" value={fluidoMotrizBH} onChange={setFluidoMotrizBH} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Equipo superficial" name='equipoSuperficialBH' value={equipoSuperficialBH} onChange={setEquipoSuperficialBH} unit='HP' errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  makeBombeoCavidadesProgresivasForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setMotorYTipoDeMotorBCP, setProfunidadDelMotorBCP, setVelocidadBCP, setHpBCP, setArregloDeVarillasBCP, setTipoDeElastomeroBCP, setProfundidadDelAnclaAntitorqueBCP, formData } = this.props

    formData = formData.toJS() 
    let { presionDeCabeza, presionDeLineaODeSeparador, motorYTipoDeMotorBCP, profunidadDelMotorBCP, velocidadBCP, hpBCP, arregloDeVarillasBCP, tipoDeElastomeroBCP, profundidadDelAnclaAntitorqueBCP } = formData

    return (
      <div className='sistemas-artificiales-form' key={4}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de linea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Motor y tipo de motor" name='motorYTipoDeMotorBCP' value={motorYTipoDeMotorBCP} onChange={setMotorYTipoDeMotorBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Profundidad del motor" name='profunidadDelMotorBCP' value={profunidadDelMotorBCP} onChange={setProfunidadDelMotorBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Velocidad" unit='' name='velocidadBCP' value={velocidadBCP} onChange={setVelocidadBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="HP" unit='' name='hpBCP' value={hpBCP} onChange={setHpBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Arreglo de varillas" unit='' name='arregloDeVarillasBCP' value={arregloDeVarillasBCP} onChange={setArregloDeVarillasBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Tipo de elastómero (composición quimica)" unit='' name='tipoDeElastomeroBCP' value={tipoDeElastomeroBCP} onChange={setTipoDeElastomeroBCP} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Profundidad del ancla antitorque" unit='' name='profundidadDelAnclaAntitorqueBCP' value={profundidadDelAnclaAntitorqueBCP} onChange={setProfundidadDelAnclaAntitorqueBCP} errors={this.state.errors} onBlur={this.updateErrors}/>

      </div>
    )
  }

  makeBombeoElectrocentrifugoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setProfundidadDelMotorBE, setDiametroBE, setVoltsBE, setAmparajeBE, setArmaduraBE, setTipoDeCableBE, setLongitudDeCableBE, setRmpBE, formData } = this.props

    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, profundidadDelMotorBE, diametroBE, voltsBE, amparajeBE, armaduraBE, tipoDeCableBE, longitudDeCableBE, rmpBE } = formData

    return (
      <div className='sistemas-artificiales-form' key={5}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de linea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Profundidad del motor" name='profundidadDelMotorBE' value={profundidadDelMotorBE} onChange={setProfundidadDelMotorBE} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Diámetro" name='diametroBE' value={diametroBE} onChange={setDiametroBE} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Volts" name='voltsBE' value={voltsBE} onChange={setVoltsBE} unit='V' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Amperaje" name='amparajeBE' value={amparajeBE} onChange={setAmparajeBE} unit='A' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Armadura (bomba)" name='armaduraBE' value={armaduraBE} onChange={setArmaduraBE} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Tipo de cable" name='tipoDeCableBE' value={tipoDeCableBE} onChange={setTipoDeCableBE} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Longitud de cable" name='longitudDeCableBE' value={longitudDeCableBE} onChange={setLongitudDeCableBE} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="RPM" name='rmpBE' value={rmpBE} onChange={setRmpBE} errors={this.state.errors}  onBlur={this.updateErrors}/>

      </div>
    )
  }

  makeBombeoMecanicoForm() {
    let { setPresionDeCabeza, setPresionDeLineaODeSeparador, setTipoDeUnidadBM, setVelocidadBM, setLongitudDeCareraBM, setTipoDeBombaSubsuperficialBM, setTamanoDeBombaSubsuperficialBM, setProfundidadDeLaBombaBM, setArregloDeVarillasBM, setCuantaConAnclaBM, setNivelDinamico, setNivelEstatico, formData } = this.props

    formData = formData.toJS()
    let { presionDeCabeza, presionDeLineaODeSeparador, tipoDeUnidadBM, velocidadBM, longitudDeCareraBM, tipoDeBombaSubsuperficialBM, tamanoDeBombaSubsuperficialBM, profundidadDeLaBombaBM, arregloDeVarillasBM, CuantaConAnclaBM, nivelDinamico, nivelEstatico } = formData

    return (
      <div className='sistemas-artificiales-form' key={6}>
        <InputRow header="Presión de cabeza" name='presionDeCabeza' value={presionDeCabeza} onChange={setPresionDeCabeza} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Presión de linea o de separador" name='presionDeLineaODeSeparador' value={presionDeLineaODeSeparador} onChange={setPresionDeLineaODeSeparador} unit={<div>Kg/cm<sup>2</sup></div>} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Tipo de unidad" name='tipoDeUnidadBM' value={tipoDeUnidadBM} onChange={setTipoDeUnidadBM} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Velocidad" name='velocidadBM' value={velocidadBM} onChange={setVelocidadBM} unit='EPM' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Longitud de carera" name='longitudDeCareraBM' value={longitudDeCareraBM} onChange={setLongitudDeCareraBM} unit='pg' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Tipo de bomba subsuperficial" name='tipoDeBombaSubsuperficialBM' value={tipoDeBombaSubsuperficialBM} onChange={setTipoDeBombaSubsuperficialBM} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Tamaño de bomba subsuperficial" name='tamanoDeBombaSubsuperficialBM' value={tamanoDeBombaSubsuperficialBM} onChange={setTamanoDeBombaSubsuperficialBM} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Profundidad de la bomba" name='profundidadDeLaBombaBM' value={profundidadDeLaBombaBM} onChange={setProfundidadDeLaBombaBM} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Arreglo de varillas" name='arregloDeVarillasBM' value={arregloDeVarillasBM} onChange={setArregloDeVarillasBM} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRowUnitless header="Cuenta con ancla mecánica o empacador" name='CuantaConAnclaBM' value={CuantaConAnclaBM} onChange={setCuantaConAnclaBM} errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Nivel dinámico" name='nivelDinamico' value={nivelDinamico} onChange={setNivelDinamico} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
        <InputRow header="Nivel estático" name='nivelEstatico' value={nivelEstatico} onChange={setNivelEstatico} unit='m' errors={this.state.errors} onBlur={this.updateErrors}/>
      </div>
    )
  }

  handleSelectSistema(val) {
    this.setTipoDeSistemoPromise(val.value).then(e => this.updateErrors(this.state.errors))
  }

 setTipoDeSistemoPromise(value) {
    let { setTipoDeSistemo } = this.props
    return new Promise((resolve) => {
      resolve(setTipoDeSistemo(value))
    })
  }


  handleFileUpload(e) {
    let { setSistemasArtificialesImgURL } = this.props
    e.preventDefault()
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])

    setSistemasArtificialesImgURL(localImgUrl, 'sistemasArtificialesDeProduccion')
  }

  makeImgInput() {
    let { formData } = this.props
    formData = formData.toJS()
    let { imgURL } = formData

    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar imagen del sistema de producción
        </div>
        <input type='file' accept="image/*" onChange={this.handleFileUpload}></input>

        {imgURL ? <img className='img-preview' src={imgURL}></img> : null }
      </div>
    )
  }


  render() {
    let { formData } = this.props
    formData = formData.toJS()
    let { tipoDeSistemo } = formData

    let options = [
      { label: 'Ninguno', value: 'none' },
      { label: 'Émbolo viajero', value: 'emboloViajero' },
      { label: 'Bombeo neumático', value: 'bombeoNeumatico' },
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

    let className

    switch(tipoDeSistemo) {
      case 'none':
        className = 'image'
        break
      case 'emboloViajero':
        className = 'image'
        break
      case 'bombeoNeumatico':
        className = 'image BN'
        break
      case 'bombeoHidraulico':
        className = 'image BH'
        break
      case 'bombeoCavidadesProgresivas':
        className = 'image BC'
        break
      case 'bombeoElectrocentrifugo':
        className = 'image BE'
        break
      case 'bombeoMecanico':
        className = 'image BM'
        break
    }

        console.log('render sistemas')
    return (
      <div className="form sistemas-artificiales-de-produccion">
        <div className='left'>
          <div className='select-sistema' >
            <InputRowSelectUnitless header='Tipo de sistema' name='tipoDeSistemo' value={tipoDeSistemo} options={options} callback={this.handleSelectSistema} errors={this.state.errors} />
          </div>
          { forms[tipoDeSistemo]}
          { this.makeImgInput() }
          </div>
        <div className='right'>
          <div className={className}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  forms: state.get('forms'),
  formData: state.get('sistemasArtificialesDeProduccion'),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
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
  setNivelEstatico  : val => dispatch(setNivelEstatico(val)),
  setSistemasArtificialesImgURL: (url, name) => dispatch(setSistemasArtificialesImgURL(url, name)),
  setHasErrorsSistemas: val => dispatch(setHasErrorsSistemas(val)),
  setFromSaveSistemas: val => dispatch(setFromSaveSistemas(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SistemasArtificialesDeProduccion)
