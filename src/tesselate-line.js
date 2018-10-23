import flatten from '@flatten/array'
import { vec2 } from 'gl-matrix'

const mag = ([ x, y ]) => Math.sqrt(x * x + y * y)
const unit = (v) => vec2.scale([], v, 1 / mag(v))
const perp = ([ x, y ]) => [ -y, x ]
const extrude = ([ x, y ]) => [ -x, -y ]

const getIndices = (startWith) => [ 0, 1, 2, 2, 1, 3 ].map((xx) => xx + startWith)

export const tesselate = (line) => {
  // console.log('should tesselate', line)
  let vertices = []
  let normals = []
  let indices = []
  let currentVertex, nextVertex
  let i, j, idx

  const getVertex = (pos) => [ line[pos], line[pos + 1] ]

  for (i = 0; i < line.length - 2; i += 2) {
    // idx = i * 4
    j = i + 2
    currentVertex = getVertex(i)
    nextVertex = getVertex(j)

    let sub = vec2.sub([], currentVertex, nextVertex)
    let m = mag(sub)
    let u = unit(sub)
    let p = perp(u)
    let ep = vec2.negate([], p)

    idx = vertices.length
    vertices.push(currentVertex, currentVertex, nextVertex, nextVertex)
    normals.push(p, ep, p, ep)
    indices.push(getIndices(idx))
  }

  return {
    vertices: flatten(vertices),
    normals: flatten(normals),
    indices: flatten(indices)
  }
}
