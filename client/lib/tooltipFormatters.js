import ReactHighcharts from 'react-highcharts'
const { numberFormat } = ReactHighcharts.Highcharts

export function formatAverageDeviation() {
  return `${this.x}
  <br><b>Desviación</b>: ${numberFormat(this.y, 2)} %`
}

export function formatGeneralBarChart() {
  return `${this.x}
  <br>${numberFormat(this.y, 2)}`
}

export function formatScatter() {
  return `${this.series.userOptions.name}
  <br><b>Real.</b>: ${this.y}
  <br><b>Est.</b>: ${this.x}`
}

export function formatPiePercent() {
  return `${numberFormat(this.percentage)} %`
}



// function formatter() {
//   let retVal = `<small>${shortMonthDate(this.x)}</small><br><br>`
//   retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'

//   for (let i = 0; i < this.points.length; i += 1) {
//     const { point } = this.points[i]
//     const { unit } = point.series.userOptions ? point.series.userOptions : ''
//     retVal += `<div class="tooltip-line">${point.series.name}:
//             <strong>${shortenNum(point.y, 2, unit)}</strong> </div> <br>`
//   }
//   return retVal
// }