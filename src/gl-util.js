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
  const width = (canvas.clientWidth * multiplier) || 0
  const height = (canvas.clientHeight * multiplier) || 0
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}

export const createProgramFromSources = (gl, [ vert, frag ]) => {
  console.log('should create program from source')
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
