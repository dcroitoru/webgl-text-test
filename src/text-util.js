import metrics from './assets/OpenSans-Regular.json'
import { create0123RectCorrds } from './geometry.js'
import { unitSizePx } from './context.js'

export const measureText = (text, size) => {
  const arrText = text.split('').map((char) => metrics.chars[char])
  const scale = size / metrics.size
  const advance = arrText.reduce((acc, el) => acc + el[4] * scale, 0)
  return advance
}

export const drawGlyph = (chr, pen, size, vertexElements, textureElements) => {
  const metric = metrics.chars[chr]
  if (!metric) return

  const scale = size / metrics.size
  const factor = 1

  let [ width, height, horiBearingX, horiBearingY, horiAdvance, posX, posY ] = metric

  if (width > 0 && height > 0) {
    width += metrics.buffer * 2
    height += metrics.buffer * 2
    let left = horiBearingX - metrics.buffer
    let right = left + width
    let top = horiBearingY
    let bottom = height - horiBearingY

    // console.log(pen.x + left, pen.x + right)

    // Add a quad (= two triangles) per glyph.
    vertexElements.push(
      factor * (pen.x + left * scale),
      factor * (pen.y - top * scale),
      factor * (pen.x + right * scale),
      factor * (pen.y - top * scale),
      factor * (pen.x + left * scale),
      factor * (pen.y + bottom * scale),
      factor * (pen.x + right * scale),
      factor * (pen.y - top * scale),
      factor * (pen.x + left * scale),
      factor * (pen.y + bottom * scale),
      factor * (pen.x + right * scale),
      factor * (pen.y + bottom * scale)
    )

    textureElements.push(posX, posY, posX + width, posY, posX, posY + height, posX + width, posY, posX, posY + height, posX + width, posY + height)
  }

  // pen.x += Math.ceil(horiAdvance * scale);
  pen.x = pen.x + horiAdvance * scale
}

const createText = (text, size, x, y) => {
  const vertexElements = []
  const textureElements = []

  let pen = { x: x - dimensions.advance / 2, y: canvas.height / 2 }
  for (var i = 0; i < str.length; i++) {
    var chr = str[i]
    drawGlyph(chr, pen, size, vertexElements, textureElements)
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexElements), gl.STATIC_DRAW)
  vertexBuffer.numItems = vertexElements.length / 2

  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureElements), gl.STATIC_DRAW)
  textureBuffer.numItems = textureElements.length / 2
}

export const createGlyphTextureElements = (char) => {
  const charMetric = metrics.chars[char]
  const { buffer, texwidth, texheight } = metrics
  if (!charMetric) return
  let ret = []
  const [ width, height, horiBearingX, horiBearingY, horiAdvance, posX, posY ] = charMetric
  if (width && height) {
    const w = width + 2 * buffer
    const h = height + 2 * buffer
    ret = create0123RectCorrds(posX / texwidth, posY / texheight, (posX + w) / texwidth, (posY + h) / texheight)
  }

  return ret
}

export const createGlyphVertexElements = (char, charSize = 24, pos = [ 0, 0 ], rot = 0) => {
  const charMetric = metrics.chars[char]
  const { buffer, texwidth, texheight, size } = metrics
  const scale = charSize / size || 1
  const unitScale = 1 / unitSizePx * scale

  if (!charMetric) return
  let ret = []
  const [ width, height, bearingX, bearingY, horiAdvance, posX, posY ] = charMetric
  if (width && height) {
    const [ x, y ] = pos
    const w = width + 2 * buffer
    const h = height + 2 * buffer
    const left = (bearingX - buffer) * unitScale
    const right = (bearingX - buffer + w) * unitScale
    const top = -bearingY * unitScale
    const bottom = +(h - bearingY) * unitScale

    ret = create0123RectCorrds(left, top, right, bottom)
  }

  return ret
}

export const createCharStops = (word = '') => {
  const chars = word.split('')
  let len = 0
  let charStops = chars.map((char) => {
    let metric = metrics.chars[char]
    len += metric[4]
    return len
  })
  charStops.splice(0, 0, 0)

  return charStops.map((stop) => stop / len)
}
