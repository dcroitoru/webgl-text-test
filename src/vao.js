export const createPolygonVaoInfo = (gl, { vertices, indices }, { positionAttributeLocation }) => {
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