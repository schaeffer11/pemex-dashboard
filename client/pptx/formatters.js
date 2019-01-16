import { dealWithNaN } from '../lib/helpers';

const specialTermDictionary = () => ({
  'estimulacion': 'Tratamiento de estimulación',
  'acido': 'Fracturamiento ácido',
  'apuntalado': 'Fracturamiento apuntalado',
  'termico': 'Tratamiento térmico',
  'intervencionProgramada': 'Si',
  'waterAnalysisBool': 'Si',
  'none': 'Ninguno',
  'emboloViajero': 'Émbolo viajero',
  'bombeoNeumatico': 'Bombeo neumático',
  'bombeoHidraulico': 'Bombeo hidráulico',
  'bombeoCavidadesProgresivas': 'Bombeo cavidades progresivas',
  'bombeoElectrocentrifugo': 'Bombeo electrocentrífugo',
  'bombeoMecanico': 'Bombeo mecánico',
  'reactivo': 'Reactivo',
  'pre-colchon': 'Pre-colchón',
  'no-reactivo': 'No reactivo',
  'divergente': 'Divergente',
  'desplazamiento': 'Desplazamiento Líquido',
  'desplazamientoN2': 'Desplazamiento N2',
  'limpieza': 'Limpieza',
  'matricial': 'Matricial',
  'pruebasDeSolubilidad': 'Pruebas de solubilidad',
  'caracterizacionFisico': 'Caracterización fisico-química de fluidos',
  'pruebasDeCompatibilidad': 'Pruebas de compatibilidad por emulsión',
  'pruebasParaApuntalante': 'Pruebas para apuntalante',
  'pruebasGelDeFractura': 'Pruebas gel de fractura',
  'pruebasDeGrabado': 'Pruebas de grabado',
  'cromatografiaDelGas': 'Cromatografía del gas',
  'pruebaDeDureza': 'Prueba de dureza',
  'determinacionDeLaCalidad': 'Determinación de la calidad método de los cloruros',
  'curvaDeViscosidad': 'Curva de viscosidad',
  'nucleo': 'Núcleo',
  'recortesDeCanal': 'Recortes de canal',
  'incrustacionOrganica': 'Incrustación orgánica',
  'incrustacionInorganica': 'Incrustación inorgánica',
  'obscura': 'Obscura',
  'definida': 'Definida',
  'trazasSedimentos': 'Trazas de sedimentos',
  'moderadaSedimentos': 'Moderada presencia de sedimentos',
  'AbundanteSedimentos': 'Abundante presencia de sedimentos',
  'noCompatible': 'No compatible',
  'compatible': 'Compatible',
  'pre-pad': 'Pre-pad',
  'shut-in': 'Shut-in',
  'pad': 'Pad',
  'pad-proppant': 'Pad + Proppant',
  'flush': 'Flush',
  'wasCancelled': 'Si',
  'paleoceno': 'Paleoceno',
  'eoceno': 'Eoceno'
})

function dateReformat(str) {
  const dateArr = str.split('-')
  const year = dateArr[0]
  const month = dateArr[1]
  const day = dateArr[2].slice(0, 2)
  return `${day}/${month}/${year}`
}

export function formatText(str) {
  if (str === undefined || str === null) {
    return ''
  }
  if(!isNaN(str)) {
    return dealWithNaN(str)
  }
  // This awful regex unfortunately works better than moment's isValid date method
  const isValidDate = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/.test(str)
  if (isValidDate) {
    return dateReformat(str)
  }
  // if word is in special dictionary return that
  const wordMap = specialTermDictionary()
  if (wordMap[str]) {
    return wordMap[str]
  }
  // if first letter is capitalized return string
  if (/^[A-Z]/.test(str)) {
    return str
  }
  // Otherwise return string with first letter capitalized
  return str.replace(/^\w/, c => c.toUpperCase())
}
