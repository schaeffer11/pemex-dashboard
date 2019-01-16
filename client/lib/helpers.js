import { ignoreNegative999 } from './formatters'
export const round = (num, exp = 2) => Math.round(num * Math.pow(10, exp)) / Math.pow(10, exp)

export const calculateVolumes = (data, fluid, sistemas = []) => {
  return data.filter(elem => sistemas.includes(elem.sistema) || !sistemas.length)
    .reduce((accumulator, currentValue) => {
      if (currentValue[fluid]) {
        const val = ignoreNegative999(currentValue[fluid])
        return round(accumulator + parseFloat(val))
      }
      return accumulator
    }, 0)
}

export const getSistemaOptions = () => [
  { value: 'reactivo', label: 'Reactivo' },
  { value: 'no-reactivo', label: 'No Reactivo' },
  { value: 'pre-colchon', label: 'Pre-colchón' },
  { value: 'divergente', label: 'Divergente' },
  { value: 'desplazamiento', label: 'Desplazamiento Liquido' },
  { value: 'desplazamientoN2', label: 'Desplazamiento N2' },
  { value: 'gelFractura', label: 'Gel Fractura' },
  { value: 'gelLineal', label: 'Gel Lineal' },
  { value: 'modificadorPermeabilidad', label: 'Modificador de Permeabilidad' },
  { value: 'espaciador', label: 'Espaciador' },
]

export const getSistemaApuntaladoOptions = () => [
  { value: 'pre-pad', label: 'Pre-Pad' },
  { value: 'shut-in', label: 'Shut-In' },
  { value: 'pad', label: 'Pad' },
  { value: 'pad-proppant', label: 'Pad + Proppant' },
  { value: 'flush', label: 'Flush' },
  { value: 'gelLineal', label: 'Gel Lineal' },
]

export const getDisabledColumnForGeneralCedula = (sistema, id) => {
  let isDisabled = false
  if (sistema === 'desplazamientoN2' || sistema === 'pre-colchon') {
    isDisabled = id === 'gastoLiqudo' || id === 'volLiquid' || id === 'relN2Liq'
    // disabled.push('gastoLiqudo', 'volLiquid', 'relN2Liq')
  } else {
    isDisabled = id === 'gastoN2' || id === 'volN2'
    // disabled.push('gastoN2', 'volN2')
  }
  return isDisabled
}

export const getDisabledColumnForApuntaladoCeluda = (sistema, id) => sistema !== 'shut-in' && id === 'tiempo'

export const dealWithNaN = (calc) => {
  if (isNaN(calc) || calc === Infinity || calc === null) {
    return 0
  }
  return calc
}

export const checkForDifferencesInObjects = (arr, obj1, obj2) => {
  for (let elem of arr) {
    if (obj1[elem] !== obj2[elem]) {
      return true
    }
  }
  return false
}