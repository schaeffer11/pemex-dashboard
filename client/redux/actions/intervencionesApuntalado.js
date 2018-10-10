export const setHasErrorsPropuestaApuntalado = value => ({ type: 'set_hasErrorsPropuestaApuntalado', value})
export const setHasErrorsResultadosSimulacionApuntalado = value => ({ type: 'set_hasErrorsResultadosSimulacionApuntalado', value})
export const setHasErrorsEstIncProduccionApuntalado = value => ({ type: 'set_hasErrorsEstIncProduccionApuntalado', value})

export const setIntervalo = value => ({ type: 'set_intervalo', value})
export const setLongitudDeIntervalo = value => ({ type: 'set_longitudDeIntervalo', value})
export const setVolAparejo = value => ({ type: 'set_volAparejo', value})
export const setCapacidadTotalDelPozo = value => ({ type: 'set_capacidadTotalDelPozo', value})
export const setVolumenPrecolchonN2 = value => ({ type: 'set_volumenPrecolchonN2', value})
export const setVolumenDeApuntalante = value => ({ type: 'set_volumenDeApuntalante', value})
export const setVolumenDeGelDeFractura = value => ({ type: 'set_volumenDeGelDeFractura', value})
export const setVolumenDesplazamiento = value => ({ type: 'set_volumenDesplazamiento', value})
export const setVolumenTotalDeLiquido = value => ({ type: 'set_volumenTotalDeLiquido', value})
export const setModuloYoungArena = value => ({ type: 'set_moduloYoungArena', value})
export const setModuloYoungLutitas = value => ({ type: 'set_moduloYoungLutitas', value})
export const setRelacPoissonArena = value => ({ type: 'set_relacPoissonArena', value})
export const setRelacPoissonLutatas = value => ({ type: 'set_relacPoissonLutatas', value})
export const setGradienteDeFractura = value => ({ type: 'set_gradienteDeFractura', value})
export const setDensidadDeDisparos = value => ({ type: 'set_densidadDeDisparos', value})
export const setDiametroDeDisparos = value => ({ type: 'set_diametroDeDisparos', value})
export const setPropuestaCompany = value => ({ type: 'set_propuestaCompany', value})
export const setCedulaData = (cedula, volumes) => ({
  type: 'set_cedulaDataApuntalado',
  volumes,
  cedula: cedula.map((row) => {
    row.etapa = row.index + 1
    return row
  }),
})

export const setContenidoDeAceite = value => ({ type: 'set_contenidoDeAceite', value})
export const setContenidoDeAgua = value => ({ type: 'set_contenidoDeAgua', value})
export const setContenidoDeEmulsion = value => ({ type: 'set_contenidoDeEmulsion', value})
export const setContenidoDeSolidos = value => ({ type: 'set_contenidoDeSolidos', value})
export const setTipoDeSolidos = value => ({ type: 'set_tipoDeSolidos', value})
export const setDensidadDelAceite = value => ({ type: 'set_densidadDelAceite', value})
export const setDensidadDelAgua = value => ({ type: 'set_densidadDelAgua', value})
export const setDensidadDeLaEmulsion = value => ({ type: 'set_densidadDeLaEmulsion', value})
export const setContenidoDeAsfaltenos = value => ({ type: 'set_contenidoDeAsfaltenos', value})
export const setContenidoDeParafinas = value => ({ type: 'set_contenidoDeParafinas', value})
export const setContenidoDeResinas = value => ({ type: 'set_contenidoDeResinas', value})
export const setIndiceDeEstabilidadDelColoidal = value => ({ type: 'set_indiceDeEstabilidadDelColoidal', value})
export const setIndiceDeEstabilidadDelAgua = value => ({ type: 'set_indiceDeEstabilidadDelAgua', value})
export const setPH = value => ({ type: 'set_pH', value})
export const setSalinidad = value => ({ type: 'set_salinidad', value})
export const setViscosidadDelAceite = value => ({ type: 'set_viscosidadDelAceite', value})
export const setTipoDeGelLineal = value => ({ type: 'set_tipoDeGelLineal', value})
export const setViscosidadDelGelLineal = value => ({ type: 'set_viscosidadDelGelLineal', value})
export const setTiempoDeReticulacion = value => ({ type: 'set_tiempoDeReticulacion', value})
export const setPHGelLineal = value => ({ type: 'set_pHGelLineal', value})
export const setTiempoDeRompedorDelGel = value => ({ type: 'set_tiempoDeRompedorDelGel', value})
export const setTamanoDelApuntalante = value => ({ type: 'set_tamanoDelApuntalante', value})
export const setGravedadEspecifica = value => ({ type: 'set_gravedadEspecifica', value})
export const setEsfericidad = value => ({ type: 'set_esfericidad', value})
export const setRedondeo = value => ({ type: 'set_redondeo', value})
export const setTurbidez = value => ({ type: 'set_turbidez', value})
export const setResistencia = value => ({ type: 'set_resistencia', value})
export const setPruebaDeSolubilidadConAcida = value => ({ type: 'set_pruebaDeSolubilidadConAcida', value})
export const setObervacionesPruebasLabApuntalado = value => ({ type: 'set_obervacionesPruebasLabApuntalado', value})
export const setEstIncProdApuntaladoImgURL = value => ({ type: 'set_estIncProdApuntaladoImgURL', value})

export const setLongitudApuntalada = value => ({ type: 'set_longitudApuntalada', value})
export const setAlturaTotalDeFractura = value => ({ type: 'set_alturaTotalDeFractura', value})
export const setAnchoPromedio = value => ({ type: 'set_anchoPromedio', value})
export const setConcentractionAreal = value => ({ type: 'set_concentractionAreal', value})
export const setConductividad = value => ({ type: 'set_conductividad', value})
export const setFcd = value => ({ type: 'set_fcd', value})
export const setPresionNeta = value => ({ type: 'set_presionNeta', value})
export const setEficienciaDeFluidoDeFractura = value => ({ type: 'set_eficienciaDeFluidoDeFractura', value})
export const setEvidenceSimulationApuntaladoImgURL = value => ({ type: 'set_evidenceSimulationApuntaladoImgURL', value})


export const setEstIncEstrangulador = value => ({ type: 'set_estIncEstrangulador', value})
export const setEstIncPtp = value => ({ type: 'set_estIncPtp', value})
export const setEstIncTtp = value => ({ type: 'set_estIncTtp', value})
export const setEstIncPbaj = value => ({ type: 'set_estIncPbaj', value})
export const setEstIncTbaj = value => ({ type: 'set_estIncTbaj', value})
export const setEstIncPtr = value => ({ type: 'set_estIncPtr', value})
export const setEstIncQl = value => ({ type: 'set_estIncQl', value})
export const setEstIncQo = value => ({ type: 'set_estIncQo', value})
export const setEstIncQg = value => ({ type: 'set_estIncQg', value})
export const setEstIncQw = value => ({ type: 'set_estIncQw', value})
export const setEstIncRGA = value => ({ type: 'set_estIncRGA', value})
export const setEstIncSalinidad = value => ({ type: 'set_estIncSalinidad', value})
export const setEstIncIP = value => ({ type: 'set_estIncIP', value})
export const setEstIncDeltaP = value => ({ type: 'set_estIncDeltaP', value})
export const setEstIncGastoCompromisoQo = value => ({ type: 'set_estIncGastoCompromisoQo', value})
export const setEstIncGastoCompromisoQg = value => ({ type: 'set_estIncGastoCompromisoQg', value})
export const setObervacionesEstIncApuntalado = value => ({ type: 'set_obervacionesEstIncApuntalado', value})
