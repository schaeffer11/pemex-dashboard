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

export async function buildTitleSlide(pptx, names) {
  const slideWidth = 13.3
  const slideHeight = 7.5
  const titleSlide = pptx.addNewSlide()
  titleSlide.back = 'e2e2e2'

  // Shapes
  const bottomBarLight = { x: 0, get y() { return slideHeight - this.h }, w:'100%', h: 0.15, fill:'00a02d' }
  const bottomBarDarkLeft = { x: 0.6, y: bottomBarLight.y, w:'18%', h: 0.15, fill:'005618' }
  const bottomBarDarkRight = { x: slideWidth - 1.3, y: bottomBarLight.y, w:'5%', h: 0.15, fill:'005618' }
  const topBar = { x: 0, y: 0, w:'100%', h: 0.10, fill:'ce0a00' }
  titleSlide.addShape(pptx.shapes.RECTANGLE, bottomBarLight)
  titleSlide.addShape(pptx.shapes.RECTANGLE, bottomBarDarkLeft)
  titleSlide.addShape(pptx.shapes.RECTANGLE, bottomBarDarkRight)
  titleSlide.addShape(pptx.shapes.RECTANGLE, topBar)

  // Static text
  const mainTextOptions = { fontFace: 'Arial Narrow', align: 'center', w: '100%' }
  const titleTextOptions = { ...mainTextOptions, bold: true, }
  const anotherSubTitleTextOptions = { ...mainTextOptions, fontSize: 20, color: '717171' }
  titleSlide.addText('Pemex Exploración y Producción\nSubdirección de Especialidad Técnica de Explotación', { x: 0.0, y: 1.0, ...titleTextOptions, fontSize: 24 })
  titleSlide.addText('Homologación de Procesos de Estimulación y Fracturamiento', { x: 0.0, y: 2.0, ...titleTextOptions, fontSize: 20 })
  titleSlide.addText('Gerencia de Producción.- Coordinación de Productividad de Pozos', { x: 0.0, y: 2.5, ...anotherSubTitleTextOptions })

  // Dynamic text
  const date = new Date()
  const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  const namesTitleStr = 'Subdirección:\nActivo:\nCampo:\nPozo:\nFormación:'
  const namesStr = `${names.subdireccion.split('Sub. ')[1]}\n${names.activo}\n${names.field}\n${names.well}\n${names.formation}`
  titleSlide.addText(namesTitleStr, { x: 4.5, y: 3.75, w: 2, align: 'right', fontSize: 18, bold: true })
  titleSlide.addText(namesStr, { x: 6.5, y: 3.75, w: 2, align: 'left', fontSize: 18 })
  titleSlide.addText(dateStr, { x: 11.75, y: 7, fontSize: 16, fontFace: 'Arial Narrow' })

  // Images
  titleSlide.addImage({ x: 0.2, y: 0.2, w: 1.89, h: 0.63, path: '/images/pemex-logo-fpo.png' })
  titleSlide.addImage({ path: '/images/pptx/portada_abajo.png', x: getPositions(7.79).middle, y: 5.5, h: 1.5, w: 7.79 })
  titleSlide.addImage({ x: 11, y: 2.0, h: 4.32, w: 1.74, path: '/images/pptx/portada_derecha.png' })
  titleSlide.addImage({ x: 0.65, y: 2.0,  h: 3.38, w: 1.68, path: '/images/pptx/portada_izquierda.jpg' })
  return slide
}

export async function buildObjectivoYAlcances(pptx, token, id) {
  const data = await getData('/api/getInterventionBase', token, { transactionID: id })
  const { intervencionProgramada } = data.objetivoYAlcancesIntervencion
  data.objetivoYAlcancesIntervencion.intervencionProgramada = intervencionProgramada ? 'Si' : 'No'
  const { table } = buildSimpleTable('', maps.general, data.objetivoYAlcancesIntervencion, false)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta', { placeholder: 'slide_title' })
  const { middle } = getPositions(10)
  slide.addTable(table, { x: middle, y: 1.0, colW: [2.0, 8], fontSize: 18 })
  return slide
}

export async function buildFichaTecnicaDelCampo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Campo', { placeholder: 'slide_title' })
  const data = await getData('/api/getFields', token, { transactionID: id })
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
  const data = await getData('/api/getWell', token, { transactionID: id })
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
  const data = await getData('/api/getMecanico', token, { transactionID: id })
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
        data: `image/png;base64,${base64}`, x: middle, y: 1.5,
        sizing: { type: 'contain', h: 4.0, w: 4.0 }
      })
    }
  }
  return slide
}

export async function buildSistemasArtificialesDeProduccion(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Información de Sistemas Artificiales de Producción', { placeholder: 'slide_title' })
  const wellData = await getData('/api/getWell', token, { transactionID: id })
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
  const data = await getData(`/api/${url}`, token, { transactionID: id })
  data.sistemasArtificialesDeProduccion.tipoDeSistema = title
  const { table, options } = buildSimpleTable(null, sistemasArtificialesDeProduccion[tipoSistemaArtificial], data.sistemasArtificialesDeProduccion)
  slide.addTable(table, { x: getPositions(4).middle, y: 1.0, ...options })
  return slide
}

export async function buildEvaluacionPetrofisica(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Evaluación Petrofísica', { placeholder: 'slide_title' })
  const queryObj = { transactionID: id }
  const layers = await getData('/api/getLayer', token, queryObj)
  const mud = await getData('/api/getMudLoss', token, queryObj)

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
        data: `image/png;base64,${base64}`, x: getPositions(10.5).middle, y: 1.0,
        sizing: { type: 'contain', h: 5.5, w: 10.5 }
      })
    }
  }
  return slide
}

export async function buildResultsCedula(pptx, token, id, interventionType) {
  const generalResults = await getData('/job/generalResults', token, { transactionID: id })
  const cedulaData = await getData('/job/getCedulaResults', token, { transactionID: id, type: interventionType })
  const layers = await getData('/api/getLayer', token, { transactionID: id })
  const { layerData } = layers.evaluacionPetrofisica
  const intervals = layerData.map(elem => `${elem.cimaMD}-${elem.baseMD}`).join('\n')
  const cedulaMap = maps.propuesta[interventionType.toLowerCase()].cedulaData
  const cedula = buildTable('Cedula de tratamiento', cedulaMap, cedulaData)
  const general = buildSimpleTable('', maps.generalResults, { ...generalResults, intervals }, false)
  
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Tratamiento', { placeholder: 'slide_title' })
  mainSlide.addTable(general.table, { x: getPositions(10).middle, y: 1.0, colW: [2.0, 8.0], fontSize: 18 })

  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Cédula de tratamiento', { placeholder: 'slide_title' })
  slide.addTable(cedula.table, { x: getPositions(cedula.options.w).middle, y: 1.0, ...cedula.options })
}

export async function buildProposalCedula(pptx, token, id, isResults=false) {
  const queryObj = { transactionID: id }
  const interventionTypeData = await getData('/api/getInterventionBase', token, queryObj)
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

  const data = await getData(`/api/${cedulaURL}`, token, queryObj)
  const layers = await getData('/api/getLayer', token, queryObj)
  const { cedulaData, propuestaCompany } = data[Object.keys(data)[0]]
  const { layerData } = layers.evaluacionPetrofisica
  const cedulaMap = maps.propuesta[interventionType].cedulaData
  const intervals = layerData.map(elem => `${elem.cimaMD}-${elem.baseMD}`).join('\n')
  
  const cedula = buildTable('Cedula de tratamiento', cedulaMap, cedulaData)
  const general = buildSimpleTable('', maps.propuestaGeneral, { propuestaCompany, intervals }, false)
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText('Propuesta', { placeholder: 'slide_title' })
  const { middle } = getPositions(10)
  mainSlide.addTable(general.table, { x: middle, y: 1.0, colW: [2.0, 8.0], fontSize: 18 })

  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Propuesta de tratamiento', { placeholder: 'slide_title' })
  slide.addTable(cedula.table, { x: middle, y: 1.0, ...cedula.options })
  return slide
}

export async function buildGeometry(pptx, images) {
  if (images) {
    for (let image of images) {
      const { middle } = getPositions(4.5)
      const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
      if (!base64.error) {
        const interval = image.imgName.split('.').slice(-1)
        const slide = pptx.addNewSlide('MASTER_SLIDE')
        slide.addText(`Geometría de intervalo: ${interval[0]}`, { placeholder: 'slide_title' })
        slide.addImage({
          data: `image/png;base64,${base64}`, x: middle, y: 1,
          sizing: { type: 'contain', h: 4.5, w: 4.5 }
        })
      }
    }
  }
}

export async function buildGraficaDeTratamiento(pptx, image) {
  if (image) {
    const { middle } = getPositions(4.5)
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      const slide = pptx.addNewSlide('MASTER_SLIDE')
      slide.addText('Gráfica de tratamiento', { placeholder: 'slide_title' })
      slide.addImage({
        data: `image/png;base64,${base64}`, x: middle, y: 1,
        sizing: { type: 'contain', h: 4.5, w: 4.5 }
      })
    }
  }
}

export async function buildGeneralResults(pptx, token, id, interventionType) {
  const data = await getData(`/job/getInterventionResultsData`, token, { transactionID: id, type: interventionType, shouldMapData: true })
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Resultados de tratamiento', { placeholder: 'slide_title' })

  const map = maps.propuesta[interventionType.toLowerCase()]
  const { left, right, middle } = getPositions(4)
  if (map.volumes) {
    const volumes = buildSimpleTable('Volúmenes', map.volumes, data)
    slide.addTable(volumes.table, { x: left, y: 1.0, ...volumes.options })
  }

  if (map.geoMechanicInformation) {
    const geoMechanic = buildSimpleTable('Información de Geomecánica', map.geoMechanicInformation, data)
    slide.addTable(geoMechanic.table, { x: left, y: 3.0, ...geoMechanic.options })
  }
  if (interventionType === 'Estimulacion' && data.tipoDeEstimulacion === 'limpieza') {
    const limpieza = buildSimpleTable('Limpieza de Aparejo', map.general, data)
    slide.addTable(limpieza.table, { x: left, y: 3.0, ...limpieza.options })
  }

  if (map.resultadosSimulacion) {
    const simulacion = buildSimpleTable('Resultados de la simulación', map.resultadosSimulacion, data)
    slide.addTable(simulacion.table, { x: middle, y: 1.0, ...simulacion.options })
  }

  if (interventionType === 'Termico') {
    const general = buildSimpleTable('General', map.general, data)
    slide.addTable(general.table, { x: left, y: 1.0, ...general.options })
  }

  const deltaProduction = buildSimpleTable('Incremento de producción', maps.incrementoProduccionResults, data)
  slide.addTable(deltaProduction.table, { x: right, y: 1.0, ...deltaProduction.options })
  return slide
}

export async function buildGeneralProposal(pptx, token, id) {
  const queryObj = { transactionID: id }
  const interventionTypeData = await getData('/api/getInterventionBase', token, queryObj)
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
      estimacionProduccionData = 'estIncProduccionTermico'
      propuestaData = 'propuestaTermica'
      break;
    default:
      return
  }


  const data = await getData(`/api/${interventionURL}`, token, queryObj)
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

  if (interventionType === 'termico') {
    const general = buildSimpleTable('General', map.general, data[propuestaData])
    slide.addTable(general.table, { x: left, y: 1.0, ...general.options })
  }

  const estimacion = buildSimpleTable('Estimación', maps.estimacionProduccion, data[estimacionProduccionData])
  slide.addTable(estimacion.table, { x: right, y: 1.0, ...estimacion.options })
  return slide
}

async function buildMainLabSlide(pptx, labTitle, lab, image) {
  const mainSlide = pptx.addNewSlide('MASTER_SLIDE')
  mainSlide.addText(`Pruebas de laboratorio - ${labTitle}`, { placeholder: 'slide_title' })
  const { table, options } = buildSimpleTable('Datos generales', maps.pruebasDeLaboratorio.general, lab, false)
  mainSlide.addTable(table, { x: getPositions(options.w).middle, y: 1.0, ...options })
  if (image) {
    const { middle } = getPositions(4.5)
    const base64 = await getBase64FromURL(image.imgURL).catch(e => e)
    if (!base64.error) {
      mainSlide.addImage({
        data: `image/png;base64,${base64}`, x: middle, y: 3.3,
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
    const dataSlide = pptx.addNewSlide('MASTER_SLIDE')
    dataSlide.addText('Pruebas de laboratorio', { placeholder: 'slide_title' })
    const { table, options } = buildTable(labTitle, map[tableName], lab[tableName])
    dataSlide.addTable(table, { x: getPositions(options.w).middle, y: 1.0, ...options })
  } else {
    if (Object.keys(map).length > 0) {
      const dataSlide = pptx.addNewSlide('MASTER_SLIDE')
      dataSlide.addText('Pruebas de laboratorio', { placeholder: 'slide_title' })
      const { table, options } = buildSimpleTable(labTitle, map, lab)
      dataSlide.addTable(table, { x: getPositions(options.w).middle, y: 1.0, ...options })
    }
  }
}

export async function buildLabReports(pptx, token, id, images) {
  const data = await getData('/api/getLabTest', token, { transactionID: id })
  const { pruebasDeLaboratorioData } = data.pruebasDeLaboratorio
  if (Object.keys(pruebasDeLaboratorioData[0]).length > 0) {
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
  const queryObj = { transactionID: id }
  const dataGeneral = await getData('/api/getHistIntervenciones', token, queryObj)
  const dataStimulation = await getData('/api/getHistIntervencionesEstimulacionNew', token, queryObj)
  const dataAcido = await getData('/api/getHistIntervencionesAcidoNew', token, queryObj)
  const dataApuntalado = await getData('/api/getHistIntervencionesApuntaladoNew', token, queryObj)
  const dataTermico = await getData('/api/getHistIntervencionesTermicoNew', token, queryObj)
  const { historicoEstimulacionData } = dataStimulation.historialDeIntervenciones
  const { historicoAcidoData } = dataAcido.historialDeIntervenciones
  const { historicoApuntaladoData } = dataApuntalado.historialDeIntervenciones
  const { historicoTermicoData } = dataTermico.historialDeIntervenciones

  const { general, estimulacion, acido, apuntalado, termico } = maps.historialDeIntervenciones
  if (shouldBuild(dataGeneral.fichaTecnicaDelPozo.historialIntervencionesData)) {
    buildHistoricSlides(pptx, dataGeneral.fichaTecnicaDelPozo.historialIntervencionesData, general, 'Historial de intervenciones', { x: getPositions(7).middle, colW: [1, 6], fontSize: 8 })
  }
  const { middle } = getPositions(10)
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
  let pwsData = []
  let pwfData = []
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
  }

  if (isField) {
    data = await getPostData('/well/fieldHistoricalPressure', token, id)
  } else {
    data = await getPostData('/well/pressureData', token, id)
  }

  data.forEach(i => {
    if (i.FECHA) {
      let date = new Date(i.FECHA)
      date = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

      pwsData.push([date, i.PWS])
      pwfData.push([date, i.PWF])
    }
  })

  config.series = [{
    name: 'PWS',
    color: '#0000A0',
    label: 'bbl/d',
    data: pwsData.sort((a, b) => { return a[0] - b[0] })
  }]
  config.yAxis = [{ title: { text: 'PWS (Kg/cm2)' } }]

  if (!isField) {
    config.series.push({
      name: 'PWF',
      color: '#3a88c0',
      yAxis: 1,
      label: 'MMpc/d',
      data: pwfData.sort((a, b) => { return a[0] - b[0] })
    })
    config.yAxis.push({
      opposite: true,
      title: {
        text: 'PWF (Kg/cm2)'
      }
    })
  }

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
  const data = await getData('/api/getAnalisisAgua', token, { transactionID: id })
  if (data.err) {
    return
  }
  const { table, options } = buildSimpleTable('', maps.analisisDelAgua, data.analisisDelAgua)
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Análisis del Agua', { placeholder: 'slide_title' })
  const { middle } = getPositions(4)
  slide.addTable(table, { x: middle, y: 1.0, ...options })
}

