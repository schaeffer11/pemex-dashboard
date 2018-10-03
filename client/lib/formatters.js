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

export const sortLabels = (a, b) => {
  if(a.label < b.label) return -1;
  if(a.label > b.label) return 1;
  return 0;
}


/////////////////////////
// Exporting Functions //
/////////////////////////
