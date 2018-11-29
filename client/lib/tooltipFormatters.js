import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
const { numberFormat } = ReactHighcharts.Highcharts

export function formatAverageDeviation() {
  return `${this.x}
  <br>Desviación: <b>${numberFormat(this.y, 2)} %<b>`
}

export function formatGeneralBarChart() {
  return `${this.x}
  <br><b>${numberFormat(this.y, 2)}</b>`
}

export function formatScatter() {
  return `${this.series.userOptions.name}
  <br>Real.: <b>${this.y}</b>
  <br>Est.: <b>${this.x}</b>`
}

export function formatPiePercent() {
  return `${this.point.name}<br/><b>${numberFormat(this.percentage)} %</b>`
}

export function formatBubbleProduction() {
  const date = moment(this.point.x).format('MMM YYYY')
  let retVal = `<small>${date}</small><br><br>`
  retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'
  retVal += `<div class="tooltip-line">Prod. Inc.:
  <strong>${numberFormat(this.point.y, 2)}</strong> </div> <br>`
  retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'
  retVal += `<div class="tooltip-line">Costo:
  <strong>${numberFormat(this.point.z, 0)}</strong> </div> <br>`
  return retVal
}

export function formatBubbleVolume() {
  const date = moment(this.point.x).format('MMM YYYY')
  let retVal = `<small>${date}</small><br><br>`
  retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'
  retVal += `<div class="tooltip-line">Volumen:
  <strong>${numberFormat(this.point.y, 0)}</strong> </div> <br>`
  retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'
  retVal += `<div class="tooltip-line">Costo:
  <strong>${numberFormat(this.point.z, 0)}</strong> </div> <br>`
  return retVal
}



// function formatter() {
//   let retVal = `<small>${shortMonthDate(this.x)}</small><br><br>`
//   retVal += '<div style=height:14px;font-size:12px;line-height:14px;>'

// //   for (let i = 0; i < this.points.length; i += 1) {
// //     const { point } = this.points[i]
// //     const { unit } = point.series.userOptions ? point.series.userOptions : ''
//     retVal += `<div class="tooltip-line">${point.series.name}:
// //             <strong>${shortenNum(point.y, 2, unit)}</strong> </div> <br>`
// //   }
//   return retVal
// }