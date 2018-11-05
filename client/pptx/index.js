import PptxGenJS from 'pptxgenjs'
import { maps } from './maps'
import { getBase64FromURL } from '../redux/actions/pozoFormActions';

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

async function getData(url, token, id) {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
  }
  const data = await fetch(`/api/${url}?transactionID=${id}`, headers).then(r => r.json())
  return data
}

function buildTable(title, map, data) {
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
  return [titleHeader, headers, ...body]
}

const tableOptions = {
  fontSize: 8,
  colW: '2',
}

async function buildFichaTecnicaDelCampo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Campo', { placeholder: 'slide_title' })
  const data = await getData('getFields', token, id)
  const { generales, explotacion, fluido, formacion, produccion } = maps.field
  const generalesTable = buildTable('Generales', generales, data.fichaTecnicaDelCampo)
  const explotacionTable = buildTable('Explotación', explotacion, data.fichaTecnicaDelCampo)
  const fluidoTable = buildTable('Fluido', fluido, data.fichaTecnicaDelCampo)
  const formacionTable = buildTable('Formación', formacion, data.fichaTecnicaDelCampo)
  const proudccionTable = buildTable('Producción @ formación', produccion, data.fichaTecnicaDelCampo)

  slide.addTable(generalesTable, { x: 0.5, y: 1.0, ...tableOptions } )
  slide.addTable(explotacionTable, { x: 0.5, y: 2.2, ...tableOptions } )
  slide.addTable(fluidoTable, { x: 4.0, y: 1.0, ...tableOptions } )
  slide.addTable(formacionTable, { x: 4.0, y: 3.0, ...tableOptions } )
  slide.addTable(proudccionTable, { x: 7.5, y: 1.0, ...tableOptions } )
  return slide
}

async function buildFichaTecnicaDelPozo(pptx, token, id) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Ficha Técnica del Pozo', { placeholder: 'slide_title' })
  const data = await getData('getWell', token, id)
  const { datos, fluido, formacion, presion } = maps.well
  const datosTable = buildTable('Generales', datos, data.fichaTecnicaDelPozo)
  const fluidoTable = buildTable('Fluido', fluido, data.fichaTecnicaDelPozo)
  const presionTable = buildTable('Presión', presion, data.fichaTecnicaDelPozo)
  const formacionTable = buildTable('Formación', formacion, data.fichaTecnicaDelPozo)

  slide.addTable(datosTable, { x: 0.5, y: 1.0, ...tableOptions } )
  slide.addTable(presionTable, { x: 4.0, y: 1.0, ...tableOptions } )
  slide.addTable(formacionTable, { x: 4.0, y: 3.0, ...tableOptions } )
  slide.addTable(fluidoTable, { x: 7.5, y: 1.0, ...tableOptions } )
  return slide
}

async function buildEstadoMecanicoYAparejo(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Edo. Mecánico y Aparejo de Producción', { placeholder: 'slide_title' })
  const data = await getData('getMecanico', token, id)
  const { terminacion, liner, disparos, volumen } = maps.estadoMecanicoYAparejo
  const terminacionTable = buildTable('Tipo de Terminación', terminacion, data.mecanicoYAparejoDeProduccion)
  const linerTable = buildTable('Tipo de liner', liner, data.mecanicoYAparejoDeProduccion)
  const disparosTable = buildTable('Disparos', disparos, data.mecanicoYAparejoDeProduccion)
  const volumenTable = buildTable('Capacidad', volumen, data.mecanicoYAparejoDeProduccion)

  slide.addTable(terminacionTable, { x: 0.5, y: 1.0, ...tableOptions } )
  slide.addTable(linerTable, { x: 4.0, y: 1.0, ...tableOptions } )
  slide.addTable(disparosTable, { x: 4.0, y: 2.5, ...tableOptions } )
  slide.addTable(volumenTable, { x: 7.5, y: 1.0, ...tableOptions } )

  if (image) {
    const base64 = await getBase64FromURL(image.imgURL)
    console.log('base', base64)
  }
  return slide
}

async function buildSistemasArtificialesDeProduccion(pptx, token, id, image) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  slide.addText('Información de Sistemas Artificiales de Producción', { placeholder: 'slide_title' })
  const wellData = await getData('getWell', token, id)
  console.log('wellData', wellData)
  const tipoSistemaArtificial = wellData.sistemasArtificialesDeProduccion.tipoDeSistemo
  console.log('tipo siste', tipoSistemaArtificial)
  const { sistemasArtificialesDeProduccion } = maps
  let url
  let map
  switch (tipoSistemaArtificial) {
    case 'none':
      return slide
    case 'emboloViajero':
      url = 'getEmboloViajero'
      break;
    case 'bombeoNeumatico':
      url = 'getBombeoNeumatico'
      break;
    case 'bombeoHidraulico':
      url = 'getBombeoHidraulico'
      break;
    case 'bombeoCavidadesProgresivas':
      url = 'getBombeoCavidades'
      break;
    case 'bombeoElectrocentrifugo':
      url = 'getBombeoElectrocentrifugo'
      break;
    case 'bombeoMecanico':
      url = 'getBombeoMecanico'
      break;
    default:
      break;
  }
  const data = await getData(url, token, id)
  console.log('data', data)
  const sistemaTable = buildTable('test', sistemasArtificialesDeProduccion[tipoSistemaArtificial], data.sistemasArtificialesDeProduccion)
  slide.addTable(sistemaTable, { x: 0.5, y: 1.0, ...tableOptions } )
  return slide
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
  const sections = await Promise.all([
    buildFichaTecnicaDelCampo(pptx, token, jobID),
    buildFichaTecnicaDelPozo(pptx, token, jobID),
    buildEstadoMecanicoYAparejo(pptx, token, jobID, images.mecanicoYAparejo),
    buildSistemasArtificialesDeProduccion(pptx, token, jobID)
  ])
  pptx.save()
}
