export const round = (num, exp = 2) => Math.round(num * Math.pow(10, exp)) / Math.pow(10, exp)

export const calculateVolumes = (data, fluid, sistemas = []) => {
  return data.filter(elem => sistemas.includes(elem.sistema) || !sistemas.length)
    .reduce((accumulator, currentValue) => {
      if (currentValue[fluid]) {
        return round(accumulator + parseFloat(currentValue[fluid]))
      }
      return accumulator
    }, 0)
}

export const getJustificacionesOptions = () => {
  const options = [
    'Limitaciones contractuales',
    'Disponibilidad de contratos',
    'Falta de vehículos de transporte',
    'Oportunidad de ejecución',
    'Disponibilidad presupuestal',
    'Fallas en los equipos',
    'Disponibilidad de equipos y materiales',
    'Disponibilidad de equipos',
    'Condiciones climatológicas',
    'Equipo y personal de compañía limitado',
    'Asignación de compañías de disparos (Permisos de SEDENA)',
    'Opera con horario restringido por inseguridad en el área',
    'Cierre de accesos',
    'Disponibilidad de personal',
    'Los pozos están zona urbana',
    'Conflictos sociales ',
    'Retraso de atención en el apoyo del equipo de contraincendios',
    'Falta de personal especializado para el diseño y seguimiento de estimulaciones',
    'Falta de personal de supervisión de CIP',
    'Limitación en la red de BN por baja presión y volumen',
    'Problemas generados por sindicatos locales',
    'Limitación contractuales disponibles en productos químicos',
    'Afectación social',
    'Inseguridad',
    'Suministro de agua',
    'Limitaciones por SAP',
    'Limitaciones en Batería (para recepción de fluidos de tratamiento)',
    'Falta de atención oportuna para tener libre acceso a localizaciones, mantenimiento a caminos, instalación y/o retiro de bajantes.',
    'Falta de permisos',
    'Limitaciones contractuales (Pase en las válvulas)',
    'Disponibilidad de equipos (Xileno, N2, TF,      equipos de separación, unidades de alta)',
    'Afectaciones',
    'Capacidad de Ejecución (Disponibilidad de N2, TF, Unidades de Bombeo, etc.)',
    'Presupuesto',
    'Cambios de programa (Pozos emergentes)',
    'Afectaciones, sindicatos con altas pretensiones monetarias, propietarios, actos vandálicos y falta de atención oportuna para tener libre acceso a localizaciones',
  ]
  return options.map(option => ({
    value: option,
    label: option,
  }))
}

export const getSistemaOptions = () => [
  { value: 'reactivo', label: 'Reactivo' },
  { value: 'no-reactivo', label: 'No Reactivo' },
  { value: 'pre-colchon', label: 'Pre-colchón' },
  { value: 'divergente', label: 'Divergente' },
  { value: 'desplazamiento', label: 'Desplazamiento Liquido' },
  { value: 'desplazamientoN2', label: 'Desplazamiento N2' },
]

export const getSistemaApuntaladoOptions = () => [
  { value: 'pre-pad', label: 'Pre-Pad' },
  { value: 'shut-in', label: 'Shut-In' },
  { value: 'pad', label: 'Pad' },
  { value: 'pad-proppant', label: 'Pad + Proppant' },
  { value: 'flush', label: 'Flush' },
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

export const dealWithNaN =(calc) => {
  if (isNaN(calc) || calc === Infinity) {
    return 0
  }
  return calc
}
