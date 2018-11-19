const units = {
  pressure: 'Kg/cm2',
  pressureEnglish: 'psi',
  fractureGradient: 'psi/ft', 
  densityApi: '°API',
  density: 'g/cm3',
  densityLayer: 'gr/cc',
  pressurePerYear: 'Kg/cm2/año',
  pressurePerMonth: 'Kg/cm2/mes',
  measuredDepth: 'md',
  verticalDepth: 'mv',
  depthUnderSeaLevel: 'mvbnm',
  rga: 'm3/m3',
  ppm: 'ppm',
  ton: 'ton',
  gallonsPerMinute: 'gpm',
  length: 'm',
  percent: '%',
  rateOverPressure: 'bpd/psi',
  barrelsPerDay: 'bpd',
  barrelsPerMinute: 'bpm',
  cubicFeetPerDay: 'MMpcd',
  cubicMetersPerMinute: 'm3/min',
  billionBarrels: 'MMb',
  trillionCubicFeetPerDay: 'MMMpc',
  temperature: '°C',
  viscosity: 'cp',
  specificGravity: 'Adim.',
  milliDarcy: 'mD',
  conductiviy: 'mD*ft',
  unidades: 'unidades',
  pulgadas: 'pg',
  degreesText: 'Grados',
  disparosDensity: 'c/m',
  volume: 'm3',
  volumeNitrogen: 'm3 std',
  volumeUS: 'U.S. Gal.',
  volumeBarrels: 'bbl',
  volumeSacks: 'sacos',
  power: 'HP',
  volts: 'V',
  amps: 'A',
  resistivity: 'ohm',
  resistivityMeters: 'ohm*m',
  mechanicalProductionSystemSpeed: 'EPM',
  gasLiquidRelation: 'm3*std/m3',
  minutes: 'min',
  concentration: 'lbm/gal',
  massPounds: 'lbm',
  massGrams: 'gr',
  malla: 'malla',
}

export const maps = {}

maps.field = {
  generales: {
    descubrimientoField: { text: 'Descubrimiento', unit: '' },
    fechaDeExplotacionField: { text: 'Fecha de explotación', unit: '' },
    numeroDePozosOperandoField: { text: 'No. de pozos operando', unit: '' },
  },
  explotacion: {
    pActualFechaField: { text: 'Fecha de presión actual', unit: '' },
    pActualField: { text: 'Presión actual', unit: units.pressure },
    pInicialAnoField: { text: 'Fecha de presión inicial', unit: '' },
    pInicialField: { text: 'Presión inicial', unit: units.pressure },
    dpPerAnoField: { text: 'DP/año', unit: units.pressurePerYear },
    tyacField: { text: 'T yac', unit: units.temperature },
    prField: { text: 'Profundidad al Plano de Referencia', unit: units.depthUnderSeaLevel },
  },
  fluido: {
    tipoDeFluidoField: { text: 'Tipo de Fluido', unit: '' },
    densidadDelAceiteField: { text: 'Densidad del aceite', unit: units.densityApi },
    pSatField: { text: 'Presión de saturación', unit: units.pressure },
    rgaFluidoField: { text: 'RGA', unit: units.rga },
    salinidadField: { text: 'Salinidad', unit: units.ppm },
    pvtRepresentativoField: { text: 'PVT representativo', unit: '' },
  },
  formacion: {
    litologiaField: { text: 'Litología', unit: '' },
    espesorNetoField: { text: 'Espesor neto', unit: units.length },
    porosidadField: { text: 'Porosidad', unit: units.percent },
    swField: { text: 'Sw', unit: units.percent },
    kPromedioField: { text: 'K promedio', unit: units.milliDarcy },
    caaField: { text: 'CAA', unit: units.length },
    cgaField: { text: 'CGA', unit: units.length },
  },
  produccion: {
    qoField: { text: 'Qo', unit: units.barrelsPerDay },
    qgField: { text: 'Qg', unit: units.cubicFeetPerDay },
    rgaField: { text: 'RGA', unit: units.rga },
    fwField: { text: 'Fw', unit: units.percent },
    npField: { text: 'Np', unit: units.billionBarrels },
    gpField: { text: 'Gp', unit: units.trillionCubicFeetPerDay },
    wpField: { text: 'Wp', unit: units.billionBarrels },
    rraField: { text: 'RRA', unit: units.billionBarrels },
    rrgField: { text: 'RRG', unit: units.trillionCubicFeetPerDay },
    rrpceField: { text: 'RRPCE', unit: units.billionBarrels },
    h2sField: { text: 'H2S', unit: units.percent },
    co2Field: { text: 'CO2', unit: units.percent },
    n2Field: { text: 'N2', unit: units.percent },
  },
}

maps.well = {
  datos: {
    tipoDePozo: { text: 'Tipo de pozo', unit: '' },
    pws: { text: 'Pws', unit: units.pressure },
    pwsFecha: { text: 'Pws (fecha)', unit: '' },
    pwf: { text: 'Pwf', unit: units.pressure },
    pwfFecha: { text: 'Pwf (fecha)', unit: '' },
    deltaPPerMes: { text: 'Δp/mes', unit: units.pressurePerMonth },
    tyac: { text: 'Tyac', unit: units.temperature },
    pvt: { text: 'PVT', unit: '' },
    pvtaparejoDeProduccion: { text: 'Aparejo de producción', unit: '' },
    profEmpacador: { text: 'Profundidad empacador', unit: units.measuredDepth },
    profSensorPYT: { text: 'Profundidad sensor P y T', unit: units.measuredDepth },
  },
  fluido: {
    densidadAceite: { text:'Densidad del aceite', unit: units.densityApi },
    bo: { text:'Bo', unit: units.rga },
    viscosidadAceite: { text:'Viscosidad del aceite', unit: units.viscosity },
    gravedadEspecificaGas: { text:'Gravedad específica del gas', unit: 'Adim.' },
    bg: { text:'Bg', unit: units.rga},
    rga: { text:'RGA', unit: units.rga },
    asfaltenos: { text:'RGA', unit: units.percent },
    parafinas: { text:'Parafinas', unit: units.percent },
    resinasAsfalticas: { text:'Resinas asfalticas', unit: units.percent },
    indiceEstColoidal: { text:'Índice de est. coloidal', unit: units.specificGravity },
    densidadAgua: { text:'Densidad del agua', unit: units.density },
    contenidoAgua: { text:'Contenido de agua', unit: units.percent },
    salinidad: { text:'Salinidad', unit: units.ppm },
    ph: { text:'pH', unit: '' },
    indiceEstAgua: { text:'Índice de est. del agua', unit: units.specificGravity },
    contenidoEmulsion: { text:'Contenido de emulsión', unit: units.percent },
  },
  formacion: {
    caliza: { text: 'Caliza', unit: units.percent },
    dolomia: { text: 'Dolomia', unit: units.percent },
    arcilla: { text: 'Arcilla', unit: units.percent },
    porosidad: { text: 'Porosidad', unit: units.percent },
    permeabilidad: { text: 'Permeabilidad', unit: units.milliDarcy },
    sw: { text: 'Sw', unit: units.percent },
    caa: { text: 'CAA', unit: units.depthUnderSeaLevel },
    cga: { text: 'CGA', unit: units.depthUnderSeaLevel },
  },
  presion: {
    pruebaDePresion: { text: "Prueba de presión", unit: '' },
    modelo: { text: "Modelo", unit: '' },
    kh: { text: "Kh", unit: units.conductiviy },
    k: { text: "K", unit: units.milliDarcy },
    s: { text: "S", unit: units.unidades },
    piEnNivelSonda: { text: "Pi @ nivel sonda", unit: units.pressure } ,
  },
}

maps.estadoMecanicoYAparejo = {
  terminacion: {
    tipoDeTerminacion: { text: 'Tipo de terminación', unit: '' },
    hIntervaloProductor: { text: 'h (intervalo productor)', unit: units.verticalDepth },
    empacador: { text: 'Empacador', unit: units.verticalDepth },
    presionDifEmpacador: { text: 'Presión dif. empacador', unit: units.pressureEnglish },
    sensorPyt: { text: 'Profundidad Sensor P y T', unit: units.verticalDepth },
  },
  liner: {
    tipoDeLiner: { text: "Tipo de liner", unit: '', },
    diametroDeLiner: { text: "Diámetro de liner", unit: units.pulgadas },
  },
  disparos: {
    tipoDePistolas: { text: 'Tipo de pistolas', unit: '' },
    densidadDeDisparosMecanico: { text: 'Densidad de disparos', unit: units.disparosDensity },
    fase: { text: 'Fase', unit: units.degreesText },
    diametroDeOrificio: { text: 'Diámetro de orificio', unit: units.pulgadas },
    penetracion: { text: 'Penetración', unit: units.pulgadas, },
  },
  volumen: {
    tratamientoPor: { text: 'Tratamiento Por', unit: '' },
    volumenAparejoDeProduccion: { text: "Volumen aparejo de producción", unit: units.volume },
    volumenCimaDeIntervalo: { text: "Volumen @ cima de intervalo", unit: units.volume },
    volumenBaseDeIntervalo: { text: "Volumen @ base de intervalo", unit: units.volume },
    volumenDeEspacioAnular: { text: "Volumen de espacio anular (EA)", unit: units.volume },
  }
}

maps.sistemasArtificialesDeProduccion = {
  emboloViajero: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    numeroDeDescargasOCiclosEV: { text: 'Número de descargas o ciclos', unit: '' },
    volumenDesplazadoPorCircloEV: { text: 'Volumen desplazado por ciclo', unit: '' },
  },
  bombeoNeumatico: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    presionDeInyeccionBN: { text: 'Presión de inyección', unit: units.pressure },
    presionDeDescargaBN: { text: 'Presión de descarga', unit: units.pressure },
    numeroDeValvulasBN: { text: 'Número de válvulas', unit: '' },
    profundidadDeLaVulvulaOperanteBN: { text: 'Profundidad de la válvula operante', unit: units.length },
    orificioBN: { text: 'Orificio', unit: units.pulgadas },
    volumenDeGasInyectadoBN: { text: 'Volumen de gas', unit: units.volume },
  },
  bombeoHidraulico: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    profundidadDeLaBombaBH: { text: 'Profundidad de la bomba', unit: units.length },
    tipoYMarcaDeBombaBH: { text: 'Tipo y marca de bomba', unit: '' },
    orificioBH: { text: 'Orificio', unit: units.pulgadas },
    tipoDeCamisaBH: { text: 'Tipo de camisa', unit: units.pulgadas },
    fluidoMotrizBH: { text: 'Fluido motriz', unit: '' },
    equipoSuperficialBH: { text: 'Equipo superficial', unit: units.power },
  },
  bombeoCavidadesProgresivas: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    motorYTipoDeMotorBCP: { text: 'Motor y tipo de motor', unit: '' },
    profunidadDelMotorBCP: { text: 'Profundidad del motor', unit: '' },
    velocidadBCP: { text: 'Velocidad', unit: '' },
    hpBCP: { text: 'HP', unit: '' },
    arregloDeVarillasBCP: { text: 'Arreglo de varillas', unit: '' },
    tipoDeElastomeroBCP: { text: 'Tipo de elastómero (composición quimica)', unit: '' },
    profundidadDelAnclaAntitorqueBCP: { text: 'Profundidad del ancla antitorque', unit: '' },
  },
  bombeoElectrocentrifugo: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    profundidadDelMotorBE: { text: 'Profundidad del motor', unit: units.length },
    diametroBE: { text: 'Diámetro', unit: units.pulgadas },
    voltsBE: { text: 'Volts', unit: units.volts },
    amparajeBE: { text: 'Amperaje', unit: units.amps },
    armaduraBE: { text: 'Armadura (bomba)', unit: '' },
    tipoDeCableBE: { text: 'Tipo de cable', unit: '' },
    longitudDeCableBE: { text: 'Longitud de cable', unit: units.length },
    rpmBE: { text: 'RPM', unit: '' },
  },
  bombeoMecanico: {
    tipoDeSistema: { text: 'Tipo de sistema', unit: '' },
    presionDeCabeza: { text: 'Presión de cabeza', unit: units.pressure },
    presionDeLineaODeSeparador: { text: 'Presión de línea o de separador', unit: units.pressure },
    tipoDeUnidadBM: { text: 'Tipo de unidad', unit: '' },
    velocidadBM: { text: 'Velocidad', unit: units.mechanicalProductionSystemSpeed },
    longitudDeCareraBM: { text: 'Longitud de carera', unit: units.pulgadas },
    tipoDeBombaSubsuperficialBM: { text: 'Tipo de bomba subsuperficial', unit: '' },
    tamanoDeBombaSubsuperficialBM: { text: 'Tamaño de bomba subsuperficial', unit: '' },
    profundidadDeLaBombaBM: { text: 'Profundidad de la bomba', unit: units.length },
    arregloDeVarillasBM: { text: 'Arreglo de varillas', unit: '' },
    CuantaConAnclaBM: { text: 'Cuenta con ancla mecánica o empacador', unit: '' },
    nivelDinamico: { text: 'Nivel dinámico', unit: units.length },
    nivelEstatico: { text: 'Nivel estático', unit: units.length },
  },
}

maps.evaluacionPetrofisica = {
  layerData: {
    interval: { text: 'Intervalo', unit: '' },
    cimaMD: { text: 'Cima', unit: units.measuredDepth },
    baseMD: { text: 'Base', unit: units.measuredDepth },
    espesorBruto: { text: 'Espesor bruto', unit: units.measuredDepth },
    espesorNeto: { text: ' Espesor neto', unit: units.measuredDepth },
    vArc: { text: 'V arc.', unit: units.percent },
    vCal: { text: 'V cal.', unit: units.percent },
    vDol: { text: 'V dol.', unit: units.percent },
    porosity: { text: 'Porosidad', unit: units.percent },
    sw: { text: 'Sw.', unit: units.percent },
    dens: { text: 'Dens.', unit: units.densityLayer },
    resis: { text: 'Resis.', unit: units.resistivity },
    perm: { text: 'Perm.', unit: units.measuredDepth },
  },
  mudLossData: {
    cimaMD: { text: 'Cima', unit: units.measuredDepth },
    baseMD: { text: 'Base', unit: units.measuredDepth },
    lodoPerdido: { text: 'Lodo perdido', unit: units.volume },
    densidad: { text: 'Densidad', unit: units.densityLayer },
  }
}

maps.estimacionProduccion = {
  estIncEstrangulador: { text: 'Estrangulador', unit: units.pulgadas },
  estIncPtp: { text: 'Ptp', unit: units.pressure },
  estIncTtp: { text: 'Ttp', unit: units.temperature },
  estIncPbaj: { text: 'Pbaj', unit: units.pressure },
  estIncTbaj: { text: 'Tbaj', unit: units.temperature },
  estIncPtr: { text: 'Ptr', unit: units.pressure },
  estIncQl: { text: 'Ql', unit: units.barrelsPerDay },
  estIncQo: { text: 'Qo', unit: units.barrelsPerDay },
  estIncQg: { text: 'Qg', unit: units.cubicFeetPerDay },
  estIncQw: { text: 'Qw', unit: units.barrelsPerDay },
  estIncRGA: { text: 'RGA', unit: units.rga },
  estIncSalinidad: { text: 'Salinidad', unit: units.ppm },
  estIncIP: { text: 'IP estimado', unit: units.rateOverPressure },
  estIncDeltaP: { text: 'ΔP', unit: units.pressure },
  estIncGastoCompromisoQo: { text: 'Qo', unit: units.barrelsPerDay },
  estIncGastoCompromisoQg: { text: 'Qg', unit: units.cubicFeetPerDay },
  obervacionesEstIncEstim: { text: 'Observaciones', unit: '' },
}

maps.propuestaGeneral = {
  propuestaCompany: { text: 'Compañía', unit: '' },
  intervals: { text: 'Intervalos', unit: '' }
}

maps.propuesta = {
  estimulacion: {
    cedulaData: {
      etapa: { text: 'Etapa', unit: '' },
      sistema: { text: 'Sistema', unit: '' },
      nombreComercial: { text: 'Nombre comercial', unit: '' },
      volLiquid: { text: 'Vol. liq.', unit: units.volume },
      gastoLiqudo: { text: 'Gasto Líquido', unit: units.barrelsPerMinute },
      relN2Liq: { text: 'Rel. N2/Liq', unit: units.gasLiquidRelation },
      calidad: { text: 'Calidad', unit: units.percent },
      gastoEnFondo: { text: 'Gasto en fondo', unit: units.barrelsPerMinute },
      gastoN2: { text: 'Gasto N2', unit: units.cubicMetersPerMinute },
      volN2: { text: 'Vol N2', unit: units.volumeNitrogen },
      volLiquidoAcum: { text: 'Vol. liq. acum.', unit: units.volume },
      volN2Acum: { text: 'Vol. N2 acum.', unit: units.volumeNitrogen },
      tiempo: { text: 'Tiempo', unit: units.minutes },
    },
    general: {
      tipoDeColocacion: { text: 'Tipo de colocación', unit: '' },
      tiempoDeContacto: { text: 'Tiempo de contacto', unit: units.minutes },
    },
    volumes: {
      volumenPrecolchonN2: { text: 'Precolchón N2', unit: units.volume },
      volumenSistemaNoReativo: { text: 'Sistema no reactivo', unit: units.volume },
      volumenSistemaReactivo: { text: 'Sistema reactivo', unit: units.volume },
      volumenSistemaDivergente: { text: 'Sistema divergente', unit: units.volume },
      volumenDesplazamientoLiquido: { text: 'Desplazamiento líquido', unit: units.volume },
      volumenDesplazamientoN2: { text: 'Desplazamiento N2', unit: units.volume },
      volumenTotalDeLiquido: { text: 'Total de líquido', unit: units.volume },
    },
    resultadosSimulacion: {
      penetracionRadial: { text: 'Penetración radial', unit: units.pulgadas },
      longitudDeAgujeroDeGusano: { text: 'Longitud de agujero de gusano', unit: units.pulgadas },
    }
  },
  acido: {
    cedulaData: {
      etapa: { text: 'Etapa', unit: '' },
      sistema: { text: 'Sistema', unit: '' },
      nombreComercial: { text: 'Nombre comercial', unit: '' },
      tipoDeApuntalante: { text: 'Tipo de apuntalante', unit: '' },
      concentraciDeApuntalante: { text: '', unit: units.concentration },
      volLiquid: { text: 'Vol. liq.', unit: units.volume },
      gastoLiqudo: { text: 'Gasto Líquido', unit: units.barrelsPerMinute },
      relN2Liq: { text: 'Rel. N2/Liq', unit: units.gasLiquidRelation },
      calidad: { text: 'Calidad', unit: units.percent },
      gastoEnFondo: { text: 'Gasto en fondo', unit: units.barrelsPerMinute },
      gastoN2: { text: 'Gasto N2', unit: units.cubicMetersPerMinute },
      volN2: { text: 'Vol N2', unit: units.volumeNitrogen },
      volLiquidoAcum: { text: 'Vol. liq. acum.', unit: units.volume },
      volN2Acum: { text: 'Vol. N2 acum.', unit: units.volumeNitrogen },
      tiempo: { text: 'Tiempo', unit: units.minutes },
    },
    volumes: {
      volumenPrecolchonN2: { text: 'Precolchón N2', unit: units.volume },
      volumenSistemaNoReativo: { text: 'Sistema no reactivo', unit: units.volume },
      volumenSistemaReactivo: { text: 'Sistema reactivo', unit: units.volume },
      volumenSistemaDivergente: { text: 'Sistema divergente', unit: units.volume },
      volumenDesplazamientoLiquido: { text: 'Desplazamiento líquido', unit: units.volume },
      volumenDesplazamientoN2: { text: 'Desplazamiento N2', unit: units.volume },
      volumenTotalDeLiquido: { text: 'Total de líquido', unit: units.volume },
    },
    resultadosSimulacion: {
      longitudTotal: { text: 'Longitud total', unit: units.length },
      longitudEfectivaGrabada: { text: 'Longitud efectiva grabada', unit: units.length },
      alturaGrabada: { text: 'Altura grabada', unit: units.length },
      anchoPromedio: { text: 'Ancho promedio', unit: units.pulgadas },
      concentracionDelAcido: { text: 'Concentración del ácido', unit: units.pressureEnglish },
      conductividad: { text: 'Conductividad', unit: units.conductiviy },
      fcd: { text: 'FCD', unit: units.specificGravity },
      presionNeta: { text: 'Presión neta', unit: units.pressureEnglish },
      eficienciaDeFluidoDeFractura: { text: 'Eficiencia de fluido de fractura', unit: units.percent },
    },
    geoMechanicInformation: {
      moduloYoungArena: { text: 'Módulo young arena', unit: units.pressureEnglish },
      moduloYoungLutitas: { text: 'Módulo young lutitas', unit: units.pressureEnglish },
      relacPoissonArena: { text: 'Relac. poisson arena', unit: units.specificGravity },
      relacPoissonLutatas: { text: 'Relac. poisson lutatas', unit: units.specificGravity },
      gradienteDeFractura: { text: 'Gradiente de fractura', unit: units.fractureGradient },
      densidadDeDisparos: { text: 'Densidad de disparos', unit: units.disparosDensity },
      diametroDeDisparos: { text: 'Diámetro de disparos', unit: units.pulgadas },
    },
  },
  apuntalado: {
    cedulaData: {
      etapa: { text: 'Etapa', unit: '' },
      sistema: { text: 'Sistema', unit: '' },
      nombreComercial: { text: 'Nombre comercial', unit: '' },
      tipoDeFluido: { text: 'Tipo de fluido', unit: '' },
      tipoDeApuntalante: { text: 'Tipo de Apuntalante', unit: '' },
      volLiquido: { text: 'Vol. liq', unit: units.volumeUS },
      volLechada: { text: 'Vol. lechada', unit: units.volumeBarrels },
      gastoSuperficie: { text: 'Gasto en superficie', unit: units.barrelsPerMinute },
      gastoN2Superficie: { text: 'Gasto N2 superficie', unit: units.cubicMetersPerMinute },
      gastoEnFondo: { text: 'Gasto total fondo', unit: units.barrelsPerMinute },
      calidadN2Fondo: { text: 'Calidad N2', unit: units.percent },
      volEspumaFondo: { text: 'Vol. espuma fondo', unit: units.volumeUS },
      concentracionApuntalanteSuperficie: { text: 'Concentración de apuntalante superficie', unit: units.concentration },
      concentracionApuntalanteFondo: { text: 'Concentración de apuntalante fondo', unit: units.concentration },
      apuntalanteAcumulado: { text: 'Apuntalante acumulado', unit: units.massPounds },
      tiempo: { text: 'Tiempo', unit: units.minutes },
    },
    volumes: {
      volumenPrecolchonN2: { text: 'Precolchón', unit: units.volumeUS },
      volumenApuntalante: { text: 'Apuntalante', unit: units.volumeSacks },
      volumenGelFractura: { text: 'Gel de fractura', unit: units.volumeUS },
      volumenDesplazamientoLiquido: { text: 'Desplazamiento líquido', unit: units.volumeUS },
      volumenTotalDeLiquido: { text: 'Total de líquido', unit: units.volumeUS },
    },
    resultadosSimulacion: {
      longitudApuntalada: { text: 'Longitud apuntalada', unit: units.length },
      alturaTotalDeFractura: { text: 'Altura total de fractura', unit: units.length },
      anchoPromedio: { text: 'Ancho promedio', unit: units.pulgadas },
      concentractionAreal: { text: 'Concentración areal', unit: units.pressureEnglish },
      conductividad: { text: 'Conductividad', unit: units.conductiviy },
      fcd: { text: 'FCD', unit: units.specificGravity },
      presionNeta: { text: 'Presión neta', unit: units.pressureEnglish },
      eficienciaDeFluidoDeFractura: { text: 'Eficiencia de fluido de fractura', unit: units.percent },
    },
    geoMechanicInformation: {
      moduloYoungArena: { text: 'Módulo young arena', unit: units.pressureEnglish },
      moduloYoungLutitas: { text: 'Módulo young lutitas', unit: units.pressureEnglish },
      relacPoissonArena: { text: 'Relac. poisson arena', unit: units.specificGravity },
      relacPoissonLutatas: { text: 'Relac. poisson lutatas', unit: units.specificGravity },
      gradienteDeFractura: { text: 'Gradiente de fractura', unit: units.fractureGradient },
      densidadDeDisparos: { text: 'Densidad de disparos', unit: units.disparosDensity },
      diametroDeDisparos: { text: 'Diámetro de disparos', unit: units.pulgadas },
    },
  },
  termico: {
    cedulaData: {
      etapa: { text: 'Etapa', unit: '' },
      actividad: { text: 'Actividad', unit: '' },
      descripcion: { text: 'Descripción', unit: '' },
      justificacion: { text: 'Justificación', unit: '' },
    },
    general: {
      volumenVapor: { text: 'Volumen de vapor a inyectado', unit: units.ton },
      calidad: { text: 'Calidad', unit: units.percent },
      gastoInyeccion: { text: 'Gasto de inyección', unit: units.gallonsPerMinute },
      presionMaximaSalidaGenerador: { text: 'Presión máxima de salida del generador', unit: units.pressureEnglish },
      temperaturaMaximaGenerador: { text: 'Temperatura máxima del generador', unit: units.temperature },
    }
  },
}

maps.pruebasDeLaboratorioTitles = {
  caracterizacionFisico: { text: 'Caracterización fisico-química de fluidos' },
  pruebasDeCompatibilidad: { text: 'Pruebas de compatiblidad por emulsión' },
  pruebasDeGrabado: { text: 'Pruebas de grabado' },
  pruebasDeSolubilidad: { text: 'Pruebas de solubilidad' },
  pruebasGelDeFractura: { text: 'Pruebas gel de fractura' },
  pruebasParaApuntalante: { text: 'Pruebas para apuntalante' },
  cromatografiaDelGas: { text: 'Cromatografía del gas' },
  pruebaDeDureza: { text: 'Prueba de dureza' },
  determinacionDeLaCalidad: { text: 'Determinación de la calidad método de los cloruros' },
}

maps.pruebasDeLaboratorio = {
  general: {
    type: { text: 'Tipo de Analisis', unit: '' },
    fechaMuestreo: { text: 'Fecha de muestreo', unit: '' },
    fechaPrueba: { text: 'Fecha de prueba', unit: '' },
    compania: { text: 'Compañía', unit: '' },
    superviso: { text: 'Personal de Pemex que supervisó', unit: '' },
    obervaciones: { text: 'Observaciones', unit: '' },
  },
  caracterizacionFisico: {
    percentAceite: { text: 'Determinación del porcentaje de aceite', unit: units.percent },
    percentAgua: { text: 'Determinación del porcentaje de agua', unit: units.percent },
    percentEmulsion: { text: 'Determinación del porcentaje de emulsión', unit: units.percent },
    percentSolidos: { text: 'Determinación del porcentaje de sólidos', unit: units.percent },
    percentAsfaltenos: { text: 'Determinación del porcentaje de asfaltenos', unit: units.percent },
    percentParafinas: { text: 'Determinación del porcentaje de parafinas', unit: units.percent },
    percentResinasAsfalticas: { text: 'Determinación del porcentaje de resinas asfalticas', unit: units.percent },
    percentContenidoDeSolidos: { text: 'Determinación del porcentaje de contenido de sólidos', unit: units.percent },
    densityAceite: { text: 'Densidad del aceite', unit: units.density },
    densityAgua: { text: 'Densidad del agua', unit: units.density },
    densityEmulsion: { text: 'Densidad de la emulsión', unit: units.density },
    viscosityAceite: { text: 'Viscosidad del aceite', unit: units.viscosity },
    viscosityEmulsion: { text: 'Viscosidad de la emulsión', unit: units.viscosity },
    phDelAgua: { text: 'pH del agua', unit: '' },
    salinidadDelAgua: { text: 'Salinidad del agua', unit: units.ppm },
    salinidadDelAceite: { text: 'Salinidad del aceite', unit: units.ppm },
  },
  pruebasDeCompatibilidad: {
    compatabilidadTable: {
      diseno: { text: 'Diseño', unit: '' },
      sistema: { text: 'Sistema', unit: '' },
      aceiteDelPozo: { text: 'Aceite del pozo', unit: '' },
      tiempoDeRompimiento: { text: 'Tiempo de Rompimiento', unit: '' },
      separacionDeFases: { text: 'Separación de fases', unit: '' },
      solidos: { text: 'Solidos', unit: '' },
      condicion: { text: 'Condición', unit: '' },
    },
  },
  pruebasDeGrabado: {
    grabadoTable: {
      sistemaAcido: { text: 'Sistema Ácido', unit: '' },
      tiempoDeContacto: { text: 'Tiempo de contacto', unit: units.minutes },
      grabado: { text: 'Grabado', unit: '' },
    }
  },
  pruebasDeSolubilidad: {
    tipoDeMuestra: { text: 'Tipo de muestra', unit: '' },
    pesoDeLaMuestra: { text: 'Peso de la muestra', unit: units.massGrams },
    tipoDeSistemaEmpleado: { text: 'Tipo de sistema químico empleado', unit: '' },
    pesoDeLaMuestraFinal: { text: 'Peso final de la muestra', unit: units.massGrams },
    solubilidad: { text: 'Solubilidad', unit: units.percent },
  },
  pruebasGelDeFractura: {
    hidratacionDelFluido: { text: 'Hidratación del fluido', unit: units.specificGravity },
    tiempoDeActivacion: { text: 'Tiempo de activación del gel', unit: units.specificGravity },
    determinacionDePh: { text: 'Determinación de pH', unit: '' },
    tiempoDeRompimiento: { text: 'Tiempo de rompimiento', unit: '' },
    dosificacionDeQuebradors: { text: 'Dosificación de quebradores', unit: units.specificGravity },
    viscosidadDelGelDeFractura: { text: 'Viscosidad del gel de fractura', unit: units.specificGravity },
  },
  pruebasParaApuntalante: {
    esfericidad: { text: 'Esfericidad', unit: units.specificGravity },
    redondez: { text: 'Redondez', unit: units.specificGravity },
    resistenciaCompresion: { text: 'Resistencia a la compresión', unit: units.pressureEnglish },
    malla: { text: 'Malla', unit: units.malla },
    aglutinamiento: { text: 'Aglutinamiento', unit: units.specificGravity },
    turbidez: { text: 'Turbidez', unit: units.specificGravity },
    solubilidad: { text: 'Solubilidad', unit: units.percent },
  },
  cromatografiaDelGas: {
    // image
  },
  pruebaDeDureza: {
    // image
  },
  determinacionDeLaCalidad: {
    // image
  }
}

maps.historialDeIntervenciones = {
  general: {
    fecha: { text: 'Fecha', unit: '', width: .5 },
    intervenciones: { text: 'Historial de intervenciones', unit: '' },
  },
  estimulacion: {
    fecha: { text: 'Fecha', unit: '' },
    tipoDeTratamiento: { text: 'Tipo de tratamiento', unit: '' },
    objetivo: { text: 'Objectivo', unit: '' },
    compania: { text: 'Compañía', unit: '' },
    acidoNombre: { text: 'Nombre ácido', unit: '' },
    acidoVol: { text: 'Volumen ácido', unit: units.volume },
    solventeNombre: { text: 'Nombre solvente', unit: '' },
    solventeVol: { text: 'Volumen solvente', unit: '' },
    divergenteNombre: { text: 'Nombre divergente', unit: '' },
    divergenteVol: { text: 'Volumen divergente', unit: '' },
    totalN2: { text: 'N2 Total', unit: units.volume },
    beneficioProgramado: { text: 'Beneficio Programado', unit: units.barrelsPerDay },
    beneficioOficial: { text: 'Beneficio Oficial', unit: units.barrelsPerDay },
  },
  acido: {
    fecha: { text: 'Fecha', unit: '' },
    tipoDeTratamiento: { text: 'Tipo de tratamiento', unit: '' },
    objetivo: { text: 'Objetivo', unit: '' },
    compania: { text: 'Compañía', unit: '' },
    base: { text: 'Base', unit: units.measuredDepth },
    cima: { text: 'Cima', unit: units.measuredDepth },
    longitudGravada: { text: 'Longitud gravada', unit: units.length },
    alturaGravada: { text: 'Alutra gravada', unit: units.length },
    anchoGravado: { text: 'Ancho Gravado', unit: units.pulgadas },
    conductividad: { text: 'Conductividad', unit: units.conductiviy },
    fcd: { text: 'FCD', unit: units.specificGravity },
    presionNeta: { text: 'Presión neta', unit: units.pressureEnglish },
    fluidoFractura: { text: 'Eficiencia de fluida de fractura', unit: units.percent },
    beneficioProgramado: { text: 'Beneficio Programado', unit: units.barrelsPerDay },
    beneficioOficial: { text: 'Beneficio Oficial', unit: units.barrelsPerDay },
  },
  apuntalado: {
    fecha: { text: 'Fecha', unit: '' },
    tipoDeTratamiento: { text: 'Tipo de tratamiento', unit: '' },
    objetivo: { text: 'Objetivo', unit: '' },
    compania: { text: 'Compañía', unit: '' },
    base: { text: 'Base', unit: units.measuredDepth },
    cima: { text: 'Cima', unit: units.measuredDepth },
    longitudApuntalada: { text: 'Longitud apuntalada', unit: units.length },
    alturaTotalDeFractura: { text: 'Altura total de fractura', unit: units.length },
    anchoPromedio: { text: 'Ancho promedio', unit: units.pulgadas },
    concentracionAreal: { text: 'Concentración areal', unit: units.pressureEnglish },
    conductividad: { text: 'Conductividad', unit: units.conductiviy },
    fcd: { text: 'FCD', unit: units.specificGravity },
    presionNeta: { text: 'Presión neta', unit: units.pressureEnglish },
    fluidoFractura: { text: 'Eficiencia de fluida de fractura', unit: units.percent },
    beneficioProgramado: { text: 'Beneficio Programado', unit: units.barrelsPerDay },
    beneficioOficial: { text: 'Beneficio Oficial', unit: units.barrelsPerDay },
  },
  termico: {
    ciclo: { text: 'Ciclo', unit: ''},
    fechaInicio: { text: 'Fecha Inicio', unit: '' },
    fechaFin: { text: 'Fecha Fin', unit: '' },
    objetivo: { text: 'Objectivo', unit: '' },
    Piny: { text: 'P iny', unit: units.pressure },
    Tiny: { text: 'T iny', unit: units.temperature },
    calidad: { text: 'Calidad', unit: units.percent },
    Qiny: { text: 'Q iny', unit: units.barrelsPerDay },
    aguaAcum: { text: 'Agua acum.', unit: units.volumeBarrels },
    beneficioProgramado: { text: 'Beneficio Programado', unit: units.barrelsPerDay },
    beneficioOficial: { text: 'Beneficio Oficial', unit: units.barrelsPerDay },
  }
}

maps.analisisDelAgua = {
  pH: { text: 'pH', unit: '' },
  temperaturaDeConductividad: { text: 'Temperatura de conductividad', unit: units.temperature },
  resistividad: { text: 'Resistividad', unit: units.resistivityMeters },
  salinidadConConductimetro: { text: 'Salinidad con conductimetro', unit: units.ppm },
  solidosDisueltosTotales: { text: 'Solidos disueltos totales', unit: units.ppm },
  durezaTotalComoCaCO3: { text: 'Dureza total como CaCO3', unit: units.ppm },
  durezaDeCalcioComoCaCO3: { text: 'Dureza de calcio como CaCO3', unit: units.ppm },
  durezaDeMagnesioComoCaCO3: { text: '<div>Dureza de magnesio como CaCO3', unit: units.ppm },
  alcalinidadTotalComoCaCO3: { text: 'Alcalinidad total como CaCO3', unit: units.ppm },
  alcalinidadALaFenolftaleinaComoCaCO3: { text: 'Alcalinidad a la fenolftaleína como CaCO3', unit: units.ppm },
  salinidadComoNaCl: { text: 'Salinidad como NaCl', unit: units.ppm },
  sodio: { text: 'Sodio', unit: units.ppm },
  calcio: { text: 'Calcio', unit: units.ppm },
  magnesio: { text: 'Magnesio', unit: units.ppm },
  fierro: { text: 'Fierro', unit: units.ppm },
  cloruros: { text: 'Cloruros', unit: units.ppm },
  bicarbonatos: { text: 'Bicarbonatos', unit: units.ppm },
  sulfatos: { text: 'Sulfatos', unit: units.ppm },
  carbonatos: { text: 'Carbonatos', unit: units.ppm },
  densidadAt15: { text: 'Densidad @ 15.5 °C', unit: units.density },
  densidadAt20: { text: 'Densidad @ 20 °C', unit: units.density },
}

maps.generalResults = {
  intervals: { text: 'Intervalos', unit: '' },
  company: { text: 'Compañía', units: '' },
  fecha: { text: 'Fecha', units: '' },
  justificacion: { text: 'Justificación', units: '' },
  comentarios: { text: 'Comentarios', units: '' },
}

maps.incrementoProduccionResults = {
  qo: { text: 'Qo', units: units.barrelsPerDay },
  qw: { text: 'Qw', units: units.barrelsPerDay },
  qg: { text: 'Qg', units: units.cubicFeetPerDay },
}
