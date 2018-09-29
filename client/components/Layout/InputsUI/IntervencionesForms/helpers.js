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