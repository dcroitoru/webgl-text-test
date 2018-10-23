import { createProgramInfo, createVaoInfoType3 } from '../gl-util'

export const vertexShaderSource = `#version 300 es

in vec2 a_position;
in vec2 a_normal;

uniform mat3 u_matrix;
uniform float u_thickness;

out vec2 p;

void main() {
  
  vec2 point_pos = a_position.xy + vec2(a_normal.xy * u_thickness/2.0 );
  // point_pos = a_position;

  gl_Position = vec4((u_matrix * vec3(point_pos, 1)).xy, 0, 1);
  // gl_Position = vec4(a_position.xy, 0, 1);
  gl_PointSize = 4.0;

  p = a_position;
}
`

export const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 u_color;
out vec4 outColor;

in vec2 p;

void main() {
  outColor = u_color;
  // outColor = vec4(0.5, 0, 0, 1);

  // outColor = vec4(p.x, p.y, 0, 1);
}
`

const shader = [ vertexShaderSource, fragmentShaderSource ]
const programName = 'polyline'
const uniforms = [ 'u_matrix', 'u_thickness', 'u_color' ]
const attributes = [ 'a_position', 'a_normal' ]
const defaultData = {
  vertexElements: [],
  normalElements: [],
  indexElements: []
}
export const createPolylineProgramInfo = (gl) => createProgramInfo(gl, programName, shader, attributes, uniforms)
export const createPolylineVaoInfo = (gl, programInfo, data = defaultData) => createVaoInfoType3(gl, programInfo, data, programName)
