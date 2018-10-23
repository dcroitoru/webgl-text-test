// 0 ----- 1
// | - / - |
// 2 ------3
// 0, 1, 2, 1, 3, 2
export const polygonFlat2d = [ -1, 1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1 ]
export const texturePolygonFlat2d = [ 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1 ]
export const translateFlat2d = (poly, [ x, y ]) => {
  let ret = []
  for (let i = 0; i < poly.length; i += 2) {
    ret.push(poly[i] + x, poly[i + 1] + y)
  }
  return ret
}

export const scaleFlat2d = (poly, [ x, y ]) => {
  let ret = []
  for (let i = 0; i < poly.length; i += 2) {
    ret.push(poly[i] * x, poly[i + 1] * y)
  }
  return ret
}

export const rotateFlat2d = (poly, theta) => {
  let ret = []
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  let x, y
  for (let i = 0; i < poly.length; i += 2) {
    x = poly[i]
    y = poly[i + 1]
    ret.push(x * cos - y * sin, y * cos + x * sin)
  }
  return ret
}

export const create0123RectCorrds = (l, t, r, b) => [ l, t, r, t, l, b, r, t, r, b, l, b ]
