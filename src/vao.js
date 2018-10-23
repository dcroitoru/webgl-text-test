import { measureText, drawGlyph } from './text-util'
import { polygonFlat2d, translateFlat2d, scaleFlat2d, rotateFlat2d, texturePolygonFlat2d } from './geometry'
import { createTextureVaoInfo } from './shaders/texture'
import { createSdfTextureProgramInfo, createSdfTextureVaoInfo } from './shaders/sdf-texture'

export const createPolygonVaoInfo = (gl, { positionAttributeLocation }, { vertices, indices }) => {
  console.log('should create vao', vertices, indices)

  const positionBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

  return {
    pos: positionBuffer,
    ind: indexBuffer,
    vao: vao,
    len_arr: vertices.length / 2,
    len_elem: indices.length
  }
}

export const createComplexPolygonVaoInfo = (gl, textureProgramInfo, { pos }) => {
  console.log('should create complex polygon vao', pos)
  const [ x, y ] = pos
  const scale = [ 0.5, 1 ]

  const { a_position, a_texcoord } = textureProgramInfo

  const vertexElements = rotateFlat2d(scaleFlat2d(polygonFlat2d, scale), 1.57)
  // const vertexElements = polygonFlat2d
  // [ 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1 ]

  //rotateFlat2d(polygonFlat2d, 1.78)
  const textureElements = [ 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1 ]

  const vertexBuffer = gl.createBuffer()
  const textureBuffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  gl.enableVertexAttribArray(a_position)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexElements), gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)

  gl.enableVertexAttribArray(a_texcoord)
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureElements), gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, 0, 0)

  return {
    vao,
    len_arr: vertexElements.length / 2
  }
}




