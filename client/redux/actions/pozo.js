//FichaTecnicaDelPozoHighLevel
export const setSubdireccion = value => ({ type: 'set_subdireccion', value})
export const setBloque = value => ({ type: 'set_bloque', value})
export const setActivo = value => ({ type: 'set_activo', value})
export const setCampo = value => ({ type: 'set_campo', value})
export const setPozo = value => ({ type: 'set_pozo', value})
export const setFormacion = value => ({ type: 'set_formacion', value})
//export const setChecked = value => ({ type: 'set_checked', value})
export const setChecked = (value, form)  => ({
   type: 'set_forms_checked', 
   form: form,
   value: value
}) 

//FichaTecnicaDelCampo
export const setDescubrimientoField = value => ({ type: 'set_descubrimientoField', value})
export const setFechaDeExplotacionField = value => ({ type: 'set_fechaDeExplotacionField', value})
export const setNumeroDePozosOperandoField = value => ({ type: 'set_numeroDePozosOperandoField', value})
export const setPInicialAnoField = value => ({ type: 'set_pInicialAnoField', value})
export const setPActualFechaField = value => ({ type: 'set_pActualFechaField', value})
export const setPInicialField = value => ({ type: 'set_pInicialField', value})
export const setPActualField = value => ({ type: 'set_pActualField', value})
export const setDpPerAnoField = value => ({ type: 'set_dpPerAnoField', value})
export const setTyacField = value => ({ type: 'set_tyacField', value})
export const setPrField = value => ({ type: 'set_prField', value})
export const setTipoDeFluidoField = value => ({ type: 'set_tipoDeFluidoField', value})
export const setDensidadDelAceiteField = value => ({ type: 'set_densidadDelAceiteField', value})
export const setPSatField = value => ({ type: 'set_pSatField', value})
export const setRgaFluidoField = value => ({ type: 'set_rgaFluidoField', value})
export const setSalinidadField = value => ({ type: 'set_salinidadField', value})
export const setPvtRepresentativoField = value => ({ type: 'set_pvtRepresentativoField', value})
export const setLitologiaField = value => ({ type: 'set_litologiaField', value})
export const setEspesorNetoField = value => ({ type: 'set_espesorNetoField', value})
export const setPorosidadField = value => ({ type: 'set_porosidadField', value})
export const setSwField = value => ({ type: 'set_swField', value})
export const setKPromedioField = value => ({ type: 'set_kPromedioField', value})
export const setCaaField = value => ({ type: 'set_caaField', value})
export const setCgaField = value => ({ type: 'set_cgaField', value})
export const setQoField = value => ({ type: 'set_qoField', value})
export const setQgField = value => ({ type: 'set_qgField', value})
export const setRgaField = value => ({ type: 'set_rgaField', value})
export const setFwField = value => ({ type: 'set_fwField', value})
export const setNpField = value => ({ type: 'set_npField', value})
export const setGpField = value => ({ type: 'set_gpField', value})
export const setWpField = value => ({ type: 'set_wpField', value})
export const setRraField = value => ({ type: 'set_rraField', value})
export const setRrgField = value => ({ type: 'set_rrgField', value})
export const setRrpceField = value => ({ type: 'set_rrpceField', value})
export const setH2sField = value => ({ type: 'set_h2sField', value})
export const setCo2Field = value => ({ type: 'set_co2Field', value})
export const setN2Field = value => ({ type: 'set_n2Field', value})
export const setFichaTecnicaDelCampo = value => ({ type: 'set_fichaTecnicaDelCampo', value})

//HistorialDeIntervenciones
export const setHistoricoEstimulacionData = value => ({ type: 'set_historicoEstimulacionData', value})
export const setHistoricoAcidoData = value => ({ type: 'set_historicoAcidoData', value})
export const setHistoricoApuntaladoData = value => ({ type: 'set_historicoApuntaladoData', value})
export const setHistorialDeIntervenciones = value => ({ type: 'set_historialDeIntervenciones', value})

//FichaTecnicaDelPozo
export const setIntervaloProductor = value => ({ type: 'set_intervaloProductor', value})
export const setEspesorBruto = value => ({ type: 'set_espesorBruto', value})
export const setEspesorNeto = value => ({ type: 'set_espesorNeto', value})
export const setCaliza = value => ({ type: 'set_caliza', value})
export const setDolomia = value => ({ type: 'set_dolomia', value})
export const setArcilla = value => ({ type: 'set_arcilla', value})
export const setPorosidad = value => ({ type: 'set_porosidad', value})
export const setPermeabilidad = value => ({ type: 'set_permeabilidad', value})
export const setSw = value => ({ type: 'set_sw', value})
export const setCaa = value => ({ type: 'set_caa', value})
export const setCga = value => ({ type: 'set_cga', value})
export const setTipoDePozo = value => ({ type: 'set_tipoDePozo', value})
export const setPwsFecha = value => ({ type: 'set_pwsFecha', value})
export const setPwfFecha = value => ({ type: 'set_pwfFecha', value})
export const setPws = value => ({ type: 'set_pws', value}) 
export const setPwf = value => ({ type: 'set_pwf', value}) 
export const setDeltaPPerMes = value => ({ type: 'set_deltaPPerMes', value})
export const setTyac = value => ({ type: 'set_tyac', value})
export const setPvt = value => ({ type: 'set_pvt', value})
export const setAparejoDeProduccion = value => ({ type: 'set_aparejoDeProduccion', value})
export const setProfEmpacador = value => ({ type: 'set_profEmpacador', value})
export const setProfSensorPYT = value => ({ type: 'set_profSensorPYT', value})
export const setTipoDeSap = value => ({ type: 'set_tipoDeSap', value})
export const setHistorialIntervencionesData = value => ({ type: 'set_historialIntervencionesData', value})
export const setIntervalos = value => ({
  type: 'set_intervalos', 
  value: value.map(elem => {
    elem.espesor = elem.base - elem.cima
    return elem
  })
})
export const setFichaTecnicaDelPozo = value => ({ type: 'set_fichaTecnicaDelPozo', value})

//InformacionDeSistemasArtificialsDeProduccion
export const setTipoDeSistemo = value => ({ type: 'set_tipoDeSistemo', value})
export const setPresionDeCabeza = value => ({type: 'set_presionDeCabeza', value})
export const setPresionDeLineaODeSeparador = value => ({type: 'set_presionDeLineaODeSeparador', value})
export const setNumeroDeDescargasOCiclosEV = value => ({type: 'set_numeroDeDescargasOCiclosEV', value})
export const setVolumenDesplazadoPorCircloEV = value => ({type: 'set_volumenDesplazadoPorCircloEV', value})
export const setPresionDeInyeccionBN = value => ({type: 'set_presionDeInyeccionBN', value})
export const setPresionDeDescargaBN = value => ({type: 'set_presionDeDescargaBN', value})
export const setNumeroDeValvulasBN = value => ({type: 'set_numeroDeValvulasBN', value})
export const setProfundidadDeLaVulvulaOperanteBN = value => ({type: 'set_profundidadDeLaVulvulaOperanteBN', value})
export const setOrificioBN = value => ({type: 'set_orificioBN', value})
export const setVolumenDeGasInyectadoBN = value => ({type: 'set_volumenDeGasInyectadoBN', value})
export const setProfundidadDeLaBombaBH = value => ({type: 'set_profundidadDeLaBombaBH', value})
export const setTipoYMarcaDeBombaBH = value => ({type: 'set_tipoYMarcaDeBombaBH', value})
export const setOrificioBH = value => ({type: 'set_orificioBH', value})
export const setTipoDeCamisaBH = value => ({type: 'set_tipoDeCamisaBH', value})
export const setFluidoMotrizBH = value => ({type: 'set_fluidoMotrizBH', value})
export const setEquipoSuperficialBH = value => ({type: 'set_equipoSuperficialBH', value})
export const setMotorYTipoDeMotorBCP = value => ({type: 'set_motorYTipoDeMotorBCP', value})
export const setProfunidadDelMotorBCP = value => ({type: 'set_profunidadDelMotorBCP', value})
export const setVelocidadBCP = value => ({type: 'set_velocidadBCP', value})
export const setHpBCP = value => ({type: 'set_hpBCP', value})
export const setArregloDeVarillasBCP = value => ({type: 'set_arregloDeVarillasBCP', value})
export const setTipoDeElastomeroBCP = value => ({type: 'set_tipoDeElastomeroBCP', value})
export const setProfundidadDelAnclaAntitorqueBCP = value => ({type: 'set_profundidadDelAnclaAntitorqueBCP', value})
export const setProfundidadDelMotorBE = value => ({type: 'set_profundidadDelMotorBE', value})
export const setDiametroBE = value => ({type: 'set_diametroBE', value})
export const setVoltsBE = value => ({type: 'set_voltsBE', value})
export const setAmparajeBE = value => ({type: 'set_amparajeBE', value})
export const setArmaduraBE = value => ({type: 'set_armaduraBE', value})
export const setTipoDeCableBE = value => ({type: 'set_tipoDeCableBE', value})
export const setLongitudDeCableBE = value => ({type: 'set_longitudDeCableBE', value})
export const setRmpBE = value => ({type: 'set_rmpBE', value})
export const setTipoDeUnidadBM = value => ({type: 'set_tipoDeUnidadBM', value})
export const setVelocidadBM = value => ({type: 'set_velocidadBM', value})
export const setLongitudDeCareraBM = value => ({type: 'set_longitudDeCareraBM', value})
export const setTipoDeBombaSubsuperficialBM = value => ({type: 'set_tipoDeBombaSubsuperficialBM', value})
export const setTamanoDeBombaSubsuperficialBM = value => ({type: 'set_tamanoDeBombaSubsuperficialBM', value})
export const setProfundidadDeLaBombaBM = value => ({type: 'set_profundidadDeLaBombaBM', value})
export const setArregloDeVarillasBM = value => ({type: 'set_arregloDeVarillasBM', value})
export const setCuantaConAnclaBM = value => ({type: 'set_CuantaConAnclaBM', value})
export const setNivelDinamico = value => ({type: 'set_nivelDinamico', value})
export const setNivelEstatico = value => ({type: 'set_nivelEstatico', value})
export const setSistemasArtificialesImgURL = value => ({ type: 'set_sistemasArtificialesImgURL', value})
export const setSistemasArtificialesDeProduccion = value => ({ type: 'set_sistemasArtificialesDeProduccion', value})

//EvaluacionPetrofisica
export const setLayerData = value => ({
  type: 'set_layerData',
  value: value.map((elem, i) => {
    elem.interval = i + 1
    elem.baseMD = parseFloat(elem.baseMD)
    elem.cimaMD = parseFloat(elem.cimaMD)
    elem.espesorBruto = !isNaN(elem.baseMD) && !isNaN(elem.cimaMD) ? ( Math.round((elem.baseMD - elem.cimaMD) * 100) / 100 ): ''
    return elem
  })
})
export const setMudLossData = value => ({ type: 'set_mudLossData', value})
export const setImgURL = value => ({ type: 'set_imgURL', value})
export const setEvaluacionPetrofisica = value => ({ type: 'set_evaluacionPetrofisica', value})

//EdoMecanicoYAparejoDeProduccion
export const setTipoDeTerminacion = value => ({ type: 'set_tipoDeTerminacion', value})
export const setHIntervaloProductor = value => ({ type: 'set_hIntervaloProductor', value})
export const setEmpacador = value => ({ type: 'set_empacador', value})
export const setPresionDifEmpacador = value => ({ type: 'set_presionDifEmpacador', value})
export const setSensorPyt = value => ({ type: 'set_sensorPyt', value})
export const setTipoDeLiner = value => ({ type: 'set_tipoDeLiner', value})
export const setDiametroDeLiner = value => ({ type: 'set_diametroDeLiner', value})
export const setTipoDePistolas = value => ({ type: 'set_tipoDePistolas', value})
export const setDensidadDeDisparosMecanico = value => ({ type: 'set_densidadDeDisparosMecanico', value})
export const setFase = value => ({ type: 'set_fase', value})
export const setDiametroDeOrificio = value => ({ type: 'set_diametroDeOrificio', value})
export const setPenetracion = value => ({ type: 'set_penetracion', value})
export const setTipoDeSAP = value => ({ type: 'set_tipoDeSAP', value})
export const setTratamientoPor = value => ({ type: 'set_tratamientoPor', value})
export const setVolumenAparejoDeProduccion = value => ({ type: 'set_volumenAparejoDeProduccion', value})
export const setVolumenCimaDeIntervalo = value => ({ type: 'set_volumenCimaDeIntervalo', value})
export const setVolumenBaseDeIntervalo = value => ({ type: 'set_volumenBaseDeIntervalo', value})
export const setVolumenDeEspacioAnular = value => ({ type: 'set_volumenDeEspacioAnular', value})
export const setImgBoreDiagramURL = value => ({ type: 'set_imgBoreDiagramURL', value})
export const setImgAparejoDeProduccionURL = value => ({ type: 'set_imgAparejoDeProduccionURL', value})
export const setMecanicoYAparejoDeProduccion = value => ({ type: 'set_mecanicoYAparejoDeProduccion', value})

//HistoricoDePresion
export const setPresionDataCampo = value => ({ type: 'set_presionDataCampo', value})
export const setPresionDataPozo = value => ({ type: 'set_presionDataPozo', value})
export const setPressureDepthPozo = value => ({ type: 'set_pressureDepthPozo', value})
export const setPressureDepthCampo = value => ({ type: 'set_pressureDepthCampo', value})

//HistoricoDeProduccion
export const setProduccionData = value => ({ 
	type: 'set_produccionData',
	value: value.map((row, i) => {
        row.qo = (parseFloat(row.qo_vol) / parseFloat(row.dias) ).toFixed(2)
        row.qw = (parseFloat(row.qw_vol) / parseFloat(row.dias) ).toFixed(2)
        row.qg = (parseFloat(row.qg_vol) / parseFloat(row.dias)).toFixed(2)
        row.qgi = (parseFloat(row.qgi_vol) / parseFloat(row.dias)).toFixed(2)
        row.rga = (parseFloat(row.qg) / parseFloat(row.qo) / 5.615).toFixed(2)
        row.fw = (parseFloat(row.qw) / (parseFloat(row.qw) + parseFloat(row.qo))).toFixed(2)

        let prev = value[i - 1]

        row.np = prev ? (parseFloat(prev.np) + parseFloat(row.qo_vol)).toFixed(2) : (parseFloat(row.qo_vol)).toFixed(2)
        row.wp = prev ? (parseFloat(prev.wp) + parseFloat(row.qw_vol)).toFixed(2) : (parseFloat(row.qw_vol)).toFixed(2)
        row.gp = prev ? (parseFloat(prev.gp) + parseFloat(row.qg_vol)).toFixed(2) : (parseFloat(row.qg_vol)).toFixed(2)
        row.gi = prev ? (parseFloat(prev.gi) + parseFloat(row.qgi_vol)).toFixed(2) : (parseFloat(row.qgi_vol)).toFixed(2)

        return row
      })
  	})

export const setHistoricoProduccion = value => ({ type: 'set_historicoProduccion', value})

//HistoricoDeAforos
export const setAforosData = value => ({ type: 'set_aforosData', value})
export const setHistoricoDeAforos = value => ({ type: 'set_historicoDeAforos', value})
    


//AnalisisDelAgua
export const setWaterAnalysisBool = value => ({ type: 'set_waterAnalysisBool', value})
export const setPH = value => ({ type: 'set_pH', value})
export const setTemperaturaDeConductividad = value => ({ type: 'set_temperaturaDeConductividad', value})
export const setResistividad = value => ({ type: 'set_resistividad', value})
export const setSalinidadConConductimetro = value => ({ type: 'set_salinidadConConductimetro', value})
export const setSolidosDisueltosTotales = value => ({ type: 'set_solidosDisueltosTotales', value})
export const setDurezaTotalComoCaCO3 = value => ({ type: 'set_durezaTotalComoCaCO3', value})
export const setDurezaDeCalcioComoCaCO3 = value => ({ type: 'set_durezaDeCalcioComoCaCO3', value})
export const setDurezaDeMagnesioComoCaCO3 = value => ({ type: 'set_durezaDeMagnesioComoCaCO3', value})
export const setAlcalinidadTotalComoCaCO3 = value => ({ type: 'set_alcalinidadTotalComoCaCO3', value})
export const setAlcalinidadALaFenolftaleinaComoCaCO3 = value => ({ type: 'set_alcalinidadALaFenolftaleinaComoCaCO3', value})
export const setSalinidadComoNaCl = value => ({ type: 'set_salinidadComoNaCl', value})
export const setSodio = value => ({ type: 'set_sodio', value})
export const setCalcio = value => ({ type: 'set_calcio', value})
export const setMagnesio = value => ({ type: 'set_magnesio', value})
export const setFierro = value => ({ type: 'set_fierro', value})
export const setCloruros = value => ({ type: 'set_cloruros', value})
export const setBicarbonatos = value => ({ type: 'set_bicarbonatos', value})
export const setSulfatos = value => ({ type: 'set_sulfatos', value})
export const setCarbonatos = value => ({ type: 'set_carbonatos', value})
export const setDensidadAt15 = value => ({ type: 'set_densidadAt15', value})
export const setDensidadAt20 = value => ({ type: 'set_densidadAt20', value})
export const setAnalisisDelAgua = value => ({ type: 'set_analisisDelAgua', value})
