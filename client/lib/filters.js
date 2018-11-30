import { convertHighDate, convertLowDate } from './formatters'

export const getFilters = () => ({
  subdireccion: {
    title: 'Subdirección',
    id: 'SUBDIRECCION_ID',
    name: 'SUBDIRECCION_NAME',
  },
  activo: {
    title: 'Activo',
    id: 'ACTIVO_ID',
    name: 'ACTIVO_NAME',
  },
  field: {
    title: 'Campo',
    id: 'FIELD_FORMACION_ID',
    name: 'FIELD_NAME',
  },
  well: {
    title: 'Pozo',
    id: 'WELL_FORMACION_ID',
    name: 'WELL_NAME',
  },
  formation: {
    title: 'Formación',
    id: 'FORMACION',
    name: 'FORMACION',
  },
  company: {
    title: 'Compañía',
    id: 'COMPANY',
    name: 'COMPANY',
  },
  interventionType: {
    title: 'Intervención',
    id: 'TIPO_DE_INTERVENCIONES',
    name: 'TIPO_DE_INTERVENCIONES',
  },
  terminationType: {
    title: 'Terminación',
    id: 'TIPO_DE_TERMINACION',
    name: 'TIPO_DE_TERMINACION',
  },
})

export async function fetchFilterData(token, globalAnalysis) {
  const query = buildQuery(globalAnalysis)
    const headers = {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
    }
  const url = `/api/filterOptions?${query.join('&')}`

  const data = await fetch(url, { headers }).then(r => r.json())
  return data
}

export function buildFiltersOptions(data) {
  const options = {}
  const filters = getFilters()
  const interventionMap = {
    acido: 'Frac. Ácido',
    apuntalado: 'Frac. Apuntalado',
    estimulacionLimpieza: 'Estimulación Limpieza',
    estimulacionMatricial: 'Estimulación Matricial',
    termico: 'Estimulación Termica',
  }
  data.filter(elem => {
    const key = Object.keys(elem)[0]
    if (key === 'lowDate' || key === 'highDate') {
      return false
    }
    return true
  }).forEach(elem => {
    const key = Object.keys(elem)[0]
    const { id, name } = filters[key]
    options[key] = elem[key].map(i => {
      if(key === 'interventionType') {
        return {
          label: interventionMap[i[name]],
          value: i[id],
        }
      }
      return {
        label: i[name],
        value: i[id],
      }
    })
  })
  return options
}

function buildQuery(globalAnalysis) {
  // let { globalAnalysis } = this.props
  const filters = getFilters()
  const filteredFilters = Object.keys(filters).filter(f => {
    return globalAnalysis[f]
  })

  globalAnalysis.lowDate = convertLowDate(globalAnalysis.lowDate)
  globalAnalysis.highDate = convertHighDate(globalAnalysis.highDate)
  const queries = [...filteredFilters, 'lowDate', 'highDate'].map(f => `${f}=${globalAnalysis[f]}`)
  return queries
}
