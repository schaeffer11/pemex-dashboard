import PptxGenJS from 'pptxgenjs'
import { buildEstadoMecanicoYAparejo, buildFichaTecnicaDelCampo, buildFichaTecnicaDelPozo, buildSistemasArtificialesDeProduccion, buildEvaluacionPetrofisica, buildEvaluacionPetrofisicaImage, buildProposalCedula, buildGeneralProposal, buildLabReports, buildHistorialIntervenciones, buildChart, buildProductionChart, buildAforoChart, buildPressureChart, buildWaterAnalysis } from './slides'

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

export const tableOptions = {
  fontSize: 8,
  colW: '2',
}

export async function generatePowerPoint(token, jobID, wellID) {
  const slideWidth = 13.3
  const slideHeight = 7.5
  const pptx = new PptxGenJS()
  pptx.setBrowser(true)
  pptx.setLayout({ name: 'LAYOUT_WIDE', width: slideWidth, height: slideHeight })
  const masterSlide = buildMasterSlide(slideWidth, slideHeight)
  pptx.defineSlideMaster(masterSlide)
  const images = await getData('getImages', token, jobID)
  console.log('images', images)
  await buildFichaTecnicaDelCampo(pptx, token, jobID)
  await buildPressureChart(pptx, token, jobID, true)
  await buildFichaTecnicaDelPozo(pptx, token, jobID)
  await buildEstadoMecanicoYAparejo(pptx, token, jobID, images.mecanicoYAparejoDeProduccion)
  await buildSistemasArtificialesDeProduccion(pptx, token, jobID)
  await buildEvaluacionPetrofisica(pptx, token, jobID, images.buildEvaluacionPetrofisica)
  await buildWaterAnalysis(pptx, token, jobID)
  await buildProposalCedula(pptx, token, jobID)
  await buildGeneralProposal(pptx, token, jobID)
  await buildLabReports(pptx, token, jobID, images.pruebasDeLaboratorio)
  await buildHistorialIntervenciones(pptx, token, jobID)
  await buildProductionChart(pptx, token, jobID)
  await buildAforoChart(pptx, token, jobID)
  await buildPressureChart(pptx, token, jobID)
  pptx.save()
}
