export const round = (num, exp = 2) => Math.round(num * Math.pow(10, exp)) / Math.pow(10, exp)

export const calculateVolumes = (data, fluid, sistema = null) => {
  return data.filter(elem => elem.sistema === sistema || sistema === null)
    .reduce((accumulator, currentValue) => {
      if (currentValue[fluid]) {
        return round(accumulator + parseFloat(currentValue[fluid]))
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
]