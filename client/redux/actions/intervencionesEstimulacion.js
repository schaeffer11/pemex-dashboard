export const setObjetivo = value => ({ type: 'set_objetivo', value})
export const setAlcances = value => ({ type: 'set_alcances', value})
export const setTipoDeIntervenciones = value => ({ type: 'set_tipoDeIntervenciones', value})

export const setIntervalo = value => ({ type: 'set_intervalo', value})
export const setLongitudDeIntervalo = value => ({ type: 'set_longitudDeIntervalo', value})
export const setVolAparejo = value => ({ type: 'set_volAparejo', value})
export const setCapacidadTotalDelPozo = value => ({ type: 'set_capacidadTotalDelPozo', value})
export const setVolumenPrecolchonN2 = value => ({ type: 'set_volumenPrecolchonN2', value})
export const setVolumenSistemaNoReativo = value => ({ type: 'set_volumenSistemaNoReativo', value})
export const setVolumenSistemaReactivo = value => ({ type: 'set_volumenSistemaReactivo', value})
export const setVolumenSistemaDivergente = value => ({ type: 'set_volumenSistemaDivergente', value})
export const setVolumenDesplazamientoLiquido = value => ({ type: 'set_volumenDesplazamientoLiquido', value})
export const setVolumenDesplazamientoN2 = value => ({ type: 'set_volumenDesplazamientoN2', value})
export const setVolumenTotalDeLiquido = value => ({ type: 'set_volumenTotalDeLiquido', value})
export const setPropuestaCompany = value => ({ type: 'set_propuestaCompany', value})
export const setTipoDeEstimulacion = value => ({ type: 'set_tipoDeEstimulacion', value})
export const setTipoDeColocacion = value => ({ type: 'set_tipoDeColocacion', value})
export const setTiempoDeContacto = value => ({ type: 'set_tiempoDeContacto', value})
export const setCedulaData = (value) => ({
  type: 'set_cedulaData',
  value: value.map((row, i) => {
    row.etapa = row.index + 1
    row.volLiquid = parseFloat(row.gastoLiqudo) * parseFloat(row.tiempo)
    row.volN2 = parseFloat(row.gastoN2) * parseFloat(row.tiempo)

    let prev = value[i - 1]

    row.volLiquidoAcum = prev ? prev.volLiquidoAcum + row.volLiquid : row.volLiquid
    row.volN2Acum = prev ? prev.volN2Acum + row.volN2 : row.volN2
    return row
  }),
})

export const setPruebasDeLaboratorioData = value => ({ type: 'set_pruebasDeLaboratorioData', value})
export const setEstimacionCostosData = value => ({ type: 'set_estimacionCostos', value})

export const setLabEvidenceImgURL = value => ({ type: 'set_labEvidenceImgURL', value})

export const setPenetracionRadial = value => ({ type: 'set_penetracionRadial', value})
export const setLongitudDeAgujeroDeGusano = value => ({ type: 'set_longitudDeAgujeroDeGusano', value})


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
export const setObervacionesEstIncEstim = value => ({ type: 'set_obervacionesEstIncEstim', value})
export const setEstIncProdEstimulationImgURL = value => ({ type: 'set_estIncProdEstimulationImgURL', value})

export const setEstCostoDeRentaDeBarco = value => ({ type: 'set_estCostoDeRentaDeBarco', value})
export const setEstCostDeSistemaReactivo = value => ({ type: 'set_estCostDeSistemaReactivo', value})
export const setEstCostDeSistemaNoReactivo = value => ({ type: 'set_estCostDeSistemaNoReactivo', value})
export const setEstCostDeDivergenes = value => ({ type: 'set_estCostDeDivergenes', value})
export const setEstCostDeN2 = value => ({ type: 'set_estCostDeN2', value})
export const setEstCostHCL = value => ({ type: 'set_estCostHCL', value})

export const setChecked = (value, form)  => ({
   type: 'set_forms_checked',
   form: form,
   value: value
})
