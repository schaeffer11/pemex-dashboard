///////////////////////
// Library Variables //
///////////////////////
import objectPath from 'object-path'
import { round, dealWithNaN } from './helpers'
import React from 'react'

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

export const selectSimpleValue = (val, options) => {
  if (val === null) {
    return null
  }
  const simpleValue = options ? options.find(i=>i.value === val) : null
  return simpleValue
}

export const handleSelectValue = (selection) => {
  let valueToSet
  if (selection === null) {
    valueToSet = null
  } else {
    valueToSet = selection.value
  }
  return valueToSet
}

export const convertLowDate = (date) => {
  const year = Math.floor((date - 1) / 12)
  let month = date % 12
  month === 0 ? month = 12 : null
  return `${year}-${month}-01`
}

export const convertHighDate = (date) => {
  const year = Math.floor((date - 1) / 12)
  let month = date % 12
  month === 0 ? month = 12 : null
  return `${year}-${month}-31`
}

export function handleImagesFromServer(images, state) {
  const shallowStateCopy = {...state}
  const imagesKeys = Object.keys(images)
  if (imagesKeys.length > 0) {
    imagesKeys.forEach(parent => {
      if (parent === 'pruebasDeLaboratorio') {
        images[parent].forEach((elem, index) => {
          const { imgURL, imgName, imgSource, labID } = elem
          for (let lab of shallowStateCopy.pruebasDeLaboratorio.pruebasDeLaboratorioData) {
            if (lab.labID.toString() === labID) {
              lab.imgURL = imgURL
              lab.imgName = imgName
              lab.imgSource = imgSource
            }
          }
        })
      } else {
        const { imgURL, imgName, imgSource } = images[parent]
        objectPath.set(shallowStateCopy, `${parent}.imgURL`, imgURL)
        objectPath.set(shallowStateCopy, `${parent}.imgName`, imgName)
        objectPath.set(shallowStateCopy, `${parent}.imgSource`, imgSource)
      }
    })
  }
  return shallowStateCopy
}

export const ignoreNegative999 = (val) => val === -999 || val === '-999' ? 0 : val

export const calculateValuesGeneralCedula = (data) => {
  return data.map((row, i) => {
    let { sistema, relN2Liq, gastoLiqudo, volLiquid } = row
    relN2Liq = ignoreNegative999(relN2Liq)
    gastoLiqudo = ignoreNegative999(gastoLiqudo)
    volLiquid = ignoreNegative999(volLiquid)
    row.gastoN2 = ignoreNegative999(row.gastoN2)
    row.volN2 = ignoreNegative999(row.volN2)
    if (sistema === 'desplazamientoN2' || sistema === 'pre-colchon') {
      row.volLiquid = 0
      row.gastoLiqudo = 0
      row.relN2Liq = 0
      row.tiempo = dealWithNaN(round(row.volN2 / row.gastoN2))
    } else {
      row.gastoN2 = dealWithNaN(round(relN2Liq / 6.291 * gastoLiqudo) || 0)
      row.volN2 = dealWithNaN(round((6.291 * volLiquid / gastoLiqudo) * row.gastoN2) || 0)
      row.tiempo = dealWithNaN(round((volLiquid * 6.291) / gastoLiqudo) || 0)
    }
    const prev = data[i - 1]
    row.volLiquidoAcum = prev ? dealWithNaN(round(parseFloat(prev.volLiquidoAcum) + parseFloat(volLiquid))) : volLiquid
    row.volN2Acum = prev ? dealWithNaN(round(parseFloat(prev.volN2Acum) + parseFloat(row.volN2))) : row.volN2
    row.etapa = row.index + 1
    if (isNaN(row.etapa)) {
      row.etapa = 1
    }
    return row
  })
}

export const calculateValuesApuntaladoCedula = (data) => {
  return data.map((row, i) => {
    let { volLechada, gastoSuperficie, volEspumaFondo, concentracionApuntalanteFondo } = row
    volLechada = ignoreNegative999(volLechada)
    gastoSuperficie = ignoreNegative999(gastoSuperficie)
    volEspumaFondo = ignoreNegative999(volEspumaFondo)
    concentracionApuntalanteFondo = ignoreNegative999(concentracionApuntalanteFondo)
    const prev = data[i - 1]
    const apuntalante = parseFloat(volEspumaFondo) * parseFloat(concentracionApuntalanteFondo)
    if (i === 0) {
      row.apuntalanteAcumulado = apuntalante
    } else {
      row.apuntalanteAcumulado = dealWithNaN(round(parseFloat(prev.apuntalanteAcumulado) + apuntalante))
    }
    if (isNaN(row.apuntalanteAcumulado)) {
      row.apuntalanteAcumulado = 0
    }
    if (row.sistema !== 'shut-in') {
      row.tiempo = dealWithNaN(round(parseFloat(volLechada) / parseFloat(gastoSuperficie)))
    }
    row.etapa = row.index + 1
    if (isNaN(row.etapa)) {
      row.etapa = 1
    }
    return row
  })
}

export const calculateValuesTermicaCedula = (data) => {
  return data.map((row, i) => {
    row.etapa = row.index + 1
    if (isNaN(row.etapa)) {
      row.etapa = 1
    }
    return row
  })
}

export const numWithCommas = (x) => {
  if (x === 0) {
    return 0
  }
  if (!x) {
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//CELL TYPES 
export const Currency = (row) => (<span>{row.value ? '$' + numWithCommas(row.value) : '-'}</span>)
export const Percent = (row) => { 
  return (
    <span>{row.value ? (row.value.toFixed(1)) + '%': '-'}</span>
  )
}

export const Integer = (row) => { 
  return (
    <span>{row.value ? numWithCommas(row.value.toFixed(0)) : 0}</span>
  )
}

export const CategoryDist = (row) => (
  <div style={{width: '100%', height: '100%', borderRadius: '2px'}}>
    <div style={{width: `${row.original.percAcido}%`, height: '25px', verticalAlign: 'top', display: 'inline-block', position: 'relative', backgroundColor: '#56B3D8', top: '5%', transition: 'all .5s ease-out'}}></div>
    <div style={{width: `${row.original.percApuntalado}%`, height: '25px', verticalAlign: 'top', display: 'inline-block', position: 'relative', backgroundColor: '#C3E4CC', top: '5%', transition: 'all .5s ease-out'}}></div>
    <div style={{width: `${row.original.percEstimulacionLimpieza}%`, height: '25px', verticalAlign: 'top', display: 'inline-block', position: 'relative', backgroundColor: '#E4CE5E', top: '5%', transition: 'all .5s ease-out'}}></div>
    <div style={{width: `${row.original.percEstimulacionMatricial}%`, height: '25px', verticalAlign: 'top', display: 'inline-block', position: 'relative', backgroundColor: '#C26A1B', top: '5%', transition: 'all .5s ease-out'}}></div>
    <div style={{width: `${row.original.percTermico}%`, height: '25px', verticalAlign: 'top', display: 'inline-block', position: 'relative', backgroundColor: '#5D2311', top: '5%', transition: 'all .5s ease-out'}}></div>
  </div>
  )

export const TrafficLight = (row) => {
  let color = row.original.light > 1 ? 'green' : row.original.light > .8 ? 'yellow' : 'red'
  return (
  <div style={{width: '100%', height: '100%', borderRadius: '2px'}}>
    <div style={{width: `30px`, height: '30px', borderRadius: '30px', left: 'calc(50% - 15px)', display: 'inline-block', position: 'relative', backgroundColor: color}}></div>
  
  </div>
  )
}

export const RenameInterventionTypes = (series) => {
  series = series.map(i => {
    if (i.name) {
      if (i.name === 'apuntalado') { 
        i.name = 'Frac. Apuntalado'
       }
      if (i.name === 'acido') {
        i.name = 'Frac. Ácido'
       }
      if (i.name === 'estimulacionLimpieza') { 
        i.name = 'Estimulación Limpiezas'
       }
      if (i.name === 'estimulacionMatricial') { 
        i.name = 'Estimulación Matricial'
       }
      if (i.name === 'termico') { 
        i.name = 'Estimulación Térmica'
       }  
    }
    else {
      if (i === 'apuntalado') { 
        i = 'Frac. Apuntalado'
       }
      if (i === 'acido') {
        i = 'Frac. Ácido'
       }
      if (i === 'estimulacionLimpieza') { 
        i = 'Estimulación Limpiezas'
       }
      if (i === 'estimulacionMatricial') { 
        i = 'Estimulación Matricial'
       }
      if (i === 'termico') { 
        i = 'Estimulación Térmica'
       }  
    }

     return i
  })
  return series
}
