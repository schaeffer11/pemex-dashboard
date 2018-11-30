import PptxGenJS from 'pptxgenjs'
import ReactHighcharts from 'react-highcharts'
import { buildEstadoMecanicoYAparejo, buildFichaTecnicaDelCampo, buildFichaTecnicaDelPozo, buildSistemasArtificialesDeProduccion, buildEvaluacionPetrofisica, buildEvaluacionPetrofisicaImage, buildProposalCedula, buildGeneralProposal, buildLabReports, buildHistorialIntervenciones, buildChart, buildProductionChart, buildAforoChart, buildPressureChart, buildWaterAnalysis, buildResultsCedula, buildGeneralResults, buildGeometry, buildGraficaDeTratamiento, buildObjectivoYAlcances } from './slides'

function buildMasterSlide(slideWidth, slideHeight, names) {
  const logo = { x: 0.7, y: 0.15, w: 1.5, h: 0.5, path: '/images/pemex-logo-fpo.png' }
  const bottomBarLight = { x: 0, get y() { return slideHeight - this.h }, w:'100%', h: 0.15, fill:'00a02d' }
  const bottomBarDarkLeft = { x: 0.6, y: bottomBarLight.y, w:'18%', h: 0.15, fill:'005618' }
  const bottomBarDarkRight = { x: slideWidth - 1.3, y: bottomBarLight.y, w:'5%', h: 0.15, fill:'005618' }
  const topBar = { x: 0, y: 0, w:'100%', h: 0.10, fill:'ce0a00' }
  const topLine = { get x() { return (slideWidth - this.w) / 2 }, y: logo.h + logo.y + 0.1, w: slideWidth * 0.9, h: bottomBarLight.h / 7, fill: '424242' }
  const slideTitle = {
    options: { name: 'slide_title', type: 'body', w: '100%', y: logo.h - 0.15, fontSize: 24, align: 'center', fontFace: 'Arial Narrow' },
    text: '(title)'
  }
  const namesOptions = {
    fontFace: 'Arial Narrow',
    x: 10.5,
    fontSize: 11,
  }
  const field = { text: `Campo: ${names.field}`, options:{ y: 0.15, ...namesOptions } }
  const well = { text: `Pozo: ${names.well}`, options:{ y: 0.30, ...namesOptions } }
  const formation = { text: `Formación: ${names.formation}`, options:{ y: 0.45, ...namesOptions } }
  return {
    title: 'MASTER_SLIDE',
    bkgd: 'e2e2e2',
    fontFace: 'Arial Narrow',
    slideNumber: { x:12.5, y:'92%', fontSize: 18 },
    margin: 0.5,
    objects: [
      { rect: bottomBarLight },
      { rect: bottomBarDarkLeft },
      { rect: bottomBarDarkRight },
      { rect: topBar },
      { rect: topLine },
      { image: logo },
      { placeholder: slideTitle },
      { text: field },
      { text: well },
      { text: formation },
    ]
  }
}

export async function getData(url, token, queryObj=undefined) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const queryStr = queryObj ? Object.keys(queryObj).map(key => `${key}=${queryObj[key]}`).join('&') : ''
  return fetch(`${url}?${queryStr}`, headers).then(r => r.json())
}

export async function getPostData(url, token, transactionID) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      transactionID
    })
  })
  .then(res => res.json())
}

export function buildTable(title, map, data) {
  const headerOptions = {
    fill: '2c6c94',
    color: 'ffffff',
    fontFace: 'Arial Narrow',
  }
  const mapKeys = Object.keys(map)
  const headers = mapKeys.map((header) => {
    let { text, unit } = {...map[header]}
    if (unit !== '') {
      text += `\n (${unit})`
    }
    return { text, options: headerOptions }
  })
  const body = data.map((elem, index) => {
    const d = mapKeys.map((header) => {
      const options = { fontFace: 'Arial Narrow' }
      options.fill = index % 2 === 1 ? 'cdd4dc' : 'e8ebef'
      const obj = { text: elem[header], options }
      return obj
    })
    return d
  })
  const final = [headers, ...body]
  if (title) {
    const titleHeader =[{
      text: title,
      options: {
        fill: '2c6c94',
        color: 'ffffff',
        colspan: headers.length,
        align: 'center'
      }
    }]
    final.unshift(titleHeader)
  }
  const options = largeTableOptions()
  return { options, table: final }
}

export function buildSimpleTable(title, map, data, hasUnits=true) {
  const titleHeader =[{
    text: title,
    options: {
      fill: '2c6c94',
      color: 'ffffff',
      colspan: hasUnits ? 3 : 2,
      align: 'center',
      fontFace: 'Arial Narrow',
    }
  }]
  const headerOptions = {
    fill: '2c6c94',
    color: 'ffffff',
  }
  const headers = [
    { text: 'Descripción', options: headerOptions },
    { text: 'Valor', options: headerOptions },
    // { text: 'Unidades', options: headerOptions },
  ]
  if (hasUnits) {
    headers.push({ text: 'Unidades', options: headerOptions })
  }
  const mapKeys = Object.keys(map)
  const body = mapKeys.map((elem, index) => {
    const options = { fontFace: 'Arial Narrow' }
    options.fill = index % 2 === 1 ? 'cdd4dc' : 'e8ebef'
    const { text, unit } = map[elem]
    const dataArray = [
      { text, options },
      { text: data[elem], options },
    ]
    if (hasUnits) {
      dataArray.push({ text: unit, options })
    }
    return dataArray
  })
  const final = [headers, ...body]
  if (title) {
    final.unshift(titleHeader)
  }

  const options = smallTableOptions()
  return { options, table: final }
}

export async function buildChartBase64(config) {
  const domElement = document.createElement('div')
  domElement.id = 'hiddenChart'
  domElement.style.display = 'none'
  document.body.appendChild(domElement)
  const chart = new ReactHighcharts.Highcharts.Chart(config)
  const dataURL = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(chart.getSVG())))}`
  document.getElementById('hiddenChart').outerHTML = ''
  return dataURL
}

const tableOptions = {
  fontSize: 8,
  align: 'center',
}

export const smallTableOptions = () => ({
  w: 4,
  ...tableOptions
})

export const largeTableOptions = () => ({
  w: 10,
  ...tableOptions
})

function buildSectionSlide(pptx, title) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText(' ', { placeholder: 'slide_title' })
  slide.addText(title, { w: '100%', h: '100%', fontSize: 48, fontFace: 'Arial Narrow', align: 'center', valign: 'middle' })
}

async function getHasresults(token, id) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const data = await fetch(`/job/generalResults?transactionID=${id}`, headers).then(r => r.json())
  return Object.keys(data).length > 0
}

const firstHalf = (pptx, token, jobID, images) => [
  { func: async () => buildObjectivoYAlcances(pptx, token, jobID), name: 'objectivoYAlcances' },
  { func: () => buildSectionSlide(pptx, 'Información del campo') },
  { func: async () => buildFichaTecnicaDelCampo(pptx, token, jobID), name: 'fichaTecnicalDelCampo' },
  { func: async () => buildPressureChart(pptx, token, jobID, true), name: 'historicoPresionCampo' },
  { func: () => buildSectionSlide(pptx, 'Información del pozo') },
  { func: async () => buildFichaTecnicaDelPozo(pptx, token, jobID), name: 'fichaTecnicaDelPozo' },
  { func: async () => buildHistorialIntervenciones(pptx, token, jobID), name: 'historialDeIntervenciones' },
  { func: async () => buildEstadoMecanicoYAparejo(pptx, token, jobID, images.mecanicoYAparejoDeProduccion), name: 'estadoMecanicoYAparejo' },
  { func: async () => buildSistemasArtificialesDeProduccion(pptx, token, jobID), name: 'sistemasArtificialesDeProduccion' },
  { func: async () => buildEvaluacionPetrofisica(pptx, token, jobID, images.evaluacionPetrofisica), name: 'evaluacionPetrofisica' },
  { func: async () => buildWaterAnalysis(pptx, token, jobID), name: 'analisisDeAgua' },
  { func: async () => buildProductionChart(pptx, token, jobID), name: 'historicoDeProduccion' },
  { func: async () => buildAforoChart(pptx, token, jobID), name: 'historicoDeAforosPropuesta' },
  { func: async () => buildPressureChart(pptx, token, jobID), name: 'historicoDePresionPozo' },
  { func: () => buildSectionSlide(pptx, 'Información de la propuesta') },
  { func: async () => buildProposalCedula(pptx, token, jobID), name: 'propuestaCedula' },
  { func: async () => buildGeneralProposal(pptx, token, jobID), name: 'propuesta' },
  { func: async () => buildLabReports(pptx, token, jobID, images.pruebasDeLaboratorio), name: 'laboratorios' },
]

const secondHalf = (pptx, token, jobID, jobType, images) => [
  { func: () => buildSectionSlide(pptx, 'Información de los resultados') },
  { func: async () => buildResultsCedula(pptx, token, jobID, jobType), name: 'resultadosCedula' },
  { func: async () => buildGeneralResults(pptx, token, jobID, jobType), name: 'resultados' },
  { func: async () => buildGeometry(pptx, images[`evaluacion${jobType}`]), name: 'geometria' },
  { func: async () => buildAforoChart(pptx, token, jobID), name: 'historicoDeAforosResultados' },
  { func: async () => buildGraficaDeTratamiento(pptx, images.graficaTratamiento), name: 'graficaDeTratamiento' },
]

async function buildAndSkipError(index, everything, hasResults, updateProgress) {
  for (let e of everything) {
    try {
      await e.func()
      if (e.name) {
        updateProgress(index, e.name, hasResults)
        index++
      }
    } catch (error) {
      console.log('error', error)
      if (e.name) {
        updateProgress(index, e.name, hasResults, true)
        index++
      }
    }
  }
  return index
}

export async function generatePowerPoint(token, jobID, jobType, updateProgress) {
  console.log('generating powerpoint')
  const slideWidth = 13.3
  const slideHeight = 7.5
  const pptx = new PptxGenJS()
  pptx.setBrowser(true)
  pptx.setLayout({ name: 'LAYOUT_WIDE', width: slideWidth, height: slideHeight })
  const names = await getData('/api/getSpecificFieldWell', token, { transactionID: jobID })
  const masterSlide = buildMasterSlide(slideWidth, slideHeight, names)
  pptx.defineSlideMaster(masterSlide)
  const images = await getData('/api/getImages', token, { transactionID: jobID })
  const hasResults = await getHasresults(token, jobID)
  // const hasResults = false
  const firstHalfTasks = firstHalf(pptx, token, jobID, images)
  let index = 1
  index = await buildAndSkipError(index, firstHalfTasks, hasResults, updateProgress)
  if (hasResults) {
    const imageResults = await getData(`/job/getResultsImages`, token, { transactionID: jobID })
    const secondHalfTasks = secondHalf(pptx, token, jobID, jobType, imageResults)
    index = await buildAndSkipError(index, secondHalfTasks, hasResults, updateProgress)
  //   console.log('image results', imageResults)
    // buildSectionSlide(pptx, 'Información de los resultados')
    // await buildResultsCedula(pptx, token, jobID, jobType)
    // await buildGeneralResults(pptx, token, jobID, jobType)
    // await buildGeometry(pptx, imageResults[`evaluacion${jobType}`])
    // await buildAforoChart(pptx, token, jobID)
    // await buildGraficaDeTratamiento(pptx, imageResults.graficaTratamiento)
  }
  console.log('finished building ppt')
  pptx.save()
}
