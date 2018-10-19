///////////////////////
// Library Variables //
///////////////////////
import objectPath from 'object-path'

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

export function handleImagesFromServer(images, state) {
  const shallowStateCopy = {...state}
  const imagesKeys = Object.keys(images)
  if (imagesKeys.length > 0) {
    imagesKeys.forEach(parent => {
      if (parent === 'pruebasDeLaboratorio') {
        images[parent].forEach((elem, index) => {
          const { imgURL, imgName, imgSource } = elem
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgURL`, imgURL)
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgName`, imgName)
          objectPath.set(shallowStateCopy, `pruebasDeLaboratorio.pruebasDeLaboratorioData.${index}.imgSource`, imgSource)
        })
      } else {
        const { imgURL, imgName, imgSource } = images[parent]
        objectPath.set(shallowStateCopy, `${parent}.imgURL`, imgURL)
        objectPath.set(shallowStateCopy, `${parent}.imgName`, imgName)
        objectPath.set(shallowStateCopy, `${parent}.imgSource`, imgSource)
      }
    })
  }
  console.log('shallow state copy', shallowStateCopy)
  return shallowStateCopy
}
