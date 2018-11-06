import PptxGenJS from 'pptxgenjs'
import { buildEstadoMecanicoYAparejo, buildFichaTecnicaDelCampo, buildFichaTecnicaDelPozo, buildSistemasArtificialesDeProduccion, buildEvaluacionPetrofisica } from './slides'

function buildMasterSlide(slideWidth, slideHeight) {
  const logo = { x: 0.7, y: 0.15, w: 1.5, h: 0.5, path: '/images/pemex-logo-fpo.png' }
  const bottomBarLight = { x: 0, get y() { return slideHeight - this.h }, w:'100%', h: 0.15, fill:'00a02d' }
  const bottomBarDarkLeft = { x: 0.6, y: bottomBarLight.y, w:'18%', h: 0.15, fill:'005618' }
  const bottomBarDarkRight = { x: slideWidth - 1.3, y: bottomBarLight.y, w:'5%', h: 0.15, fill:'005618' }
  const topBar = { x: 0, y: 0, w:'100%', h: 0.10, fill:'ce0a00' }
  const topLine = { get x() { return (slideWidth - this.w) / 2 }, y: logo.h + logo.y + 0.1, w: slideWidth * 0.9, h: bottomBarLight.h / 7, fill: '424242' }
  const slideTitle = {
    options: { name: 'slide_title', type: 'body', w: '100%', y: logo.h - 0.15, fontSize: 24, align: 'center' },
    text: '(title)'
  }
  return {
    title: 'MASTER_SLIDE',
    bkgd: 'e2e2e2',
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
  console.log('url?', url)
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const data = await fetch(`/api/${url}?transactionID=${id}`, headers).then(r => r.json())
  return data
}

export function buildTable(title, map, data) {
 

  const headerOptions = {
    fill: '2c6c94',
    color: 'ffffff',
  }

  const mapKeys = Object.keys(map)
  const headers = mapKeys.map((header) => {
    const obj = map[header]
    let text = obj.text
    if (obj.unit !== '') {
      text += `\n (${obj.unit})`
    }
    return { text, options: headerOptions }
  })

  const body = data.map((elem, index) => mapKeys.map((header) => {
    const options = {}
    options.fill = index % 2 === 1 ? 'cdd4dc' : 'e8ebef'
    return { text: elem[header], options }
  }))
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

export function buildSimpleTable(title, map, data) {
  const titleHeader =[{
    text: title,
    options: {
      fill: '2c6c94',
      color: 'ffffff',
      colspan: 3,
      align: 'center'
    }
  }]
  const headerOptions = {
    fill: '2c6c94',
    color: 'ffffff',
  }
  const headers = [
    { text: 'Descripción', options: headerOptions },
    { text: 'Valor', options: headerOptions },
    { text: 'Unidades', options: headerOptions },
  ]
  const body = Object.keys(map).map((elem, index) => {
    const options = {}
    options.fill = index % 2 === 1 ? 'cdd4dc' : 'e8ebef'
    const { text, unit } = map[elem]
    return [
      { text, options },
      { text: data[elem], options },
      { text: unit, options },
    ]
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

export async function generatePowerPoint(token, jobID) {
  const slideWidth = 13.3
  const slideHeight = 7.5
  const pptx = new PptxGenJS()
  pptx.setBrowser(true)
  pptx.setLayout({ name: 'LAYOUT_WIDE', width: slideWidth, height: slideHeight })
  const masterSlide = buildMasterSlide(slideWidth, slideHeight)
  pptx.defineSlideMaster(masterSlide)
  const images = await getData('getImages', token, jobID)
  console.log('images', images)
  const sections = await Promise.all([
    buildFichaTecnicaDelCampo(pptx, token, jobID),
    buildFichaTecnicaDelPozo(pptx, token, jobID),
    buildEstadoMecanicoYAparejo(pptx, token, jobID, images.mecanicoYAparejoDeProduccion),
    buildSistemasArtificialesDeProduccion(pptx, token, jobID),
    buildEvaluacionPetrofisica(pptx, token, jobID, images.evaluacionPetrofisica),
  ])
  pptx.save()
}
