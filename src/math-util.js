import flatten from '@flatten/array'
import { vec2 } from 'gl-matrix'

const mag = ([ x, y ]) => Math.sqrt(x * x + y * y)
const unit = (v) => vec2.scale([], v, 1 / mag(v))
const perp = ([ x, y ]) => [ -y, x ]
const extrude = ([ x, y ]) => [ -x, -y ]

const sum = (a, b) => a + b
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
const lenab = (ab) => Math.hypot(ab[2] - ab[0], ab[3] - ab[1])

const numLenThatFitsTotal = (total, length, gap) => {
  const f = (l, n) => (l + length > total ? n : f(l + length + gap, n + 1))
  return f(0, 0)
}

const createNormal = ([ x0, y0, x1, y1 ]) => {
  const currentVertex = [ x0, y0 ]
  const nextVertex = [ x1, y1 ]
  const sub = vec2.sub([], currentVertex, nextVertex)
  const u = unit(sub)
  const eu = vec2.negate([], u)
  return eu
}

const createNormals = (segments) => segments.map(createNormal)

const createSegments2D = (polyline) => {
  let segments = []
  for (let i = 0; i < polyline.length - 2; i += 2) {
    segments.push([ polyline[i], polyline[i + 1], polyline[i + 2], polyline[i + 3] ])
  }
  return segments
}

const createIntervals1D = (segments) => {
  let lenSoFar = 0
  return segments.map((segment, index) => {
    let len = lenab(segment)
    let start = lenSoFar
    let end = lenSoFar + len
    lenSoFar = end
    return [ start, end ]
  })
}

const createStopsIn0N = (num, N = 1) => {
  const arr = []
  const unitSize = N / (num - 1)
  for (let i = 0; i < num; i++) {
    arr.push(i * unitSize)
  }
  return arr
}

const createIntervalsFromStops = (stops) => {
  let intervals = []
  for (let i = 0; i < stops.length - 1; i += 1) {
    intervals.push([ stops[i], stops[i + 1] ])
  }
  return intervals
}

const spreadStopsOverInterval = (stops, [ left, right ]) => {
  let dif = right - left
  return stops.map((stop) => stop * dif + left)
}

const findIntervalForStop = (intervals, stop) => {
  let int = null
  let i = 0
  while (!int && i < intervals.length) {
    let [ left, right ] = intervals[i]
    if (left <= stop && stop < right) {
      int = intervals[i]
    }
    i++
  }
  return int
}

const getStopOnInterval = (stop, [ left, right ]) => stop * (right - left) + left
const getNormalizedStopOnInterval = (stop, [ left, right ]) => (stop - left) / (right - left)
const getPointOnSegment = (stop, [ x0, y0, x1, y1 ]) => [ getStopOnInterval(stop, [ x0, x1 ]), getStopOnInterval(stop, [ y0, y1 ]) ]

const createCharAnchors1d = (totalLength, wordLength, fontSize, gapSize, charStops, measuredLength) => {
  const actualWordLength = measuredLength || fontSize * wordLength
  const totalWords = numLenThatFitsTotal(totalLength, actualWordLength, gapSize)
  const wordIntervalSize = fontSize * (wordLength - 1)
  const totalGapSize = totalLength - wordIntervalSize * totalWords
  const gap = totalGapSize / (totalWords + 1)
  const halfGap = gap / 2
  const charStopsInWord = charStops || createStopsIn0N(wordLength)

  const wordsBoundsStops = createStopsIn0N(totalWords + 1, totalLength)
  const wordsBoundsIntervals = createIntervalsFromStops(wordsBoundsStops)
  const wordsWithGapsBoundsIntervals = wordsBoundsIntervals.map(([ left, right ]) => [ left + halfGap, right - halfGap ])
  const anchors = wordsWithGapsBoundsIntervals.map((wordInterval) => spreadStopsOverInterval(charStopsInWord, wordInterval))

  return anchors
}

export const createAnchors2D = (polyline, wordLength, fontSize, gapSize, charStops, measuredLength) => {
  const segments = createSegments2D(polyline)
  const intervals = createIntervals1D(segments)
  const polylineLength = segments.map(lenab).reduce(sum)
  const charAnchors1d = createCharAnchors1d(polylineLength, wordLength, fontSize, gapSize, charStops, measuredLength)
  // const charAnchors1dFlat = flatten(charAnchors1d)
  const g = polylineLength - measuredLength
  const s = g * 1 / 2 / polylineLength
  const e = s + measuredLength

  const charAnchors1dFlat = spreadStopsOverInterval(charStops, [ s, e ])
  // console.log(charAnchors1dFlat)

  const anchors2d = charAnchors1dFlat.map((anchor) => {
    const interval = findIntervalForStop(intervals, anchor)
    const index = intervals.indexOf(interval)
    const segment = segments[index]
    const anchorNormalized = getNormalizedStopOnInterval(anchor, interval)
    const anchor2d = getPointOnSegment(anchorNormalized, segment)
    return anchor2d
  })

  return anchors2d
}

export const createNormals2D = (polyline, wordLength, fontSize, gapSize, charStops, measuredLength) => {
  const segments = createSegments2D(polyline)
  const normals = createNormals(segments)
  const intervals = createIntervals1D(segments)
  const polylineLength = segments.map(lenab).reduce(sum)
  const charAnchors1d = createCharAnchors1d(polylineLength, wordLength, fontSize, gapSize, charStops)
  //const charAnchors1dFlat = flatten(charAnchors1d)
  // const charAnchors1dFlat = spreadStopsOverInterval(charStops, [ 0, measuredLength / polylineLength ])

  const g = polylineLength - measuredLength
  const s = g * 1 / 2 / polylineLength
  const e = s + measuredLength

  const charAnchors1dFlat = spreadStopsOverInterval(charStops, [ s, e ])

  const normals2d = charAnchors1dFlat.map((anchor) => {
    const interval = findIntervalForStop(intervals, anchor)
    const index = intervals.indexOf(interval)
    const normal = normals[index]

    return normal
  })

  return normals2d
}
