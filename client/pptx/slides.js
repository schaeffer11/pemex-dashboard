import { getData, buildSimpleTable, buildTable, tableOptions, getPostData, buildChartBase64, getMiddle } from './index'
import { maps } from './maps'
import { getBase64FromURL } from '../redux/actions/pozoFormActions'

export async function buildFichaTecnicaDelCampo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Campo', { placeholder: 'slide_title' })
  const data = await getData('getFields', token, id)
  const { generales, explotacion, fluido, formacion, produccion } = maps.field
  const generalesTable = buildSimpleTable('Generales', generales, data.fichaTecnicaDelCampo)
  const explotacionTable = buildSimpleTable('Explotación', explotacion, data.fichaTecnicaDelCampo)
  const fluidoTable = buildSimpleTable('Fluido', fluido, data.fichaTecnicaDelCampo)
  const formacionTable = buildSimpleTable('Formación', formacion, data.fichaTecnicaDelCampo)
  const proudccionTable = buildSimpleTable('Producción @ formación', produccion, data.fichaTecnicaDelCampo)

  slide.addTable(generalesTable, { x: 0.5, y: 1.0, ...tableOptions })
  slide.addTable(explotacionTable, { x: 0.5, y: 2.2, ...tableOptions })
  slide.addTable(fluidoTable, { x: 4.0, y: 1.0, ...tableOptions })
  slide.addTable(formacionTable, { x: 4.0, y: 3.0, ...tableOptions })
  slide.addTable(proudccionTable, { x: 7.5, y: 1.0, ...tableOptions })
  return slide
}

export async function buildFichaTecnicaDelPozo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Pozo', { placeholder: 'slide_title' })
  const data = await getData('getWell', token, id)
  const { datos, fluido, formacion, presion } = maps.well
  const datosTable = buildSimpleTable('Generales', datos, data.fichaTecnicaDelPozo)
  const fluidoTable = buildSimpleTable('Fluido', fluido, data.fichaTecnicaDelPozo)
  const presionTable = buildSimpleTable('Presión', presion, data.fichaTecnicaDelPozo)
  const formacionTable = buildSimpleTable('Formación', formacion, data.fichaTecnicaDelPozo)

  slide.addTable(datosTable, { x: 0.5, y: 1.0, ...tableOptions })
  slide.addTable(presionTable, { x: 4.0, y: 1.0, ...tableOptions })
  slide.addTable(formacionTable, { x: 4.0, y: 3.3, ...tableOptions })
  slide.addTable(fluidoTable, { x: 7.5, y: 1.0, ...tableOptions })
  return slide
}

export async function buildEstadoMecanicoYAparejo(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Edo. Mecánico y Aparejo de Producción', { placeholder: 'slide_title' })
  const data = await getData('getMecanico', token, id)
  const { terminacion, liner, disparos, volumen } = maps.estadoMecanicoYAparejo
  const terminacionTable = buildSimpleTable('Tipo de Terminación', terminacion, data.mecanicoYAparejoDeProduccion)
  const linerTable = buildSimpleTable('Tipo de liner', liner, data.mecanicoYAparejoDeProduccion)
  const disparosTable = buildSimpleTable('Disparos', disparos, data.mecanicoYAparejoDeProduccion)
  const volumenTable = buildSimpleTable('Capacidad', volumen, data.mecanicoYAparejoDeProduccion)

  slide.addTable(terminacionTable, { x: 0.5, y: 1.0, ...tableOptions })
  slide.addTable(linerTable, { x: 0.5, y: 3.0, ...tableOptions })
  slide.addTable(disparosTable, { x: 0.5, y: 4.25, ...tableOptions })
  slide.addTable(volumenTable, { x: 7.5, y: 1.0, ...tableOptions })
  if (image) {
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      slide.addImage({
        data: `image/png;base64,${base64}`, x: 7.5, y: 3, w: 4, h: 3,
        sizing: { type: 'contain', h: 3.5, w: 3.5 }
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
  let map
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
  const sistemaTable = buildSimpleTable(null, sistemasArtificialesDeProduccion[tipoSistemaArtificial], data.sistemasArtificialesDeProduccion)
  slide.addTable(sistemaTable, { x: 0.5, y: 1.0, ...tableOptions })
  return slide
}

export async function buildEvaluacionPetrofisica(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Evaluación Petrofísica', { placeholder: 'slide_title' })
  const layers = await getData('getLayer', token, id)
  const mud = await getData('getMudLoss', token, id)

  let { layerData } = layers.evaluacionPetrofisica
  console.log('layerData', layerData)
  let { mudLossData } = mud.evaluacionPetrofisica
  const layerTable = buildTable('Propiedades promedio', maps.evaluacionPetrofisica.layerData, layerData)
  const mudLossTable = buildTable('Zona de pérdida', maps.evaluacionPetrofisica.mudLossData, mudLossData)

  const tableOptionsCopy = { ...tableOptions }
  delete tableOptionsCopy.colW
  slide.addTable(layerTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })
  slide.addTable(mudLossTable, { x: 0.5, y: 5.0, ...tableOptionsCopy })
  if (image) {
    const imageSlide = pptx.addNewSlide('MASTER_SLIDE')
    imageSlide.addText('Evaluación Petrofísica', { placeholder: 'slide_title' })
    imageSlide.addText('Registro del pozo', { x: 0.5, y: 1.0, fontSize: 14, fontFace: 'Arial Narrow' })
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      imageSlide.addImage({
        data: `image/png;base64,${base64}`, x: (13.3 - 6.5) / 2, y: 1.0, w: 4, h: 3,
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
  console.log('intervals', intervals)
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
  
  const cedulaTable = buildTable('Cedula de tratamiento', cedulaMap, cedulaData)
  const generalTable = buildSimpleTable('', maps.propuestaGeneral, { propuestaCompany, intervals }, false)
  console.log('generaltable', generalTable)
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Propuesta', { placeholder: 'slide_title' })
  mainSlide.addTable(generalTable, { x: getMiddle(10), y: 1.0, colW: [2.0, 8.0], fontSize: 24 })

  const tableOptionsCopy = { ...tableOptions }
  delete tableOptionsCopy.w
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta de tratamiento', { placeholder: 'slide_title' })
  slide.addTable(cedulaTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })
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
  console.log('data', data)
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


  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta de tratamiento', { placeholder: 'slide_title' })
  const data = await getData(interventionURL, token, id)


  const tableOptionsCopy = { ...tableOptions }
  const map = maps.propuesta[interventionType]

  if (map.volumes) {
    const volumesTable = buildSimpleTable('Volúmenes', map.volumes, data[propuestaData])
    slide.addTable(volumesTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })
  }

  if (map.geoMechanicInformation) {
    const geoMechanicTable = buildSimpleTable('Información de Geomecánica', map.geoMechanicInformation, data[propuestaData])
    slide.addTable(geoMechanicTable, { x: 3.5, y: 1.0, ...tableOptionsCopy })
  }

  if (interventionType === 'estimulacion' && data[propuestaData].tipoDeEstimulacion === 'limpieza') {
    const limpiezaTable = buildSimpleTable('Limpieza de Aparejo', map.general, data[propuestaData])
    slide.addTable(limpiezaTable, { x: 0.5, y: 4.0, ...tableOptionsCopy })
  }

  if (map.resultadosSimulacion) {
    const simulacionTable = buildSimpleTable('Resultados de la simulación', map.resultadosSimulacion, data[simulacionData])
    slide.addTable(simulacionTable, { x: 0.5, y: 4.0, ...tableOptionsCopy })
  }

  const estimacionTable = buildSimpleTable('Estimación', maps.estimacionProduccion, data[estimacionProduccionData])
  slide.addTable(estimacionTable, { x: 7.5, y: 1.0, ...tableOptionsCopy })

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

function buildHistoricSlides(pptx, data, map, title, options=false) {
  if (data.length > 0) {
    let tableOptions = options || {}
    const table = buildTable('', map, data)
    const slide = pptx.addNewSlide('MASTER_SLIDE')
    slide.addText(title, { placeholder: 'slide_title' })
    slide.addTable(table, tableOptions)
  }
}

export async function buildHistorialIntervenciones(pptx, token, id) {
  const dataGeneral = await getData('getHistIntervenciones', token, id)
  const dataStimulation = await getData('getHistIntervencionesEstimulacionNew', token, id)
  const dataAcido = await getData('getHistIntervencionesAcidoNew', token, id)
  const dataApuntalado = await getData('getHistIntervencionesApuntaladoNew', token, id)
  const { historicoEstimulacionData } = dataStimulation.historialDeIntervenciones
  const { historicoAcidoData } = dataAcido.historialDeIntervenciones
  const { historicoApuntaladoData } = dataApuntalado.historialDeIntervenciones
  const { general, estimulacion, acido, apuntalado } = maps.historialDeIntervenciones

  buildHistoricSlides(pptx, dataGeneral.fichaTecnicaDelPozo.historialIntervencionesData, general, 'Historial de intervenciones', { x: getMiddle(7), colW: [1, 6] })

  buildHistoricSlides(pptx, historicoEstimulacionData, estimulacion, 'Historial de intervenciones de estimulacion')
  buildHistoricSlides(pptx, historicoAcidoData, acido, 'Historial de intervenciones de acido')
  buildHistoricSlides(pptx, historicoApuntaladoData, apuntalado, 'Historial de intervenciones de apuntalado')
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
  slide.addImage({
    data: base64, x: (13.3 - 7) / 2, y: 1,
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
  slide.addImage({
    data: base64, x: (13.3 - 7) / 2, y: 1,
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

  console.log('pressuredata', data)
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
  slide.addImage({
    data: base64, x: (13.3 - 7) / 2, y: 1,
    sizing: { type: 'contain', h: 5.25, w: 7 }
  })
}

export async function buildWaterAnalysis(pptx, token, id) {
  const data = await getData('getAnalisisAgua', token, id)
  if (data.err) {
    return
  }
  const tableOptionsCopy = {...tableOptions}
  const table = buildSimpleTable('', maps.analisisDelAgua, data.analisisDelAgua)
  console.log('tableOptions', tableOptionsCopy)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Análisis del Agua', { placeholder: 'slide_title' })
  slide.addTable(table, { x: 0.5, y: 1.0, tableOptionsCopy })
}
