import { ebbv, createProgramInfo, checkProgramName, createVaoInfo, createVaoInfoTypeTexture } from '../gl-util'

export const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;
out vec2 v_texcoord;
out vec2 v_position;

uniform mat3 u_matrix;
uniform vec2 u_texsize;

void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_texcoord = a_texcoord;
    v_position = a_position;
    gl_PointSize = 4.0;
}
`

export const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform float u_buffer;
uniform float u_gamma;
uniform float u_debug;

in vec2 v_texcoord;
in vec2 v_position;
out vec4 outColor;

void main() {
    float dist = texture(u_texture, v_texcoord).r;
    if (u_debug > 0.0) {
        outColor = vec4(dist, dist, dist, 1);
    } else {
        float alpha = smoothstep(u_buffer - u_gamma, u_buffer + u_gamma, dist);
        outColor = vec4(u_color.rgb, alpha * u_color.a);
    }

    // outColor = vec4(dist, dist, dist, dist);

    // outColor = texture(u_texture, v_texcoord);
    // float alpha = smoothstep(0.6, 0.8, dist);
    // outColor = vec4(u_color.rgb, alpha * u_color.a);
    // outColor = vec4(00.5, 1, 0, 0.5);
    // outColor = vec4(v_position.x, v_position.y, 0, 1);
    // outColor = vec4(dist, dist, dist, 1);
}
`

const shader = [ vertexShaderSource, fragmentShaderSource ]
const programName = 'sdf-texture'
const uniforms = [ 'u_matrix', 'u_texsize', 'u_buffer', 'u_gamma', 'u_color' ]
const attributes = [ 'a_position', 'a_texcoord' ]
const defaultData = {
  vertexElements: [ -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1 ],
  textureElements: [ 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1 ]
}

export const createSdfTextureProgramInfo = (gl) => createProgramInfo(gl, programName, shader, attributes, uniforms)
export const createSdfTextureVaoInfo = (gl, programInfo, data = defaultData) => createVaoInfoTypeTexture(gl, programInfo, data, programName)
