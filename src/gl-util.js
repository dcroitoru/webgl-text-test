export const tileSizePx = 512
export const projection = (width, height) => [ tileSizePx / width * 2, 0, 0, 0, -1 * tileSizePx / height * 2, 0, -1, 1, 1 ]

export const checkGL = (canvas) => {
  if (!canvas) {
    throw new Error('canvas is undefined!')
  }

  const gl = canvas.getContext('webgl2')
  if (!gl) {
    throw new Error('cannot create GL!')
  }

  return gl
}

export const resizeCanvasToDisplaySize = (canvas, multiplier = 1) => {
  multiplier = Math.max(0, multiplier)
  const width = canvas.clientWidth * multiplier || 0
  const height = canvas.clientHeight * multiplier || 0
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

export const createProgramFromSources = (gl, [ vert, frag ]) => {
  const vertexShader = compileShader(gl, vert, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, frag, gl.FRAGMENT_SHADER)
  const program = createProgram(gl, vertexShader, fragmentShader)

  return program
}

const compileShader = (gl, shaderSource, shaderType) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    throw 'could not compile shader: ' + gl.getShaderInfoLog(shader)
  }

  return shader
}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    throw 'program failed to link: ' + gl.getProgramInfoLog(program)
  }

  return program
}

export const ebbv = (gl, a, b, e, elSize = 2) => {
  gl.enableVertexAttribArray(a)
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(e), gl.STATIC_DRAW)
  gl.vertexAttribPointer(a, elSize, gl.FLOAT, false, 0, 0)
}

export const createProgramInfo = (gl, name, shader, attributes, uniforms) => {
  let programInfo = { name }
  const program = createProgramFromSources(gl, shader)

  attributes.map((a) => (programInfo[a] = gl.getAttribLocation(program, a)))
  uniforms.map((u) => (programInfo[u] = gl.getUniformLocation(program, u)))
  programInfo.program = program

  console.log('created program', name)

  return programInfo
}

export const checkProgramName = (name, programName) => {
  if (name != programName) {
    throw new Error('wrong program: ' + name + ' (should be: ' + programName + ')')
  }
}

export const createVaoInfoTypeTexture = (gl, programInfo, data, programName) => {
  const { name, a_position, a_texcoord } = programInfo
  const { vertexElements, textureElements } = data

  checkProgramName(name, programName)

  const vertexBuffer = gl.createBuffer()
  const textureBuffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  ebbv(gl, a_position, vertexBuffer, vertexElements)
  ebbv(gl, a_texcoord, textureBuffer, textureElements)

  return {
    vao,
    len_arr: vertexElements.length / 2
  }
}

export const createVaoInfoTypePolygon = (gl, programInfo, data, programName) => {
  const { name, a_position } = programInfo
  const { vertexElements } = data

  checkProgramName(name, programName)

  const vertexBuffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  ebbv(gl, a_position, vertexBuffer, vertexElements)

  return {
    vao,
    len_arr: vertexElements.length / 2
  }
}

export const createVaoInfoType3 = (gl, programInfo, data, programName) => {
  const { name, a_position, a_normal } = programInfo
  const { vertexElements, normalElements, indexElements } = data

  checkProgramName(name, programName)

  const vertexBuffer = gl.createBuffer()
  const normalBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  ebbv(gl, a_position, vertexBuffer, vertexElements)
  ebbv(gl, a_normal, normalBuffer, normalElements)
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexElements), gl.STATIC_DRAW)

  return {
    vao,
    len_arr: vertexElements.length / 2,
    len_elem: indexElements.length
  }
}
