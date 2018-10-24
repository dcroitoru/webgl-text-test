import metrics from './assets/OpenSans-Regular.json'
import { create0123RectCorrds } from './geometry.js'
import { unitSizePx } from './context.js'

export const getCharMetric = (char) => {
  const [ width, height, bearingX, bearingY, horiAdvance, posX, posY ] = metrics.chars[char]
  return { width, height, bearingX, bearingY, horiAdvance, posX, posY }
}

export const createTextMeasurements = (text, scale, size = 24) => {
  const _scale = scale * size / metrics.size
  const arrChars = text.split('')
  const arrCharMetrics = arrChars.map((char) => metrics.chars[char])
  let textLength = 0
  let textIntervals = []
  let advance
  arrCharMetrics.forEach((metric) => {
    advance = metric[4] * _scale
    textIntervals.push([ textLength, textLength + advance ])
    textLength += advance
  })

  return {
    textLength,
    textIntervals
  }
}

export const createGlyphTextureElements = (char) => {
  const charMetric = getCharMetric(char)
  const { buffer, texwidth, texheight } = metrics
  if (!charMetric) return
  let ret = []
  const { width, height, posX, posY } = charMetric
  if (width && height) {
    const w = width + 2 * buffer
    const h = height + 2 * buffer
    ret = create0123RectCorrds(posX / texwidth, posY / texheight, (posX + w) / texwidth, (posY + h) / texheight)
  }

  return ret
}

export const createGlyphVertexElements = (char, charSize = 24) => {
  const charMetric = getCharMetric(char)
  const { buffer, size } = metrics
  const scale = charSize / size || 1
  const unitScale = 1 / unitSizePx * scale

  if (!charMetric) return
  let ret = []
  const { width, height, bearingX, bearingY } = charMetric
  if (width && height) {
    const w = width + 2 * buffer
    const h = height + 2 * buffer
    const left = (bearingX - buffer - w / 2) * unitScale
    const right = (bearingX - buffer + w / 2) * unitScale
    const top = -bearingY * unitScale
    const bottom = (h - bearingY) * unitScale

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
