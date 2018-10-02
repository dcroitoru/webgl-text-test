import { polygonShader } from './shaders/polygon'
import { createProgramFromSources } from './gl-util'

export const createPolygonProgramInfo = (gl) => {
  const program = createProgramFromSources(gl, polygonShader)
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const colorLocation = gl.getUniformLocation(program, 'u_color')
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

  return {
    program,
    positionAttributeLocation,
    colorLocation,
    matrixLocation
  }
}
