import { createProgramInfo, createVaoInfoTypePolygon } from "../gl-util";

const vertexShaderSource = `#version 300 es

in vec2 a_position;
uniform mat3 u_matrix;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  gl_PointSize = 4.0;
}
`

const fragmentShaderSource = `#version 300 es

precision mediump float;
uniform vec4 u_color;
out vec4 outColor;

void main() {
  outColor = u_color;
  // outColor = vec4(1, 0,0, 1);
}
`

const shader = [ vertexShaderSource, fragmentShaderSource ]
const programName = 'polygon'
const uniforms = [ 'u_matrix', 'u_color']
const attributes = [ 'a_position']
const defaultData = {
  vertexElements: [ -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1 ]
}

export const createPolygonProgramInfo = (gl) => createProgramInfo(gl, programName, shader, attributes, uniforms)
export const createPolygonVaoInfo = (gl, programInfo, data = defaultData) => createVaoInfoTypePolygon(gl, programInfo, data, programName)
