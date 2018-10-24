import { drawGlyph, createGlyphTextureElements, createGlyphVertexElements } from './text-util'
import { texturePolygonFlat2d, polygonFlat2d, translateFlat2d, rotateFlat2d, scaleFlat2d } from './geometry'
import { unitSizePx } from './context'
import metrics from './assets/OpenSans-Regular.json'
import { tesselate } from './tesselate-line'

// Type Texture
// {
//   textureElements: Array,
//   vertexElements: Array
// }
export const createTextVaoData = (text, size) => {
  const arrChr = text.split('')
  let vertexElements = []
  let textureElements = []

  // let pen = { x: 0, y: 0 }
  // arrChr.map((chr) => drawGlyph(chr, pen, size, vertexElements, textureElements))

  return { textureElements, vertexElements }
}

export const createComplexPolygonVaoData = (data) => {
  const vertexElements = []
  const textureElements = []
  data.map(({ t, r, s }) => {
    vertexElements.push(...translateFlat2d(rotateFlat2d(scaleFlat2d(polygonFlat2d, s), r), t))
    textureElements.push(...texturePolygonFlat2d)
  })

  return { textureElements, vertexElements }
}

export const createGlyphsVaoData = (word, anchors, normals) => {
  let vertexElements = []
  let textureElements = []

  // let pen = { x: 0, y: 0 }
  // drawGlyph(char, pen, size, vertexElements, textureElements)
  const chars = word.split('')
  let advance = 0
  chars.map((char, index) => {
    const anchor = anchors[index]
    const normal = normals[index]
    if (!anchor || !normal) return
    const angle = Math.atan2(normal[1], normal[0])
    textureElements.push(...createGlyphTextureElements(char))
    vertexElements.push(...translateFlat2d(rotateFlat2d(createGlyphVertexElements(char), angle), anchor))
    advance += metrics.chars[char][4] / unitSizePx
  })

  // textureElements = [ ...createGlyphTextureElements('A'), ...createGlyphTextureElements('a') ]
  // vertexElements = [
  //   ...translateFlat2d(rotateFlat2d(createGlyphVertexElements('A'), -0.7), [ 0, 0 ]),
  //   ...translateFlat2d(rotateFlat2d(createGlyphVertexElements('a'), 0.4), [ 15 / unitSizePx, 0 ])
  // ]
  // texturePolygonFlat2d

  return { textureElements, vertexElements }
}

export const createPolylineVaoData = (polyline) => {
  const { vertices, normals, indices } = tesselate(polyline)
  return {
    vertexElements: vertices,
    normalElements: normals,
    indexElements: indices
  }
}
