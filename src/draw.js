import { mat3 } from 'gl-matrix'
import { resizeCanvasToDisplaySize } from './gl-util'

export const draw = (gl, context) => {
  resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(1, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  drawCenterDot(gl, context)
}

let s = 0.25
let matrix2 = mat3.create()
mat3.scale(matrix2, matrix2, [ s, s ])
const drawCenterDot = (gl, { polygonProgramInfo, polygonVaoInfo }) => {
  gl.useProgram(polygonProgramInfo.program)
  gl.uniformMatrix3fv(polygonProgramInfo.matrixLocation, false, matrix2)
  gl.uniform4fv(polygonProgramInfo.colorLocation, [ 0, 0.9, 0.1, 1 ])
  gl.bindVertexArray(polygonVaoInfo.vao)
  gl.drawElements(gl.TRIANGLES, polygonVaoInfo.len_elem, gl.UNSIGNED_SHORT, 0)
}
