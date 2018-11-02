import PptxGenJS from 'pptxgenjs'
import { S_IFBLK } from 'constants';

function buildMasterSlide(slideWidth, slideHeight) {
  const logo = { x: 0.7, y: 0.15, w: 1.5, h: 0.5, path: '/images/pemex-logo-fpo.png' }
  const bottomBar = { x: 0, get y() { return slideHeight - this.h }, w:'100%', h: 0.15, fill:'424242' }
  const topBar = { get x() { return (slideWidth - this.w) / 2 }, y: logo.h + logo.y + 0.1, w: slideWidth * 0.9, h: bottomBar.h / 6, fill: '424242' }
  return {
    title: 'MASTER_SLIDE',
    bkgd: 'e2e2e2',
    objects: [
      { rect: bottomBar },
      { rect: topBar },
      { image: logo },
    ]
  }
}

function addTitle(slide, title) {
  const options = { w: '100%', y: .40, font_size: 24, align: 'center'}
  slide.addText(title, options)
}

function buildFichaTecnicaDelPozo(pptx, wellData) {
  const slide = pptx.addNewSlide('MASTER_SLIDE')
  addTitle(slide, 'Ficha Técnica del Pozo')
  console.log(wellData)
  const datosDePozo = {
    TIPO_DE_POZO: 'tipoDePozo',
  }
  // let rows = []
  // rows.push([
  //   { text: wellData.TIPO_DE_POZO, options: {color:'424242'} },
  //   { text: wellData.SUBDIRECCION_NAME, options:{color:'424242'} }
  // ])

  // slide.addTable( rows, { x:0.5, y:1.0, w:9.0, color:'363636' } );
  var rows = [ wellData[0].TIPO_DE_POZO, wellData[0].SUBDIRECCION_NAME];
  var tabOpts = { x:0.5, y:1.0, w:9.0, fill:'F7F7F7', fontSize:14, color:'363636' };
  slide.addTable( rows, tabOpts );
  var arrObjText = [
    { text:'Red ',   options:{color:'FF0000'} },
    { text:'Green ', options:{color:'00FF00'} },
    { text:'Blue',   options:{color:'0000FF'} }
];
// EX A: Pass an array of text objects to `addText()`
slide.addText( arrObjText, { x:0.5, y:2.75, w:9, h:2, margin:0.1, fill:'232323' } );
}

export function generatePowerPoint(allData) {
  const slideWidth = 13.3
  const slideHeight = 7.5
  const pptx = new PptxGenJS()
  pptx.setBrowser(true)
  pptx.setLayout({ name: 'LAYOUT_WIDE', width: slideWidth, height: slideHeight })
  const masterSlide = buildMasterSlide(slideWidth, slideHeight)
  pptx.defineSlideMaster(masterSlide)
  buildFichaTecnicaDelPozo(pptx, allData.wellData)
  // const slide = pptx.addNewSlide('MASTER_SLIDE')
  // const opts = { x: 1.0, y: 1.0, font_size: 42, color: '00FF00' }
  // slide.addText('Welcome to the Machine', opts)
  pptx.save();
}
