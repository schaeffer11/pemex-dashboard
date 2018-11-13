import PptxGenJS from 'pptxgenjs'
import ReactHighcharts from 'react-highcharts'
import { buildEstadoMecanicoYAparejo, buildFichaTecnicaDelCampo, buildFichaTecnicaDelPozo, buildSistemasArtificialesDeProduccion, buildEvaluacionPetrofisica, buildEvaluacionPetrofisicaImage, buildProposalCedula, buildGeneralProposal, buildLabReports, buildHistorialIntervenciones, buildChart, buildProductionChart, buildAforoChart, buildPressureChart, buildWaterAnalysis, buildResultsCedula, buildGeneralResults } from './slides'

function buildMasterSlide(slideWidth, slideHeight) {
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
  return {
    title: 'MASTER_SLIDE',
    bkgd: 'e2e2e2',
    fontFace: 'Arial Narrow',
    slideNumber: { x:12.5, y:'92%', fontSize: 18 },
    objects: [
      { rect: bottomBarLight },
      { rect: bottomBarDarkLeft },
      { rect: bottomBarDarkRight },
      { rect: topBar },
      { rect: topLine },
      { image: logo },
      { placeholder: slideTitle },
    ]
  }
}

export async function getData(url, token, id) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  return fetch(`/api/${url}?transactionID=${id}`, headers).then(r => r.json())
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
  return final
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
  return final
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

export const tableOptions = {
  fontSize: 8,
  colW: '2',
}

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
  return Object.keys(data) > 0
}

export async function generatePowerPoint(token, jobID, wellID, jobType) {
  const slideWidth = 13.3
  const slideHeight = 7.5
  const pptx = new PptxGenJS()
  pptx.setBrowser(true)
  pptx.setLayout({ name: 'LAYOUT_WIDE', width: slideWidth, height: slideHeight })
  const masterSlide = buildMasterSlide(slideWidth, slideHeight)
  pptx.defineSlideMaster(masterSlide)
  const images = await getData('getImages', token, jobID)
  const hasResults = await getHasresults(token, jobID)
  console.log('images', images)
  buildSectionSlide(pptx, 'Información del campo')
  await buildFichaTecnicaDelCampo(pptx, token, jobID)
  await buildPressureChart(pptx, token, jobID, true)
  buildSectionSlide(pptx, 'Información del pozo')
  await buildFichaTecnicaDelPozo(pptx, token, jobID)
  await buildHistorialIntervenciones(pptx, token, jobID)
  await buildEstadoMecanicoYAparejo(pptx, token, jobID, images.mecanicoYAparejoDeProduccion)
  await buildSistemasArtificialesDeProduccion(pptx, token, jobID)
  await buildEvaluacionPetrofisica(pptx, token, jobID, images.buildEvaluacionPetrofisica)
  await buildWaterAnalysis(pptx, token, jobID)
  await buildProductionChart(pptx, token, jobID)
  await buildAforoChart(pptx, token, jobID)
  await buildPressureChart(pptx, token, jobID)
  buildSectionSlide(pptx, 'Información de la propuesta')
  await buildProposalCedula(pptx, token, jobID)
  await buildGeneralProposal(pptx, token, jobID)
  await buildLabReports(pptx, token, jobID, images.pruebasDeLaboratorio)
  if (hasResults) {
    buildSectionSlide(pptx, 'Información de los resultados')
    await buildResultsCedula(pptx, token, jobID, jobType)
    await buildGeneralResults(pptx, token, jobID, jobType)
  }
  pptx.save()
}
