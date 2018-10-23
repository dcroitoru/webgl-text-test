import { mat3 } from 'gl-matrix'
import { resizeCanvasToDisplaySize } from './gl-util'

export const draw = (gl, context) => {
  resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // __drawComplexPolygon(gl, context)
  // __drawTexture(gl, context)
  // __drawText(gl, context)
  drawCenterDot(gl, context)
  __drawLine(gl, context)
  __drawSingleGlyph(gl, context)
}

const drawCenterDot = (gl, { polygonProgramInfo, polygonVaoInfo, projMatrix }) => {
  // console.log('drawing')
  const { program, u_matrix, u_color } = polygonProgramInfo
  const { len_arr, vao } = polygonVaoInfo
  gl.useProgram(program)
  gl.uniformMatrix3fv(u_matrix, false, projMatrix)
  gl.uniform4fv(u_color, [ 0, 0.9, 0.1, 0.2 ])
  gl.bindVertexArray(vao)
  gl.drawArrays(gl.TRIANGLES, 0, len_arr)
}

const __drawText = (gl, context) => {
  const { sdfTextureProgramInfo, textVaoInfo, fontAtlasTexture, projMatrix } = context
  const { program, u_matrix, u_color, u_buffer, u_gamma, u_texsize } = sdfTextureProgramInfo

  let matrix = mat3.create()
  // mat3.scale(matrix, matrix, [ 1, -1 ])
  gl.useProgram(program)
  gl.uniformMatrix3fv(u_matrix, false, matrix)

  gl.bindTexture(gl.TEXTURE_2D, fontAtlasTexture)
  gl.bindVertexArray(textVaoInfo.vao)

  gl.uniform2f(u_texsize, 512, 1024)

  let buffer = 0.5
  let gamma = 0.1

  gl.uniform4fv(u_color, [ 1, 1, 1, 1 ])
  gl.uniform1f(u_buffer, buffer)
  gl.uniform1f(u_gamma, 0.1)

  gl.drawArrays(gl.TRIANGLES, 0, textVaoInfo.len_arr)

  gl.uniform4fv(u_color, [ 0, 0, 0, 1 ])
  gl.uniform1f(u_buffer, 192 / 256)
  gl.uniform1f(u_gamma, gamma * 1.4142)

  gl.drawArrays(gl.TRIANGLES, 0, textVaoInfo.len_arr)
}

const __drawComplexPolygon = (gl, { textureProgramInfo, complexPolygonVaoInfo, fTexture }) => {
  const { program, u_matrix } = textureProgramInfo
  const { vao, len_arr } = complexPolygonVaoInfo

  gl.useProgram(program)
  gl.uniformMatrix3fv(u_matrix, false, matrix2)
  gl.bindTexture(gl.TEXTURE_2D, fTexture)
  gl.bindVertexArray(vao)
  gl.drawArrays(gl.TRIANGLES, 0, len_arr)
}

const __drawTexture = (gl, { textureProgramInfo, textureVaoInfo, fTexture, fontAtlasTexture }) => {
  const { program, u_matrix } = textureProgramInfo
  const { vao, len_arr } = textureVaoInfo

  gl.useProgram(program)
  gl.uniformMatrix3fv(u_matrix, false, matrix2)
  gl.bindTexture(gl.TEXTURE_2D, fontAtlasTexture)
  gl.bindVertexArray(vao)
  gl.drawArrays(gl.TRIANGLES, 0, len_arr)
}

const __drawSingleGlyph = (gl, { sdfTextureProgramInfo, singleGlyphVaoInfo, fontAtlasTexture, projMatrix }) => {
  const { program, u_matrix, u_color, u_buffer, u_gamma, u_texsize } = sdfTextureProgramInfo
  const { vao, len_arr } = singleGlyphVaoInfo
  let matrix = mat3.create()
  // mat3.scale(matrix, matrix, [ 1, -1 ])
  gl.useProgram(program)
  gl.uniformMatrix3fv(u_matrix, false, projMatrix)

  gl.bindTexture(gl.TEXTURE_2D, fontAtlasTexture)
  gl.bindVertexArray(vao)

  gl.uniform2f(u_texsize, 512, 1024)

  let buffer = 0.5
  let gamma = 3.5

  gl.uniform4fv(u_color, [ 1, 1, 1, 1 ])
  gl.uniform1f(u_buffer, buffer)
  // gl.uniform1f(u_gamma, gamma)

  gl.drawArrays(gl.TRIANGLES, 0, len_arr)

  gl.uniform4fv(u_color, [ 0, 0, 0, 1 ])
  gl.uniform1f(u_buffer, 192 / 256)
  gl.uniform1f(u_gamma, gamma * 1.4142 / 24)

  gl.drawArrays(gl.TRIANGLES, 0, len_arr)
}

const __drawLine = (gl, { polylineProgramInfo, polylineVaoInfo, projMatrix }) => {
  const { program, u_matrix, u_color, u_thickness } = polylineProgramInfo
  const { vao, len_elem } = polylineVaoInfo
  gl.useProgram(program)
  gl.bindVertexArray(vao)
  gl.uniformMatrix3fv(u_matrix, false, projMatrix)
  gl.uniform1f(u_thickness, 24 / 512)
  gl.uniform4fv(u_color, [ 1, 0.9, 0.1, 0.2 ])
  gl.drawElements(gl.TRIANGLES, len_elem, gl.UNSIGNED_SHORT, 0)
  gl.uniform4fv(u_color, [ 1, 1, 1, 0.1 ])
  gl.drawElements(gl.LINE_STRIP, len_elem, gl.UNSIGNED_SHORT, 0)
}
