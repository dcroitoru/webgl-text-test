import { createProgramInfo, createVaoInfoTypeTexture } from '../gl-util'

export const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;
out vec2 v_texcoord;
uniform mat3 u_matrix;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  gl_PointSize = 4.0;
  v_texcoord = a_texcoord;
}
`

export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec2 v_texcoord;
out vec4 outColor;

uniform sampler2D u_texture;

void main() {
  outColor = texture(u_texture, v_texcoord);
  //outColor = vec4(1, v_texcoord.x, 0, 1.0);
}
`

const shader = [ vertexShaderSource, fragmentShaderSource ]
const programName = 'texture'
const uniforms = [ 'u_matrix', 'u_texture' ]
const attributes = [ 'a_position', 'a_texcoord' ]
const defaultData = {
  vertexElements: [ -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1 ],
  textureElements: [ 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1 ]
}
export const createTextureProgramInfo = (gl) => createProgramInfo(gl, programName, shader, attributes, uniforms)
export const createTextureVaoInfo = (gl, programInfo, data = defaultData) => createVaoInfoTypeTexture(gl, programInfo, data, programName)
