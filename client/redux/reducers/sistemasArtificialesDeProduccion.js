import { Map, fromJS } from 'immutable'

const initialState = Map({ 
	tipoDeSistemo: 'none',
    presionDeCabeza: '',
    presionDeLineaODeSeparador: '',
    numeroDeDescargasOCiclosEV: '',
    volumenDesplazadoPorCircloEV: '',
    presionDeInyeccionBN: '',
    presionDeDescargaBN: '',
    numeroDeValvulasBN: '',
    profundidadDeLaVulvulaOperanteBN: '',
    orificioBN: '',
    volumenDeGasInyectadoBN: '',
    profundidadDeLaBombaBH: '',
    tipoYMarcaDeBombaBH: '',
    orificioBH: '',
    tipoDeCamisaBH: '',
    fluidoMotrizBH: '',
    equipoSuperficialBH: '',
    motorYTipoDeMotorBCP: '',
    profunidadDelMotorBCP: '',
    velocidadBCP: '',
    hpBCP: '',
    arregloDeVarillasBCP: '',
    tipoDeElastomeroBCP: '',
    profundidadDelAnclaAntitorqueBCP: '',
    profundidadDelMotorBE: '',
    diametroBE: '',
    voltsBE: '',
    amparajeBE: '',
    armaduraBE: '',
    tipoDeCableBE: '',
    longitudDeCableBE: '',
    rmpBE: '',
    tipoDeUnidadBM: '',
    velocidadBM: '',
    longitudDeCareraBM: '',
    tipoDeBombaSubsuperficialBM: '',
    tamanoDeBombaSubsuperficialBM: '',
    profundidadDeLaBombaBM: '',
    arregloDeVarillasBM: '',
    CuantaConAnclaBM: '',
    nivelDinamico: '',
    nivelEstatico: '',
    sistemasArtificialesImgURL: null,

})


const sistemasArtificialesDeProduccion = (state = initialState, action) => {
  switch (action.type) {
    case 'set_tipoDeSistemo':
    	return state.set('tipoDeSistemo', fromJS(action.value))
    case 'set_presionDeCabeza':
        return state.set('presionDeCabeza', fromJS(action.value))
    case 'set_presionDeLineaODeSeparador':
        return state.set('presionDeLineaODeSeparador', fromJS(action.value))
    case 'set_numeroDeDescargasOCiclosEV':
        return state.set('numeroDeDescargasOCiclosEV', fromJS(action.value))
    case 'set_volumenDesplazadoPorCircloEV':
        return state.set('volumenDesplazadoPorCircloEV', fromJS(action.value))
    case 'set_presionDeInyeccionBN':
        return state.set('presionDeInyeccionBN', fromJS(action.value))
    case 'set_presionDeDescargaBN':
        return state.set('presionDeDescargaBN', fromJS(action.value))
    case 'set_numeroDeValvulasBN':
        return state.set('numeroDeValvulasBN', fromJS(action.value))
    case 'set_profundidadDeLaVulvulaOperanteBN':
        return state.set('profundidadDeLaVulvulaOperanteBN', fromJS(action.value))
    case 'set_orificioBN':
        return state.set('orificioBN', fromJS(action.value))
    case 'set_volumenDeGasInyectadoBN':
        return state.set('volumenDeGasInyectadoBN', fromJS(action.value))
    case 'set_profundidadDeLaBombaBH':
        return state.set('profundidadDeLaBombaBH', fromJS(action.value))
    case 'set_tipoYMarcaDeBombaBH':
        return state.set('tipoYMarcaDeBombaBH', fromJS(action.value))
    case 'set_orificioBH':
        return state.set('orificioBH', fromJS(action.value))
    case 'set_tipoDeCamisaBH':
        return state.set('tipoDeCamisaBH', fromJS(action.value))
    case 'set_fluidoMotrizBH':
        return state.set('fluidoMotrizBH', fromJS(action.value))
    case 'set_equipoSuperficialBH':
        return state.set('equipoSuperficialBH', fromJS(action.value))
    case 'set_motorYTipoDeMotorBCP':
        return state.set('motorYTipoDeMotorBCP', fromJS(action.value))
    case 'set_profunidadDelMotorBCP':
        return state.set('profunidadDelMotorBCP', fromJS(action.value))
    case 'set_velocidadBCP':
        return state.set('velocidadBCP', fromJS(action.value))
    case 'set_hpBCP':
        return state.set('hpBCP', fromJS(action.value))
    case 'set_arregloDeVarillasBCP':
        return state.set('arregloDeVarillasBCP', fromJS(action.value))
    case 'set_tipoDeElastomeroBCP':
        return state.set('tipoDeElastomeroBCP', fromJS(action.value))
    case 'set_profundidadDelAnclaAntitorqueBCP':
        return state.set('profundidadDelAnclaAntitorqueBCP', fromJS(action.value))
    case 'set_profundidadDelMotorBE':
        return state.set('profundidadDelMotorBE', fromJS(action.value))
    case 'set_diametroBE':
        return state.set('diametroBE', fromJS(action.value))
    case 'set_voltsBE':
        return state.set('voltsBE', fromJS(action.value))
    case 'set_amparajeBE':
        return state.set('amparajeBE', fromJS(action.value))
    case 'set_armaduraBE':
        return state.set('armaduraBE', fromJS(action.value))
    case 'set_tipoDeCableBE':
        return state.set('tipoDeCableBE', fromJS(action.value))
    case 'set_longitudDeCableBE':
        return state.set('longitudDeCableBE', fromJS(action.value))
    case 'set_rmpBE':
        return state.set('rmpBE', fromJS(action.value))
    case 'set_tipoDeUnidadBM':
        return state.set('tipoDeUnidadBM', fromJS(action.value))
    case 'set_velocidadBM':
        return state.set('velocidadBM', fromJS(action.value))
    case 'set_longitudDeCareraBM':
        return state.set('longitudDeCareraBM', fromJS(action.value))
    case 'set_tipoDeBombaSubsuperficialBM':
        return state.set('tipoDeBombaSubsuperficialBM', fromJS(action.value))
    case 'set_tamanoDeBombaSubsuperficialBM':
        return state.set('tamanoDeBombaSubsuperficialBM', fromJS(action.value))
    case 'set_profundidadDeLaBombaBM':
        return state.set('profundidadDeLaBombaBM', fromJS(action.value))
    case 'set_arregloDeVarillasBM':
        return state.set('arregloDeVarillasBM', fromJS(action.value))
    case 'set_CuantaConAnclaBM':
        return state.set('CuantaConAnclaBM', fromJS(action.value))
    case 'set_nivelDinamico':
        return state.set('nivelDinamico', fromJS(action.value))
    case 'set_nivelEstatico':
        return state.set('nivelEstatico', fromJS(action.value))
    case 'set_sistemasArtificialesImgURL':
        return state.set('sistemasArtificialesImgURL', fromJS(action.value))
    default:
      return state
  }
}

export default sistemasArtificialesDeProduccion