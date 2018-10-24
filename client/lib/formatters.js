///////////////////////
// Library Variables //
///////////////////////
import objectPath from 'object-path'
import { round, dealWithNaN } from './helpers'

const si = [
  { value: 1E12, symbol: 'T' },
  { value: 1E9, symbol: 'B' },
  { value: 1E6, symbol: 'MM' },
  { value: 1E3, symbol: 'k' },
]

const siWithUnit = [
  { value: 1E12, symbol: 'T' },
  { value: 1E9, symbol: 'B' },
  { value: 1E6, symbol: 'MM' },
  { value: 1E3, symbol: 'M' },
]

export const sortLabels = (a, b) => {
  if(a.label < b.label) return -1;
  if(a.label > b.label) return 1;
  return 0;
}

export function handleImagesFromServer(images, state) {
  const shallowStateCopy = {...state}
  const imagesKeys = Object.keys(images)
  if (imagesKeys.length > 0) {
    imagesKeys.forEach(parent => {
      if (parent === 'pruebasDeLaboratorio') {
        images[parent].forEach((elem, index) => {
          const { imgURL, imgName, imgSource } = elem
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgURL`, imgURL)
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgName`, imgName)
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgSource`, imgSource)
        })
      } else {
        const { imgURL, imgName, imgSource } = images[parent]
        objectPath.set(shallowStateCopy, `${parent}.imgURL`, imgURL)
        objectPath.set(shallowStateCopy, `${parent}.imgName`, imgName)
        objectPath.set(shallowStateCopy, `${parent}.imgSource`, imgSource)
      }
    })
  }
  console.log('shallow state copy', shallowStateCopy)
  return shallowStateCopy
}

export const calculateValuesGeneralCedula = (data) => {
  return data.map((row, i) => {
    let { sistema, relN2Liq, gastoLiqudo, volLiquid } = row
    if (sistema === 'desplazamientoN2' || sistema === 'pre-colchon') {
      row.volLiquid = 0
      row.gastoLiqudo = 0
      row.relN2Liq = 0
      row.tiempo = dealWithNaN(round(row.volN2 / row.gastoN2))
      // if (row.tiempo === Infinity || isNaN(row.tiempo)) {
      //   row.tiempo = 0
      // }
    } else {
      row.gastoN2 = dealWithNaN(round(relN2Liq / 6.291 * gastoLiqudo) || 0)
      row.volN2 = dealWithNaN(round((6.291 * volLiquid / gastoLiqudo) * row.gastoN2) || 0)
      row.tiempo = dealWithNaN(round((volLiquid * 6.291) / gastoLiqudo) || 0)
    }
    const prev = data[i - 1]
    row.volLiquidoAcum = prev ? dealWithNaN(round(parseFloat(prev.volLiquidoAcum) + parseFloat(row.volLiquid))) : row.volLiquid
    row.volN2Acum = prev ? dealWithNaN(round(parseFloat(prev.volN2Acum) + parseFloat(row.volN2))) : row.volN2
    row.etapa = row.index + 1
    return row
  })
}

export const calculateValuesApuntaladoCedula = (data) => {
  return data.map((row, i) => {
    let { apuntalanteAcumulado, volLechada, gastoSuperficie, volEspumaFondo, concentracionApuntalanteFondo } = row
    const prev = data[i - 1]
    const apuntalante = parseFloat(volEspumaFondo) * parseFloat(concentracionApuntalanteFondo)
    if (!apuntalanteAcumulado || i === 0) {
      row.apuntalanteAcumulado = apuntalante
    } else if (prev) {
      row.apuntalanteAcumulado = dealWithNaN(round(parseFloat(prev.apuntalanteAcumulado) + apuntalante))
    } else {
      row.apuntalanteAcumulado = apuntalanteAcumulado
    }
    if (isNaN(row.apuntalanteAcumulado)) {
      row.apuntalanteAcumulado = 0
    }
    if (row.sistema !== 'shut-in') {
      row.tiempo = dealWithNaN(round(parseFloat(volLechada) / parseFloat(gastoSuperficie)))
    }
    row.etapa = row.index + 1
    return row
  })
}

export const calculateValuesTermicaCedula = (data) => {
  return data.map((row, i) => {
    row.etapa = row.index + 1
    return row
  })
}
