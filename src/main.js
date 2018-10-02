import { checkGL, resizeCanvasToDisplaySize } from './gl-util'
import { createContext } from './context'
import { draw } from './draw'

const init = (gl) => {
  resizeCanvasToDisplaySize(gl.canvas)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

const loop = (gl, context) => {
  draw(gl, context)
  requestAnimationFrame(() => loop(gl, context))
}

const main = ({ canvas }) => {
  console.log('main()')

  const gl = checkGL(canvas)
  const context = createContext(gl)

  init(gl)
  loop(gl, context)
}

export default main
