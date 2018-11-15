import { getData, buildSimpleTable, buildTable, smallTableOptions, largeTableOptions, getPostData, buildChartBase64, getMiddle } from './index'
import { maps } from './maps'
import { getBase64FromURL } from '../redux/actions/pozoFormActions'

function getPositions(len) {
  return {
    left: 0.5,
    middle: (13.3 - len) / 2,
    get right() { return (13.3 - len - this.left) }
  }
}

export async function buildFichaTecnicaDelCampo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Campo', { placeholder: 'slide_title' })
  const data = await getData('getFields', token, id)
  const { field } = maps
  const generales = buildSimpleTable('Generales', field.generales, data.fichaTecnicaDelCampo, false)
  const explotacion = buildSimpleTable('Explotación', field.explotacion, data.fichaTecnicaDelCampo)
  const fluido = buildSimpleTable('Fluido', field.fluido, data.fichaTecnicaDelCampo)
  const formacion = buildSimpleTable('Formación', field.formacion, data.fichaTecnicaDelCampo)
  const produccion = buildSimpleTable('Producción @ formación', field.produccion, data.fichaTecnicaDelCampo)

  const position = getPositions(4)
  slide.addTable(generales.table, { x: position.left, y: 1.0, ...generales.options })
  slide.addTable(explotacion.table, { x: position.left, y: 2.2, ...explotacion.options })
  slide.addTable(fluido.table, { x: position.middle, y: 1.0, ...fluido.options })
  slide.addTable(formacion.table, { x: position.middle, y: 3.0, ...formacion.options })
  slide.addTable(produccion.table, { x: position.right, y: 1.0, ...produccion.options })
  return slide
}

export async function buildFichaTecnicaDelPozo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Pozo', { placeholder: 'slide_title' })
  const data = await getData('getWell', token, id)
  const { well } = maps
  const datos = buildSimpleTable('Generales', well.datos, data.fichaTecnicaDelPozo)
  const fluido = buildSimpleTable('Fluido', well.fluido, data.fichaTecnicaDelPozo)
  const presion = buildSimpleTable('Presión', well.presion, data.fichaTecnicaDelPozo)
  const formacion = buildSimpleTable('Formación', well.formacion, data.fichaTecnicaDelPozo)

  const { left, right, middle } = getPositions(4)
  slide.addTable(datos.table, { x: left, y: 1.0, ...datos.options })
  slide.addTable(presion.table, { x: middle, y: 1.0, ...presion.options })
  slide.addTable(formacion.table, { x: middle, y: 3.0, ...formacion.options })
  slide.addTable(fluido.table, { x: right, y: 1.0, ...fluido.options })
  return slide
}

export async function buildEstadoMecanicoYAparejo(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Edo. Mecánico y Aparejo de Producción', { placeholder: 'slide_title' })
  const data = await getData('getMecanico', token, id)
  const { estadoMecanicoYAparejo } = maps
  const terminacion = buildSimpleTable('Tipo de Terminación', estadoMecanicoYAparejo.terminacion, data.mecanicoYAparejoDeProduccion)
  const liner = buildSimpleTable('Tipo de liner', estadoMecanicoYAparejo.liner, data.mecanicoYAparejoDeProduccion)
  const disparos = buildSimpleTable('Disparos', estadoMecanicoYAparejo.disparos, data.mecanicoYAparejoDeProduccion)
  const volumen = buildSimpleTable('Capacidad', estadoMecanicoYAparejo.volumen, data.mecanicoYAparejoDeProduccion)
  
  const { left, right, middle } = getPositions(4)
  slide.addTable(terminacion.table, { x: left, y: 1.0, ...terminacion.options })
  slide.addTable(liner.table, { x: left, y: 3.0, ...liner.options })
  slide.addTable(disparos.table, { x: 0.5, y: 4.25, ...disparos.options })
  slide.addTable(volumen.table, { x: right, y: 1.0, ...volumen.options })
  if (image) {
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      slide.addImage({
        data: `image/png;base64,${base64}`, x: middle, y: 0.5, w: 4, h: 3,
        sizing: { type: 'contain', h: 4.0, w: 4.0 }
      })
    }
  }
  return slide
}

export async function buildSistemasArtificialesDeProduccion(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Información de Sistemas Artificiales de Producción', { placeholder: 'slide_title' })
  const wellData = await getData('getWell', token, id)
  const tipoSistemaArtificial = wellData.sistemasArtificialesDeProduccion.tipoDeSistemo
  const { sistemasArtificialesDeProduccion } = maps
  let url
  let title
  switch (tipoSistemaArtificial) {
    case 'none':
      return slide
    case 'emboloViajero':
      title = 'Émbolo viajero'
      url = 'getEmboloViajero'
      break;
    case 'bombeoNeumatico':
      title = 'Bombeo neumático'
      url = 'getBombeoNeumatico'
      break;
    case 'bombeoHidraulico':
      title = 'Bombeo hidrálico'
      url = 'getBombeoHidraulico'
      break;
    case 'bombeoCavidadesProgresivas':
      title = 'Bombeo cavidades progresivas'
      url = 'getBombeoCavidades'
      break;
    case 'bombeoElectrocentrifugo':
      title = 'Bombeo electrocentrífugo'
      url = 'getBombeoElectrocentrifugo'
      break;
    case 'bombeoMecanico':
      title = 'Bombeo mecánico'
      url = 'getBombeoMecanico'
      break;
    default:
      break;
  }
  const data = await getData(url, token, id)
  data.sistemasArtificialesDeProduccion.tipoDeSistema = title
  const { table, options } = buildSimpleTable(null, sistemasArtificialesDeProduccion[tipoSistemaArtificial], data.sistemasArtificialesDeProduccion)
  slide.addTable(table, { x: getPositions(4).middle, y: 1.0, ...options })
  return slide
}

export async function buildEvaluacionPetrofisica(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Evaluación Petrofísica', { placeholder: 'slide_title' })
  const layers = await getData('getLayer', token, id)
  const mud = await getData('getMudLoss', token, id)

  let { layerData } = layers.evaluacionPetrofisica
  let { mudLossData } = mud.evaluacionPetrofisica
  const layer = buildTable('Propiedades promedio', maps.evaluacionPetrofisica.layerData, layerData)
  const mudLoss = buildTable('Zona de pérdida', maps.evaluacionPetrofisica.mudLossData, mudLossData)

  const { middle } = getPositions(10)
  slide.addTable(layer.table, { x: middle, y: 1.0, ...layer.options })
  slide.addTable(mudLoss.table, { x: middle, y: 5.0, ...mudLoss.options })
  if (image) {
    const imageSlide = pptx.addNewSlide('MASTER_SLIDE')
    imageSlide.addText('Evaluación Petrofísica', { placeholder: 'slide_title' })
    imageSlide.addText('Registro del pozo', { x: 0.5, y: 1.0, fontSize: 14, fontFace: 'Arial Narrow' })
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      imageSlide.addImage({
        data: `image/png;base64,${base64}`, x: getPositions(6.5).middle, y: 1.0, w: 4, h: 3,
        sizing: { type: 'contain', h: 6.5, w: 6.5 }
      })
    }
  }
  return slide
}

export async function buildResultsCedula(pptx, token, id, interventionType) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const generalResults = await fetch(`/job/generalResults?transactionID=${id}`, headers).then(r => r.json())
  const cedulaData = await fetch(`/job/getCedulaResults?transactionID=${id}&type=${interventionType}`, headers).then(r => r.json())
  const layers = await getData('getLayer', token, id)
  const { layerData } = layers.evaluacionPetrofisica
  const intervals = layerData.map(elem => `${elem.cimaMD}-${elem.baseMD}`).join('\n')
  const cedulaMap = maps.propuesta[interventionType.toLowerCase()].cedulaData
  const cedulaTable = buildTable('Cedula de tratamiento', cedulaMap, cedulaData)
  const generalTable = buildSimpleTable('', maps.generalResults, { ...generalResults, intervals }, false)
  
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Tratamiento', { placeholder: 'slide_title' })
  mainSlide.addTable(generalTable, { x: getMiddle(10), y: 1.0, colW: [2.0, 8.0], fontSize: 24 })

  const tableOptionsCopy = { ...tableOptions }
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Cédula de tratamiento', { placeholder: 'slide_title' })
  delete tableOptionsCopy.w
  slide.addTable(cedulaTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })
}

export async function buildProposalCedula(pptx, token, id, isResults=false) {
  const interventionTypeData = await getData('getInterventionBase', token, id)
  const interventionType = interventionTypeData.objetivoYAlcancesIntervencion.tipoDeIntervenciones
  let cedulaURL
  switch (interventionType) {
    case 'estimulacion':
      cedulaURL = 'getCedulaEstimulacion'
      break;
    case 'acido':
      cedulaURL = 'getCedulaAcido'
      break;
    case 'apuntalado':
      cedulaURL = 'getCedulaApuntalado'
      break;
    case 'termico':
      cedulaURL = 'getCedulaTermico'
      break;
    default:
      return
  }

  const data = await getData(cedulaURL, token, id)
  const layers = await getData('getLayer', token, id)
  const { cedulaData, propuestaCompany } = data[Object.keys(data)[0]]
  const { layerData } = layers.evaluacionPetrofisica
  const cedulaMap = maps.propuesta[interventionType].cedulaData
  const intervals = layerData.map(elem => `${elem.cimaMD}-${elem.baseMD}`).join('\n')
  
  const cedula = buildTable('Cedula de tratamiento', cedulaMap, cedulaData)
  const general = buildSimpleTable('', maps.propuestaGeneral, { propuestaCompany, intervals }, false)
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Propuesta', { placeholder: 'slide_title' })
  const { middle } = getPositions(10)
  mainSlide.addTable(general.table, { x: middle, y: 1.0, colW: [2.0, 8.0], fontSize: 24 })

  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta de tratamiento', { placeholder: 'slide_title' })
  slide.addTable(cedula.table, { x: middle, y: 1.0, ...cedula.options })
  return slide
}

export async function buildGeneralResults(pptx, token, id, interventionType) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const data = await fetch(`/job/getInterventionResultsData?transactionID=${id}&type=${interventionType}&shouldMapData=true`, headers).then(r => r.json())
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Resultados de tratamiento', { placeholder: 'slide_title' })

  const tableOptionsCopy = { ...tableOptions }
  const map = maps.propuesta[interventionType.toLowerCase()]
  const volumesTable = buildSimpleTable('Volúmenes', map.volumes, data)
  slide.addTable(volumesTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })

  if (map.geoMechanicInformation) {
    const geoMechanicTable = buildSimpleTable('Información de Geomecánica', map.geoMechanicInformation, data)
    slide.addTable(geoMechanicTable, { x: 3.5, y: 1.0, ...tableOptionsCopy })
  }

  if (interventionType === 'estimulacion' && data.tipoDeEstimulacion === 'limpieza') {
    const limpiezaTable = buildSimpleTable('Limpieza de Aparejo', map.general, data)
    slide.addTable(limpiezaTable, { x: 3.5, y: 1.0, ...tableOptionsCopy })
  }

  const simulacionTable = buildSimpleTable('Resultados de la simulacion', map.resultadosSimulacion, data)
  slide.addTable(simulacionTable, { x: 3.5, y: 2.0, ...tableOptionsCopy })
  return slide
}

export async function buildGeneralProposal(pptx, token, id) {
  const interventionTypeData = await getData('getInterventionBase', token, id)
  const interventionType = interventionTypeData.objetivoYAlcancesIntervencion.tipoDeIntervenciones
  let interventionURL
  let propuestaData
  let simulacionData
  let estimacionProduccionData
  switch (interventionType) {
    case 'estimulacion':
      interventionURL = 'getInterventionEstimulacion'
      simulacionData = 'resultadosSimulacionEstimulacion'
      propuestaData = 'propuestaEstimulacion'
      estimacionProduccionData = 'estIncProduccionEstimulacion'
      break;
    case 'acido':
      interventionURL = 'getInterventionAcido'
      simulacionData = 'resultadosSimulacionAcido'
      propuestaData = 'propuestaAcido'
      estimacionProduccionData = 'estIncProduccionAcido'
      break;
    case 'apuntalado':
      interventionURL = 'getInterventionApuntalado'
      simulacionData = 'resultadosSimulacionApuntalado'
      propuestaData = 'propuestaApuntalado'
      estimacionProduccionData = 'estIncProduccionApuntalado'
      break;
    case 'termico':
      interventionURL = 'getInterventionTermico'
      break;
    default:
      return
  }


  const data = await getData(interventionURL, token, id)
  const map = maps.propuesta[interventionType]
  
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta de tratamiento', { placeholder: 'slide_title' })
  const { left, right, middle } = getPositions(4)
  if (map.volumes) {
    const volumes = buildSimpleTable('Volúmenes', map.volumes, data[propuestaData])
    slide.addTable(volumes.table, { x: left, y: 1.0, ...volumes.options })
  }

  if (map.geoMechanicInformation) {
    const geoMechanic = buildSimpleTable('Información de Geomecánica', map.geoMechanicInformation, data[propuestaData])
    slide.addTable(geoMechanic.table, { x: left, y: 3.0, ...geoMechanic.options })
  }

  if (interventionType === 'estimulacion' && data[propuestaData].tipoDeEstimulacion === 'limpieza') {
    const limpieza = buildSimpleTable('Limpieza de Aparejo', map.general, data[propuestaData])
    slide.addTable(limpieza.table, { x: left, y: 3.0, ...limpieza.options })
  }

  if (map.resultadosSimulacion) {
    const simulacion = buildSimpleTable('Resultados de la simulación', map.resultadosSimulacion, data[simulacionData])
    slide.addTable(simulacion.table, { x: middle, y: 1.0, ...simulacion.options })
  }

  const estimacion = buildSimpleTable('Estimación', maps.estimacionProduccion, data[estimacionProduccionData])
  slide.addTable(estimacion.table, { x: right, y: 1.0, ...estimacion.options })
  return slide
}

async function buildMainLabSlide(pptx, labTitle, lab, image) {
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Pruebas de laboratorio', { placeholder: 'slide_title' })
  mainSlide.addText(labTitle, { x: 0.5, y: 1.0, fontSize: 18, fontFace: 'Arial Narrow' })
  const tableOptionsCopy = { ...tableOptions }
  delete tableOptionsCopy.colW
  const generalTable = buildSimpleTable('Datos generales', maps.pruebasDeLaboratorio.general, lab, false)
  mainSlide.addTable(generalTable, { x: 0.5, y: 1.5, ...tableOptionsCopy })
  if (image) {
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      mainSlide.addImage({
        data: `image/png;base64,${base64}`, x: 4.4, y: 3.3, w: 4.5, h: 3.5,
        sizing: { type: 'contain', h: 4.5, w: 4.5 }
      })
    }
  }
}

function buildLabDataSlide(pptx, map, lab, labTitle) {
  let tableName = ''
  const isTable = Object.keys(map).filter(m => {
    if (Array.isArray(lab[m])) {
      tableName = m
      return true
    }
    return false
  }).length > 0
  if (isTable) {
    const tableOptionsCopy = { ...tableOptions }
    delete tableOptionsCopy.colW
    const dataSlide = pptx.addNewSlide('MASTER_SLIDE')
    dataSlide.addText('Pruebas de laboratorio', { placeholder: 'slide_title' })
    dataSlide.addText(labTitle, { x: 0.5, y: 1.0, fontSize: 18, fontFace: 'Arial Narrow' })
    const table = buildTable('', map[tableName], lab[tableName])
    dataSlide.addTable(table, { x: 0.5, y: 1.5, ...tableOptionsCopy })
  } else {
    if (Object.keys(map).length > 0) {
      const tableOptionsCopy = { ...tableOptions }
      const dataSlide = pptx.addNewSlide('MASTER_SLIDE')
      dataSlide.addText('Pruebas de laboratorio', { placeholder: 'slide_title' })
      dataSlide.addText(labTitle, { x: 0.5, y: 1.0, fontSize: 18, fontFace: 'Arial Narrow' })
      const table = buildSimpleTable('', map, lab)
      dataSlide.addTable(table, { x: 0.5, y: 1.5, ...tableOptionsCopy })
    }
  }
}

export async function buildLabReports(pptx, token, id, images) {
  const data = await getData('getLabTest', token, id)
  const { pruebasDeLaboratorioData } = data.pruebasDeLaboratorio
  for (let lab of pruebasDeLaboratorioData) {
    const labImage = images ? images.find(elem => elem.labID.toString() === lab.labID.toString()) : null
    const labTitle = maps.pruebasDeLaboratorioTitles[lab.type].text
    const map = maps.pruebasDeLaboratorio[lab.type]
    await buildMainLabSlide(pptx, labTitle, lab, labImage)
    if (map) {
      buildLabDataSlide(pptx, map, lab, labTitle)
    }
  }
}

function buildHistoricSlides(pptx, data, map, title, options) {
  if (data.length > 0) {
    const { table } = buildTable('', map, data)
    const slide = pptx.addNewSlide('MASTER_SLIDE')
    slide.addText(title, { placeholder: 'slide_title' })
    slide.addTable(table, options)
  }
}

function shouldBuild(data) {
  if (data.length > 1) {
    return true
  } else if (data.length === 1) {
    // has to have more than one key because and if it only has one key it has to not be the error key
    return Object.keys(data).length > 1 || (Object.keys(data).length === 1 && !data[0].error)
  }
  return false
}

export async function buildHistorialIntervenciones(pptx, token, id) {
  const dataGeneral = await getData('getHistIntervenciones', token, id)
  const dataStimulation = await getData('getHistIntervencionesEstimulacionNew', token, id)
  const dataAcido = await getData('getHistIntervencionesAcidoNew', token, id)
  const dataApuntalado = await getData('getHistIntervencionesApuntaladoNew', token, id)
  const dataTermico = await getData('getHistIntervencionesTermicoNew', token, id)
  const { historicoEstimulacionData } = dataStimulation.historialDeIntervenciones
  const { historicoAcidoData } = dataAcido.historialDeIntervenciones
  const { historicoApuntaladoData } = dataApuntalado.historialDeIntervenciones
  const { historicoTermicoData } = dataTermico.historialDeIntervenciones

  const { general, estimulacion, acido, apuntalado, termico } = maps.historialDeIntervenciones
  if (shouldBuild(dataGeneral.fichaTecnicaDelPozo.historialIntervencionesData)) {
    buildHistoricSlides(pptx, dataGeneral.fichaTecnicaDelPozo.historialIntervencionesData, general, 'Historial de intervenciones', { x: getPositions(7).middle, colW: [1, 6], fontSize: 8 })
  }
  // const tableOptionsCopy = tableOptions
  // tableOptionsCopy.w = 10
  const { middle } = getPositions(10)
  // const options = { x: getPositions(10).middle, w: 10, fontSize: 8 }
  const tableOptions = largeTableOptions()
  if (shouldBuild(historicoEstimulacionData)) {
    buildHistoricSlides(pptx, historicoEstimulacionData, estimulacion, 'Historial de intervenciones de estimulacion', { x: middle, ...tableOptions })
  }
  if (shouldBuild(historicoAcidoData)) {
    buildHistoricSlides(pptx, historicoAcidoData, acido, 'Historial de intervenciones de acido', { x: middle, ...tableOptions })
  }
  if (shouldBuild(historicoApuntaladoData)) {
    buildHistoricSlides(pptx, historicoApuntaladoData, apuntalado, 'Historial de intervenciones de apuntalado', { x: middle, ...tableOptions })
  }
  if(shouldBuild(historicoTermicoData)) {
    buildHistoricSlides(pptx, historicoTermicoData, termico, 'Historial de intervenciones térmicas', { x: middle, ...tableOptions })
  }
  return
}

export async function buildProductionChart(pptx, token, id) {
  const data = await getPostData('/well/productionData', token, id)
  const config = {
    chart: {
      type: 'line',
      zoomType: 'xy',
      renderTo: 'hiddenChart',
      // width: 800,
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Fecha'
      },
      type: 'datetime'
    },
    yAxis: [{
      title: {
        text: 'Gasto (bbl/d)'
      }
    }, {
      opposite: true,
      title: {
        text: 'Gasto (MMpc/d)'
      }
    }],
    plotOptions: {
      series: {
        animation: false,
      },
      scatter: {
        marker: {
          radius: 5,
        },

      }
    },
    series: [{
      name: 'Qo',
      color: '#35b06d',
      label: 'bbl/d',
      data: []
    }, {
      name: 'Qg',
      color: '#CC3D3D',
      yAxis: 1,
      label: 'MMpc/d',
      data: []
    }, {
      name: 'Qw',
      color: '#3a88c0',
      label: 'bbl/d',
      data: []
    }]
  }

  let qoData = []
  let qwData = []
  let qgData = []

  data.forEach(i => {
    if (i.Fecha) {
      let date = new Date(i.Fecha)
      date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

      qoData.push([date, i.QO])
      qwData.push([date, i.QW])
      qgData.push([date, i.QG])
    }
  })

  config.series[0].data = qoData.sort((a, b) => { return a[0] - b[0] })
  config.series[1].data = qgData.sort((a, b) => { return a[0] - b[0] })
  config.series[2].data = qwData.sort((a, b) => { return a[0] - b[0] })
  const base64 = await buildChartBase64(config)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Histórico de producción', { placeholder: 'slide_title' })
  const { middle } = getPositions(7)
  slide.addImage({
    data: base64, x: middle, y: 1,
    sizing: { type: 'contain', h: 5.25, w: 7 }
  })
}

export async function buildAforoChart(pptx, token, id) {
  const data = await getPostData('/well/aforosData', token, id)
  let config = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      renderTo: 'hiddenChart',

    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Fecha'
      },
      type: 'datetime',
    },
    yAxis: [{
      title: {
        text: 'Gasto (bbl/d)'
      }
    }, {
      opposite: true,
      title: {
        text: 'Gasto (MMpc/d)'
      }
    }],
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
        },

      }
    },
    series: [{
      name: 'Qo',
      color: '#35b06d',
      label: 'bbl/d',
      data: []
    }, {
      name: 'Qg',
      color: '#CC3D3D',
      yAxis: 1,
      label: 'MMpc/d',
      data: []
    }, {
      name: 'Qw',
      color: '#3a88c0',
      label: 'bbl/d',
      data: []
    }]
  }
  let qoData = []
  let qwData = []
  let qgData = []
  data.forEach(i => {
    if (i.FECHA) {
      let date = new Date(i.FECHA)
      date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      qoData.push([date, i.QO])
      qwData.push([date, i.QW])
      qgData.push([date, i.QG])
    }
  })
  config.series[0].data = qoData
  config.series[1].data = qgData
  config.series[2].data = qwData
  const base64 = await buildChartBase64(config)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Histórico de aforos', { placeholder: 'slide_title' })
  const { middle } = getPositions(7)
  slide.addImage({
    data: base64, x: middle, y: 1,
    sizing: { type: 'contain', h: 5.25, w: 7 }
  })
}

export async function buildPressureChart(pptx, token, id, isField = false) {
  let data
  if (isField) {
    data = await getPostData('/well/fieldHistoricalPressure', token, id)
  } else {
    data = await getPostData('/well/pressureData', token, id)
  }

  let config = {
    chart: {
      type: 'line',
      zoomType: 'xy',
      renderTo: 'hiddenChart',

    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Fecha'
      },
      type: 'datetime'
    },
    yAxis: [{
      title: {
        text: 'PWS (someUnit)'
      }
    }, {
      opposite: true,
      title: {
        text: 'PWF (someUnit)'
      }
    }],
    plotOptions: {
      series: {
        animation: false,
      },
      scatter: {
        marker: {
          radius: 5,
        },

      }
    },
    series: [{
      name: 'PWS',
      color: '#0000A0',
      label: 'bbl/d',
      data: []
    }, {
      name: 'PWF',
      color: '#3a88c0',
      yAxis: 1,
      label: 'MMpc/d',
      data: []
    }]
  }

  let pwsData = []
  let pwfData = []

  data.forEach(i => {
    if (i.FECHA) {
      let date = new Date(i.FECHA)
      date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

      pwsData.push([date, i.PWS])
      pwfData.push([date, i.PWF])
    }
  })

  config.series[0].data = pwsData.sort((a, b) => { return a[0] - b[0] })
  config.series[1].data = pwfData.sort((a, b) => { return a[0] - b[0] })

  const base64 = await buildChartBase64(config)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  let title = 'Histórico de presión - '
  title += isField ? 'campo' : 'pozo'
  slide.addText(title, { placeholder: 'slide_title' })
  const { middle } = getPositions(7)
  slide.addImage({
    data: base64, x: middle, y: 1,
    sizing: { type: 'contain', h: 5.25, w: 7 }
  })
}

export async function buildWaterAnalysis(pptx, token, id) {
  const data = await getData('getAnalisisAgua', token, id)
  if (data.err) {
    return
  }
  const { table, options } = buildSimpleTable('', maps.analisisDelAgua, data.analisisDelAgua)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Análisis del Agua', { placeholder: 'slide_title' })
  const { middle } = getPositions(4)
  slide.addTable(table, { x: middle, y: 1.0, ...options })
}
