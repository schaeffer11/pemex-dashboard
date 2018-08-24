///////////////////////
// Library Variables //
///////////////////////
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


/////////////////////////
// Exporting Functions //
/////////////////////////
export const shortenNum = (num, digits, unit = '') => {
  if (!num || typeof num !== 'number') {
    return num
  }

  if (num < 0.001) {
    return 0
  }
