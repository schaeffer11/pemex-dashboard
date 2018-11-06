import { getData, buildSimpleTable, buildTable, tableOptions } from './index'
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
  slide.addTable(linerTable, { x: 4.0, y: 1.0, ...tableOptions })
  slide.addTable(disparosTable, { x: 4.0, y: 2.5, ...tableOptions })
  slide.addTable(volumenTable, { x: 7.5, y: 1.0, ...tableOptions })

  if (image) {
    const base64 = await getBase64FromURL(image.imgURL)
    slide.addImage({
      data: `image/png;base64,${base64}`, x: 7.5, y: 3, w:4, h:3,
      sizing: { type: 'contain', h: 3.5, w: 3.5 }
    })
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
  let { mudLossData } = mud.evaluacionPetrofisica
  const layerTable = buildTable('Propiedades promedio', maps.evaluacionPetrofisica.layerData, layerData)
  const mudLossTable = buildTable('Zona de pérdida', maps.evaluacionPetrofisica.mudLossData, mudLossData)
  if (image) {
    const base64 = await getBase64FromURL(image.imgURL)
    slide.addImage({
      data: `image/png;base64,${base64}`, x: 7.5, y: 3, w:4, h:3,
      sizing: { type: 'contain', h: 3.5, w: 3.5 }
    })
  }

  const tableOptionsCopy = {...tableOptions}
  delete tableOptionsCopy.colW
  slide.addTable(layerTable, { x: 0.5, y: 1.0, ...tableOptionsCopy })
  slide.addTable(mudLossTable, { x: 0.5, y: 5.0, ...tableOptionsCopy })
}
